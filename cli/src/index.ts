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
import { activateCommand, statusCommand } from './commands/activate';
import { onboardCommand } from './commands/onboard';

// Load environment variables from root .env
config({ path: path.join(__dirname, '../../.env') });

const program = new Command();

program
  .name('builderos')
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

// Command: builderos doctor
program
  .command('doctor')
  .alias('check')
  .description('Check if BuilderOS is set up correctly')
  .action(() => {
    doctorCommand();
  });

// Command: builderos activate
program
  .command('activate [license-key]')
  .description('Activate your Pro license')
  .action(async (licenseKey?: string) => {
    await activateCommand(licenseKey);
  });

// Command: builderos status
program
  .command('status')
  .description('Check your license status')
  .action(() => {
    statusCommand();
  });

// Command: builderos onboard
program
  .command('onboard')
  .alias('welcome')
  .description('Interactive onboarding tour')
  .action(async () => {
    await onboardCommand();
  });

// Default action
program.action(() => {
  console.log(chalk.blue.bold('\n✨ BuilderOS - Terminal AI for Developers\n'));
  console.log(chalk.white('Commands:'));
  console.log(chalk.gray('  builderos commit  →  AI commit (interactive)'));
  console.log(chalk.gray('  builderos quick   →  Quick commit (auto stage + commit)'));
  console.log(chalk.gray('  builderos stats   →  See your progress'));
  console.log(chalk.gray('  builderos setup   →  Install shell integration'));
  console.log();
  console.log(chalk.yellow('Quick Start:'));
  console.log(chalk.cyan('  builderos setup') + chalk.gray('   # Install shell integration'));
  console.log(chalk.cyan('  builderos quick') + chalk.gray('   # Make your first commit'));
  console.log();
});

program.parse();

