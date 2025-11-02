import chalk from 'chalk';
import fs from 'fs';
import os from 'os';
import path from 'path';

export function setupCommand() {
  console.log(chalk.blue.bold('\n⚙️  BuilderOS Setup\n'));

  const shell = process.env.SHELL || '';
  const homeDir = os.homedir();
  const platform = process.platform;

  // Windows
  if (platform === 'win32') {
    setupWindows(homeDir);
  }
  // Unix-like (Mac, Linux)
  else if (shell.includes('zsh')) {
    setupZsh(homeDir);
  } else if (shell.includes('bash')) {
    setupBash(homeDir);
  } else if (shell.includes('fish')) {
    setupFish(homeDir);
  } else {
    console.log(chalk.yellow('⚠️  Shell not detected or not supported'));
    console.log(chalk.gray('   Supports: zsh, bash, fish (Mac/Linux), PowerShell (Windows)'));
    console.log(chalk.gray(`   Your shell: ${shell || 'unknown'}`));
    console.log();
    console.log(chalk.white('💡 You can still use BuilderOS:'));
    console.log(chalk.cyan('   builderos quick') + chalk.gray(' - Quick commit'));
    console.log(chalk.cyan('   builderos stats') + chalk.gray(' - See stats'));
    console.log();
  }
}

function setupZsh(homeDir: string) {
  const zshrcPath = path.join(homeDir, '.zshrc');
  
  const integration = `
# BuilderOS Integration
alias bos="builderos"
alias bq="builderos quick"
alias bs="builderos stats"
`;

  if (!fs.existsSync(zshrcPath)) {
    console.log(chalk.yellow('⚠️  .zshrc not found, creating one...'));
    fs.writeFileSync(zshrcPath, integration);
  } else {
    const content = fs.readFileSync(zshrcPath, 'utf-8');
    if (content.includes('BuilderOS Integration')) {
      console.log(chalk.green('✅ BuilderOS already set up in .zshrc'));
      return;
    }
    fs.appendFileSync(zshrcPath, integration);
  }

  console.log(chalk.green('✅ BuilderOS integrated with zsh!'));
  console.log();
  console.log(chalk.white.bold('Quick aliases:'));
  console.log(chalk.gray('  bos        →  builderos'));
  console.log(chalk.gray('  bq         →  builderos quick (instant commit)'));
  console.log(chalk.gray('  bs         →  builderos stats'));
  console.log();
  console.log(chalk.yellow('⚡ Run this to activate:'));
  console.log(chalk.cyan('  source ~/.zshrc'));
  console.log();
  console.log(chalk.gray('Then just type') + chalk.cyan(' bq ') + chalk.gray('to commit your changes!'));
  console.log();
}

function setupBash(homeDir: string) {
  const bashrcPath = path.join(homeDir, '.bashrc');
  
  const integration = `
# BuilderOS Integration
alias bos="builderos"
alias bq="builderos quick"
alias bs="builderos stats"
`;

  if (!fs.existsSync(bashrcPath)) {
    console.log(chalk.yellow('⚠️  .bashrc not found, creating one...'));
    fs.writeFileSync(bashrcPath, integration);
  } else {
    const content = fs.readFileSync(bashrcPath, 'utf-8');
    if (content.includes('BuilderOS Integration')) {
      console.log(chalk.green('✅ BuilderOS already set up in .bashrc'));
      return;
    }
    fs.appendFileSync(bashrcPath, integration);
  }

  console.log(chalk.green('✅ BuilderOS integrated with bash!'));
  console.log();
  console.log(chalk.white.bold('Quick aliases:'));
  console.log(chalk.gray('  bos        →  builderos'));
  console.log(chalk.gray('  bq         →  builderos quick (instant commit)'));
  console.log(chalk.gray('  bs         →  builderos stats'));
  console.log();
  console.log(chalk.yellow('⚡ Run this to activate:'));
  console.log(chalk.cyan('  source ~/.bashrc'));
  console.log();
  console.log(chalk.gray('Then just type') + chalk.cyan(' bq ') + chalk.gray('to commit your changes!'));
  console.log();
}

function setupFish(homeDir: string) {
  const fishConfigDir = path.join(homeDir, '.config', 'fish');
  const fishConfigPath = path.join(fishConfigDir, 'config.fish');
  
  const integration = `
# BuilderOS Integration
alias bos="builderos"
alias bq="builderos quick"
alias bs="builderos stats"
`;

  // Ensure config directory exists
  if (!fs.existsSync(fishConfigDir)) {
    fs.mkdirSync(fishConfigDir, { recursive: true });
  }

  if (!fs.existsSync(fishConfigPath)) {
    console.log(chalk.yellow('⚠️  config.fish not found, creating one...'));
    fs.writeFileSync(fishConfigPath, integration);
  } else {
    const content = fs.readFileSync(fishConfigPath, 'utf-8');
    if (content.includes('BuilderOS Integration')) {
      console.log(chalk.green('✅ BuilderOS already set up in Fish'));
      return;
    }
    fs.appendFileSync(fishConfigPath, integration);
  }

  console.log(chalk.green('✅ BuilderOS integrated with Fish!'));
  console.log();
  console.log(chalk.white.bold('Quick aliases:'));
  console.log(chalk.gray('  bos        →  builderos'));
  console.log(chalk.gray('  bq         →  builderos quick (instant commit)'));
  console.log(chalk.gray('  bs         →  builderos stats'));
  console.log();
  console.log(chalk.yellow('⚡ Reload config:'));
  console.log(chalk.cyan('  source ~/.config/fish/config.fish'));
  console.log();
  console.log(chalk.gray('Then just type') + chalk.cyan(' bq ') + chalk.gray('to commit your changes!'));
  console.log();
}

function setupWindows(homeDir: string) {
  console.log(chalk.green('✅ Windows detected!'));
  console.log();
  console.log(chalk.white.bold('For PowerShell:'));
  console.log(chalk.gray('  Add these aliases to your PowerShell profile:'));
  console.log();
  console.log(chalk.cyan('  Set-Alias bos builderos'));
  console.log(chalk.cyan('  function bq { builderos quick }'));
  console.log(chalk.cyan('  function bs { builderos stats }'));
  console.log();
  console.log(chalk.gray('To edit your profile, run:'));
  console.log(chalk.cyan('  notepad $PROFILE'));
  console.log();
  console.log(chalk.white.bold('For Git Bash / WSL:'));
  console.log(chalk.gray('  Run setup again in your bash shell'));
  console.log();
  console.log(chalk.gray('Then just type') + chalk.cyan(' bq ') + chalk.gray('to commit your changes!'));
  console.log();
}
