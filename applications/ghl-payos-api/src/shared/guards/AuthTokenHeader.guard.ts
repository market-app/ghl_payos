import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { get } from 'lodash';

@Injectable()
export class AuthTokenHeaderGuard implements CanActivate {
  // constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const clientId = get(request.headers, 'x-client-id');
    const accessToken = get(request.headers, 'x-access-token');
    if (!accessToken || !clientId) {
      throw new UnauthorizedException(
        'Endpoint requires x-client-id, x-access-token in header',
      );
    }
    if (
      accessToken !== process.env.X_ACCESS_TOKEN ||
      clientId !== process.env.X_CLIENT_ID
    ) {
      throw new UnauthorizedException(
        'x-client-id or x-access-token incorrect',
      );
    }

    return true;
  }
}
