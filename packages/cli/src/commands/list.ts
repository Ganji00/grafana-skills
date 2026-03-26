import pc from 'picocolors';
import { fetchRegistryJson } from '../lib/github.js';
import { readLockfile } from '../lib/lockfile.js';
import { getShortName } from '../lib/aliases.js';
import { findProjectRoot } from '../utils/paths.js';
import { log } from '../utils/logger.js';

interface ListOptions {
  installed: boolean;
  json: boolean;
}

export async function listCommand(options: ListOptions): Promise<void> {
  if (options.installed) {
    listInstalled(options.json);
    return;
  }

  log.info('Fetching registry from github.com/grafana/skills...');
  const registry = await fetchRegistryJson();

  if (options.json) {
    console.log(JSON.stringify(registry.plugins, null, 2));
    return;
  }

  log.heading(`Available plugins (${registry.plugins.length}):`);
  console.log();
  for (const plugin of registry.plugins) {
    const skillCount = plugin.skills.length;
    const countLabel = skillCount === 0
      ? pc.dim('coming soon')
      : pc.dim(`${skillCount} skill${skillCount !== 1 ? 's' : ''}`);
    console.log(
      `  ${pc.bold(pc.cyan(plugin.name.padEnd(22)))} ${countLabel.padEnd(16)} ${pc.dim(plugin.description)}`,
    );
  }
  console.log();
  log.dim('Run "grafana-skills info <plugin>" to see individual skills.');
  log.dim('Run "grafana-skills add <plugin>" to install.');
}

function listInstalled(json: boolean): void {
  const projectRoot = findProjectRoot();
  const lockfile = readLockfile(projectRoot);
  const entries = Object.entries(lockfile.installed);

  if (json) {
    console.log(JSON.stringify(lockfile, null, 2));
    return;
  }

  if (entries.length === 0) {
    log.info('No skills installed in this project.');
    log.dim('Run "grafana-skills add <plugin>" to install skills.');
    return;
  }

  log.heading(`Installed plugins (${entries.length}):`);
  console.log();
  for (const [name, entry] of entries) {
    const short = getShortName(name);
    console.log(
      `  ${pc.bold(pc.cyan(short.padEnd(22)))} ${pc.dim(`v${entry.version}`.padEnd(10))} ${entry.skills.length} skill${entry.skills.length !== 1 ? 's' : ''}`,
    );
    for (const skill of entry.skills) {
      console.log(`    ${pc.dim('•')} ${skill}`);
    }
  }
}
