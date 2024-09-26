import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { DashboardController } from './dashboard.controller';
import { UserService } from 'src/shared/services/user/user.service';
import { BookService } from 'src/shared/services/book/book.service';
import { OrderService } from 'src/shared/services/order/order.service';
import { UserRepository } from 'src/shared/services/user/user.repository';
import { BookRepository } from 'src/shared/services/book/book.repository';
import { OrderRepository } from 'src/shared/services/order/order.repository';
import { ReviewService } from 'src/shared/services/review/review.service';
import { ReviewsRepository } from 'src/shared/services/review/review.repository';
import { CategoryRepository } from 'src/shared/services/category/category.repository';
import { CategoryService } from 'src/shared/services/category/category.service';

@Module({
  imports: [PrismaModule],
  controllers: [DashboardController],
  providers: [
    UserService,
    BookService,
    OrderService,
    UserRepository,
    BookRepository,
    OrderRepository,
    ReviewService,
    ReviewsRepository,
    CategoryRepository,
    CategoryService
  ],
})
export class DashboardModule {}
