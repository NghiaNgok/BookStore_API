import { Injectable } from '@nestjs/common';
import { Prisma, CartItem } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartRepository {
  constructor(private prisma: PrismaService) {}

  async createCartItem(params: {
    data: Prisma.CartItemCreateInput;
  }): Promise<CartItem> {
    const { data } = params;
    return this.prisma.cartItem.create({ data, include: { book: true } });
  }

  async findMany(params: {
    where?: Prisma.CartItemWhereInput;
    orderBy?: Prisma.CartItemOrderByWithRelationInput;
  }) {
    const { where, orderBy } = params;
    const currentDate = new Date();
    return this.prisma.cartItem.findMany({
      where,
      orderBy,
      include: {
        book: {
          include: {
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
        },
      },
    });
  }

  async findOne(id: Prisma.CartItemWhereUniqueInput): Promise<CartItem | null> {
    const currentDate = new Date();
    return this.prisma.cartItem.findUnique({
      where: id,
      include: { book: {
        include: {
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
      }, },
    });
  }

  async checkCartExisted(params: {
    where: Prisma.CartItemWhereInput;
  }): Promise<CartItem | null> {
    const { where } = params;
    return this.prisma.cartItem.findFirst({
      where,
      include: { book: true },
    });
  }

  async update(params: {
    id: Prisma.CartItemWhereUniqueInput;
    data: Prisma.CartItemUpdateInput;
  }): Promise<CartItem | null> {
    const { id, data } = params;
    return this.prisma.cartItem.update({
      where: id,
      data: data,
      include: { book: true },
    });
  }

  async delete(params: { id: Prisma.CartItemWhereUniqueInput }) {
    const { id } = params;
    return this.prisma.cartItem.delete({ where: id });
  }

  async deleteMany(params: { where: Prisma.CartItemWhereInput }) {
    const { where } = params;
    return this.prisma.cartItem.deleteMany({ where });
  }
}
