import chalk from 'chalk';
import fs from 'fs';
import os from 'os';
import path from 'path';

export function setupCommand() {
  console.log(chalk.blue.bold('\n⚙️  BuilderOS Setup\n'));

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

