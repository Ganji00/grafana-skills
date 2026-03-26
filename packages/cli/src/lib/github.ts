import https from 'node:https';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import * as tar from 'tar';
import type { RegistryRoot } from './skill-registry.js';

const REPO = 'grafana/skills';
const BRANCH = 'main';
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;
const ARCHIVE_URL = `https://github.com/${REPO}/archive/refs/heads/${BRANCH}.tar.gz`;

function fetchBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const request = (u: string) => {
      const mod = u.startsWith('https') ? https : http;
      mod.get(u, { headers: { 'User-Agent': 'grafana-skills-cli' } }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          request(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} fetching ${u}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(Buffer.from(c)));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      }).on('error', reject);
    };
    request(url);
  });
}

export async function fetchRegistryJson(): Promise<RegistryRoot> {
  const data = await fetchBuffer(`${RAW_BASE}/skill-registry.json`);
  return JSON.parse(data.toString()) as RegistryRoot;
}

/**
 * Downloads the repo archive from GitHub and extracts it to a temp directory.
 * Returns the path to the extracted repo root (skills/ lives directly inside).
 * Uses strip:1 to remove the top-level `skills-main/` prefix from the archive.
 */
export async function downloadRepoArchive(): Promise<string> {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'grafana-skills-'));
  const tarball = path.join(tmpDir, 'repo.tar.gz');

  const data = await fetchBuffer(ARCHIVE_URL);
  fs.writeFileSync(tarball, data);

  const extractDir = path.join(tmpDir, 'repo');
  fs.mkdirSync(extractDir);
  tar.extract({ file: tarball, cwd: extractDir, sync: true, strip: 1 } as Parameters<typeof tar.extract>[0]);

  return extractDir;
}
