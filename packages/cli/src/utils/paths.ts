import fs from 'node:fs';
import path from 'node:path';

export function findProjectRoot(startDir: string = process.cwd()): string {
  let dir = startDir;
  while (dir !== path.dirname(dir)) {
    if (
      fs.existsSync(path.join(dir, '.git')) ||
      fs.existsSync(path.join(dir, 'package.json'))
    ) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return startDir;
}
