import { Controller, Post } from '@nestjs/common';
import { GHLMigrateService } from './migrate.service';

@Controller('migrate')
export class GHLMigrateController {
  private appId = process.env.PAYOS_APP_ID || '';

  constructor(private migrateService: GHLMigrateService) {}

  @Post()
  async migrateAppsToClientAndAuthToken(): Promise<any> {
    return this.migrateService.migrateAppsToClientAndAuthToken(this.appId);
  }
}
