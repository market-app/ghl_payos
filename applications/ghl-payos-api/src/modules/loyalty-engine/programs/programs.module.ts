import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoyaltyEngineProgramsController } from './programs.controller';
import { LoyaltyEngineProgramsService } from './programs.service';

@Module({
  imports: [],
  controllers: [LoyaltyEngineProgramsController],
  providers: [LoyaltyEngineProgramsService],
  exports: [LoyaltyEngineProgramsService, TypeOrmModule],
})
export class LoyaltyEngineProgramsModule {}
