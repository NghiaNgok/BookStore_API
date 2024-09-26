import { InputType, Field, Int, ArgsType } from '@nestjs/graphql';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

@ArgsType()
export class UpdatePromotionDto {
  @Field(() => String)
  @IsNotEmpty({ message: 'title is not empty' })
  title: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'description is not empty' })
  description: string;

  @Field(() => Date)
  @IsNotEmpty({ message: 'startDate is not empty' })
  @IsDate()
  startDate: Date;

  @Field(() => Date)
  @IsNotEmpty({ message: 'endDate is not empty' })
  @IsDate()
  endDate: Date;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty({ message: 'discount percent is not empty' })
  discountPercent: number;

  @Field(() => [String])
  @IsArray()
  @IsNotEmpty({ message: 'book is not empty' })
  bookId: string[];
}
