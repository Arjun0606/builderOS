import chalk from 'chalk';
import { getGitDiff, isGitRepo, commitWithMessage } from '../utils/git';
import { generateCommitMessage } from '../ai/anthropic-client';
import { logCommit } from '../db/database';

export async function commitCommand() {
  console.log(chalk.blue('🔍 Analyzing your changes...\n'));

  // Check if we're in a git repo
  if (!isGitRepo()) {
    console.log(chalk.red('❌ Not a git repository'));
    console.log(chalk.gray('   Run this command inside a git repo'));
    process.exit(1);
  }

  // Get the diff
  let diff: string;
  try {
    diff = getGitDiff();
  } catch (error: any) {
    console.log(chalk.red('❌ Failed to get git diff'));
    console.log(chalk.gray(`   ${error.message}`));
    process.exit(1);
  }

  if (!diff.trim()) {
    console.log(chalk.yellow('⚠️  No changes to commit'));
    console.log(chalk.gray('   Make some changes or stage files with git add'));
    process.exit(0);
  }

  // Generate commit message with AI
  console.log(chalk.gray('   Asking Claude for the perfect commit message...'));
  
  let message: string;
  try {
    message = await generateCommitMessage(diff);
  } catch (error: any) {
    console.log(chalk.red('❌ Failed to generate commit message'));
    console.log(chalk.gray(`   ${error.message}`));
    process.exit(1);
  }

  // Show the generated message
  console.log(chalk.green('\n✨ Generated commit message:\n'));
  console.log(chalk.white.bold(`   ${message}\n`));

  // Ask for confirmation
  console.log(chalk.gray('Press Enter to commit, or Ctrl+C to cancel...'));
  
  await new Promise<void>((resolve) => {
    process.stdin.once('data', () => resolve());
    process.stdin.setRawMode(true);
    process.stdin.resume();
  });

  process.stdin.setRawMode(false);
  process.stdin.pause();

  // Commit
  try {
    commitWithMessage(message);
    console.log(chalk.green('\n✅ Committed successfully!\n'));

    // Log to database
    logCommit({
      message,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.log(chalk.red('❌ Commit failed'));
    console.log(chalk.gray(`   ${error.message}`));
    process.exit(1);
  }
}

