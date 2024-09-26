import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmpty, IsString, MinLength } from 'class-validator';

@ArgsType()
export class SignInDto {
  @IsString()
  @Field(() => String)
  username: string;
 
  @MinLength(6)
  @Field(() => String)
  password: string;
}
