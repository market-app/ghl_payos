import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import CryptoJS from 'crypto-js';
import { get } from 'lodash';

@Injectable()
export class DecryptPayloadSSOKeyGuard implements CanActivate {
  // constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const payload = get(request.headers, 'x-sso-payload');
    if (!payload) {
      throw new UnauthorizedException(
        'Endpoint requires x-sso-payload in header',
      );
    }

    const sessionJson = CryptoJS.AES.decrypt(
      String(payload),
      process.env.GHL_SSO_KEY || '',
    ).toString(CryptoJS.enc.Utf8);

    const session = JSON.parse(sessionJson);

    request.appInfo = session;
    return true;
  }
}
