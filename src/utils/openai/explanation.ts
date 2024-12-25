import { getClient } from './client';

const formatExplanationPrompt = (
  question: string,
  choices: string[],
  correctAnswer: number
): string => {
  return `
英語の問題の解説を日本語で行ってください。以下の形式で解説を作成してください：

【問題文の意味】
${question} の意味を説明

【選択肢】
${choices.map((choice, index) => `${index + 1}. ${choice}`).join('\n')}

【解説】
なぜ ${correctAnswer} が正解なのかを説明

【完全な文】
正解を入れた完全な文とその日本語訳

必ず各セクションの間に空行を入れ、箇条書きの場合は改行して書いてください。
`;
};

export const generateExplanation = async (
  question: string,
  choices: string[],
  correctAnswer: number,
  onToken: (token: string) => void
): Promise<void> => {
  try {
    const client = getClient();
    const prompt = formatExplanationPrompt(question, choices, correctAnswer);

    const stream = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        onToken(content);
      }
    }
  } catch (error: any) {
    console.error('OpenAI explanation error:', error);
    
    if (error.code === 'invalid_api_key') {
      throw new Error('APIキーが無効です。正しいAPIキーを入力してください。');
    }
    
    if (error.code === 'insufficient_quota') {
      throw new Error('APIの利用制限に達しました。別のAPIキーを使用してください。');
    }
    
    if (error.message?.includes('API key')) {
      throw new Error('APIキーが無効または期限切れです。');
    }
    
    throw new Error('解説の生成中にエラーが発生しました。もう一度お試しください。');
  }
};