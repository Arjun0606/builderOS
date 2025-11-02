import chalk from 'chalk';
import { getStats } from '../db/database';

export function statsCommand() {
  console.log(chalk.blue.bold('\n📊 Your DevFlow Stats\n'));

  const stats7d = getStats(7);
  const stats30d = getStats(30);

  // Last 7 days
  console.log(chalk.white.bold('Last 7 Days:'));
  console.log(chalk.gray(`  Commits:  ${chalk.green(stats7d.totalCommits.toString())}`));
  console.log(chalk.gray(`  Commands: ${chalk.cyan(stats7d.totalCommands.toString())}`));
  console.log();

  // Last 30 days
  console.log(chalk.white.bold('Last 30 Days:'));
  console.log(chalk.gray(`  Commits:  ${chalk.green(stats30d.totalCommits.toString())}`));
  console.log(chalk.gray(`  Commands: ${chalk.cyan(stats30d.totalCommands.toString())}`));
  console.log();

  // Recent commits
  if (stats7d.recentCommits.length > 0) {
    console.log(chalk.white.bold('Recent Commits:'));
    stats7d.recentCommits.slice(0, 5).forEach((commit: any) => {
      const date = new Date(commit.timestamp);
      const timeAgo = formatTimeAgo(commit.timestamp);
      console.log(chalk.gray(`  ${timeAgo.padEnd(12)} ${chalk.white(commit.message.split('\n')[0])}`));
    });
    console.log();
  }

  console.log(chalk.gray('💡 Keep building! Track your progress at') + chalk.cyan(' devflow.dev'));
  console.log();
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 604800)}w ago`;
}

