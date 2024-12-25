import OpenAI from 'openai';
import { getStoredApiKey } from '../storage';

let openaiClient: OpenAI | null = null;

export const getClient = () => {
  if (!openaiClient) {
    const apiKey = getStoredApiKey();
    if (!apiKey) {
      throw new Error('APIキーが設定されていません。');
    }
    openaiClient = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  }
  return openaiClient;
};

export const initializeClient = (apiKey: string): OpenAI => {
  openaiClient = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  return openaiClient;
};