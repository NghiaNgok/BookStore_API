import { Injectable } from '@nestjs/common';
import { Prisma, Book } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class BookRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: { data: Prisma.BookCreateInput }): Promise<Book> {
    const { data } = params;
    return this.prisma.book.create({ data });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.BookWhereInput;
    orderBy?: Prisma.BookOrderByWithRelationInput;
  }): Promise<Book[]> {
    const { skip, take, where, orderBy } = params;
    const currentDate = new Date();
    return this.prisma.book.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        category: true,
        author: true,
        bookPromotion: {
          where: {
            promotion: {
              AND: {
                isActive: true,
                startDate: { lte: currentDate },
                expriedDate: { gte: currentDate },
              },
            },
          },
          include: { promotion: true },
        },
      },
    });
  }

  async countBook(params: { where?: Prisma.BookWhereInput }): Promise<number> {
    const { where } = params;
    return this.prisma.book.count({
      where,
    });
  }

  async findOne(id: Prisma.BookWhereUniqueInput): Promise<Book | null> {
    const currentDate = new Date();
    return this.prisma.book.findUnique({
      where: id,
      include: {
        category: true,
        author: true,
        bookPromotion: {
          where: {
            promotion: {
              isActive: true,
              startDate: { lte: currentDate },
              expriedDate: { gte: currentDate },
            },
          },
          include: { promotion: true },
        },
      },
    });
  }

  async update(params: {
    id: Prisma.BookWhereUniqueInput;
    data: Prisma.BookUpdateInput;
  }): Promise<Book | null> {
    const { id, data } = params;
    return this.prisma.book.update({ where: id, data: data });
  }

  async delete(id: Prisma.BookWhereUniqueInput): Promise<Book> {
    return this.prisma.book.delete({ where: id });
  }
}
