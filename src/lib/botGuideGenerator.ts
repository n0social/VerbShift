// Bot Guide Generator Logic
import { prisma } from '@/lib/prisma';

export async function runBotGuideGenerator() {
  // Example topics for guides
  const topicCategories = [
    {
      category: 'AI & Machine Learning',
      topics: [
        'How do I train a neural network for image classification?',
        'What is overfitting in machine learning and how can I prevent it?',
        'How do I use transfer learning in deep learning?',
        'How do I deploy a machine learning model to production?',
        'How do I interpret SHAP values in model explainability?',
        'How do I use reinforcement learning for game AI?',
        'How do I use AI for climate change research?',
        'How do I use ChatGPT for business automation?',
      ],
    },
    {
      category: 'IT & Troubleshooting',
      topics: [
        'How do I troubleshoot a slow computer?',
        'How do I recover deleted files on Windows?',
        'How do I fix printer connection issues?',
        'How do I set up a VPN for remote work?',
        'How do I secure my crypto wallet?',
      ],
    },
    {
      category: 'Software & Productivity',
      topics: [
        'How do I automate tasks with Zapier?',
        'How do I create formulas in Excel?',
        'How do I use Notion for project management?',
        'How do I set up email filters in Gmail?',
        'How do I organize files in Google Drive?',
      ],
    },
    {
      category: 'Web Development',
      topics: [
        'How do I build a responsive website with Tailwind CSS?',
        'How do I deploy a Next.js app to Vercel?',
        'How do I create a REST API with Express.js?',
        'How do I optimize images for the web?',
        'How do I set up SEO for a blog?',
      ],
    },
    {
      category: 'Design & Creativity',
      topics: [
        'How do I design a logo in Figma?',
        'How do I create social media graphics in Canva?',
        'How do I animate SVGs for the web?',
        'How do I create viral TikTok content?',
        'How do I get started with drone photography?',
      ],
    },
    {
      category: 'Health & Wellness',
      topics: [
        'How do I start a meditation practice?',
        'How do I meal prep for a busy week?',
        'How do I improve sleep quality?',
        'How do I create a home workout plan?',
        'How do I set and achieve personal health goals?',
        'How do I improve my public speaking confidence?',
        'How do I create a daily wellness routine?',
        'How do I manage stress at work?',
        'How do I promote team wellness in the workplace?',
        'How do I support mental health for remote teams?',
        'How do I encourage healthy habits in a team?',
        'How do I build resilience and emotional intelligence?',
        'How do I improve work-life balance?',
        'How do I foster positive relationships at work?',
        'How do I lead a healthy lifestyle as a professional?',
        'How do I create a supportive team environment?',
        'How do I learn a new language efficiently for personal growth?',
        // Moved from Business & Marketing
        'How do I write a business plan?',
        'How do I run a successful email marketing campaign?',
        'How do I set up an online store with Shopify?',
        'How do I analyze website traffic with Google Analytics?',
        'How do I manage remote teams effectively?',
        // Moved from Travel & Adventure
        'How do I plan a budget-friendly vacation?',
        'How do I organize a community event?',
        'How do I start a podcast?',
        'How do I care for indoor plants?',
        'How do I get started with photography?',
        'How do I learn basic car maintenance?',
        // Moved from Finance & Investing
        'How do I create a personal budget?',
        'How do I start investing in stocks?',
        'How do I save for retirement?',
        'How do I understand cryptocurrency basics?',
      ],
    },
    {
      category: 'Science & Education',
      topics: [
        'How do I conduct a simple chemistry experiment at home?',
        'How do I learn astronomy basics?',
        'How do I build a model rocket?',
        'How do I teach about renewable energy?',
      ],
    },
  ];

  async function getTrendingTopics() {
    // Example: Replace with real API call
    return [
      'How do I use AI for climate change research?',
      'How do I create viral TikTok content?',
      'How do I secure my crypto wallet?',
      'How do I use ChatGPT for business automation?',
      'How do I get started with drone photography?',
    ];
  }

  const trendingTopics = await getTrendingTopics();

  let topic;
  if (Math.random() < 0.2 && trendingTopics.length > 0) {
    topic = trendingTopics[Math.floor(Math.random() * trendingTopics.length)];
  } else {
    const selectedCategory = topicCategories[Math.floor(Math.random() * topicCategories.length)];
    topic = selectedCategory.topics[Math.floor(Math.random() * selectedCategory.topics.length)];
  }

  const formatOptions = [
    'step-by-step guide',
    'FAQ',
    'checklist',
    'troubleshooting manual',
    'case study',
    'quick tips',
    'story format',
    'visual walkthrough',
  ];
  const audienceOptions = [
    'for beginners',
    'for advanced users',
    'for professionals',
    'for hobbyists',
    'for educators',
    'for business owners',
  ];
  const format = formatOptions[Math.floor(Math.random() * formatOptions.length)];
  const audience = audienceOptions[Math.floor(Math.random() * audienceOptions.length)];

  const depthOptions = [
    'Include advanced tips and troubleshooting.',
    'Add a real-world case study or example.',
    'Explain common mistakes and how to avoid them.',
    'Provide a checklist for success.',
    'Suggest resources for further learning.',
    'Break down the process for beginners and experts.',
    'Highlight industry best practices.',
    'Include a summary and actionable next steps.',
  ];
  const depthDetail = depthOptions[Math.floor(Math.random() * depthOptions.length)];

  const allCategories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  if (!allCategories.length) {
    return { success: false, message: 'No categories found in the database.' };
  }
  const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
  const category = randomCategory.name;

  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    return { success: false, message: 'No OpenAI API key.' };
  }
  const guidePrompt = `You are an expert technical writer. Write a ${format} ${audience} for: ${topic}. ${depthDetail}`;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1',
      messages: [
        { role: 'system', content: guidePrompt },
      ],
      max_tokens: 1800,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    return { success: false, message: 'OpenAI API error.' };
  }
  const data = await response.json();
  const generatedContent = data.choices?.[0]?.message?.content?.trim() || '';
  const lines = generatedContent.split('\n');
  const titleLine = lines.find((line: string) => line.startsWith('# '));
  let title = titleLine ? titleLine.replace('# ', '').trim() : topic;

  if (!title || title.length < 5 || /load data|untitled|no content/i.test(title)) {
    return { success: false, message: 'Guide not saved: invalid or meaningless title.' };
  }
  const similarGuides = await prisma.guide.findMany({
    where: {
      title: {
        contains: title.split(' ').slice(0, 4).join(' '),
        mode: 'insensitive',
      },
    },
    take: 1,
  });
  if (similarGuides.length > 0) {
    return { success: false, message: `Guide not saved: similar guide already exists ('${similarGuides[0].title}').` };
  }
  if (!generatedContent || generatedContent.length < 100 || /load data|no content|untitled/i.test(generatedContent)) {
    return { success: false, message: 'Guide not saved: content not meaningful.' };
  }
  const slug = title.toLowerCase().replace(/[^a-z0-9\- ]/g, '').replace(/\s+/g, '-');

  const adminUser = await prisma.user.findFirst({ where: { role: 'admin' } });
  if (!adminUser) {
    return { success: false, message: 'No admin user found.' };
  }
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
