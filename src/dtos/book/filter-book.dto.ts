import { InputType, Field, Int, ArgsType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum SortBookByEnum {
  ON_SALE = 'ON_SALE',
  POPULAR = 'POPULAR',
  RECOMMENDED = 'RECOMMENDED',
  NEW = 'NEW',
}
@ArgsType()
export class FilterBookDto {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @IsOptional()
  rate?: number[];

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  author?: string[];

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  category?: string[];

  @Field(() => String, { nullable: true })
  @IsEnum(SortBookByEnum)
  @IsOptional()
  sortByEnum?: SortBookByEnum;

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  page?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  limit?: number;
}
