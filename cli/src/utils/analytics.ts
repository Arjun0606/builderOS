/**
 * Privacy-friendly analytics
 * We NEVER send:
 * - Code or commit content
 * - User identity (email, name)
 * - Git repo info
 * 
 * We ONLY track:
 * - Anonymous usage (for understanding adoption)
 * - Error rates (for debugging)
 * - Version info (for compatibility)
 */

import Database from 'better-sqlite3';
import path from 'path';
import os from 'os';

const DB_PATH = path.join(os.homedir(), '.snapcommit', 'snapcommit.db');
const db = new Database(DB_PATH);

// Initialize analytics table
db.exec(`
  CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event TEXT NOT NULL,
    version TEXT,
    platform TEXT,
    timestamp INTEGER NOT NULL
  );
`);

interface AnalyticsEvent {
  event: 'commit_success' | 'commit_error' | 'trial_started' | 'pro_activated' | 'rate_limited';
  version?: string;
  platform?: string;
}

export function trackEvent(data: AnalyticsEvent) {
  const version = require('../../package.json').version;
  const platform = os.platform();
  
  db.prepare(`
    INSERT INTO analytics (event, version, platform, timestamp)
    VALUES (?, ?, ?, ?)
  `).run(data.event, version, platform, Date.now());
}

export function getAnalyticsSummary(): {
  totalCommits: number;
  successRate: number;
  errorCount: number;
  rateLimitHits: number;
} {
  const total = db.prepare(`
    SELECT COUNT(*) as count FROM analytics WHERE event = 'commit_success' OR event = 'commit_error'
  `).get() as { count: number };

  const success = db.prepare(`
    SELECT COUNT(*) as count FROM analytics WHERE event = 'commit_success'
  `).get() as { count: number };

  const errors = db.prepare(`
    SELECT COUNT(*) as count FROM analytics WHERE event = 'commit_error'
  `).get() as { count: number };

  const rateLimited = db.prepare(`
    SELECT COUNT(*) as count FROM analytics WHERE event = 'rate_limited'
  `).get() as { count: number };

  const successRate = total.count > 0 ? (success.count / total.count) * 100 : 100;

  return {
    totalCommits: success.count,
    successRate: Math.round(successRate),
    errorCount: errors.count,
    rateLimitHits: rateLimited.count,
  };
}

