import Database from 'better-sqlite3';
import path from 'path';
import os from 'os';
import fs from 'fs';

const LICENSE_DIR = path.join(os.homedir(), '.builderos');
const LICENSE_DB = path.join(LICENSE_DIR, 'license.db');

// Ensure directory exists
if (!fs.existsSync(LICENSE_DIR)) {
  fs.mkdirSync(LICENSE_DIR, { recursive: true });
}

const db = new Database(LICENSE_DB);

// Initialize license database
db.exec(`
  CREATE TABLE IF NOT EXISTS license (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    email TEXT,
    plan TEXT NOT NULL,
    status TEXT NOT NULL,
    activated_at INTEGER NOT NULL,
    expires_at INTEGER,
    device_id TEXT NOT NULL,
    last_validated INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    month TEXT NOT NULL,
    commits INTEGER DEFAULT 0,
    UNIQUE(month)
  );
`);

export interface License {
  key: string;
  email?: string;
  plan: 'free' | 'pro_monthly' | 'pro_yearly';
  status: 'active' | 'expired' | 'cancelled';
  activated_at: number;
  expires_at?: number;
  device_id: string;
}

export interface UsageStats {
  month: string;
  commits: number;
  limit: number;
  remaining: number;
}

// Free tier: 10 commits per month
const FREE_COMMIT_LIMIT = 10;

export function getCurrentLicense(): License | null {
  const result = db.prepare('SELECT * FROM license ORDER BY id DESC LIMIT 1').get() as any;
  
  if (!result) {
    return null;
  }

  return {
    key: result.key,
    email: result.email,
    plan: result.plan,
    status: result.status,
    activated_at: result.activated_at,
    expires_at: result.expires_at,
    device_id: result.device_id,
  };
}

export function activateLicense(licenseKey: string, email?: string, plan: string = 'pro_monthly'): void {
  const deviceId = getDeviceId();
  const now = Date.now();
  
  // Calculate expiration
  let expires_at: number | undefined;
  if (plan === 'pro_monthly') {
    expires_at = now + 30 * 24 * 60 * 60 * 1000; // 30 days
  } else if (plan === 'pro_yearly') {
    expires_at = now + 365 * 24 * 60 * 60 * 1000; // 365 days
  }

  // Deactivate any existing license
  db.prepare('DELETE FROM license').run();

  // Insert new license
  db.prepare(`
    INSERT INTO license (key, email, plan, status, activated_at, expires_at, device_id, last_validated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(licenseKey, email || null, plan, 'active', now, expires_at || null, deviceId, now);
}

export function activateFreeTier(): void {
  const deviceId = getDeviceId();
  const now = Date.now();
  const freeKey = `free_${deviceId}_${now}`;

  // Deactivate any existing license
  db.prepare('DELETE FROM license').run();

  // Insert free tier
  db.prepare(`
    INSERT INTO license (key, email, plan, status, activated_at, expires_at, device_id, last_validated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(freeKey, null, 'free', 'active', now, null, deviceId, now);
}

export function deactivateLicense(): void {
  db.prepare('DELETE FROM license').run();
}

export function isProUser(): boolean {
  const license = getCurrentLicense();
  
  if (!license) {
    return false;
  }

  if (license.plan === 'free') {
    return false;
  }

  // Check if expired
  if (license.expires_at && Date.now() > license.expires_at) {
    return false;
  }

  return license.status === 'active';
}

export function canUseCommit(): { allowed: boolean; reason?: string; usage?: UsageStats } {
  const license = getCurrentLicense();

  // No license = start free tier
  if (!license) {
    activateFreeTier();
    return canUseCommit(); // Retry
  }

  // Pro users = unlimited
  if (isProUser()) {
    return { allowed: true };
  }

  // Free users = check limit
  const usage = getCurrentMonthUsage();
  
  if (usage.remaining <= 0) {
    return {
      allowed: false,
      reason: 'Free tier limit reached (10 commits/month)',
      usage,
    };
  }

  return { allowed: true, usage };
}

export function trackCommit(): void {
  const currentMonth = getCurrentMonth();
  
  const existing = db.prepare('SELECT * FROM usage WHERE month = ?').get(currentMonth) as any;
  
  if (existing) {
    db.prepare('UPDATE usage SET commits = commits + 1 WHERE month = ?').run(currentMonth);
  } else {
    db.prepare('INSERT INTO usage (month, commits) VALUES (?, 1)').run(currentMonth);
  }
}

export function getCurrentMonthUsage(): UsageStats {
  const currentMonth = getCurrentMonth();
  
  const result = db.prepare('SELECT * FROM usage WHERE month = ?').get(currentMonth) as any;
  
  const commits = result ? result.commits : 0;
  const limit = FREE_COMMIT_LIMIT;
  const remaining = Math.max(0, limit - commits);

  return {
    month: currentMonth,
    commits,
    limit,
    remaining,
  };
}

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getDeviceId(): string {
  // Create a unique device ID based on hostname and username
  const hostname = os.hostname();
  const username = os.userInfo().username;
  return Buffer.from(`${hostname}_${username}`).toString('base64').substring(0, 16);
}

export function getLicenseInfo(): string {
  const license = getCurrentLicense();
  
  if (!license) {
    return 'No license';
  }

  if (license.plan === 'free') {
    const usage = getCurrentMonthUsage();
    return `Free (${usage.remaining}/${usage.limit} commits remaining this month)`;
  }

  const planName = license.plan === 'pro_monthly' ? 'Pro Monthly' : 'Pro Yearly';
  
  if (license.expires_at) {
    const daysRemaining = Math.ceil((license.expires_at - Date.now()) / (24 * 60 * 60 * 1000));
    return `${planName} (${daysRemaining} days remaining)`;
  }

  return planName;
}

