import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class SentimentSummaryDto {
  @Field(() => Int)
  positive: number;

  @Field(() => Int)
  neutral: number;

  @Field(() => Int)
  negative: number;
}
