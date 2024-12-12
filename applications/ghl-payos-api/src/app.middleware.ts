import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  constructor(private readonly traceService: TraceService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const requestBody = req.body;

    const trace = this.traceService.getSpan();
    if (trace) {
      trace.setAttribute('request-body', JSON.stringify(requestBody));
    }

    next();
  }
}
