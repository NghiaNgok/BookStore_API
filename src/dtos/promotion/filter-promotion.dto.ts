import { Field, Int, ArgsType } from '@nestjs/graphql';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum statusPromotion {
    SOON = "soon",
    ON_DATE = "on_date",
    OUT_DATE = "out_date",
}

@ArgsType()
export class FilterPromotionDto {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field(() => String)
  @IsEnum(statusPromotion)
  @IsOptional()
  status?: statusPromotion;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  page?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  limit?: number;
}
