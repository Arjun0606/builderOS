/**
 * Production-ready error handling
 */

export class BuilderOSError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string,
    public helpUrl?: string
  ) {
    super(message);
    this.name = 'BuilderOSError';
  }
}

export class APIError extends BuilderOSError {
  constructor(
    message: string,
    public provider: 'anthropic' | 'google',
    userMessage?: string
  ) {
    super(
      message,
      'API_ERROR',
      userMessage || 'AI service temporarily unavailable. Please try again.',
      'https://builderos.dev/docs/errors#api-error'
    );
  }
}

export class LicenseError extends BuilderOSError {
  constructor(message: string, userMessage?: string) {
    super(
      message,
      'LICENSE_ERROR',
      userMessage || 'License validation failed.',
      'https://builderos.dev/docs/errors#license-error'
    );
  }
}

export class GitError extends BuilderOSError {
  constructor(message: string, userMessage?: string) {
    super(
      message,
      'GIT_ERROR',
      userMessage || 'Git operation failed.',
      'https://builderos.dev/docs/errors#git-error'
    );
  }
}

export function handleError(error: unknown): never {
  if (error instanceof BuilderOSError) {
    console.error(`\n❌ ${error.userMessage}`);
    if (error.helpUrl) {
      console.error(`   Help: ${error.helpUrl}`);
    }
    process.exit(1);
  }

  if (error instanceof Error) {
    console.error(`\n❌ Unexpected error: ${error.message}`);
    console.error('   Please report this at: https://github.com/Arjun0606/builderOS/issues');
    process.exit(1);
  }

  console.error('\n❌ An unknown error occurred');
  process.exit(1);
}

