#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { config } from 'dotenv';
import path from 'path';
import { commitCommand } from './commands/commit';
import { statsCommand } from './commands/stats';
import { setupCommand } from './commands/setup';
import { quickCommand } from './commands/quick';
import { doctorCommand } from './commands/doctor';

// Load environment variables from root .env
config({ path: path.join(__dirname, '../../.env') });

const program = new Command();

program
  .name('devflow')
  .description('Terminal AI + Progress Tracking for Developers')
  .version('0.1.0');

// Command: devflow commit
program
  .command('commit')
  .alias('c')
  .description('Generate AI-powered commit message (interactive)')
  .action(async () => {
    await commitCommand();
  });

// Command: devflow quick
program
  .command('quick')
  .alias('q')
  .description('Quick commit (stage all + AI commit, no prompts)')
  .action(async () => {
    await quickCommand();
  });

// Command: devflow stats
program
  .command('stats')
  .alias('s')
  .description('Show your coding stats')
  .action(() => {
    statsCommand();
  });

// Command: devflow setup
program
  .command('setup')
  .description('Set up DevFlow shell integration')
  .action(() => {
    setupCommand();
  });

// Command: devflow doctor
program
  .command('doctor')
  .alias('check')
  .description('Check if DevFlow is set up correctly')
  .action(() => {
    doctorCommand();
  });

// Default action
program.action(() => {
  console.log(chalk.blue.bold('\n✨ DevFlow - Terminal AI for Developers\n'));
  console.log(chalk.white('Commands:'));
  console.log(chalk.gray('  devflow commit  →  AI commit (interactive)'));
  console.log(chalk.gray('  devflow quick   →  Quick commit (auto stage + commit)'));
  console.log(chalk.gray('  devflow stats   →  See your progress'));
  console.log(chalk.gray('  devflow setup   →  Install shell integration'));
  console.log();
  console.log(chalk.yellow('Quick Start:'));
  console.log(chalk.cyan('  devflow setup') + chalk.gray('   # Install shell integration'));
  console.log(chalk.cyan('  devflow quick') + chalk.gray('   # Make your first commit'));
  console.log();
});

program.parse();

