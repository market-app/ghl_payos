import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Injector } from './injector';
import { context, trace } from '@opentelemetry/api';

@Injectable()
export class LoggerInjector implements Injector {
  public inject(): void {
    ConsoleLogger.prototype.log = this.wrapPrototype(
      ConsoleLogger.prototype.log,
    );
    ConsoleLogger.prototype.debug = this.wrapPrototype(
      ConsoleLogger.prototype.debug,
    );
    ConsoleLogger.prototype.error = this.wrapPrototype(
      ConsoleLogger.prototype.error,
    );
    ConsoleLogger.prototype.verbose = this.wrapPrototype(
      ConsoleLogger.prototype.verbose,
    );
    ConsoleLogger.prototype.warn = this.wrapPrototype(
      ConsoleLogger.prototype.warn,
    );
  }

  private wrapPrototype(prototype): any {
    return {
      [prototype.name]: function (...args: any[]): any {
        args[0] = LoggerInjector.getMessage(args[0]);
        prototype.apply(this, args);
      },
    }[prototype.name];
  }

  private static getMessage(message: string): string {
    const currentSpan = trace.getSpan(context.active());
    if (!currentSpan) return message;

    const spanContext = currentSpan.spanContext();
    currentSpan.addEvent(message);

    return `[${spanContext.traceId}] ${message}`;
  }
}
