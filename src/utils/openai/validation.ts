import { initializeClient } from './client';

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const client = initializeClient(apiKey);
    
    await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "test" }],
      max_tokens: 1
    });
    
    return true;
  } catch (error: any) {
    console.error('OpenAI validation error:', error);
    return false;
  }
};