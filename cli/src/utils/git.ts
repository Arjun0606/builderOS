import { execSync } from 'child_process';

export function getGitDiff(): string {
  try {
    // Get staged changes
    const staged = execSync('git diff --cached', { encoding: 'utf-8' });
    
    if (staged.trim()) {
      return staged;
    }

    // If nothing staged, get unstaged changes
    const unstaged = execSync('git diff', { encoding: 'utf-8' });
    return unstaged;
  } catch (error: any) {
    throw new Error(`Git error: ${error.message}`);
  }
}

export function isGitRepo(): boolean {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export function commitWithMessage(message: string): void {
  try {
    execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
  } catch (error: any) {
    throw new Error(`Git commit failed: ${error.message}`);
  }
}

