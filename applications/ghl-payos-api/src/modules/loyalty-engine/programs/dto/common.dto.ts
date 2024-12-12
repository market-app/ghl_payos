import { BadRequestException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import dayjs from 'dayjs';
import { get } from 'lodash';

@ValidatorConstraint()
export class IsAfterOneDay implements ValidatorConstraintInterface {
  public async validate(
    value: any,
    validationArguments?: ValidationArguments | undefined,
  ): Promise<boolean> {
    const date = dayjs(value).startOf('day');
    const tmr = dayjs().add(1, 'day').startOf('day');
    return tmr.isSameOrBefore(date);
  }
}

@ValidatorConstraint()
export class IsEndDateAfterStartDate implements ValidatorConstraintInterface {
  public async validate(
    value: any,
    validationArguments?: ValidationArguments | undefined,
  ): Promise<boolean> {
    const obj = validationArguments?.object;
    const startDate = get(obj, 'startDate');
    const endDate = get(obj, 'endDate');
    if (!startDate || !endDate) {
      throw new BadRequestException('Dữ liệu truyền lên không đúng');
    }

    return dayjs(endDate)
      .startOf('day')
      .isAfter(dayjs(startDate).startOf('day'));
  }
}

@ValidatorConstraint({ async: false })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: any): boolean {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    return value === relatedValue; // So sánh hai giá trị
  }

  defaultMessage(args: any): string {
    const [relatedPropertyName] = args.constraints;
    return `$property phải trùng với ${relatedPropertyName}`;
  }
}

/**
 * Dùng để check các giá trị trùng nhau
 * - Vd: các trường của option truyền lên như key, value, label thì phải check thêm key = value
 * để tránh trường hợp gọi bằng postman và làm vậy thì sau này gọi ra thì xài biến nào cx đc
 * @param property
 * @param validationOptions
 * @returns
 */
export function Match(property: string, validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}
