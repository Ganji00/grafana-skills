import type { Meter } from '@opentelemetry/sdk-metrics';

export function createMetrics(meter: Meter) {
  return {
    commandTotal: meter.createCounter('grafana_skills_command_total', {
      description: 'Total CLI command invocations',
    }),
    installTotal: meter.createCounter('grafana_skills_install_total', {
      description: 'Successful skill plugin installs',
    }),
    installDuration: meter.createHistogram('grafana_skills_install_duration_seconds', {
      description: 'Time to complete an install operation',
    }),
    removeTotal: meter.createCounter('grafana_skills_remove_total', {
      description: 'Skill plugin removals',
    }),
    errorTotal: meter.createCounter('grafana_skills_error_total', {
      description: 'CLI errors by type',
    }),
  };
}

export type Metrics = ReturnType<typeof createMetrics>;
