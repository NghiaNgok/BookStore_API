import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { DetailBookDto } from 'src/dtos/book/detail-book.dto';

import { FilterBookDto } from 'src/dtos/book/filter-book.dto';
import { ResponseBookDto } from 'src/dtos/book/response-book.dto';
import { BookEntity } from 'src/entities/book.entity';
import { BookService } from 'src/shared/services/book/book.service';

@Resolver(() => BookEntity)
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Query(() => ResponseBookDto)
  async findAllBooks(@Args() filter: FilterBookDto) {
    try {
      const result = await this.bookService.findAll(filter);
      const response = plainToInstance(ResponseBookDto, result);
      return response;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch books');
    }
  }

  @Query(() => DetailBookDto)
  async getDetailBook(@Args('id') id: string) {
    try {
      const result = await this.bookService.findOne(id);
      return plainToInstance(DetailBookDto, result);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch book');
    }
  }

  @Mutation(() => BookEntity)
  async updateBookRating(@Args('id') id: string): Promise<BookEntity> {
    const result = await this.bookService.updateRate(id);
    return result;
  }
}
