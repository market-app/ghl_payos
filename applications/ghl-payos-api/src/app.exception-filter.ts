import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import get from 'lodash/get';
import omit from 'lodash/omit';
import set from 'lodash/set';

import { parseErrorToJson } from './shared/utils/handle-error';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(private readonly traceService: TraceService) {
    super();
  }

  catch(exception: any, host: ArgumentsHost): void {
    const trace = this.traceService.getSpan();

    const exceptionDetail = parseErrorToJson(exception);
    if (trace) {
      trace.setAttribute('error', JSON.stringify(exceptionDetail));
    }

    if (get(exceptionDetail, 'name') === 'HttpException') {
      set(exceptionDetail, 'response', {
        ...omit(exceptionDetail, ['response']),
        statusCode: get(exceptionDetail, 'status', 400),
      });
    }
    super.catch(exception, host);
  }
}
