import { Command } from 'commander';
import { initTelemetry, shutdownTelemetry, getMetrics } from './telemetry/setup.js';
import { addCommand } from './commands/add.js';
import { removeCommand } from './commands/remove.js';
import { listCommand } from './commands/list.js';
import { updateCommand } from './commands/update.js';
import { installCommand } from './commands/install.js';
import { infoCommand } from './commands/info.js';
import { searchCommand } from './commands/search.js';
import { log } from './utils/logger.js';

const VERSION = __CLI_VERSION__;

const program = new Command();

program
  .name('grafana-skills')
  .description('Install Grafana AI agent skills into your project')
  .version(VERSION);

const noTelemetry =
  process.env.GRAFANA_SKILLS_NO_TELEMETRY === '1' ||
  process.argv.includes('--no-telemetry');

if (!noTelemetry) {
  initTelemetry();
}

async function withTelemetry(command: string, fn: () => Promise<void>): Promise<void> {
  const metrics = getMetrics();
  try {
    await fn();
    metrics?.commandTotal.add(1, { command, success: 'true', cli_version: VERSION });
  } catch (err) {
    metrics?.commandTotal.add(1, { command, success: 'false', cli_version: VERSION });
    metrics?.errorTotal.add(1, { command, error_type: 'unhandled' });
    log.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  } finally {
    if (!noTelemetry) {
      await shutdownTelemetry();
    }
  }
}

program
  .command('add <plugin>')
  .description('Install skills from a plugin into this project')
  .option('--skill <name>', 'Only install a specific named skill')
  .option('--platform <p>', 'claude-code | cursor | both', 'both')
  .option('--dry-run', 'Preview changes without writing files', false)
  .option('--no-telemetry', 'Disable anonymous usage telemetry')
  .action(async (plugin: string, opts) => {
    await withTelemetry('add', () => addCommand(plugin, opts));
  });

program
  .command('remove <plugin>')
  .description('Remove installed skills')
  .option('--skill <name>', 'Only remove a specific named skill')
  .option('--platform <p>', 'claude-code | cursor | both', 'both')
  .option('--no-telemetry', 'Disable anonymous usage telemetry')
  .action(async (plugin: string, opts) => {
    await withTelemetry('remove', () => removeCommand(plugin, opts));
  });

program
  .command('list')
  .description('List available or installed plugins')
  .option('--installed', 'Show plugins installed in the current project', false)
  .option('--json', 'Output as JSON', false)
  .option('--no-telemetry', 'Disable anonymous usage telemetry')
  .action(async (opts) => {
    await withTelemetry('list', () => listCommand(opts));
  });

program
  .command('update [plugin]')
  .description('Re-download and reinstall to get the latest skills from GitHub')
  .option('--platform <p>', 'claude-code | cursor | both', 'both')
  .option('--no-telemetry', 'Disable anonymous usage telemetry')
  .action(async (plugin: string | undefined, opts) => {
    await withTelemetry('update', () => updateCommand(plugin, opts));
  });

program
  .command('install')
  .description('Install all plugins from .grafana-skills.lock.json')
  .option('--platform <p>', 'claude-code | cursor | both', 'both')
  .option('--no-telemetry', 'Disable anonymous usage telemetry')
  .action(async (opts) => {
    await withTelemetry('install', () => installCommand(opts));
  });

program
  .command('info <plugin>')
  .description('Show details about a plugin and its skills')
  .option('--no-telemetry', 'Disable anonymous usage telemetry')
  .action(async (plugin: string) => {
    await withTelemetry('info', () => infoCommand(plugin));
  });

program
  .command('search <query>')
  .description('Search plugins and skills by name, description, or tag')
  .option('--json', 'Output as JSON', false)
  .option('--no-telemetry', 'Disable anonymous usage telemetry')
  .action(async (query: string, opts) => {
    await withTelemetry('search', () => searchCommand(query, opts));
  });

program.parse();
