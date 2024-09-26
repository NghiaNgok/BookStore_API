import { Field, Int, ArgsType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class UpdateUserPasswordDto {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  id?: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  currentPassword?: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  newPassword?: string;
}
