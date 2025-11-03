/**
 * Version checking and auto-update notifications
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CACHE_FILE = path.join(os.homedir(), '.snapcommit', 'version-cache.json');
const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

interface VersionCache {
  lastCheck: number;
  latestVersion: string;
  currentVersion: string;
}

export async function checkForUpdates(): Promise<{
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
} | null> {
  try {
    // Read cache
    let cache: VersionCache | null = null;
    if (fs.existsSync(CACHE_FILE)) {
      cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      
      // Skip if checked recently
      if (cache && Date.now() - cache.lastCheck < CHECK_INTERVAL) {
        return null;
      }
    }

    // Get current version
    const pkg = require('../../package.json');
    const currentVersion = pkg.version;

    // Fetch latest version from npm registry
    const latestVersion = await fetchLatestVersion();

    // Update cache
    fs.writeFileSync(CACHE_FILE, JSON.stringify({
      lastCheck: Date.now(),
      latestVersion,
      currentVersion,
    }));

    // Compare versions
    const hasUpdate = isNewerVersion(latestVersion, currentVersion);

    return {
      hasUpdate,
      currentVersion,
      latestVersion,
    };
  } catch (error) {
    // Silent fail - don't block user
    return null;
  }
}

function fetchLatestVersion(): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get('https://registry.npmjs.org/snapcommit/latest', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.version);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

function isNewerVersion(latest: string, current: string): boolean {
  const latestParts = latest.split('.').map(Number);
  const currentParts = current.split('.').map(Number);

  for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
    const latestPart = latestParts[i] || 0;
    const currentPart = currentParts[i] || 0;

    if (latestPart > currentPart) {
      return true;
    } else if (latestPart < currentPart) {
      return false;
    }
  }

  return false;
}

