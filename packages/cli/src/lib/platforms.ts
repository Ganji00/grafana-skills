import path from 'node:path';

export type Platform = 'claude-code' | 'cursor' | 'both';

const PLATFORM_DIRS: Record<string, string> = {
  'claude-code': '.claude/skills',
  'cursor': '.cursor/skills',
};

export function getSkillDirs(projectRoot: string, platform: Platform): string[] {
  if (platform === 'both') {
    return Object.values(PLATFORM_DIRS).map((dir) => path.join(projectRoot, dir));
  }
  return [path.join(projectRoot, PLATFORM_DIRS[platform])];
}

export function getAllPlatformDirs(projectRoot: string): string[] {
  return Object.values(PLATFORM_DIRS).map((dir) => path.join(projectRoot, dir));
}
