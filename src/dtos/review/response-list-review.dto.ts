import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ReviewEntity } from 'src/entities/review.entity';
import { SentimentScores } from 'src/entities/sentiment-scores.types';

@ObjectType()
export class ResponseReviewDto {
  @Field((type) => [ReviewEntity])
  list: [ReviewEntity];

  @Field((type) => Int)
  totalPages: number;

  @Field((type) => Int)
  currentPage: number;

  @Field((type) => Int)
  totalProducts: number;

  @Field((type) => Int)
  limit: number;

  @Field(() => String, { nullable: true })
  overallSentiment?: string;  // Add field for overall sentiment

  @Field(() => SentimentScores, { nullable: true })
  scores?: SentimentScores;
}