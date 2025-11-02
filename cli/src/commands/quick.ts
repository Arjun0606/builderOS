import chalk from 'chalk';
import { getGitDiff, isGitRepo, commitWithMessage, stageAllChanges, getCommitStats } from '../utils/git';
import { generateCommitMessage } from '../ai/anthropic-client';
import { logCommit } from '../db/database';

/**
 * Quick commit - stage all, generate message, commit
 * No prompts, just do it (for rapid iteration)
 */
export async function quickCommand() {
  // Check git repo
  if (!isGitRepo()) {
    console.log(chalk.red('❌ Not a git repository'));
    process.exit(1);
  }

  console.log(chalk.blue('⚡ Quick commit mode...\n'));

  // Stage all changes
  try {
    stageAllChanges();
    console.log(chalk.gray('✓ Staged all changes'));
  } catch (error: any) {
    console.log(chalk.red('❌ Failed to stage changes'));
    process.exit(1);
  }

  // Get diff
  let diff: string;
  try {
    diff = getGitDiff(true);
  } catch (error: any) {
    console.log(chalk.red('❌ Failed to get diff'));
    process.exit(1);
  }

  if (!diff.trim()) {
    console.log(chalk.yellow('⚠️  No changes to commit'));
    process.exit(0);
  }

  // Truncate large diffs
  if (diff.length > 40000) {
    diff = diff.substring(0, 40000);
  }

  // Generate message
  console.log(chalk.gray('✓ Generating commit message...'));
  let message: string;
  try {
    message = await generateCommitMessage(diff);
  } catch (error: any) {
    console.log(chalk.red('❌ AI failed'));
    process.exit(1);
  }

  // Show message
  console.log(chalk.green(`✓ ${message.split('\n')[0]}`));

  // Commit
  try {
    const hash = commitWithMessage(message);
    const stats = getCommitStats(hash);
    
    console.log(chalk.green(`✓ Committed ${hash.substring(0, 7)}`));
    console.log(chalk.gray(`  +${stats.insertions} -${stats.deletions} across ${stats.files} files\n`));

    // Log to database
    logCommit({
      message,
      hash,
      files_changed: stats.files,
      insertions: stats.insertions,
      deletions: stats.deletions,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.log(chalk.red('❌ Commit failed'));
    process.exit(1);
  }
}

