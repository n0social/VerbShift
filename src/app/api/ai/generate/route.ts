import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import stripe from '@/lib/stripe';

function log(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, data || '');
}


// Subscription tier config
const SUBSCRIPTION_TIERS = {
  FREE: { postLimit: 1, price: 0 },
  BASIC: { postLimit: 10, price: 5.99 },
  PREMIUM: { postLimit: 25, price: 9.99 },
};

async function checkSubscriptionLimit(userId: string, contentType: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  // Default to free tier if no subscription
  const tier = ((subscription?.tier || 'FREE').toUpperCase() as keyof typeof SUBSCRIPTION_TIERS);
  const config = SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.FREE;

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  // Count both guides and blogs created by the user this month
  const guideCount = await prisma.guide.count({
    where: {
      authorId: userId,
      createdAt: {
        gte: new Date(`${currentMonth}-01`),
        lt: new Date(`${currentMonth}-31`),
      },
    },
  });
  const blogCount = await prisma.blog.count({
    where: {
      authorId: userId,
      createdAt: {
        gte: new Date(`${currentMonth}-01`),
        lt: new Date(`${currentMonth}-31`),
      },
    },
  });
  const usage = guideCount + blogCount;
  if (usage >= config.postLimit) {
    throw new Error('Subscription limit reached.');
  }
}

async function createOneTimePaymentSession(userId: string, contentType: string) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `One-Time ${contentType} Generation`,
          },
          unit_amount: 500, // $5.00
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
  });

  return session.url;
}

export async function POST(request: NextRequest) {
  try {
    log('Received POST request to /api/ai/generate');

    const session = await getServerSession(authOptions);
    log('Session retrieved', session);

    if (!session?.user?.id) {
      log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    log('Request body parsed', body);

    const { topic, contentType, oneTimePayment } = body;

    if (!topic || !contentType) {
      log('Validation error: Missing topic or contentType');
      return NextResponse.json({ error: 'Topic and content type are required' }, { status: 400 });
    }

    if (oneTimePayment) {
      try {
        const paymentUrl = await createOneTimePaymentSession(session.user.id, contentType);
        return NextResponse.json({ paymentUrl });
      } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
      }
    }

    // Allow admins to bypass subscription check
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || user.role !== 'admin') {
      await checkSubscriptionLimit(session.user.id, contentType);
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    log('OpenAI API key retrieved');

    if (openaiApiKey) {
      try {
        log('Sending request to OpenAI API', { topic, contentType });

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: contentType === 'guide'
                  ? `You are an expert technical writer for a modern AI education website. Write comprehensive, in-depth, and well-structured AI guides in markdown format. Use clear section headings (H2, H3), bullet points, numbered steps, and code blocks where appropriate. Ensure that section headings are varied and contextually relevant to the content.`
                  : `You are an AI industry expert writing engaging blog posts. Write in markdown format with insights, analysis, and forward-looking perspectives. Ensure that section headings are varied and contextually relevant to the content.`,
              },
              {
                role: 'user',
                content: contentType === 'guide'
                  ? `Write a detailed, high-quality AI guide about: ${topic}.`
                  : `Write a long-form, in-depth, and original AI blog post about: ${topic}.`,
              },
            ],
            max_tokens: 2000,
            temperature: 0.7,
          }),
        });

        log('OpenAI API response received', { status: response.status });

        if (response.ok) {
          const data = await response.json();
          log('OpenAI API response parsed', data);

          let generatedContent = data.choices[0].message.content;

          const lines = generatedContent.split('\n');
          const titleLine = lines.find((line: string) => line.startsWith('# '));
          const title = titleLine ? titleLine.replace('# ', '').trim() : topic;

          const excerptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${openaiApiKey}`,
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [
                {
                  role: 'user',
                  content: `Write a catchy, curiosity-driven, and engaging 1-2 sentence excerpt for the following content. The excerpt should summarize the article in a way that grabs attention, uses conversational language, and poses a question or invites the reader to explore further. Avoid generic summaries. Content: ${generatedContent}`,
                },
              ],
              max_tokens: 100,
              temperature: 0.9,
            }),
          });

          log('Excerpt generation response received', { status: excerptResponse.status });

          let excerpt = `Curious about ${topic.toLowerCase()}? Dive into this engaging ${contentType} to learn more!`;
          if (excerptResponse.ok) {
            const excerptData = await excerptResponse.json();
            log('Excerpt generation response parsed', excerptData);
            excerpt = excerptData.choices[0].message.content.trim();
          }

          // New logic to search for references
          const referencesResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${openaiApiKey}`,
            },
            body: JSON.stringify({
              model: 'gpt-4',
              messages: [
                {
                  role: 'user',
                  content: `Provide a list of credible references and sources for the topic: ${topic}. Include URLs and brief descriptions for each source.`,
                },
              ],
              max_tokens: 500,
              temperature: 0.5,
            }),
          });

          log('References generation response received', { status: referencesResponse.status });

          let references = [];
          if (referencesResponse.ok) {
            const referencesData = await referencesResponse.json();
            log('References generation response parsed', referencesData);
            references = referencesData.choices[0].message.content.split('\n').filter(Boolean);
          }

          // If a headline is provided, perform a search for references
          if (contentType === 'blog' && topic) {
            const searchResponse = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${openaiApiKey}`,
              },
              body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                  {
                    role: 'user',
                    content: `Search online for credible references related to the headline: ${topic}. Provide a list of URLs and brief descriptions for each source.`,
                  },
                ],
                max_tokens: 500,
                temperature: 0.5,
              }),
            });

            log('Headline-based reference search response received', { status: searchResponse.status });

            if (searchResponse.ok) {
              const searchData = await searchResponse.json();
              log('Headline-based reference search response parsed', searchData);
              references = searchData.choices[0].message.content.split('\n').filter(Boolean);
            }
          }

          // Append references to the bottom of the blog post
          if (contentType === 'blog' && references.length > 0) {
            generatedContent += '\n\n## References\n';
            references.forEach((ref: string) => {
              generatedContent += `- ${ref}\n`;
            });
          }

          log('Content generation successful', { title, excerpt, references });
          return NextResponse.json({ title, excerpt, content: generatedContent, references });
        }
      } catch (apiError) {
        log('OpenAI API error', apiError);
      }
    }

    log('OpenAI failed or not configured, returning error');
    return NextResponse.json({ error: 'AI content generation failed. Please try again later or contact support.' }, { status: 500 });
  } catch (error) {
    log('Error generating content', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
