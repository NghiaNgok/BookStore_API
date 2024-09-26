import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import { BookEntity } from 'src/entities/book.entity';

@ObjectType()
export class ResponseBookDto {
  @Field((type) => [BookEntity])
  list: [BookEntity];

  @Field((type) => Int)
  totalPages: Number;

  @Field((type) => Int)
  currentPage: Number;

  @Field((type) => Int)
  totalProducts: Number;

  @Field((type) => Int)
  limit: Number;
}
