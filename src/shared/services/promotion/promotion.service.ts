import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PromotionRepository } from './promotion.repository';
import { CreatePromotionDto } from 'src/dtos/promotion/create-promotion.dto';
import { PromotionEntity } from 'src/entities/promotion.entity';
import {
  FilterPromotionDto,
  statusPromotion,
} from 'src/dtos/promotion/filter-promotion.dto';
import { UpdatePromotionDto } from 'src/dtos/promotion/edit-promotion.dto';

@Injectable()
export class PromotionService {
  constructor(private promotionRepository: PromotionRepository) {}

  async create(
    createPromotionDTO: CreatePromotionDto,
  ): Promise<PromotionEntity> {
    const result = await this.promotionRepository.create({
      data: {
        title: createPromotionDTO.title,
        description: createPromotionDTO.description,
        discountPercents: createPromotionDTO.discountPercent,
        isActive: true,
        startDate: createPromotionDTO.startDate,
        expriedDate: createPromotionDTO.endDate,
        bookPromotion: {
          create: createPromotionDTO.bookId.map((item) => ({
            book: {
              connect: {
                id: item,
              },
            },
          })),
        },
      },
    });
    return plainToInstance(PromotionEntity, result);
  }
  async findAll(filter: FilterPromotionDto) {
    const itemPerPage: number = filter.limit || 5;
    const offset: number =
      filter.page && filter.page > 0 ? (filter.page - 1) * itemPerPage : 0;
    const currentPage: number = filter.page || 1;

    const whereCondition: any = {
      AND: [],
    };

    if (filter.title) {
      whereCondition.AND.push({ title: { contains: filter.title } });
    }

    if (filter.status) {
      const currentDate = new Date();
      const threeDaysFromNow = new Date(currentDate);
      threeDaysFromNow.setDate(currentDate.getDate() + 3);

      switch (filter.status) {
        case statusPromotion.ON_DATE:
          whereCondition.AND.push({
            startDate: { lte: currentDate },
            expriedDate: { gte: currentDate },
          });
          break;
        case statusPromotion.OUT_DATE:
          whereCondition.AND.push({
            expriedDate: { lt: currentDate },
          });
          break;
        case statusPromotion.SOON:
          whereCondition.AND.push({
            startDate: { lte: threeDaysFromNow, gte: currentDate },
          });
          break;
        default:
          break;
      }
    }

    const [list, total] = await Promise.all([
      this.promotionRepository.findMany({
        skip: offset,
        take: itemPerPage,
        where: whereCondition,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.promotionRepository.countPromotion({
        where: whereCondition,
      }),
    ]);

    const result = plainToInstance(PromotionEntity, list);

    return {
      list: result,
      totalProducts: total,
      totalPages: Math.ceil(total / itemPerPage),
      currentPage: currentPage,
      limit: itemPerPage,
    };
  }
  async active(id: string) {
    const result = await this.promotionRepository.update({
      id: { id },
      data: {
        isActive: true,
      },
    });
    return result;
  }
  async disable(id: string) {
    const result = await this.promotionRepository.update({
      id: { id },
      data: {
        isActive: false,
      },
    });
    return result;
  }
  async getDetail(id: string): Promise<PromotionEntity> {
    const result = await this.promotionRepository.findOne({
      id,
    });
    return plainToInstance(PromotionEntity, result);
  }

  async edit(id: string, data: UpdatePromotionDto) {
    const result = await this.promotionRepository.update({
      id: { id },
      data: {
        title: data.title,
        description: data.description,
        discountPercents: data.discountPercent,
        startDate: data.startDate,
        expriedDate: data.endDate,
        bookPromotion: {
          deleteMany: {}, // Remove existing relationships
          create: data.bookId.map((bookId) => ({
            book: {
              connect: { id: bookId },
            },
          })),
        },
      },
    });
    return plainToInstance(PromotionEntity, result);
  }
}
