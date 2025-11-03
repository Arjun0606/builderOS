import chalk from 'chalk';
import { getGitDiff, isGitRepo, commitWithMessage, stageAllChanges, getCommitStats } from '../utils/git';
import { generateCommitMessage } from '../ai/anthropic-client';
import { logCommit } from '../db/database';
import { canUseCommit, trackCommit, isProUser, getLicenseInfo } from '../license/manager';
import { checkRateLimit, formatResetTime } from '../utils/rate-limit';
import { trackEvent } from '../utils/analytics';

/**
 * Quick commit - stage all, generate message, commit
 * No prompts, just do it (for rapid iteration)
 */
export async function quickCommand() {
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
    console.log(chalk.gray('   • Advanced stats & features'));
    console.log();
    console.log(chalk.white('Visit: ') + chalk.cyan('https://builderos.dev/pricing'));
    console.log();
    process.exit(1);
  }

  // Check git repo
  if (!isGitRepo()) {
    console.log(chalk.red('❌ Not a git repository'));
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

  console.log(chalk.blue('⚡ Quick commit mode...\n'));
  
  // Show trial status for trial users
  if (!isProUser() && usage && !usage.isExpired) {
    console.log(chalk.gray(`Trial: ${usage.daysRemaining} day${usage.daysRemaining === 1 ? '' : 's'} remaining\n`));
  }

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
    trackEvent({ event: 'commit_error' });
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
    process.exit(1);
  }
}

