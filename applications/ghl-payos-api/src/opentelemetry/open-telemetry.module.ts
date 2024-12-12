import { DynamicModule } from '@nestjs/common';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { TraceService } from './trace/trace.service';
import { CONSTANTS } from 'src/shared/constants/opentelemetry.constant';
import { OpenTelemetryModuleDefaultConfig } from './open-telemetry-module-config';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import { OpenTelemetryService } from './open-telemetry.service';
import { OpenTelemetryModuleAsyncOption } from './open-telemetry-module-async-option';
import { DecoratorInjector } from './trace/injectors/decorator-injector';
import { ModuleRef } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Tracer } from '@opentelemetry/sdk-trace-base';

export class OpenTelemetryModule {
  static async forRootAsync(
    configuration: OpenTelemetryModuleAsyncOption = {},
  ): Promise<DynamicModule> {
    return {
      global: true,
      module: OpenTelemetryModule,
      imports: [
        ...(configuration?.imports as any),
        EventEmitterModule.forRoot(),
      ],
      providers: [
        TraceService,
        OpenTelemetryService,
        this.buildAsyncProvider(),
        this.buildAsyncInjectors(),
        this.buildTracer(),
        {
          provide: CONSTANTS.SDK_CONFIG,
          useFactory: configuration.useFactory as any,
          inject: configuration.inject,
        },
      ],
      exports: [TraceService, Tracer],
    };
  }

  private static buildAsyncProvider(): FactoryProvider {
    return {
      provide: CONSTANTS.SDK,
      useFactory: async (config): Promise<NodeSDK> => {
        config = { ...OpenTelemetryModuleDefaultConfig, ...config };
        const sdk = new NodeSDK(config);
        await sdk.start();
        return sdk;
      },
      inject: [CONSTANTS.SDK_CONFIG],
    };
  }

  private static buildAsyncInjectors(): FactoryProvider {
    return {
      provide: CONSTANTS.SDK_INJECTORS,
      useFactory: async (config, moduleRef: ModuleRef): Promise<any> => {
        config = { ...OpenTelemetryModuleDefaultConfig, ...config };
        const injectors =
          config.traceAutoInjectors ??
          OpenTelemetryModuleDefaultConfig.traceAutoInjectors;

        const decoratorInjector = await moduleRef.create(DecoratorInjector);
        await decoratorInjector.inject();

        for await (const injector of injectors) {
          const created = await moduleRef.create(injector);
          if (created['inject']) await created.inject();
        }

        return {};
      },
      inject: [CONSTANTS.SDK_CONFIG, ModuleRef],
    };
  }

  private static buildTracer(): {
    provide: any;
    useFactory: any;
    inject: any[];
  } {
    return {
      provide: Tracer,
      useFactory: (traceService: TraceService): any => traceService.getTracer(),
      inject: [TraceService],
    };
  }
}
