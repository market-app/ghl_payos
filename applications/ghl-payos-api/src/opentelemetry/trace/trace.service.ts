import { context, trace, Span, Tracer } from '@opentelemetry/api';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TraceService {
  public getTracer(): Tracer {
    return trace.getTracer('default');
  }

  public getSpan(): Span | undefined {
    return trace.getSpan(context.active());
  }

  public startSpan(name: string): Span {
    const tracer = trace.getTracer('default');
    return tracer.startSpan(name);
  }
}
