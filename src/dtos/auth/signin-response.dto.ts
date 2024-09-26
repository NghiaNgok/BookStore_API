import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { UserEntity } from 'src/entities/user.entity';

@ObjectType()
export class SignInResponseDto {
  @IsString()
  @Field(() => String)
  accessToken: string;

  @IsString()
  @Field(() => String)
  refreshToken: string;

  @Field(() => UserEntity)
  userInfo: UserEntity;
}
