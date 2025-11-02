import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import os from 'os';

const DB_DIR = path.join(os.homedir(), '.devflow');
const DB_PATH = path.join(DB_DIR, 'devflow.db');

// Ensure directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    command TEXT,
    description TEXT,
    timestamp INTEGER NOT NULL,
    duration INTEGER,
    metadata TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp);
  CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);

  CREATE TABLE IF NOT EXISTS commits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    hash TEXT,
    files_changed INTEGER,
    insertions INTEGER,
    deletions INTEGER,
    timestamp INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_commits_timestamp ON commits(timestamp);
`);

export interface Activity {
  type: 'command' | 'commit' | 'session_start' | 'session_end';
  command?: string;
  description?: string;
  timestamp: number;
  duration?: number;
  metadata?: any;
}

export interface Commit {
  message: string;
  hash?: string;
  files_changed?: number;
  insertions?: number;
  deletions?: number;
  timestamp: number;
}

export function logActivity(activity: Activity): void {
  const stmt = db.prepare(`
    INSERT INTO activities (type, command, description, timestamp, duration, metadata)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    activity.type,
    activity.command || null,
    activity.description || null,
    activity.timestamp,
    activity.duration || null,
    activity.metadata ? JSON.stringify(activity.metadata) : null
  );
}

export function logCommit(commit: Commit): void {
  const stmt = db.prepare(`
    INSERT INTO commits (message, hash, files_changed, insertions, deletions, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    commit.message,
    commit.hash || null,
    commit.files_changed || null,
    commit.insertions || null,
    commit.deletions || null,
    commit.timestamp
  );
}

export function getStats(daysBack: number = 7) {
  const since = Date.now() - daysBack * 24 * 60 * 60 * 1000;

  const totalCommits = db
    .prepare('SELECT COUNT(*) as count FROM commits WHERE timestamp > ?')
    .get(since) as { count: number };

  const totalCommands = db
    .prepare('SELECT COUNT(*) as count FROM activities WHERE type = "command" AND timestamp > ?')
    .get(since) as { count: number };

  const recentCommits = db
    .prepare('SELECT * FROM commits WHERE timestamp > ? ORDER BY timestamp DESC LIMIT 10')
    .all(since);

  return {
    totalCommits: totalCommits.count,
    totalCommands: totalCommands.count,
    recentCommits,
  };
}

export default db;

