import { CartItem, Category as categoryDB } from '@prisma/client';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BookEntity } from './book.entity';
import { IsOptional } from 'class-validator';

@ObjectType()
export class CartItemEntity {
  @Field(() => String)
  id: CartItem['id'];

  @Field(() => String)
  bookId: CartItem['bookId'];

  @Field(() => Number)
  quantity: CartItem['quantity'];

  @Field(() => Date)
  createdAt: CartItem['createdAt'];

  @Field(() => Date)
  updatedAt: CartItem['updatedAt'];

  @Field(() => String)
  userId: CartItem['userId'];

  @Field(() => Number)
  price: CartItem['price'];

  @Field(() => BookEntity, {nullable: true})
  book: BookEntity
}
