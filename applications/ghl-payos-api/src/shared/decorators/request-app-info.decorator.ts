import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestAppInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.appInfo;
  },
);
