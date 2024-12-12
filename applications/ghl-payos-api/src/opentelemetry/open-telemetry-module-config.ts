import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { Injector } from './trace/injectors/injector';
import { NodeSDKConfiguration } from '@opentelemetry/sdk-node';
import { ControllerInjector } from './trace/injectors/controller-injector';
// import { GuardInjector } from './trace/injectors/GuardInjector';
import { EventEmitterInjector } from './trace/injectors/event-emitter-injector';
import { ScheduleInjector } from './trace/injectors/schedule-injector';
import { PipeInjector } from './trace/injectors/pipe-injector';
import { LoggerInjector } from './trace/injectors/logger-injector';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { Resource } from '@opentelemetry/resources';
import { NoopSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { CompositePropagator } from '@opentelemetry/core';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { awsEc2Detector } from '@opentelemetry/resource-detector-aws';
import { containerDetector } from '@opentelemetry/resource-detector-container';
import { gcpDetector } from '@opentelemetry/resource-detector-gcp';
import { Span } from '@opentelemetry/api';
import { ClientRequest, IncomingMessage } from 'http';

export interface OpenTelemetryModuleConfig
  extends Partial<NodeSDKConfiguration> {
  traceAutoInjectors?: Provider<Injector>[];
}

export const OpenTelemetryModuleDefaultConfig = {
  serviceName: 'UNKNOWN',
  traceAutoInjectors: [
    ControllerInjector,
    // GuardInjector,
    EventEmitterInjector,
    ScheduleInjector,
    PipeInjector,
    LoggerInjector,
  ],
  autoDetectResources: false,
  resourceDetectors: [
    awsEc2Detector,
    containerDetector,
    gcpDetector,
    // instantAgentDetector,
  ],
  contextManager: new AsyncLocalStorageContextManager(),
  resource: new Resource({
    lib: '@metinseylan/nestjs-opentelemetry',
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-http': {
        requestHook: (span: Span, request) => {
          if (request instanceof ClientRequest) {
            span.updateName(`${request.method} ${request.path}`);
          }
          if (request instanceof IncomingMessage) {
            span.updateName(`${request.method} ${request.url}`);
          }
        },
        requireParentforOutgoingSpans: true,
        enabled: true,
        ignoreIncomingRequestHook: (request: IncomingMessage) => {
          const url = request.url as string;

          //! true is will be ignore
          if (
            url.startsWith('/health') ||
            url.startsWith('/metrics') ||
            url == '/'
          ) {
            return true;
          }
          return false;
        },
      },
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
    }),
  ],
  spanProcessor: new NoopSpanProcessor(),
  textMapPropagator: new CompositePropagator({
    propagators: [
      new JaegerPropagator(),
      new B3Propagator(),
      new B3Propagator({
        injectEncoding: B3InjectEncoding.MULTI_HEADER,
      }),
    ],
  }),
} as OpenTelemetryModuleConfig;
