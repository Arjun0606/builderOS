/**
 * Rate limiting to prevent API cost explosions
 * If you hit $50K/month with 5K users, you're doing ~50K AI calls/month
 * Need to prevent abuse and API cost spikes
 */

import Database from 'better-sqlite3';
import path from 'path';
import os from 'os';

const DB_PATH = path.join(os.homedir(), '.snapcommit', 'snapcommit.db');
const db = new Database(DB_PATH);

// Rate limits (per hour)
const RATE_LIMITS = {
  free: 10, // 10 commits per hour for trial users
  pro: 100, // 100 commits per hour for pro users (way more than needed)
};

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(userPlan: 'free' | 'pro'): RateLimitResult {
  const now = Date.now();
  const oneHourAgo = now - (60 * 60 * 1000);
  const limit = RATE_LIMITS[userPlan];

  // Count commits in last hour
  const result = db.prepare(`
    SELECT COUNT(*) as count FROM commits
    WHERE timestamp >= ?
  `).get(oneHourAgo) as { count: number };

  const count = result.count;
  const allowed = count < limit;
  const remaining = Math.max(0, limit - count);
  const resetAt = now + (60 * 60 * 1000);

  return { allowed, remaining, resetAt };
}

export function formatResetTime(resetAt: number): string {
  const minutesRemaining = Math.ceil((resetAt - Date.now()) / (60 * 1000));
  if (minutesRemaining <= 60) {
    return `${minutesRemaining} minute${minutesRemaining === 1 ? '' : 's'}`;
  }
  const hours = Math.ceil(minutesRemaining / 60);
  return `${hours} hour${hours === 1 ? '' : 's'}`;
}

