import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmpty, IsNotEmpty } from 'class-validator';
import { SignInDto } from './signin.dto';

@ArgsType()
export class SignInAdminDto extends SignInDto {
  @IsNotEmpty()
  @Field(() => Boolean, { defaultValue: true })
  isAdmin: boolean;
}
