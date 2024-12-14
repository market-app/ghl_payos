import { Module } from '@nestjs/common';
import { LoyaltyEngineAuthController } from './auth.controller';
import { LoyaltyEngineAuthService } from './auth.service';

@Module({
  imports: [],
  controllers: [LoyaltyEngineAuthController],
  providers: [LoyaltyEngineAuthService],
  exports: [LoyaltyEngineAuthService],
})
export class LoyaltyEngineAuthModule {}
