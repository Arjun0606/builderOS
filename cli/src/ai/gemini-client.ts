import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function quickAutocomplete(partialCommand: string): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 100,
      }
    });

    const prompt = `You are a terminal autocomplete system. Suggest the most likely command completion.

Partial input: "${partialCommand}"

Rules:
1. Reply with ONE most likely completion
2. No explanations, just the command
3. Common Unix commands only
4. If it looks complete, suggest a variation or flag

Reply with just the command:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text().trim();

    return [text];
  } catch (error: any) {
    // Fail gracefully - autocomplete is non-critical
    console.error('Gemini autocomplete error:', error.message);
    return [];
  }
}

