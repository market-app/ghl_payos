import upperCase from 'lodash/upperCase';
import {
  AdvancedConsoleLogger,
  Logger,
  LoggerOptions,
  QueryRunner,
} from 'typeorm';

export class CustomTypeOrmLogger
  extends AdvancedConsoleLogger
  implements Logger
{
  constructor(options?: LoggerOptions) {
    super(options);
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    if (query && upperCase(query) !== 'SELECT 1') {
      super.logQuery(query, parameters, queryRunner);
    }
  }
}
