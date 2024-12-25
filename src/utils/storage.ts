const STORAGE_KEY = 'openai_api_key';

export const getStoredApiKey = (): string | null => {
  return localStorage.getItem(STORAGE_KEY);
};

export const storeApiKey = (apiKey: string): void => {
  localStorage.setItem(STORAGE_KEY, apiKey);
};

export const removeApiKey = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};