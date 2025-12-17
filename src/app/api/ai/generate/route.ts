import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

function log(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, data || '');
}

function generateSampleContent(topic: string, contentType: string) {
  const title = topic.charAt(0).toUpperCase() + topic.slice(1);

  const guideContent = `# ${title}

Welcome to this comprehensive guide on ${topic.toLowerCase()}. This tutorial will walk you through everything you need to know.

## Introduction

${topic} is an important concept in the AI space. Understanding it will help you leverage AI more effectively in your work.

## What You'll Learn

- Core concepts and fundamentals
- Best practices and techniques
- Practical examples and use cases
- Tips for getting started

## Getting Started

### Prerequisites

Before diving in, make sure you have:

1. Basic understanding of AI concepts
2. Access to relevant tools and platforms
3. A curious mindset ready to learn

### Step 1: Understanding the Basics

Let's start with the fundamental concepts. ${topic} involves several key principles that form the foundation of everything else.

\`\`\`
Key Concept: The main idea behind ${topic.toLowerCase()}
\`\`\`

### Step 2: Practical Application

Now that you understand the basics, let's put this knowledge into practice.

1. **Start simple** - Begin with basic examples
2. **Iterate** - Improve based on results
3. **Experiment** - Try different approaches

### Step 3: Advanced Techniques

Once you're comfortable with the basics, explore more advanced features:

- Advanced configuration options
- Optimization techniques
- Integration patterns

## Best Practices

Here are some best practices to keep in mind:

1. **Always start with clear goals** - Know what you want to achieve
2. **Document your process** - Keep notes for future reference
3. **Stay updated** - AI evolves quickly, keep learning

## Common Mistakes to Avoid

- Jumping into complex scenarios too quickly
- Ignoring the fundamentals
- Not testing your implementations

## Conclusion

You now have a solid understanding of ${topic.toLowerCase()}. Continue practicing and exploring to deepen your knowledge.

## Next Steps

- Explore related topics
- Join community discussions
- Build your own projects

Happy learning! 🚀`;

  const blogContent = `# ${title}

The world of AI is constantly evolving, and ${topic.toLowerCase()} represents one of the most exciting developments we've seen recently.

## Overview

In this post, we'll explore ${topic.toLowerCase()} and discuss its implications for the future of AI.

## The Current State

${topic} has been gaining significant attention in the AI community. Here's why it matters:

### Key Developments

1. **Innovation** - New approaches are emerging
2. **Accessibility** - Tools are becoming more user-friendly
3. **Impact** - Real-world applications are growing

## What This Means for You

Whether you're a developer, researcher, or enthusiast, ${topic.toLowerCase()} offers exciting opportunities:

- New tools and capabilities
- Enhanced productivity
- Creative possibilities

## Looking Ahead

The future of ${topic.toLowerCase()} looks promising. We expect to see:

1. More sophisticated implementations
2. Broader adoption across industries
3. Integration with existing workflows

## Our Take

At AI Guides, we believe ${topic.toLowerCase()} will play a significant role in shaping the future of AI. Stay tuned for more updates and in-depth tutorials.

## Resources

- Check out our [guides](/guides) for hands-on tutorials
- Follow the latest [news](/blog) in AI

---

*What are your thoughts on ${topic.toLowerCase()}? Share your experiences and questions in the comments below!*`;

  return {
    title,
    excerpt: contentType === 'guide'
      ? `A comprehensive guide to ${topic.toLowerCase()}. Learn everything you need to know to get started.`
      : `Exploring ${topic.toLowerCase()} and its impact on the AI landscape. Read our latest insights.`,
    content: contentType === 'guide' ? guideContent : blogContent,
  };
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

    const { topic, contentType } = body;

    if (!topic || !contentType) {
      log('Validation error: Missing topic or contentType');
      return NextResponse.json({ error: 'Topic and content type are required' }, { status: 400 });
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
                  ? `You are an expert technical writer for a modern AI education website. Write comprehensive, in-depth, and well-structured AI guides in markdown format. Use clear section headings (H2, H3), bullet points, numbered steps, and code blocks where appropriate.`
                  : `You are an AI industry expert writing engaging blog posts. Write in markdown format with insights, analysis, and forward-looking perspectives.`,
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

          const generatedContent = data.choices[0].message.content;

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

          log('Content generation successful', { title, excerpt });
          return NextResponse.json({ title, excerpt, content: generatedContent });
        }
      } catch (apiError) {
        log('OpenAI API error', apiError);
      }
    }

    log('Falling back to sample content generation');
    const sampleContent = generateSampleContent(topic, contentType);
    return NextResponse.json(sampleContent);
  } catch (error) {
    log('Error generating content', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
