import { About } from '@prisma/client';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AboutEntity {
  @Field(() => String)
  id: About['id'];

  @Field(() => String)
  content: About['content'];

}
