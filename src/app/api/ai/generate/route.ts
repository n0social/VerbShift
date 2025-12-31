// Helper to remove emojis from a string
function removeEmojis(str: string): string {
  return str.split('').filter(function(char: string) {
    const code = char.charCodeAt(0);
    // Exclude common emoji ranges
    if (
      (code >= 0x2600 && code <= 0x27BF) || // Misc symbols & Dingbats
      (code >= 0x1F600 && code <= 0x1F64F) || // Emoticons
      (code >= 0x1F300 && code <= 0x1F5FF) || // Misc symbols & pictographs
      (code >= 0x1F680 && code <= 0x1F6FF) || // Transport & map symbols
      (code >= 0x1F700 && code <= 0x1F77F) || // Alchemical symbols
      (code >= 0x1F780 && code <= 0x1F7FF) || // Geometric Shapes Extended
      (code >= 0x1F800 && code <= 0x1F8FF) || // Supplemental Arrows-C
      (code >= 0x1F900 && code <= 0x1F9FF) || // Supplemental Symbols and Pictographs
      (code >= 0x1FA00 && code <= 0x1FA6F) || // Chess Symbols
      (code >= 0x1FA70 && code <= 0x1FAFF)    // Symbols and Pictographs Extended-A
    ) {
      return false;
    }
    return true;
  }).join('');
}
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import stripe from '@/lib/stripe';
import { getGuideOutline } from './_lib/getGuideOutline';
import { enhanceGuidePrompt } from './_lib/enhanceGuidePrompt';
import { PERSONALITY_MATRIX } from './_lib/personalityMatrix';
// import { limitEmojis } from './_lib/limitEmojis';
import { buildBlogPrompt } from './_lib/blogPrompt';
import { cleanBlogContent } from './_lib/cleanBlogContent';
import { sendMail } from '@/lib/mailer';

function log(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, data || '');
}

// Subscription tier config

// Utility to generate a slug from a string
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { topic, contentType, oneTimePayment, personality = 'friendly', email } = body;
    if (!topic || !contentType) {
      return NextResponse.json({ error: 'Topic and content type are required' }, { status: 400 });
    }
    // All users can generate content for free. No payment or subscription checks.
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json({ error: 'AI content generation failed. Please try again later or contact support.' }, { status: 500 });
    }
    // Content generation
    let generatedContent = '';
    let title = topic;
    let excerpt = '';
    let references: string[] = [];
    if (contentType === 'guide') {
      // Strictly How-to: no outline, no categories, just step-by-step instructions
      const guidePrompt = enhanceGuidePrompt(topic);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4.1',
          messages: [
            {
              role: 'system',
              content: guidePrompt,
            },
          ],
          max_tokens: 1800,
          temperature: 0.7,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        generatedContent = data.choices[0].message.content;
      } else {
        throw new Error('Failed to generate guide content');
      }
      // Title/excerpt extraction
      const lines = generatedContent.split('\n');
      const titleLine = lines.find((line) => line.startsWith('# '));
      title = titleLine ? titleLine.replace('# ', '').trim() : topic;
      // Excerpt: first 2-3 lines after title
      const previewLines = lines.filter(line => line && !line.startsWith('# ')).slice(0, 3);
      excerpt = `${title}\n${previewLines.join(' ').slice(0, 180)}${previewLines.join(' ').length > 180 ? '...' : ''}`.trim();
      // References: look for a section at the end
      const refStart = lines.findIndex(line => /references[:]?/i.test(line));
      if (refStart !== -1) {
        references = lines.slice(refStart + 1).filter(line => line.trim().length > 0);
      } else {
        references = [];
      }
    } else {
      // Blog generation (prompt and emoji limiting handled in _lib)
      const { prompt: blogPrompt, maxEmojis } = buildBlogPrompt(topic, personality);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4.1',
          messages: [
            {
              role: 'system',
              content: blogPrompt,
            },
          ],
          max_tokens: 700,
          temperature: 0.95,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        let content = data.choices[0].message.content;
        // Remove all emojis from content
        content = removeEmojis(content);
        content = cleanBlogContent(content);
        if (!content || !content.trim()) {
          // Only block if content is truly empty (after cleaning)
          return NextResponse.json({ error: 'AI generated no content. Please try again.' }, { status: 500 });
        }
        generatedContent = content;
      } else {
        throw new Error('Failed to generate blog content');
      }
      // Title/excerpt extraction for blog
      const lines = generatedContent.split('\n');
      const titleLine = lines.find((line: string) => line.startsWith('# '));
      title = titleLine ? titleLine.replace('# ', '').trim() : topic;
      // Excerpt: preview-style, not a sales pitch
      const previewLines = lines.filter(line => line && !line.startsWith('# ')).slice(0, 3);
      excerpt = `${title}\n${previewLines.join(' ').slice(0, 180)}${previewLines.join(' ').length > 180 ? '...' : ''}`.trim();
      references = [];
    }
    // Slug
    const slug = slugify(title);
    // Response
    return NextResponse.json({ title, slug, excerpt, content: generatedContent, references });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
