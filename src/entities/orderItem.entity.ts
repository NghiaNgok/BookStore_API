import { OrderItem } from '@prisma/client';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { BookEntity } from './book.entity';

@ObjectType()
export class OrderItemEntity {
  @Field(() => String)
  id: OrderItem['id'];

  @Field(() => String)
  orderId: OrderItem['orderId'];

  @Field(() => String)
  bookId: OrderItem['bookId'];

  @Field(() => Float)
  price: OrderItem['price'];

  @Field(() => Int)
  quantity: OrderItem['quantity'];

  @Field(() => BookEntity)
  book: BookEntity;
}
