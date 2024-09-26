import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ReviewEntity } from 'src/entities/review.entity';

@ObjectType()
export class ResponseReviewDto {
  @Field((type) => [ReviewEntity])
  list: [ReviewEntity];

  @Field((type) => Int)
  totalPages: Number;

  @Field((type) => Int)
  currentPage: Number;

  @Field((type) => Int)
  totalProducts: Number;

  @Field((type) => Int)
  limit: Number;
}
