import { Field, ArgsType, Float, registerEnumType } from '@nestjs/graphql';
import { OrderStatus, PaymentMethod } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { OrderItemInput } from '../cart/order-item-input.sto';

registerEnumType(PaymentMethod, {
  name: 'PaymentMethod',
});

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

@ArgsType()
export class UpdateStatusOrderDto {
  @Field(() => OrderStatus)
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  paidAt: Date | null;
}
