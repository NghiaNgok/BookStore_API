import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'src/entities/user.entity';

@ObjectType()
export class ResponseUserDto {
  @Field((type) => [UserEntity])
  list: [UserEntity];

  @Field((type) => Int)
  totalPages: Number;

  @Field((type) => Int)
  currentPage: Number;

  @Field((type) => Int)
  totalProducts: Number;

  @Field((type) => Int)
  limit: Number;
}
