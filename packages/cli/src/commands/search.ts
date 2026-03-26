import pc from 'picocolors';
import { fetchRegistryJson } from '../lib/github.js';
import { log } from '../utils/logger.js';

interface SearchOptions {
  json: boolean;
}

export async function searchCommand(query: string, options: SearchOptions): Promise<void> {
  log.info('Fetching registry from github.com/grafana/skills...');
  const registry = await fetchRegistryJson();

  const q = query.toLowerCase();
  const results = registry.plugins.flatMap((plugin) => {
    const pluginMatch =
      plugin.name.toLowerCase().includes(q) ||
      plugin.description.toLowerCase().includes(q);

    const matchingSkills = plugin.skills.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        (s.tags ?? []).some((t) => t.toLowerCase().includes(q)),
    );

    if (pluginMatch) return [{ plugin, skills: plugin.skills }];
    if (matchingSkills.length > 0) return [{ plugin, skills: matchingSkills }];
    return [];
  });

  if (options.json) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  if (results.length === 0) {
    log.warn(`No skills found matching "${query}".`);
    log.dim('Run "grafana-skills list" to see all available plugins.');
    return;
  }

  log.heading(`Results for "${query}":`);
  console.log();
  for (const { plugin, skills } of results) {
    console.log(`  ${pc.bold(pc.cyan(plugin.name))}`);
    for (const skill of skills) {
      console.log(`    ${pc.dim('•')} ${skill.name} — ${pc.dim(skill.description)}`);
    }
  }
  console.log();
  log.dim('Install: grafana-skills add <plugin>');
}
