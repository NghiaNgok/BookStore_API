import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Review } from '@prisma/client';
import { Transform } from 'class-transformer';
import * as moment from "moment"; 
import { UserEntity } from './user.entity';
import { BookEntity } from './book.entity';
import { SentimentScores } from './sentiment-scores.types';  // Import the new type

@ObjectType()
export class ReviewEntity {
  @Field(() => String)
  id: Review['id'];

  @Field(() => String)
  content: Review['content'];

  @Field(() => Int)
  rate: Review['rate'];

  @Field(() => String)
  userId: Review['userId'];

  @Field(() => String)
  bookId: Review['bookId'];

  @Field(() => String)
  category: Review['category'];

  @Field(() => SentimentScores, { nullable: true })  // Use the custom type
  scores: SentimentScores;

  @Field(() => String, { nullable: true })  // Set nullable to true
  overallSentiment?: string;

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
  createdAt: Review['createdAt'];

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
  updatedAt: Review['updatedAt'];

  @Field(() => UserEntity)
  user: UserEntity;

  @Field(() => BookEntity)
  book: BookEntity;
}
