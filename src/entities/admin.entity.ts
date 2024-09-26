import { Admin } from '@prisma/client';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AdminEntity {
  @Field(() => String)
  id: Admin['id'];

  @Field(() => String)
  fullName: Admin['fullName'];

  @Field(() => String)
  email: Admin['email'];

  @Field(() => String)
  username: Admin['username'];

  @Field(() => String)
  password: Admin['password'];

  @Field(() => Boolean)
  isActive: Admin['isActive'];

  @Field(() => String)
  phoneNumber: Admin['phoneNumber'];

  @Field(() => String, { nullable: true })
  address: Admin['address'];

  @Field(() => String, { nullable: true })
  avatar: Admin['avatar'];

  @Field(() => String, { nullable: true })
  refreshToken: Admin['refreshToken'];

  @Field(() => Date)
  createdAt: Admin['createdAt'];

  @Field(() => Date)
  updatedAt: Admin['updatedAt'];
}
