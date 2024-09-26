import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { PromotionController } from './promotion.controller';
import { PromotionRepository } from 'src/shared/services/promotion/promotion.repository';
import { PromotionService } from 'src/shared/services/promotion/promotion.service';
import { BookService } from 'src/shared/services/book/book.service';
import { BookRepository } from 'src/shared/services/book/book.repository';
import { ReviewService } from 'src/shared/services/review/review.service';
import { ReviewsRepository } from 'src/shared/services/review/review.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PromotionController],
  providers: [
    PromotionRepository,
    PromotionService,
    BookService,
    BookRepository,
    ReviewService,
    ReviewsRepository,
  ],
})
export class PromotionModule {}
