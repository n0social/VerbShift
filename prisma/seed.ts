import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('Intellect101!', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'donavansky@gmail.com' },
    update: { password: hashedPassword },
    create: {
      email: 'donavansky@gmail.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('Created admin user:', admin.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'getting-started' },
      update: {},
      create: {
        name: 'Getting Started',
        slug: 'getting-started',
        description: 'Beginner guides to get you started with AI',
        color: '#10b981',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'machine-learning' },
      update: {},
      create: {
        name: 'Machine Learning',
        slug: 'machine-learning',
        description: 'Deep dives into machine learning concepts',
        color: '#8b5cf6',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'prompt-engineering' },
      update: {},
      create: {
        name: 'Prompt Engineering',
        slug: 'prompt-engineering',
        description: 'Master the art of crafting effective prompts',
        color: '#f59e0b',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tools-and-frameworks' },
      update: {},
      create: {
        name: 'Tools & Frameworks',
        slug: 'tools-and-frameworks',
        description: 'Reviews and tutorials for AI tools',
        color: '#ec4899',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'news' },
      update: {},
      create: {
        name: 'AI News',
        slug: 'news',
        description: 'Latest updates from the AI world',
        color: '#0ea5e9',
      },
    }),
  ])

  console.log('Created categories:', categories.map(c => c.name).join(', '))

  // Create sample guides
  const guides = await Promise.all([
    prisma.guide.upsert({
      where: { slug: 'introduction-to-chatgpt' },
      update: {},
      create: {
        title: 'Introduction to ChatGPT',
        slug: 'introduction-to-chatgpt',
        excerpt: 'Learn the basics of ChatGPT and how to use it effectively for various tasks.',
        content: `# Introduction to ChatGPT

ChatGPT is an AI language model developed by OpenAI that can understand and generate human-like text. This guide will help you get started.

## What is ChatGPT?

ChatGPT is built on the GPT (Generative Pre-trained Transformer) architecture. It's designed to:

- Answer questions
- Write content
- Help with coding
- Assist with analysis
- And much more!

## Getting Started

### Step 1: Create an Account

Visit [chat.openai.com](https://chat.openai.com) and sign up for a free account.

### Step 2: Understanding the Interface

The interface is simple:
- A text input at the bottom
- Conversation history above
- Settings in the sidebar

### Step 3: Writing Your First Prompt

\`\`\`
Hello ChatGPT! Can you help me understand how AI works?
\`\`\`

## Best Practices

1. **Be specific** - Clear prompts get better responses
2. **Provide context** - Give background information
3. **Iterate** - Refine your prompts based on responses
4. **Use examples** - Show what you want

## Conclusion

ChatGPT is a powerful tool that can enhance your productivity. Start experimenting today!`,
        coverImage: '/images/chatgpt-guide.jpg',
        published: true,
        featured: true,
        readTime: 8,
        authorId: admin.id,
        categoryId: categories[0].id,
      },
    }),
    prisma.guide.upsert({
      where: { slug: 'prompt-engineering-basics' },
      update: {},
      create: {
        title: 'Prompt Engineering Basics',
        slug: 'prompt-engineering-basics',
        excerpt: 'Master the fundamentals of prompt engineering to get better AI responses.',
        content: `# Prompt Engineering Basics

Prompt engineering is the art and science of crafting effective inputs for AI models.

## Why Prompt Engineering Matters

The quality of your prompts directly affects:
- Response accuracy
- Response relevance
- Response format
- Response depth

## Core Techniques

### 1. Zero-Shot Prompting

Ask directly without examples:

\`\`\`
Summarize this article in 3 bullet points.
\`\`\`

### 2. Few-Shot Prompting

Provide examples:

\`\`\`
Convert these sentences to formal English:

Informal: "gonna grab some food"
Formal: "I am going to get some food"

Informal: "what's up"
Formal: 
\`\`\`

### 3. Chain-of-Thought

Ask for step-by-step reasoning:

\`\`\`
Solve this problem step by step: If a train travels...
\`\`\`

## Advanced Tips

- **Role assignment**: "You are an expert in..."
- **Format specification**: "Respond in JSON format"
- **Constraints**: "Keep your response under 100 words"

## Practice Exercise

Try converting this vague prompt into an effective one:

❌ "Tell me about dogs"

✅ "Provide a brief overview of the top 5 most popular dog breeds for families with children, including their temperament and exercise needs."`,
        coverImage: '/images/prompt-engineering.jpg',
        published: true,
        featured: true,
        readTime: 12,
        authorId: admin.id,
        categoryId: categories[2].id,
      },
    }),
    prisma.guide.upsert({
      where: { slug: 'building-with-openai-api' },
      update: {},
      create: {
        title: 'Building with OpenAI API',
        slug: 'building-with-openai-api',
        excerpt: 'A comprehensive guide to integrating OpenAI API into your applications.',
        content: `# Building with OpenAI API

Learn how to integrate OpenAI's powerful models into your applications.

## Prerequisites

- Node.js or Python installed
- OpenAI API key
- Basic programming knowledge

## Getting Your API Key

1. Visit [platform.openai.com](https://platform.openai.com)
2. Create an account
3. Navigate to API keys
4. Generate a new key

## Installation

### Node.js

\`\`\`bash
npm install openai
\`\`\`

### Python

\`\`\`bash
pip install openai
\`\`\`

## Basic Usage

### Node.js Example

\`\`\`javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "user", content: "Hello, how are you?" }
  ],
});

console.log(completion.choices[0].message);
\`\`\`

## Best Practices

1. **Never expose your API key** in client-side code
2. **Use environment variables** for sensitive data
3. **Implement rate limiting** to control costs
4. **Handle errors gracefully**

## Conclusion

The OpenAI API opens up endless possibilities for your applications!`,
        coverImage: '/images/openai-api.jpg',
        published: true,
        featured: false,
        readTime: 15,
        authorId: admin.id,
        categoryId: categories[3].id,
      },
    }),
  ])

  console.log('Created guides:', guides.map(g => g.title).join(', '))

  // Create sample blogs
  const blogs = await Promise.all([
    prisma.blog.upsert({
      where: { slug: 'future-of-ai-2024' },
      update: {},
      create: {
        title: 'The Future of AI in 2024',
        slug: 'future-of-ai-2024',
        excerpt: 'Exploring the trends and predictions for artificial intelligence in the coming year.',
        content: `# The Future of AI in 2024

As we step into 2024, the AI landscape continues to evolve at an unprecedented pace.

## Key Trends to Watch

### 1. Multimodal AI

AI models that can understand and generate multiple types of content - text, images, audio, and video - are becoming mainstream.

### 2. AI Agents

Autonomous AI agents that can perform complex tasks with minimal human intervention are emerging.

### 3. Smaller, Efficient Models

The trend toward smaller, more efficient models that can run locally on devices.

### 4. Regulation and Ethics

Increased focus on AI regulation, safety, and ethical considerations.

## Industry Impact

- **Healthcare**: AI-assisted diagnosis and drug discovery
- **Education**: Personalized learning experiences
- **Creative Industries**: AI collaboration in art and music
- **Business**: Enhanced automation and decision-making

## What to Expect

The democratization of AI continues, making powerful tools accessible to everyone. Stay curious and keep learning!`,
        coverImage: '/images/ai-future.jpg',
        published: true,
        featured: true,
        readTime: 6,
        authorId: admin.id,
        categoryId: categories[4].id,
      },
    }),
    prisma.blog.upsert({
      where: { slug: 'ai-tools-comparison' },
      update: {},
      create: {
        title: 'Best AI Tools Compared: 2024 Edition',
        slug: 'ai-tools-comparison',
        excerpt: 'A comprehensive comparison of the top AI tools available today.',
        content: `# Best AI Tools Compared: 2024 Edition

With so many AI tools available, choosing the right one can be overwhelming. Here's our breakdown.

## Chat & Writing

| Tool | Best For | Pricing |
|------|----------|---------|
| ChatGPT | General use | Free / $20/mo |
| Claude | Long documents | Free / $20/mo |
| Gemini | Google integration | Free / $20/mo |

## Image Generation

| Tool | Best For | Pricing |
|------|----------|---------|
| Midjourney | Artistic images | $10/mo |
| DALL-E 3 | Accuracy | Credits-based |
| Stable Diffusion | Customization | Free |

## Coding

| Tool | Best For | Pricing |
|------|----------|---------|
| GitHub Copilot | IDE integration | $10/mo |
| Cursor | AI-first editor | Free / $20/mo |
| Codeium | Free alternative | Free |

## Our Recommendations

- **For beginners**: Start with ChatGPT
- **For developers**: GitHub Copilot
- **For creators**: Midjourney + ChatGPT

## Conclusion

The best tool depends on your specific needs. Try free tiers first!`,
        coverImage: '/images/ai-tools.jpg',
        published: true,
        featured: false,
        readTime: 8,
        authorId: admin.id,
        categoryId: categories[3].id,
      },
    }),
  ])

  console.log('Created blogs:', blogs.map(b => b.title).join(', '))

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
