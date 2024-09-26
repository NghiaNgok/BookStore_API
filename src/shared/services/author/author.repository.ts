import { Injectable } from '@nestjs/common';
import { Prisma, Author } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthorRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: { data: Prisma.AuthorCreateInput }): Promise<Author> {
    const { data } = params;
    return this.prisma.author.create({ data });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AuthorWhereUniqueInput;
    where?: Prisma.AuthorWhereInput;
    orderBy?: Prisma.AuthorOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy, cursor } = params;
    return this.prisma.author.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async countAuthor(params: { where?: Prisma.AuthorWhereInput }): Promise<number> {
    const { where } = params;
    return this.prisma.author.count({
      where,
    });
  }

  async findOne(id: Prisma.AuthorWhereUniqueInput): Promise<Author | null> {
    return this.prisma.author.findUnique({ where: id });
  }

  async update(params: {
    id: Prisma.AuthorWhereUniqueInput;
    data: Prisma.AuthorUpdateInput;
  }): Promise<Author | null> {
    const { id, data } = params;
    return this.prisma.author.update({ where: id, data: data });
  }

  async disable(id: Prisma.AuthorWhereUniqueInput): Promise<Author> {
    return this.prisma.author.delete({ where: id });
  }

  async active(id: Prisma.AuthorWhereUniqueInput): Promise<Author> {
    return this.prisma.author.delete({ where: id });
  }
}
