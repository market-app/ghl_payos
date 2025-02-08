import { Controller, Get, Query } from '@nestjs/common';
import { GoHighLevelPayOSAuthenticationService } from './auth.service';

@Controller('/payos/auth')
export class GoHighLevelPayOSAuthenticationController {
  constructor(
    private readonly authService: GoHighLevelPayOSAuthenticationService,
  ) {}

  @Get()
  async get(@Query('code') code: string): Promise<string> {
    return this.authService.get(code);
  }
}
