import { Field, Int, ArgsType } from '@nestjs/graphql';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

@ArgsType()
export class FilterReviewDto {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  bookId?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  bookTitle?: string;

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @IsOptional()
  rate?: number[];

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  page?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  limit?: number;
}
