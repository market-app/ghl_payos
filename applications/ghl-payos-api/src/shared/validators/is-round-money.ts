import {
  buildMessage,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';
import { isNil } from 'lodash';

export function IsRoundMoney(prefixMessage?: string, divisibleBy = 1000) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string): void {
    registerDecorator({
      name: 'isRoundMoney',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, args: ValidationArguments) {
          if (value % divisibleBy === 0) return true;
          return false;
        },
        // Specify your error message here.
        defaultMessage: buildMessage(
          (eachPrefix) =>
            `${eachPrefix} ${
              !isNil(prefixMessage) ? prefixMessage : '$property'
            } must be divisible by ${divisibleBy} `,
        ),
      },
    });
  };
}
