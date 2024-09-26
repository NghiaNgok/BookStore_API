import { Injectable } from '@nestjs/common';
import { Prisma, User  } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findOne(id: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({ where: id });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.BookOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async countUser(params: { where?: Prisma.UserWhereInput }): Promise<number> {
    const { where } = params;
    return this.prisma.user.count({
      where,
    });
  }

  async update(params: {
    id: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<UserEntity | null> {
    const { id, data } = params;
    return this.prisma.user.update({ where: id, data: data });
  }
}
