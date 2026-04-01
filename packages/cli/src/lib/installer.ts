import fs from 'node:fs';
import path from 'node:path';
import { getSkillDirs, type Platform } from './platforms.js';
import type { SkillEntry } from './skill-registry.js';

function copyDirRecursive(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Installs a skill from the extracted repo archive into the project.
 * skill.path points to the skill directory relative to the repo root,
 * e.g. "skills/grafana-plugins/plugin-bundle-size".
 */
export function installSkill(
  repoDir: string,
  skill: SkillEntry,
  projectRoot: string,
  platform: Platform,
): void {
  const skillSourceDir = path.join(repoDir, skill.path);
  if (!fs.existsSync(skillSourceDir)) {
    throw new Error(`Skill directory not found in archive: ${skillSourceDir}`);
  }

  for (const targetBase of getSkillDirs(projectRoot, platform)) {
    const targetDir = path.join(targetBase, skill.name);
    copyDirRecursive(skillSourceDir, targetDir);
  }
}

export function removeSkill(
  skillName: string,
  projectRoot: string,
  platform: Platform,
): void {
  for (const targetBase of getSkillDirs(projectRoot, platform)) {
    const targetDir = path.join(targetBase, skillName);
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
  }
}
