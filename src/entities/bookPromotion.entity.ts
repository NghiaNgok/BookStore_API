import { BookPromotionRelationship, Category as categoryDB } from '@prisma/client';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import * as moment from "moment"; 
import { PromotionEntity } from './promotion.entity';
import { BookEntity } from './book.entity';
@ObjectType()
export class BookPromotionEntity {
  @Field(() => String)
  id: BookPromotionRelationship["id"];

  @Field(() => String)
  bookId: BookPromotionRelationship["bookId"];

  @Field(() => String)
  promotionId: BookPromotionRelationship["promotionId"];

  @Field(() => PromotionEntity)
  promotion: PromotionEntity;

  @Field(() => BookEntity)
  book: BookEntity;

}
