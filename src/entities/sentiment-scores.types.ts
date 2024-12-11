// src/entities/sentiment-scores.type.ts
import { Field, ObjectType, Float } from '@nestjs/graphql';

@ObjectType()  // Ensure @ObjectType decorator is here
export class SentimentScores {
  @Field(() => Float)  // Use @Field with explicit type
  Positive: number;

  @Field(() => Float)
  Neutral: number;

  @Field(() => Float)
  Negative: number;
}
