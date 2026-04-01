import { resolvePluginName, getShortName } from '../lib/aliases.js';
import { readLockfile, removeFromLockfile, writeLockfile } from '../lib/lockfile.js';
import { removeSkill } from '../lib/installer.js';
import { type Platform } from '../lib/platforms.js';
import { findProjectRoot } from '../utils/paths.js';
import { log } from '../utils/logger.js';
import { getMetrics } from '../telemetry/setup.js';

interface RemoveOptions {
  skill?: string;
  platform: Platform;
}

export async function removeCommand(pluginInput: string, options: RemoveOptions): Promise<void> {
  const pluginName = resolvePluginName(pluginInput);
  const shortName = getShortName(pluginName);
  const projectRoot = findProjectRoot();
  const lockfile = readLockfile(projectRoot);
  const metrics = getMetrics();

  const entry = lockfile.installed[pluginName];
  if (!entry) {
    log.error(`${shortName} is not installed. Run "grafana-skills list --installed" to see installed plugins.`);
    process.exitCode = 1;
    return;
  }

  const skillsToRemove = options.skill
    ? entry.skills.filter((s) => s === options.skill)
    : entry.skills;

  if (options.skill && skillsToRemove.length === 0) {
    log.error(`Skill "${options.skill}" not found in ${shortName}. Installed: ${entry.skills.join(', ')}`);
    process.exitCode = 1;
    return;
  }

  for (const skillName of skillsToRemove) {
    removeSkill(skillName, projectRoot, options.platform);
    log.success(`Removed ${skillName}`);
  }

  if (options.skill) {
    const remaining = entry.skills.filter((s) => s !== options.skill);
    if (remaining.length === 0) {
      removeFromLockfile(projectRoot, pluginName);
    } else {
      lockfile.installed[pluginName].skills = remaining;
      writeLockfile(projectRoot, lockfile);
    }
  } else {
    removeFromLockfile(projectRoot, pluginName);
  }

  metrics?.removeTotal.add(1, { package: shortName });
  log.success(`Removed ${skillsToRemove.length} skill${skillsToRemove.length !== 1 ? 's' : ''} from ${shortName}`);
}
