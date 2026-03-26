/** Short aliases users can type instead of the full plugin name. */
const ALIASES: Record<string, string> = {
  'plugins': 'grafana-plugins',
  'core': 'grafana-core',
  'cloud': 'grafana-cloud',
};

export function resolvePluginName(input: string): string {
  return ALIASES[input] ?? input;
}

export function getShortName(pluginName: string): string {
  for (const [alias, full] of Object.entries(ALIASES)) {
    if (full === pluginName) return alias;
  }
  return pluginName;
}

export { ALIASES };
