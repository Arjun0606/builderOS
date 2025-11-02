import chalk from 'chalk';
import readline from 'readline';
import { setupCommand } from './setup';

export async function onboardCommand() {
  console.clear();
  console.log(chalk.blue.bold('\n🚀 Welcome to BuilderOS!\n'));
  console.log(chalk.white('The AI that makes you look like a senior developer.\n'));
  
  await sleep(500);
  
  // Step 1: What is BuilderOS?
  console.log(chalk.cyan.bold('What is BuilderOS?\n'));
  console.log(chalk.gray('BuilderOS uses AI to:'));
  console.log(chalk.white('  • Generate perfect commit messages'));
  console.log(chalk.white('  • Track your coding progress'));
  console.log(chalk.white('  • Make git effortless'));
  console.log();
  
  await pressEnter();
  
  // Step 2: How it works
  console.clear();
  console.log(chalk.blue.bold('\n🎯 How it works\n'));
  console.log(chalk.white('Instead of this:'));
  console.log(chalk.gray('  $ git add .'));
  console.log(chalk.gray('  $ git commit -m "fix"  ') + chalk.red('← Bad commit message!'));
  console.log();
  console.log(chalk.white('Just do this:'));
  console.log(chalk.green('  $ bq  ') + chalk.cyan('← AI writes perfect commits!'));
  console.log();
  
  await pressEnter();
  
  // Step 3: Setup
  console.clear();
  console.log(chalk.blue.bold('\n⚙️  Let\'s set up BuilderOS\n'));
  console.log(chalk.white('We\'ll add some aliases to your shell:\n'));
  console.log(chalk.cyan('  bos  ') + chalk.gray('→ builderos'));
  console.log(chalk.cyan('  bq   ') + chalk.gray('→ builderos quick (instant commit)'));
  console.log(chalk.cyan('  bs   ') + chalk.gray('→ builderos stats'));
  console.log();
  
  const setupNow = await askYesNo('Run setup now?');
  console.log();
  
  if (setupNow) {
    setupCommand();
  } else {
    console.log(chalk.gray('  Skipped. Run') + chalk.cyan(' builderos setup') + chalk.gray(' anytime.'));
    console.log();
  }
  
  await sleep(500);
  
  // Step 4: Pricing
  console.clear();
  console.log(chalk.blue.bold('\n💰 Pricing\n'));
  console.log(chalk.white.bold('Free Tier:'));
  console.log(chalk.gray('  • 10 AI commits per month'));
  console.log(chalk.gray('  • Perfect for trying it out'));
  console.log();
  console.log(chalk.white.bold('Pro ($9.99/mo or $100/yr):'));
  console.log(chalk.gray('  • Unlimited AI commits'));
  console.log(chalk.gray('  • Advanced stats'));
  console.log(chalk.gray('  • Priority support'));
  console.log();
  console.log(chalk.cyan('You start on the free tier. Upgrade anytime at builderos.dev/pricing'));
  console.log();
  
  await pressEnter();
  
  // Step 5: Quick Start
  console.clear();
  console.log(chalk.blue.bold('\n🎉 You\'re all set!\n'));
  console.log(chalk.white.bold('Quick Start:\n'));
  console.log(chalk.cyan('  1. ') + chalk.white('cd your-project'));
  console.log(chalk.cyan('  2. ') + chalk.white('Make some changes'));
  console.log(chalk.cyan('  3. ') + chalk.white('Run: ') + chalk.green.bold('bq'));
  console.log();
  console.log(chalk.gray('Other commands:'));
  console.log(chalk.cyan('  builderos doctor  ') + chalk.gray('→ Check setup'));
  console.log(chalk.cyan('  builderos stats   ') + chalk.gray('→ See your progress'));
  console.log(chalk.cyan('  builderos --help  ') + chalk.gray('→ All commands'));
  console.log();
  console.log(chalk.yellow.bold('💡 Pro tip: ') + chalk.white('Use') + chalk.cyan(' bq ') + chalk.white('for instant commits!'));
  console.log();
  console.log(chalk.gray('Need help? → ') + chalk.cyan('https://builderos.dev/docs'));
  console.log();
}

async function pressEnter() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<void>((resolve) => {
    rl.question(chalk.gray('Press Enter to continue...'), () => {
      rl.close();
      resolve();
    });
  });
}

async function askYesNo(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(chalk.cyan(question + ' (Y/n): '), (answer) => {
      rl.close();
      resolve(answer.toLowerCase() !== 'n');
    });
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

