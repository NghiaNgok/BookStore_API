import { Injectable } from '@nestjs/common';
import { Prisma, Review } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReviewsRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: { data: Prisma.ReviewCreateInput }): Promise<Review> {
    const { data } = params;
    return this.prisma.review.create({
      data,
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ReviewWhereInput;
    orderBy?: Prisma.ReviewOrderByWithRelationInput;
  }) {
    const { where, orderBy, skip, take } = params;
    return this.prisma.review.findMany({
      skip,
      take,
      where,
      orderBy,
      include: { user: true, book: true },
    });
  }

  async countReview(params: {
    where?: Prisma.ReviewWhereInput;
  }): Promise<number> {
    const { where } = params;
    return this.prisma.review.count({
      where,
    });
  }
}
