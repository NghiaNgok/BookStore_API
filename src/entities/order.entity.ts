import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Order, OrderStatus, PaymentMethod } from '@prisma/client';
import { Transform } from 'class-transformer';
import * as moment from "moment"; 
import { OrderItemEntity } from './orderItem.entity';

@ObjectType()
export class OrderEntity {
  @Field(() => String)
  id: Order['id'];

  @Field(() => Float)
  totalPrice: Order['totalPrice'];

  @Field(() => String)
  userId: Order['userId'];

  @Field(() => OrderStatus)
  status: Order['status'];

  @Transform(({ value }) => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return moment(date).format("LL");
      }
    }
    return value;
  })
  @Field(() => String, { nullable: true })
  paidAt: Order['paidAt'];

  @Field(() => String)
  address: Order['address'];

  @Field(() => String)
  customerName: Order['customerName'];

  @Field(() => String)
  phoneNumber: Order['phoneNumber'];

  @Field(() => PaymentMethod)
  paymentMethod: Order['paymentMethod'];

  @Transform(({ value }) => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return moment(date).format("LL");
      }
    }
    return value;
  })
  @Field(() => String)
  createdAt: Order['createdAt'];

  @Transform(({ value }) => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return moment(date).format("LL");
      }
    }
    return value;
  })
  @Field(() => String)
  updatedAt: Order['updatedAt'];

  @Field(() => [OrderItemEntity])
  OrderDetail: OrderItemEntity[];
}
