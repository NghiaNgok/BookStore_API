import { Category as categoryDB } from '@prisma/client';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import * as moment from "moment"; 
@ObjectType()
export class Category {
  @Field(() => String)
  id: categoryDB["id"];

  @Field(() => String)
  name: categoryDB["name"];

  @Field(() => String)
  description: categoryDB["description"];

  @Field(() => Boolean)
  isActive: categoryDB["isActive"];

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
  createdAt: categoryDB["createdAt"];

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
  updatedAt: categoryDB["updatedAt"];
}
