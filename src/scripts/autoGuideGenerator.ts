import fetch from 'node-fetch';

// Example topics for Machine Learning and Prompt Engineering
const topics = [
  'How do I train a neural network for image classification?',
  'What is overfitting in machine learning and how can I prevent it?',
  'How do I write an effective prompt for a language model?',
  'What are the best practices for prompt engineering with GPT-4?',
  'How do I fine-tune a machine learning model for better accuracy?',
  'How can I use prompt engineering to get more creative AI outputs?',
];

// Pick a random topic
function getRandomTopic() {
  return topics[Math.floor(Math.random() * topics.length)];
}

// Main function to generate and submit a guide
async function generateGuide() {
  const topic = getRandomTopic();
  const category = topic.toLowerCase().includes('prompt') ? 'Prompt Engineering' : 'Machine Learning';

  // Call the AI guide generation API
  const response = await fetch('https://your-website.com/api/ai/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add authentication if required
    },
    body: JSON.stringify({
      topic,
      contentType: 'guide',
      category,
      personality: 'default',
    }),
  });

  if (!response.ok) {
    console.error('Failed to generate guide:', await response.text());
    return;
  }

  const result = await response.json();
  console.log('Guide generated and submitted:', result);
}

// Run the script
generateGuide();
