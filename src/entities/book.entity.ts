import { Book } from '@prisma/client';

import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PromotionEntity } from './promotion.entity';
import { BookPromotionEntity } from './bookPromotion.entity';

@ObjectType()
export class BookEntity {
  @Field(() => String)
  id: Book['id'];

  @Field(() => String)
  title: Book['title'];

  @Field(() => String)
  description: Book['description'];

  @Field(() => Number)
  price: Book['price'];

  @Field(() => Number)
  rate: Book['rate'];

  @Field(() => String)
  imageUrl: Book['imageUrl'];

  @Field(() => Boolean)
  isActive: Book['isActive'];

  @Field(() => Boolean)
  isOutofStock: Book['isOutofStock'];

  @Field(() => String)
  categoryId: Book['categoryId'];

  @Field(() => String)
  authorId: Book['authorId'];

  @Field(() => Int)
  limitDiscount: Book['limitDiscount'];

  @Field(() => Date)
  createdAt: Book['createdAt'];

  @Field(() => Date)
  updatedAt: Book['updatedAt'];

  @Field(() => [BookPromotionEntity], {nullable: true})
  bookPromotion: BookPromotionEntity;
}
