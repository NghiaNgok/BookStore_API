import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from '../../../dtos/author/create-author.dto';
import { UpdateAuthorDto } from '../../../dtos/author/update-author.dto';
import { AuthorRepository } from './author.repository';
import { plainToInstance } from 'class-transformer';
import { AuthorEntity } from '../../../entities/author.entity';
import { FilterAuthorDto } from 'src/dtos/author/filter-author.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthorService {
  constructor(private authorRepository: AuthorRepository) {}

  async create(createAuthorDto: CreateAuthorDto) {
    const result = await this.authorRepository.create({
      data: createAuthorDto,
    });
    return result;
  }

  async findAll(filter: FilterAuthorDto): Promise<{
    data: AuthorEntity[];
    totalItem: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  }> {
    let itemPerPage: number = filter.limit ? filter.limit : 5;
    let offset: number = filter.page > 0 ? (filter.page - 1) * filter.limit : 0;
    let currentPage: number = filter.page ? filter.page : 1;
    const result = await this.authorRepository.findMany({
      skip: offset,
      take: itemPerPage,
      where: {
        name: { contains: filter.name },
      },
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    });
    const total = await this.authorRepository.countAuthor({
      where: {
        name: { contains: filter.name },
      },
    });
    const data = plainToInstance(AuthorEntity, result);
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
    const result = await this.authorRepository.findMany({
      where: {
        isActive: true,
      },
    });
    return plainToInstance(AuthorEntity, result);
  }

  async findOne(id: string) {
    const result = await this.authorRepository.findOne({ id: id });
    return plainToInstance(AuthorEntity, result);
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    const result = await this.authorRepository.update({
      id: { id },
      data: updateAuthorDto,
    });
    return plainToInstance(AuthorEntity, result);
  }

  async remove(id: string) {
    const result = await this.authorRepository.update({
      id: { id },
      data: {
        isActive: false,
      },
    });
    return plainToInstance(AuthorEntity, result);
  }

  async active(id: string) {
    const result = await this.authorRepository.update({
      id: { id },
      data: {
        isActive: true,
      },
    });
    return plainToInstance(AuthorEntity, result);
  }
}
