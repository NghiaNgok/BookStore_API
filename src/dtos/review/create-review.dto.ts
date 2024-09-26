import { InputType, Field, Int, ArgsType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

@ArgsType()
export class CreateReviewDto {
  @Field(() => String)
  @IsNotEmpty({ message: 'bookId is not empty' })
  bookId: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'userId is not empty' })
  @IsString({ message: 'userId must be a string' })
  userId: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'content is not empty' })
  @IsString({ message: 'content must be a string' })
  content: string;

  @Field(() => Int)
  @IsNotEmpty({ message: 'rate is not empty' })
  @IsNumber({}, { message: 'rate must be an integer' })
  @Max(5, { message: 'max stars is 5' })
  @Min(1, { message: 'min stars is 1' })
  rate: number;
}
