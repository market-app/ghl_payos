import { BeforeApplicationShutdown, Inject, Injectable } from '@nestjs/common';
import { CONSTANTS } from 'src/shared/constants/opentelemetry.constant';
import { NodeSDK } from '@opentelemetry/sdk-node';

@Injectable()
export class OpenTelemetryService implements BeforeApplicationShutdown {
  constructor(@Inject(CONSTANTS.SDK) private readonly sdk: NodeSDK) {}

  async beforeApplicationShutdown(): Promise<void> {
    await this.sdk?.shutdown();
  }
}
