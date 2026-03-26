export interface SkillEntry {
  name: string;
  description: string;
  /** Path to the skill directory relative to repo root, e.g. "skills/grafana-plugins/plugin-bundle-size" */
  path: string;
  tags?: string[];
}

export interface PluginEntry {
  name: string;
  description: string;
  skills: SkillEntry[];
}

export interface RegistryRoot {
  name: string;
  version: string;
  repository: string;
  plugins: PluginEntry[];
}

export function findPlugin(registry: RegistryRoot, pluginName: string): PluginEntry | undefined {
  return registry.plugins.find((p) => p.name === pluginName);
}
