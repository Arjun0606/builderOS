import chalk from 'chalk';
import fs from 'fs';
import os from 'os';
import path from 'path';

export function setupCommand() {
  console.log(chalk.blue.bold('\n⚙️  DevFlow Setup\n'));

  const shell = process.env.SHELL || '';
  const homeDir = os.homedir();

  if (shell.includes('zsh')) {
    setupZsh(homeDir);
  } else if (shell.includes('bash')) {
    setupBash(homeDir);
  } else {
    console.log(chalk.yellow('⚠️  Shell not detected or not supported yet'));
    console.log(chalk.gray('   Currently supports: zsh, bash'));
    console.log(chalk.gray(`   Your shell: ${shell}`));
    process.exit(1);
  }
}

function setupZsh(homeDir: string) {
  const zshrcPath = path.join(homeDir, '.zshrc');
  
  const integration = `
# DevFlow Integration
alias flow="devflow"
function devflow-commit() {
  devflow commit
}
alias fc="devflow-commit"
`;

  if (!fs.existsSync(zshrcPath)) {
    console.log(chalk.yellow('⚠️  .zshrc not found, creating one...'));
    fs.writeFileSync(zshrcPath, integration);
  } else {
    const content = fs.readFileSync(zshrcPath, 'utf-8');
    if (content.includes('DevFlow Integration')) {
      console.log(chalk.green('✅ DevFlow already set up in .zshrc'));
      return;
    }
    fs.appendFileSync(zshrcPath, integration);
  }

  console.log(chalk.green('✅ DevFlow integrated with zsh!'));
  console.log();
  console.log(chalk.white.bold('Quick commands:'));
  console.log(chalk.gray('  flow commit  →  AI-powered commit'));
  console.log(chalk.gray('  fc           →  Quick commit alias'));
  console.log(chalk.gray('  flow stats   →  See your progress'));
  console.log();
  console.log(chalk.yellow('⚡ Run this to activate:'));
  console.log(chalk.cyan('  source ~/.zshrc'));
  console.log();
}

function setupBash(homeDir: string) {
  const bashrcPath = path.join(homeDir, '.bashrc');
  
  const integration = `
# DevFlow Integration
alias flow="devflow"
function devflow-commit() {
  devflow commit
}
alias fc="devflow-commit"
`;

  if (!fs.existsSync(bashrcPath)) {
    console.log(chalk.yellow('⚠️  .bashrc not found, creating one...'));
    fs.writeFileSync(bashrcPath, integration);
  } else {
    const content = fs.readFileSync(bashrcPath, 'utf-8');
    if (content.includes('DevFlow Integration')) {
      console.log(chalk.green('✅ DevFlow already set up in .bashrc'));
      return;
    }
    fs.appendFileSync(bashrcPath, integration);
  }

  console.log(chalk.green('✅ DevFlow integrated with bash!'));
  console.log();
  console.log(chalk.white.bold('Quick commands:'));
  console.log(chalk.gray('  flow commit  →  AI-powered commit'));
  console.log(chalk.gray('  fc           →  Quick commit alias'));
  console.log(chalk.gray('  flow stats   →  See your progress'));
  console.log();
  console.log(chalk.yellow('⚡ Run this to activate:'));
  console.log(chalk.cyan('  source ~/.bashrc'));
  console.log();
}

