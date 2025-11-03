import chalk from 'chalk';
import { getGitDiff, isGitRepo, commitWithMessage, getGitStatus, stageAllChanges, getCommitStats, getCurrentBranch } from '../utils/git';
import { generateCommitMessage } from '../ai/anthropic-client';
import { logCommit } from '../db/database';
import { canUseCommit, trackCommit, isProUser } from '../license/manager';
import { checkRateLimit, formatResetTime } from '../utils/rate-limit';
import { trackEvent } from '../utils/analytics';
import readline from 'readline';

export async function commitCommand() {
  // Check license before proceeding
  const { allowed, reason, usage } = canUseCommit();
  
  if (!allowed) {
    console.log(chalk.red('\n❌ ' + reason));
    
    if (usage) {
      console.log(chalk.gray(`   Your 7-day trial has ended`));
    }
    
    console.log();
    console.log(chalk.yellow('⭐ Upgrade to Pro to keep using BuilderOS!'));
    console.log(chalk.gray('   • $9.99/month or $100/year'));
    console.log(chalk.gray('   • Unlimited AI commits'));
    console.log();
    console.log(chalk.white('Visit: ') + chalk.cyan('https://builderos.dev/pricing'));
    console.log();
    process.exit(1);
  }

  // Check rate limit (prevent abuse)
  const userPlan = isProUser() ? 'pro' : 'free';
  const rateLimit = checkRateLimit(userPlan);
  
  if (!rateLimit.allowed) {
    trackEvent({ event: 'rate_limited' });
    console.log(chalk.red('\n❌ Rate limit exceeded'));
    console.log(chalk.gray(`   Too many commits in the last hour`));
    console.log(chalk.gray(`   Limit resets in ${formatResetTime(rateLimit.resetAt)}`));
    console.log();
    if (userPlan === 'free') {
      console.log(chalk.yellow('💡 Pro users have 10x higher limits!'));
      console.log(chalk.white('   Visit: ') + chalk.cyan('https://builderos.dev/pricing'));
    }
    console.log();
    process.exit(1);
  }

  console.log(chalk.blue('🔍 Analyzing your changes...\n'));

  // Check if we're in a git repo
  if (!isGitRepo()) {
    console.log(chalk.red('❌ Not a git repository'));
    console.log(chalk.gray('   Run this command inside a git repo'));
    process.exit(1);
  }

  // Get status
  let status: { staged: number; unstaged: number; untracked: number };
  try {
    status = getGitStatus();
  } catch (error: any) {
    console.log(chalk.red('❌ Failed to get git status'));
    console.log(chalk.gray(`   ${error.message}`));
    process.exit(1);
  }

  // If nothing staged, ask if they want to stage all
  if (status.staged === 0 && (status.unstaged > 0 || status.untracked > 0)) {
    console.log(chalk.yellow('⚠️  No staged changes found'));
    console.log(chalk.gray(`   ${status.unstaged} modified, ${status.untracked} untracked`));
    console.log();
    
    const answer = await askQuestion(chalk.cyan('   Stage all changes? (Y/n): '));
    
    if (answer.toLowerCase() !== 'n') {
      try {
        stageAllChanges();
        console.log(chalk.green('✓ Staged all changes\n'));
        status = getGitStatus();
      } catch (error: any) {
        console.log(chalk.red('❌ Failed to stage changes'));
        console.log(chalk.gray(`   ${error.message}`));
        process.exit(1);
      }
    } else {
      console.log(chalk.gray('   Cancelled. Stage files with: git add <files>'));
      process.exit(0);
    }
  }

  if (status.staged === 0) {
    console.log(chalk.yellow('⚠️  No changes to commit'));
    console.log(chalk.gray('   Make some changes and stage them with git add'));
    process.exit(0);
  }

  // Get the diff
  let diff: string;
  try {
    diff = getGitDiff(true);
  } catch (error: any) {
    console.log(chalk.red('❌ Failed to get git diff'));
    console.log(chalk.gray(`   ${error.message}`));
    process.exit(1);
  }

  // Check if diff is too large (>50KB)
  if (diff.length > 50000) {
    console.log(chalk.yellow('⚠️  Large diff detected'));
    console.log(chalk.gray(`   ${Math.round(diff.length / 1024)}KB of changes`));
    console.log(chalk.gray('   This might take a moment...\n'));
    
    // Truncate diff for AI (keep first 40KB)
    diff = diff.substring(0, 40000) + '\n\n... (diff truncated for AI processing)';
  }

  // Show status
  const branch = getCurrentBranch();
  console.log(chalk.gray(`   Branch: ${branch}`));
  console.log(chalk.gray(`   Files: ${status.staged} staged`));
  console.log();

  // Generate commit message with AI
  console.log(chalk.gray('   Asking Claude for the perfect commit message...'));
  
  let message: string;
  try {
    message = await generateCommitMessage(diff);
  } catch (error: any) {
    console.log(chalk.red('\n❌ Failed to generate commit message'));
    console.log(chalk.gray(`   ${error.message}`));
    console.log();
    console.log(chalk.yellow('💡 Tip: Check your ANTHROPIC_API_KEY in .env'));
    process.exit(1);
  }

  // Show the generated message
  console.log(chalk.green('\n✨ Generated commit message:\n'));
  
  // Display message with nice formatting
  const lines = message.split('\n');
  lines.forEach((line, i) => {
    if (i === 0) {
      // First line (title) - bold
      console.log(chalk.white.bold(`   ${line}`));
    } else if (line.trim()) {
      // Body lines
      console.log(chalk.gray(`   ${line}`));
    } else {
      console.log();
    }
  });
  
  console.log();

  // Ask for confirmation
  const answer = await askQuestion(
    chalk.cyan('Continue? ') + 
    chalk.gray('(Y)es / (n)o / (e)dit: ')
  );

  if (answer.toLowerCase() === 'e') {
    // Edit message
    const edited = await askQuestion(chalk.cyan('Enter commit message: '));
    message = edited || message;
  } else if (answer.toLowerCase() === 'n') {
    console.log(chalk.gray('\nCancelled.'));
    process.exit(0);
  }

  // Commit
  let hash: string;
  try {
    hash = commitWithMessage(message);
    console.log(chalk.green('\n✅ Committed successfully!\n'));

    // Get commit stats
    const stats = getCommitStats(hash);
    
    console.log(chalk.gray(`   Hash: ${hash.substring(0, 7)}`));
    console.log(chalk.gray(`   Files: ${stats.files}`));
    console.log(chalk.gray(`   +${stats.insertions} -${stats.deletions}`));
    console.log();

      // Track usage
      trackCommit();
      trackEvent({ event: 'commit_success' });

      // Log to database
      logCommit({
      message,
      hash,
      files_changed: stats.files,
      insertions: stats.insertions,
      deletions: stats.deletions,
      timestamp: Date.now(),
    });

    // Show upgrade message for trial users (last 2 days)
    if (!isProUser() && usage && !usage.isExpired && usage.daysRemaining <= 2) {
      console.log(chalk.yellow(`⚠️  Only ${usage.daysRemaining} day${usage.daysRemaining === 1 ? '' : 's'} left in your trial!`));
      console.log(chalk.gray('   Upgrade to Pro: https://builderos.dev/pricing\n'));
    }
  } catch (error: any) {
    console.log(chalk.red('❌ Commit failed'));
    console.log(chalk.gray(`   ${error.message}`));
    process.exit(1);
  }
}

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}
