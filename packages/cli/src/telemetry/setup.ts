import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { createMetrics, type Metrics } from './metrics.js';

const CLI_VERSION: string = __CLI_VERSION__;

let meterProvider: MeterProvider | null = null;
let metrics: Metrics | null = null;

export function initTelemetry(): Metrics | null {
  const endpoint = process.env.OTLP_ENDPOINT;
  const auth = process.env.OTLP_AUTH_HEADER;

  if (!endpoint || !auth) {
    return null;
  }

  const exporter = new OTLPMetricExporter({
    url: `${endpoint}/v1/metrics`,
    headers: { Authorization: auth },
  });

  meterProvider = new MeterProvider({
    resource: new Resource({
      [ATTR_SERVICE_NAME]: 'grafana-skills-cli',
      [ATTR_SERVICE_VERSION]: CLI_VERSION,
    }),
    readers: [
      new PeriodicExportingMetricReader({
        exporter,
        exportIntervalMillis: 60000,
      }),
    ],
  });

  const meter = meterProvider.getMeter('grafana-skills-cli');
  metrics = createMetrics(meter);
  return metrics;
}

export function getMetrics(): Metrics | null {
  return metrics;
}

export async function shutdownTelemetry(): Promise<void> {
  if (meterProvider) {
    try {
      await meterProvider.forceFlush();
      await meterProvider.shutdown();
    } catch {
      // Silently ignore telemetry shutdown errors
    }
  }
}
