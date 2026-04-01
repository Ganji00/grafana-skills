import { readLockfile } from '../lib/lockfile.js';
import { type Platform } from '../lib/platforms.js';
import { findProjectRoot } from '../utils/paths.js';
import { log } from '../utils/logger.js';
import { addCommand } from './add.js';

interface InstallOptions {
  platform: Platform;
}

export async function installCommand(options: InstallOptions): Promise<void> {
  const projectRoot = findProjectRoot();
  const lockfile = readLockfile(projectRoot);
  const entries = Object.keys(lockfile.installed);

  if (entries.length === 0) {
    log.info('No skills in .grafana-skills.lock.json.');
    log.dim('Run "grafana-skills add <plugin>" to install skills.');
    return;
  }

  log.info(`Installing ${entries.length} plugin${entries.length !== 1 ? 's' : ''} from lockfile...`);
  for (const pluginName of entries) {
    await addCommand(pluginName, { platform: options.platform, dryRun: false });
  }
}
