import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoyaltyEngineAuthService } from './auth.service';

@ApiTags('loyalty-engine/authentication')
@Controller('loyalty-engine/authentication')
export class LoyaltyEngineAuthController {
  constructor(
    private readonly loyaltyEngineAuthService: LoyaltyEngineAuthService,
  ) {}
}
