import { Author } from '@prisma/client';
import { BookEntity } from './book.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import * as moment from "moment"; 

@ObjectType()
export class AuthorEntity {
  @Field(() => String)
  id: Author['id'];

  @Field(() => String)
  name: Author['name'];

  @Field(() => Boolean)
  isActive: Author['isActive'];

  @Transform(({ value }) => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return moment(date).format("LL");
      }
    }
    return value;
  })
  @Field(() => String)
  createdAt: Author['createdAt'];

  @Transform(({ value }) => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return moment(date).format("LL");
      }
    }
    return value;
  })
  @Field(() => String)
  updatedAt: Author['updatedAt'];

}
