import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType()
export class TokenPayload {
  @IsString()
  @Field(() => String)
  sub: string;

  @IsString()
  @Field(() => String)
  username: String;
  
}
