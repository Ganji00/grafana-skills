import { resolvePluginName } from '../lib/aliases.js';
import { readLockfile } from '../lib/lockfile.js';
import { type Platform } from '../lib/platforms.js';
import { findProjectRoot } from '../utils/paths.js';
import { log } from '../utils/logger.js';
import { addCommand } from './add.js';

interface UpdateOptions {
  platform: Platform;
}

export async function updateCommand(
  pluginInput: string | undefined,
  options: UpdateOptions,
): Promise<void> {
  const projectRoot = findProjectRoot();
  const lockfile = readLockfile(projectRoot);
  const installed = Object.keys(lockfile.installed);

  if (installed.length === 0) {
    log.info('No skills installed in this project.');
    log.dim('Run "grafana-skills add <plugin>" to install skills.');
    return;
  }

  const toUpdate = pluginInput
    ? [resolvePluginName(pluginInput)]
    : installed;

  for (const pluginName of toUpdate) {
    if (!lockfile.installed[pluginName]) {
      log.warn(`${pluginName} is not installed, skipping.`);
      continue;
    }
    log.info(`Updating ${pluginName}...`);
    await addCommand(pluginName, { platform: options.platform, dryRun: false });
  }
}
