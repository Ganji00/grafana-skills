import fs from 'node:fs';
import path from 'node:path';

const LOCKFILE_NAME = '.grafana-skills.lock.json';

export interface LockfileEntry {
  version: string;
  skills: string[];
  installedAt: string;
}

export interface Lockfile {
  lockfileVersion: number;
  installed: Record<string, LockfileEntry>;
}

function emptyLockfile(): Lockfile {
  return { lockfileVersion: 1, installed: {} };
}

export function getLockfilePath(projectRoot: string): string {
  return path.join(projectRoot, LOCKFILE_NAME);
}

export function readLockfile(projectRoot: string): Lockfile {
  const lockPath = getLockfilePath(projectRoot);
  if (!fs.existsSync(lockPath)) {
    return emptyLockfile();
  }
  try {
    return JSON.parse(fs.readFileSync(lockPath, 'utf-8')) as Lockfile;
  } catch {
    return emptyLockfile();
  }
}

export function writeLockfile(projectRoot: string, lockfile: Lockfile): void {
  const lockPath = getLockfilePath(projectRoot);
  fs.writeFileSync(lockPath, JSON.stringify(lockfile, null, 2) + '\n', 'utf-8');
}

export function addToLockfile(
  projectRoot: string,
  pluginName: string,
  version: string,
  skills: string[],
): void {
  const lockfile = readLockfile(projectRoot);
  lockfile.installed[pluginName] = {
    version,
    skills,
    installedAt: new Date().toISOString(),
  };
  writeLockfile(projectRoot, lockfile);
}

export function removeFromLockfile(projectRoot: string, pluginName: string): void {
  const lockfile = readLockfile(projectRoot);
  delete lockfile.installed[pluginName];
  writeLockfile(projectRoot, lockfile);
}
