import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateCategoryDto } from '../../../dtos/category/create-category.dto';
import { UpdateCategoryDto } from '../../../dtos/category/update-category.dto';
import { CategoryRepository } from './category.repository';
import { Category } from '../../../entities/category.entity';
import { FilterCategoryDto } from 'src/dtos/category/filter-category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async create(createCategorytDto: CreateCategoryDto): Promise<Category> {
    const result = await this.categoryRepository.create({
      data: {
        name: createCategorytDto.name,
        description: createCategorytDto.description,
      },
    });
    return plainToInstance(Category, result);
  }

  async findAll(filter: FilterCategoryDto): Promise<{
    data: Category[];
    totalItem: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  }> {
    let itemPerPage: number = filter.limit ? filter.limit : 5;
    let offset: number = filter.page > 0 ? (filter.page - 1) * filter.limit : 0;
    let currentPage: number = filter.page ? filter.page : 1;
    const result = await this.categoryRepository.findMany({
      skip: offset,
      take: itemPerPage,
      where: {
        name: { contains: filter.name },
      },
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    });
    const total = await this.categoryRepository.count({
      where: {
        name: { contains: filter.name },
      },
    });
    const data = plainToInstance(Category, result);
    return {
      data: data,
      totalItem: total,
      totalPages:
        total % itemPerPage !== 0
          ? Math.floor(total / itemPerPage) + 1
          : total / itemPerPage,
      currentPage: currentPage,
      limit: itemPerPage,
    };
  }

  async findAllForFilter() {
    const result = await this.categoryRepository.findMany({
      where: {
        isActive: true,
      },
    });
    return plainToInstance(Category, result);
  }

  async findOne(id: string): Promise<Category> {
    const result = await this.categoryRepository.findOne({ id });
    return plainToInstance(Category, result);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const result = await this.categoryRepository.update({
      id: { id },
      data: updateCategoryDto,
    });
    return plainToInstance(Category, result);
  }

  async remove(id: string) {
    const result = await this.categoryRepository.update({
      id: { id },
      data: {
        isActive: false,
      },
    });
    return result;
  }
  async active(id: string) {
    const result = await this.categoryRepository.update({
      id: { id },
      data: {
        isActive: true,
      },
    });
    return result;
  }

  async loadForDashboard(id: string[]) {
    let arrResult = [];
    let listCategories = [];
    for (let i = 0; i < id.length; i++) {
      let idx = arrResult.findIndex((el) => el.cid === id[i]);
      if (idx > -1) {
        arrResult[idx]['count'] += 1;
      } else {
        arrResult.push({
          cid: id[i],
          count: 1,
        });
      }
    }
    arrResult.sort((a, b) => b.count - a.count).slice(0, 3);
    for (let i = 0; i < arrResult.length; i++) {
      let category = await this.findOne(arrResult[i].cid);
      listCategories.push({ category: category, count: arrResult[i].count });
    }
    return listCategories;
  }
}
