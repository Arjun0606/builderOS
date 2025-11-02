import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

/**
 * Doctor command - checks if everything is set up correctly
 */
export function doctorCommand() {
  console.log(chalk.blue.bold('\n🔍 DevFlow Health Check\n'));

  let allGood = true;

  // Check 1: Git installed
  console.log(chalk.white('Checking Git...'));
  try {
    const gitVersion = execSync('git --version', { encoding: 'utf-8' }).trim();
    console.log(chalk.green(`  ✓ ${gitVersion}`));
  } catch {
    console.log(chalk.red('  ✗ Git not found'));
    console.log(chalk.gray('    Install: https://git-scm.com'));
    allGood = false;
  }

  // Check 2: Node.js version
  console.log(chalk.white('\nChecking Node.js...'));
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  if (majorVersion >= 18) {
    console.log(chalk.green(`  ✓ ${nodeVersion} (good)`));
  } else {
    console.log(chalk.yellow(`  ⚠ ${nodeVersion} (recommend v18+)`));
  }

  // Check 3: API Keys
  console.log(chalk.white('\nChecking API Keys...'));
  
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey && anthropicKey.startsWith('sk-ant')) {
    console.log(chalk.green('  ✓ ANTHROPIC_API_KEY set'));
  } else {
    console.log(chalk.red('  ✗ ANTHROPIC_API_KEY missing or invalid'));
    console.log(chalk.gray('    Get key: https://console.anthropic.com'));
    allGood = false;
  }

  const geminiKey = process.env.GOOGLE_AI_API_KEY;
  if (geminiKey && geminiKey.startsWith('AIza')) {
    console.log(chalk.green('  ✓ GOOGLE_AI_API_KEY set'));
  } else {
    console.log(chalk.yellow('  ⚠ GOOGLE_AI_API_KEY missing'));
    console.log(chalk.gray('    Optional for now, needed for autocomplete'));
  }

  // Check 4: Shell integration
  console.log(chalk.white('\nChecking Shell Integration...'));
  const shell = process.env.SHELL || '';
  const homeDir = os.homedir();
  
  let shellConfigPath = '';
  if (shell.includes('zsh')) {
    shellConfigPath = path.join(homeDir, '.zshrc');
  } else if (shell.includes('bash')) {
    shellConfigPath = path.join(homeDir, '.bashrc');
  }

  if (shellConfigPath && fs.existsSync(shellConfigPath)) {
    const content = fs.readFileSync(shellConfigPath, 'utf-8');
    if (content.includes('DevFlow Integration')) {
      console.log(chalk.green('  ✓ Shell integration installed'));
    } else {
      console.log(chalk.yellow('  ⚠ Shell integration not installed'));
      console.log(chalk.gray('    Run: devflow setup'));
    }
  } else {
    console.log(chalk.gray('  - Shell config not found'));
  }

  // Check 5: Database
  console.log(chalk.white('\nChecking Database...'));
  const dbPath = path.join(homeDir, '.devflow', 'devflow.db');
  if (fs.existsSync(dbPath)) {
    const stats = fs.statSync(dbPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(chalk.green(`  ✓ Database exists (${sizeKB} KB)`));
  } else {
    console.log(chalk.gray('  - Database will be created on first use'));
  }

  // Check 6: Git repo (current directory)
  console.log(chalk.white('\nChecking Current Directory...'));
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    const branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
    console.log(chalk.green(`  ✓ Git repository (${branch})`));
  } catch {
    console.log(chalk.gray('  - Not in a git repository'));
  }

  // Summary
  console.log();
  if (allGood) {
    console.log(chalk.green.bold('✅ All systems go! DevFlow is ready.\n'));
    console.log(chalk.gray('Try: ') + chalk.cyan('devflow quick') + chalk.gray(' to make your first commit'));
  } else {
    console.log(chalk.yellow.bold('⚠️  Some issues found. Fix them to get started.\n'));
  }

  console.log();
}

