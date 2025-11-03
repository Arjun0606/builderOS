import Anthropic from '@anthropic-ai/sdk';
import { retryWithBackoff } from '../utils/retry';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateCommitMessage(diff: string): Promise<string> {
  try {
    // Retry with exponential backoff for transient errors
    const message = await retryWithBackoff(() => client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: `You are an expert software engineer writing commit messages. 

Analyze this git diff and generate a professional conventional commit message.

Rules:
1. Use conventional commits format: type(scope): message
2. Types: feat, fix, docs, style, refactor, test, chore
3. Keep first line under 72 characters
4. Be specific and clear
5. If multiple changes, use the most significant one
6. Don't mention file names unless critical
7. Focus on WHAT changed and WHY, not HOW

Git Diff:
\`\`\`
${diff}
\`\`\`

Reply with ONLY the commit message, nothing else.`,
        },
      ],
    }), {
      maxAttempts: 3,
      initialDelay: 1000,
      maxDelay: 5000,
    });

    const content = message.content[0];
    if (content.type === 'text') {
      return content.text.trim();
    }

    throw new Error('Unexpected response format from Claude');
  } catch (error: any) {
    throw new Error(`Claude API error: ${error.message}`);
  }
}

export async function analyzeCommand(naturalLanguage: string): Promise<string> {
  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: `You are a terminal command expert. Convert this natural language request into a precise terminal command.

Request: "${naturalLanguage}"

Rules:
1. Reply with ONLY the command, nothing else
2. No explanations, no markdown, no backticks
3. If multiple commands needed, separate with &&
4. Use common Unix commands (works on Mac/Linux)
5. Be safe - no destructive commands without confirmation

Reply with the command:`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      return content.text.trim();
    }

    throw new Error('Unexpected response format from Claude');
  } catch (error: any) {
    throw new Error(`Claude API error: ${error.message}`);
  }
}

