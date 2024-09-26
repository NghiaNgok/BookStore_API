import { Injectable } from '@nestjs/common';
import { Prisma, Promotion } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PromotionRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: {
    data: Prisma.PromotionCreateInput;
  }): Promise<Promotion> {
    const { data } = params;
    return this.prisma.promotion.create({
      data,
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.PromotionWhereInput;
    orderBy?: Prisma.PromotionOrderByWithRelationInput;
  }) {
    const { where, orderBy, skip, take } = params;
    return this.prisma.promotion.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async countPromotion(params: {
    where?: Prisma.PromotionWhereInput;
  }): Promise<number> {
    const { where } = params;
    return this.prisma.promotion.count({
      where,
    });
  }

  async findOne(
    id: Prisma.PromotionWhereUniqueInput,
  ): Promise<Promotion | null> {
    return this.prisma.promotion.findUnique({
      where: id,
      include: { bookPromotion: { include: { book: true } } },
    });
  }

  async update(params: {
    id: Prisma.PromotionWhereUniqueInput;
    data: Prisma.PromotionUpdateInput;
  }): Promise<Promotion | null> {
    const { id, data } = params;
    return this.prisma.promotion.update({ where: id, data: data });
  }
}
