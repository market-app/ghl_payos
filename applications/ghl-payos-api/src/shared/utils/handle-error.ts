import { HttpException } from '@nestjs/common';
import { parse, stringify } from 'flatted';

/**
 * parse error sang json
 */
export function parseErrorToJson(error: any): Record<string, any> {
  let parseError: Record<string, any> = {};

  parseError = parse(stringify(error));

  if (error?.response?.message) {
    parseError.message = error?.response?.message;
  } else if (error?.message) {
    parseError.message = error?.message;
  }
  return parseError;
}

export class HttpErrorCustom {
  constructor(error: Record<string, any>) {
    const httpStatusCode = Number(error?.cause?.code || error?.status || 400);
    const errorDetail = error?.response || error;
    const message =
      error?.response?.message ||
      error?.message ||
      'Có lỗi xảy ra trong quá trình xử lý, vui lòng thử lại sau.';
    throw new HttpException({ ...errorDetail, message }, httpStatusCode);
  }
}
