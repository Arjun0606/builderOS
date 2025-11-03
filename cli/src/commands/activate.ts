import chalk from 'chalk';
import { activateLicense, getCurrentLicense, getLicenseInfo } from '../license/manager';
import readline from 'readline';

export async function activateCommand(licenseKey?: string) {
  console.log(chalk.blue.bold('\n🔐 SnapCommit License Activation\n'));

  // If no key provided, prompt for it
  if (!licenseKey) {
    licenseKey = await askQuestion(chalk.cyan('Enter your license key: '));
  }

  if (!licenseKey || !licenseKey.trim()) {
    console.log(chalk.red('❌ No license key provided'));
    process.exit(1);
  }

  licenseKey = licenseKey.trim();

  // Validate format (basic check)
  if (licenseKey.length < 10) {
    console.log(chalk.red('❌ Invalid license key format'));
    process.exit(1);
  }

  console.log(chalk.gray('Validating license key...'));

  // TODO: Validate against API in production
  // For now, accept any key that looks valid
  let plan: string;
  if (licenseKey.toLowerCase().includes('yearly') || licenseKey.toLowerCase().includes('annual')) {
    plan = 'pro_yearly';
  } else {
    plan = 'pro_monthly';
  }

  try {
    activateLicense(licenseKey, undefined, plan);
    
    console.log(chalk.green('\n✅ License activated successfully!\n'));
    
    const license = getCurrentLicense();
    if (license) {
      console.log(chalk.white.bold('License Details:'));
      console.log(chalk.gray(`  Plan: ${license.plan === 'pro_monthly' ? 'Pro Monthly ($9.99/mo)' : 'Pro Yearly ($100/yr)'}`));
      console.log(chalk.gray(`  Status: ${license.status}`));
      
      if (license.expires_at) {
        const expiresDate = new Date(license.expires_at);
        console.log(chalk.gray(`  Expires: ${expiresDate.toLocaleDateString()}`));
      }
    }
    
    console.log();
    console.log(chalk.green('🎉 You now have unlimited AI commits!'));
    console.log(chalk.gray('   Try: ') + chalk.cyan('snapcommit quick'));
    console.log();
  } catch (error: any) {
    console.log(chalk.red('\n❌ Failed to activate license'));
    console.log(chalk.gray(`   ${error.message}`));
    process.exit(1);
  }
}

export function statusCommand() {
  console.log(chalk.blue.bold('\n📊 SnapCommit License Status\n'));

  const license = getCurrentLicense();

  if (!license) {
    console.log(chalk.yellow('⚠️  No license found'));
    console.log(chalk.gray('   You have a 7-day free trial'));
    console.log();
    console.log(chalk.cyan('Upgrade to Pro:'));
    console.log(chalk.gray('   • Unlimited AI commits'));
    console.log(chalk.gray('   • Advanced stats'));
    console.log(chalk.gray('   • Priority support'));
    console.log();
    console.log(chalk.white('Visit: ') + chalk.cyan('https://snapcommit.dev/pricing'));
    console.log();
    return;
  }

  const info = getLicenseInfo();
  
  console.log(chalk.white.bold('Current License:'));
  console.log(chalk.gray(`  ${info}`));
  console.log();

  if (license.plan === 'free') {
    const usage = require('../license/manager').getTrialStatus();
    if (usage.isExpired) {
      console.log(chalk.red('❌ Your trial has expired!'));
      console.log(chalk.white('Upgrade: ') + chalk.cyan('https://snapcommit.dev/pricing'));
    } else {
      console.log(chalk.yellow(`💡 ${usage.daysRemaining} day${usage.daysRemaining === 1 ? '' : 's'} left in your trial!`));
      console.log(chalk.white('Upgrade: ') + chalk.cyan('https://snapcommit.dev/pricing'));
    }
  } else {
    console.log(chalk.green('✅ You have Pro access!'));
  }
  
  console.log();
}

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

