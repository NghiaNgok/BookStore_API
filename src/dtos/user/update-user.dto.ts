import { Field, Int, ArgsType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class UpdateUserDto {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  id?: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  fullName?: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  email?: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  address?: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  phoneNumber?: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  avatar?: string;
}
