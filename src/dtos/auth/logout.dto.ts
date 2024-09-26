import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType()
export class LogoutResponseDto {
  @IsString()
  @Field(() => String)
  result: string;
}
