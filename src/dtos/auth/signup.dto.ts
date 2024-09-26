import { ArgsType, Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

@ArgsType()
export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  address: string;

  @IsEmail({}, {message: 'Email is invalid'})
  @IsNotEmpty()
  @Field(() => String)
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field(() => String)
  @IsNotEmpty()
  @MinLength(6, {message: "Password must be at least 6 characters"})
  password: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  avatar?: string;
}
