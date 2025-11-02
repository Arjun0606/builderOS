#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { config } from 'dotenv';
import path from 'path';
import { commitCommand } from './commands/commit';
import { statsCommand } from './commands/stats';
import { setupCommand } from './commands/setup';

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
  .description('Generate AI-powered commit message')
  .action(async () => {
    await commitCommand();
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

// Default action
program.action(() => {
  console.log(chalk.blue.bold('\n✨ DevFlow - Terminal AI for Developers\n'));
  console.log(chalk.white('Commands:'));
  console.log(chalk.gray('  devflow commit  →  AI-powered commit messages'));
  console.log(chalk.gray('  devflow stats   →  See your progress'));
  console.log(chalk.gray('  devflow setup   →  Install shell integration'));
  console.log();
  console.log(chalk.gray('Run ') + chalk.cyan('devflow setup') + chalk.gray(' to get started!'));
  console.log();
});

program.parse();

