import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { BookRepository } from 'src/shared/services/book/book.repository';
import { BookService } from 'src/shared/services/book/book.service';
import { BookResolver } from './book.resolver';
import { ReviewService } from 'src/shared/services/review/review.service';
import { ReviewsRepository } from 'src/shared/services/review/review.repository';

@Module({
  imports: [PrismaModule],
  providers: [BookResolver, BookService, BookRepository, ReviewService, ReviewsRepository],
  exports: [BookRepository, BookService, ReviewService],
})
export class BookModule {}
