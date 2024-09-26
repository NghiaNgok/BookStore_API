import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { OrderEntity } from 'src/entities/order.entity';
import { ReviewsRepository } from './review.repository';
import { CreateReviewDto } from 'src/dtos/review/create-review.dto';
import { ReviewEntity } from 'src/entities/review.entity';
import { FilterReviewDto } from 'src/dtos/review/filter-review.dto';
import { equal } from 'assert';

@Injectable()
export class ReviewService {
  constructor(private reviewRepository: ReviewsRepository) {}

  async create(creatReviewDTO: CreateReviewDto): Promise<ReviewEntity> {
    const result = await this.reviewRepository.create({
      data: {
        content: creatReviewDTO.content,
        rate: creatReviewDTO.rate,
        book: {
          connect: {
            id: creatReviewDTO.bookId,
          },
        },
        user: {
          connect: {
            id: creatReviewDTO.userId,
          },
        },
      },
    });
    return plainToInstance(ReviewEntity, result);
  }

  async getAllForCalculate(bookId: string) {
    const response = await this.reviewRepository.findMany({
      where: { bookId: bookId },
    });
    return plainToInstance(ReviewEntity, response);
  }

  async findAll(filter: FilterReviewDto) {
    const itemPerPage: number = filter.limit || 5;
    const offset: number =
      filter.page && filter.page > 0 ? (filter.page - 1) * itemPerPage : 0;
    const currentPage: number = filter.page || 1;

    const whereCondition: any = {
      AND: [],
    };
    if (filter.bookTitle) {
      whereCondition.AND.push({
        book: { title: { contains: filter.bookTitle } },
      });
    }
    if (filter.bookId) {
      whereCondition.AND.push({
        bookId: { equals: filter.bookId },
      });
    }
    if (filter.rate && filter.rate.length > 0) {
      whereCondition.AND.push({
        rate: { in: filter.rate },
      });
    }

    const [list, total] = await Promise.all([
      this.reviewRepository.findMany({
        skip: offset,
        take: itemPerPage,
        where: whereCondition,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.reviewRepository.countReview({
        where: whereCondition,
      }),
    ]);

    const result = plainToInstance(ReviewEntity, list);

    return {
      list: result,
      totalProducts: total,
      totalPages: Math.ceil(total / itemPerPage),
      currentPage: currentPage,
      limit: itemPerPage,
    };
  }
}
