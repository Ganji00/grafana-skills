import { resolvePluginName, getShortName } from '../lib/aliases.js';
import { fetchRegistryJson, downloadRepoArchive } from '../lib/github.js';
import { findPlugin } from '../lib/skill-registry.js';
import { installSkill } from '../lib/installer.js';
import { addToLockfile } from '../lib/lockfile.js';
import { type Platform } from '../lib/platforms.js';
import { findProjectRoot } from '../utils/paths.js';
import { log } from '../utils/logger.js';
import { getMetrics } from '../telemetry/setup.js';

interface AddOptions {
  skill?: string;
  platform: Platform;
  dryRun: boolean;
}

export async function addCommand(pluginInput: string, options: AddOptions): Promise<void> {
  const startTime = Date.now();
  const pluginName = resolvePluginName(pluginInput);
  const shortName = getShortName(pluginName);
  const metrics = getMetrics();

  log.info(`Fetching registry from github.com/grafana/skills...`);
  const registry = await fetchRegistryJson();

  const plugin = findPlugin(registry, pluginName);
  if (!plugin) {
    const available = registry.plugins.map((p) => p.name).join(', ');
    log.error(`Plugin "${pluginInput}" not found. Available: ${available}`);
    metrics?.errorTotal.add(1, { command: 'add', error_type: 'plugin_not_found' });
    process.exitCode = 1;
    return;
  }

  let skillsToInstall = plugin.skills;
  if (options.skill) {
    skillsToInstall = plugin.skills.filter((s) => s.name === options.skill);
    if (skillsToInstall.length === 0) {
      const available = plugin.skills.map((s) => s.name).join(', ') || 'none yet';
      log.error(`Skill "${options.skill}" not found in ${shortName}. Available: ${available}`);
      metrics?.errorTotal.add(1, { command: 'add', error_type: 'skill_not_found' });
      process.exitCode = 1;
      return;
    }
  }

  if (skillsToInstall.length === 0) {
    log.warn(`No skills available in ${shortName} yet.`);
    return;
  }

  const projectRoot = findProjectRoot();

  if (options.dryRun) {
    log.heading('Dry run — would install:');
    log.list(skillsToInstall.map((s) => `${s.name} — ${s.description}`));
    log.dim(`Target: ${projectRoot}`);
    log.dim(`Platform: ${options.platform}`);
    return;
  }

  log.info(`Downloading skills...`);
  const repoDir = await downloadRepoArchive();

  for (const skill of skillsToInstall) {
    installSkill(repoDir, skill, projectRoot, options.platform);
    log.success(`${skill.name}`);
  }

  addToLockfile(projectRoot, pluginName, registry.version, skillsToInstall.map((s) => s.name));

  const duration = (Date.now() - startTime) / 1000;
  metrics?.installTotal.add(1, {
    package: shortName,
    skill_count: String(skillsToInstall.length),
    platform: options.platform,
  });
  metrics?.installDuration.record(duration, { package: shortName, success: 'true' });

  console.log();
  log.success(
    `Installed ${skillsToInstall.length} skill${skillsToInstall.length !== 1 ? 's' : ''} from ${shortName} (${duration.toFixed(1)}s)`,
  );
}
