import { NextResponse } from 'next/server';

// Import your guide generator logic here
// For demo, we'll use a simple function
async function runBotGuideGenerator() {
  // Example topics for Machine Learning and Prompt Engineering
  const topics = [
    'How do I train a neural network for image classification?',
    'What is overfitting in machine learning and how can I prevent it?',
    'How do I write an effective prompt for a language model?',
    'What are the best practices for prompt engineering with GPT-4?',
    'How do I fine-tune a machine learning model for better accuracy?',
    'How can I use prompt engineering to get more creative AI outputs?',
  ];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const category = topic.toLowerCase().includes('prompt') ? 'Prompt Engineering' : 'Machine Learning';

  // Generate guide content using OpenAI directly
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    return { success: false, message: 'No OpenAI API key.' };
  }
  // Use the same prompt logic as your /api/ai/generate endpoint
  const guidePrompt = `You are an expert technical writer. Write a step-by-step how-to guide for: ${topic}`;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: guidePrompt },
      ],
      max_tokens: 1800,
      temperature: 0.7,
    }),
  });
  if (!response.ok) {
    return { success: false, message: 'Failed to generate guide content.' };
  }
  const data = await response.json();
  const generatedContent = data.choices[0].message.content;
  const lines = generatedContent.split('\n');
  let titleLine = lines.find((line: string) => line.startsWith('# '));
  let title = titleLine ? titleLine.replace('# ', '').trim() : topic;
  // Validate title
  if (!title || title.length < 5 || /load data|untitled|no content/i.test(title)) {
    return { success: false, message: 'Guide not saved: invalid or meaningless title.' };
  }
  // Validate content
  if (!generatedContent || generatedContent.length < 100 || /load data|no content|untitled/i.test(generatedContent)) {
    return { success: false, message: 'Guide not saved: content not meaningful.' };
  }
  const slug = title.toLowerCase().replace(/[^a-z0-9\- ]/g, '').replace(/\s+/g, '-');

  // Save guide to database as admin
  const { prisma } = await import('@/lib/prisma');
  const adminUser = await prisma.user.findFirst({ where: { role: 'admin' } });
  if (!adminUser) {
    return { success: false, message: 'No admin user found.' };
  }
  // Only use existing categories
  const dbCategory = await prisma.category.findFirst({ where: { name: category } });
  if (!dbCategory) {
    return { success: false, message: `Category '${category}' does not exist. Please create it first.` };
  }
  const guide = await prisma.guide.create({
    data: {
      title,
      slug,
      content: generatedContent,
      excerpt: lines.slice(1, 4).join(' ').slice(0, 180),
      categoryId: dbCategory.id,
      authorId: adminUser.id,
      published: true,
      featured: false,
      readTime: Math.ceil(generatedContent.split(/\s+/).length / 200),
    },
  });
  return { success: true, message: `Guide generated and saved: ${guide.title}` };
}

export async function POST() {
  const result = await runBotGuideGenerator();
  return NextResponse.json(result);
}
