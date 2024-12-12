import prometheus from 'prom-client';

/**
 * @param prefix - metrics name prefix
 * request counter
 */
export function requestCountGenerator(
  labelNames: any,
  prefix = '',
): prometheus.Counter<string> {
  return new prometheus.Counter({
    name: `${prefix}http_requests_total`,
    help: 'Counter for total requests received',
    labelNames,
  });
}

/**
 * @param {!Array} buckets - array of numbers, representing the buckets for
 * @param prefix - metrics name prefix
 * request duration
 */
export function requestDurationGenerator(
  labelNames,
  buckets,
  prefix = '',
): prometheus.Histogram<string> {
  return new prometheus.Histogram({
    name: `${prefix}http_request_duration_seconds`,
    help: 'Duration of HTTP requests in seconds',
    labelNames,
    buckets,
  });
}
