import { Field, ObjectType } from '@nestjs/graphql';
import { AuthorEntity } from 'src/entities/author.entity';
import { BookEntity } from 'src/entities/book.entity';
import { Category } from 'src/entities/category.entity';

@ObjectType()
export class DetailBookDto extends BookEntity {
  @Field(() => AuthorEntity)
  author: AuthorEntity;

  @Field(() => Category)
  category: Category;
}
