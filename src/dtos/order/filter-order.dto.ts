import { ArgsType, Field, Int } from '@nestjs/graphql';
import { OrderStatus } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@ArgsType()
export class FilterOrderkDto {
  id?: string;
  status?: OrderStatus;
  isPaid?: boolean;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  userId?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  page?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  limit?: number;
}
