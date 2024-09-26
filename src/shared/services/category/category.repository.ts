import { Injectable } from '@nestjs/common';
import { Prisma, Category } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: {
    data: Prisma.CategoryCreateInput;
  }): Promise<Category> {
    const { data } = params;
    return this.prisma.category.create({ data });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CategoryWhereUniqueInput;
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput;
  }): Promise<Category[]> {
    const { skip, take, where, orderBy, cursor } = params;
    return this.prisma.category.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async count(params: {
    where?: Prisma.CategoryWhereInput;
  }): Promise<number> {
    const { where } = params;
    return this.prisma.category.count({
      where,
    });
  }

  async findOne(id: Prisma.CategoryWhereUniqueInput): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: id });
  }

  async update(params: {
    id: Prisma.CategoryWhereUniqueInput;
    data: Prisma.CategoryUpdateInput;
  }): Promise<Category | null> {
    const { id, data } = params;
    return this.prisma.category.update({ where: id, data: data });
  }

  async delete(id: Prisma.CategoryWhereUniqueInput): Promise<Category> {
    return this.prisma.category.delete({ where: id });
  }
}
