import { User } from '@prisma/client';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserEntity {
  @Field(() => String)
  id: User['id'];

  @Field(() => String)
  fullName: User['fullName'];

  @Field(() => String)
  email: User['email'];

  @Field(() => String)
  username: User['username'];

  @Field(() => String)
  password: User['password'];

  @Field(() => Boolean)
  isActive: User['isActive'];

  @Field(() => String)
  phoneNumber: User['phoneNumber'];

  @Field(() => String, { nullable: true })
  address: User['address'];

  @Field(() => String, { nullable: true })
  avatar: User['avatar'];

  @Field(() => String, { nullable: true })
  refreshToken: User['refreshToken'];

  @Field(() => Date)
  createdAt: User['createdAt'];

  @Field(() => Date)
  updatedAt: User['updatedAt'];
}
