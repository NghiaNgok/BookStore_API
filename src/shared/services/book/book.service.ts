import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { BookEntity } from '../../../entities/book.entity';
import { BookRepository } from './book.repository';
import { CreateBookDto } from 'src/dtos/book/create-book.dto';
import { FilterBookDto, SortBookByEnum } from 'src/dtos/book/filter-book.dto';
import { UpdateBookDto } from 'src/dtos/book/update-book.dto';
import { ReviewService } from '../review/review.service';
import { OrderStatus } from '@prisma/client';
import { contains } from 'class-validator';

@Injectable()
export class BookService {
  constructor(
    private bookRepository: BookRepository,
    private reviewService: ReviewService,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const result = await this.bookRepository.create({
      data: {
        title: createBookDto.title,
        description: createBookDto.description,
        price: createBookDto.price,
        rate: 0,
        limitDiscount: createBookDto.limitDiscount,
        imageUrl: createBookDto.imageUrl,
        category: {
          connect: {
            id: createBookDto.category,
          },
        },
        author: {
          connect: {
            id: createBookDto.author,
          },
        },
      },
    });
    return plainToInstance(BookEntity, result);
  }

  async findAllWithoutPagination(title: string) {
    const result = await this.bookRepository.findMany({
      where: { title: {contains: title} }
    });
    return plainToInstance(BookEntity, result);
  }
  async findAll(filter: FilterBookDto) {
    let itemPerPage: number = filter.limit ? filter.limit : 5;
    let offset: number = filter.page > 0 ? (filter.page - 1) * filter.limit : 0;
    let currentPage: number = filter.page ? filter.page : 1;

    const whereCondition: any = {
      AND: [],
    };
    let sortCondition: any = {};

    if (filter.sortByEnum) {
      const currentDate = new Date();
      switch (filter.sortByEnum) {
        case SortBookByEnum.ON_SALE:
          whereCondition.AND.push({
            bookPromotion: {
              some: {
                promotion: {
                  isActive: true,
                  startDate: { lte: currentDate },
                  expriedDate: { gte: currentDate },
                },
              },
            },
          });
          break;
        case SortBookByEnum.POPULAR:
          whereCondition.AND.push({
            orderDetail: {
              some: {
                order: {
                  status: OrderStatus.DONE,
                },
              },
            },
          });
          sortCondition = {
            orderDetail: {
              _count: 'desc',
            },
          };
          break;
        case SortBookByEnum.NEW:
          sortCondition = { createdAt: 'desc' };
          break;
        default:
          break;
      }
    }

    if (filter.title) {
      whereCondition.AND.push({ title: { contains: filter.title } });
    }

    if (filter.rate && filter.rate.length > 0) {
      whereCondition.AND.push({ rate: { in: filter.rate } });
    }

    if (filter.category && filter.category.length > 0) {
      whereCondition.AND.push({ categoryId: { in: filter.category } });
    }

    if (filter.author && filter.author.length > 0) {
      whereCondition.AND.push({ authorId: { in: filter.author } });
    }

    if (filter.isActive) {
      whereCondition.AND.push({ isActive: { equals: filter.isActive } });
    }

    const [list, total] = await Promise.all([
      this.bookRepository.findMany({
        skip: offset,
        take: itemPerPage,
        where: whereCondition,
        orderBy: sortCondition,
      }),
      this.bookRepository.countBook({
        where: whereCondition,
      }),
    ]);

    const result = plainToInstance(BookEntity, list);
    return {
      list: result,
      totalProducts: total,
      totalPages: Math.ceil(total / itemPerPage),
      currentPage: currentPage,
      limit: itemPerPage,
    };
  }
  async findOne(id: string): Promise<BookEntity> {
    const result = await this.bookRepository.findOne({ id });
    return plainToInstance(BookEntity, result);
  }

  async updateRate(id: string): Promise<BookEntity> {
    const allReviews = await this.reviewService.getAllForCalculate(id);
    let rate = 0;
    const totalRate = allReviews.forEach((item) => {
      rate = rate + item.rate;
    });
    const bookRate = this.bookRepository.update({
      id: { id },
      data: { rate: Number((rate / allReviews.length).toFixed(1)) },
    });
    return plainToInstance(BookEntity, bookRate);
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const result = await this.bookRepository.update({
      id: { id },
      data: {
        limitDiscount: updateBookDto.limitDiscount,
        title: updateBookDto.title,
        description: updateBookDto.description,
        price: updateBookDto.price,
        imageUrl: updateBookDto.imageUrl,
        category: {
          connect: {
            id: updateBookDto.category,
          },
        },
        author: {
          connect: {
            id: updateBookDto.author,
          },
        },
      },
    });
    return plainToInstance(BookEntity, result);
  }

  async remove(id: string) {
    const result = await this.bookRepository.update({
      id: { id },
      data: {
        isActive: false,
      },
    });
    return result;
  }
  async active(id: string) {
    const result = await this.bookRepository.update({
      id: { id },
      data: {
        isActive: true,
      },
    });
    return result;
  }

  async loadForDashboardAdmin() {
    return this.bookRepository.countBook({where: {isActive: true}});
  }
}
