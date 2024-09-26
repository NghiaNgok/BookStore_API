import { Field, Int, ArgsType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

@ArgsType()
export class FilterUserDto {
  @Field(() => String,{ nullable: true })
  @IsString()
  @IsOptional()
  fullName?: string;

  @Field(() => String,{ nullable: true })
  @IsString()
  @IsOptional()
  username?: string;

  @Field(() => String,{ nullable: true })
  @IsString()
  @IsOptional()
  email?: string;

  @Field(() => Boolean, { nullable: true , defaultValue: true})
  @IsBoolean()
  @IsOptional()
  isActive?: boolean

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  page?: number;

  @Field(() => Int,{ nullable: true })
  @IsNumber()
  @IsOptional()
  limit?: number;
}
