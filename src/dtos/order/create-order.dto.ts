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
export class CreateOrderDto {
  @Field(() => Float)
  @IsNumber({}, { message: 'total Price must be a number' })
  @IsNotEmpty({ message: 'total Price must not be empty' })
  totalPrice: number;

  @Field(() => PaymentMethod)
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @Field(() => String)
  @IsNotEmpty({ message: 'userId must not be empty' })
  userId: string;

  @Field(() => OrderStatus)
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @Field(() => Date, {nullable: true})
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  paidAt: Date | null;

  @Field(() => String)
  @IsNotEmpty({ message: 'address must not be empty' })
  address: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'phone number must not be empty' })
  phoneNumber: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'customer name must not be empty' })
  customerName: string;

  @Field(() => [OrderItemInput])
  @IsArray()
  orderItem: OrderItemInput[];
}
