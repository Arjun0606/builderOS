import { execSync } from 'child_process';

export function getGitDiff(staged: boolean = true): string {
  try {
    if (staged) {
      // Get staged changes
      const diff = execSync('git diff --cached', { 
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large diffs
      });
      return diff;
    } else {
      // Get unstaged changes
      const diff = execSync('git diff', { 
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024
      });
      return diff;
    }
  } catch (error: any) {
    throw new Error(`Git error: ${error.message}`);
  }
}

export function getGitStatus(): { staged: number; unstaged: number; untracked: number } {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    const lines = status.trim().split('\n').filter(Boolean);
    
    let staged = 0;
    let unstaged = 0;
    let untracked = 0;

    lines.forEach((line) => {
      const statusCode = line.substring(0, 2);
      if (statusCode[0] !== ' ' && statusCode[0] !== '?') staged++;
      if (statusCode[1] !== ' ') unstaged++;
      if (statusCode[0] === '?' && statusCode[1] === '?') untracked++;
    });

    return { staged, unstaged, untracked };
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

export function stageAllChanges(): void {
  try {
    execSync('git add -A', { stdio: 'inherit' });
  } catch (error: any) {
    throw new Error(`Git add failed: ${error.message}`);
  }
}

export function commitWithMessage(message: string): string {
  try {
    execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
    
    // Get the commit hash
    const hash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
    return hash;
  } catch (error: any) {
    throw new Error(`Git commit failed: ${error.message}`);
  }
}

export function getCommitStats(hash: string): { files: number; insertions: number; deletions: number } {
  try {
    const stats = execSync(`git show --stat --format="" ${hash}`, { encoding: 'utf-8' });
    const match = stats.match(/(\d+) files? changed(?:, (\d+) insertions?\(\+\))?(?:, (\d+) deletions?\(-\))?/);
    
    return {
      files: match?.[1] ? parseInt(match[1]) : 0,
      insertions: match?.[2] ? parseInt(match[2]) : 0,
      deletions: match?.[3] ? parseInt(match[3]) : 0,
    };
  } catch {
    return { files: 0, insertions: 0, deletions: 0 };
  }
}

export function getCurrentBranch(): string {
  try {
    return execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
  } catch {
    return 'unknown';
  }
}
