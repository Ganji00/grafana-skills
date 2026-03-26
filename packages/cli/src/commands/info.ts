import pc from 'picocolors';
import { resolvePluginName } from '../lib/aliases.js';
import { fetchRegistryJson } from '../lib/github.js';
import { findPlugin } from '../lib/skill-registry.js';
import { log } from '../utils/logger.js';

export async function infoCommand(pluginInput: string): Promise<void> {
  const pluginName = resolvePluginName(pluginInput);

  log.info('Fetching registry from github.com/grafana/skills...');
  const registry = await fetchRegistryJson();

  const plugin = findPlugin(registry, pluginName);
  if (!plugin) {
    const available = registry.plugins.map((p) => p.name).join(', ');
    log.error(`Plugin "${pluginInput}" not found. Available: ${available}`);
    process.exitCode = 1;
    return;
  }

  log.heading(plugin.name);
  console.log(`  ${pc.dim(plugin.description)}`);
  console.log(`  ${pc.dim('Registry version:')} ${registry.version}`);
  console.log(`  ${pc.dim('Source:')} ${registry.repository}`);
  console.log();

  if (plugin.skills.length === 0) {
    console.log(`  ${pc.dim('No skills available yet.')}`);
  } else {
    console.log(`  ${pc.bold('Skills')} (${plugin.skills.length}):`);
    for (const skill of plugin.skills) {
      console.log(`    ${pc.cyan(skill.name)}`);
      console.log(`      ${pc.dim(skill.description)}`);
      if (skill.tags?.length) {
        console.log(`      ${pc.dim('Tags:')} ${skill.tags.join(', ')}`);
      }
    }
  }

  console.log();
  log.dim(`Install: grafana-skills add ${plugin.name}`);
}
