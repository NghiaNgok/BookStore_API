import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { BookController } from './book.controller';
import { BookService } from 'src/shared/services/book/book.service';
import { BookRepository } from 'src/shared/services/book/book.repository';
import { CategoryService } from 'src/shared/services/category/category.service';
import { CategoryRepository } from 'src/shared/services/category/category.repository';
import { AuthorService } from 'src/shared/services/author/author.service';
import { AuthorRepository } from 'src/shared/services/author/author.repository';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { ReviewService } from 'src/shared/services/review/review.service';
import { ReviewsRepository } from 'src/shared/services/review/review.repository';

@Module({
  imports: [PrismaModule],
  controllers: [BookController],
  providers: [
    BookService,
    BookRepository,
    CategoryService,
    CategoryRepository,
    AuthorService,
    AuthorRepository,
    CloudinaryService,
    ReviewService, ReviewsRepository
  ],
})
export class BookModule {}
