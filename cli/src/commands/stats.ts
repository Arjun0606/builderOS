import chalk from 'chalk';
import { getStats } from '../db/database';

export function statsCommand() {
  console.log(chalk.blue.bold('\n📊 Your DevFlow Stats\n'));

  const stats7d = getStats(7);
  const stats30d = getStats(30);
  const statsAll = getStats(365);

  // Quick summary cards
  console.log(createStatCard('Last 7 Days', [
    { label: 'Commits', value: stats7d.totalCommits, color: 'green' },
    { label: 'Commands', value: stats7d.totalCommands, color: 'cyan' },
  ]));

  console.log(createStatCard('Last 30 Days', [
    { label: 'Commits', value: stats30d.totalCommits, color: 'green' },
    { label: 'Commands', value: stats30d.totalCommands, color: 'cyan' },
  ]));

  console.log(createStatCard('All Time', [
    { label: 'Commits', value: statsAll.totalCommits, color: 'green' },
    { label: 'Commands', value: statsAll.totalCommands, color: 'cyan' },
  ]));

  // Commit streak
  const streak = calculateStreak(statsAll.recentCommits);
  if (streak > 0) {
    console.log(chalk.yellow(`🔥 Current Streak: ${streak} day${streak > 1 ? 's' : ''}`));
    console.log();
  }

  // Recent commits
  if (stats7d.recentCommits.length > 0) {
    console.log(chalk.white.bold('Recent Commits:'));
    
    stats7d.recentCommits.slice(0, 5).forEach((commit: any) => {
      const timeAgo = formatTimeAgo(commit.timestamp);
      const message = commit.message.split('\n')[0]; // First line only
      const truncated = message.length > 60 ? message.substring(0, 57) + '...' : message;
      
      console.log(
        chalk.gray(`  ${timeAgo.padEnd(12)}`) +
        chalk.white(truncated)
      );
    });
    console.log();
  } else {
    console.log(chalk.gray('No commits yet. Run') + chalk.cyan(' devflow commit') + chalk.gray(' to get started!'));
    console.log();
  }

  // Productivity insights
  if (statsAll.totalCommits > 0) {
    const avgPerDay = (statsAll.totalCommits / 30).toFixed(1);
    console.log(chalk.white.bold('Insights:'));
    console.log(chalk.gray(`  Average: ${chalk.cyan(avgPerDay)} commits/day (last 30 days)`));
    
    if (parseFloat(avgPerDay) >= 3) {
      console.log(chalk.gray(`  Status: ${chalk.green('🚀 On fire!')}`));
    } else if (parseFloat(avgPerDay) >= 1) {
      console.log(chalk.gray(`  Status: ${chalk.yellow('💪 Steady progress')}`));
    } else {
      console.log(chalk.gray(`  Status: ${chalk.blue('🌱 Getting started')}`));
    }
    console.log();
  }

  console.log(chalk.gray('💡 View more at') + chalk.cyan(' devflow.dev') + chalk.gray(' (coming soon)'));
  console.log();
}

function createStatCard(title: string, stats: Array<{ label: string; value: number; color: string }>): string {
  const width = 32;
  const border = '─'.repeat(width);
  
  let card = '\n';
  card += chalk.gray(`┌${border}┐`) + '\n';
  card += chalk.gray('│ ') + chalk.white.bold(title.padEnd(width - 1)) + chalk.gray('│') + '\n';
  card += chalk.gray(`├${border}┤`) + '\n';
  
  stats.forEach((stat) => {
    const colorFn = stat.color === 'green' ? chalk.green : 
                    stat.color === 'cyan' ? chalk.cyan : 
                    stat.color === 'yellow' ? chalk.yellow : chalk.white;
    
    const label = `  ${stat.label}:`;
    const value = colorFn(stat.value.toString());
    const padding = ' '.repeat(Math.max(0, width - label.length - stat.value.toString().length - 1));
    
    card += chalk.gray('│') + chalk.gray(label) + padding + value + ' ' + chalk.gray('│') + '\n';
  });
  
  card += chalk.gray(`└${border}┘`);
  
  return card;
}

function calculateStreak(commits: any[]): number {
  if (commits.length === 0) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const commitDates = commits.map(c => {
    const d = new Date(c.timestamp);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  });
  
  const uniqueDates = [...new Set(commitDates)].sort((a, b) => b - a);
  
  let streak = 0;
  let currentDate = today.getTime();
  
  for (const date of uniqueDates) {
    if (date === currentDate || date === currentDate - 86400000) {
      streak++;
      currentDate = date;
    } else {
      break;
    }
  }
  
  return streak;
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 604800)}w ago`;
}
