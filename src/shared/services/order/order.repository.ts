import { Injectable } from '@nestjs/common';
import { Prisma, Order, OrderStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  async createOrder(params: { data: Prisma.OrderCreateInput }): Promise<Order> {
    const { data } = params;
    return this.prisma.order.create({
      data,
      include: { OrderDetail: { include: { book: true } } },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithRelationInput;
  }) {
    const { where, orderBy, skip, take } = params;
    return this.prisma.order.findMany({
      skip,
      take,
      where,
      orderBy,
      include: { OrderDetail: { include: { book: true } }, user: true },
    });
  }

  async countOrder(params: {
    where?: Prisma.OrderWhereInput;
  }): Promise<number> {
    const { where } = params;
    return this.prisma.order.count({
      where,
    });
  }

  async findOne(id: Prisma.OrderWhereUniqueInput): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: id,
      include: { OrderDetail: { include: { book: true } } },
    });
  }

  async updateOne(
    id: Prisma.OrderWhereUniqueInput,
    data: Prisma.OrderUpdateInput,
  ): Promise<Order | null> {
    return this.prisma.order.update({ where: id, data: data });
  }

}
