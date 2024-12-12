import express from 'express';
import ResponseTime from 'response-time';
import prometheus from 'prom-client';

import { requestCountGenerator, requestDurationGenerator } from './metrics';

import { normalizeStatusCode, normalizePath } from './normalizers';

const defaultOptions: any = {
  metricsPath: '/metrics',
  metricsApp: null,
  authenticate: null,
  collectDefaultMetrics: true,
  collectGCMetrics: false,
  // buckets for response time from 0.05s to 2.5s
  // these are arbitrary values since i don't know any better ¯\_(ツ)_/¯
  requestDurationBuckets: prometheus.exponentialBuckets(0.05, 1.75, 8),
  requestLengthBuckets: [],
  responseLengthBuckets: [],
  extraMasks: [],
  customLabels: [],
  transformLabels: null,
  normalizeStatus: true,
  prefix: '',
};

export default (userOptions = {}): any => {
  const options = { ...defaultOptions, ...userOptions };
  const originalLabels = ['route', 'method', 'status'];
  options.customLabels = new Set([...originalLabels, ...options.customLabels]);
  options.customLabels = [...options.customLabels];
  const { metricsPath, metricsApp, normalizeStatus } = options;

  const app = express();
  app.disable('x-powered-by');

  const requestDuration = requestDurationGenerator(
    options.customLabels,
    options.requestDurationBuckets,
    options.prefix,
  );
  const requestCount = requestCountGenerator(
    options.customLabels,
    options.prefix,
  );

  /**
   * Corresponds to the R(request rate), E(error rate), and D(duration of requests),
   * of the RED metrics.
   */
  const redMiddleware = ResponseTime((req, res, time) => {
    const { originalUrl, method } = req;
    // will replace ids from the route with `#val` placeholder this serves to
    // measure the same routes, e.g., /image/id1, and /image/id2, will be
    // treated as the same route
    const route = normalizePath(originalUrl, options.extraMasks);

    if (
      route !== '/' &&
      route !== metricsPath &&
      !route.startsWith('/health')
    ) {
      const status = normalizeStatus
        ? normalizeStatusCode(res.statusCode)
        : res.statusCode.toString();

      const labels = { route, method, status };

      if (typeof options.transformLabels === 'function') {
        options.transformLabels(labels, req, res);
      }
      requestCount.inc(labels);

      // observe normalizing to seconds
      requestDuration.observe(labels, time / 1000);
    }
  });

  app.use(redMiddleware);

  /**
   * Metrics route to be used by prometheus to scrape metrics
   */
  const routeApp = metricsApp || app;
  routeApp.get(metricsPath, async (req, res, next) => {
    if (typeof options.authenticate === 'function') {
      let result = null;
      try {
        result = await options.authenticate(req);
      } catch (err) {
        // treat errors as failures to authenticate
      }

      // the requester failed to authenticate, then return next, so we don't
      // hint at the existence of this route
      if (!result) {
        return next();
      }
    }

    res.set('Content-Type', prometheus.register.contentType);
    return res.end(await prometheus.register.metrics());
  });

  return app;
};
