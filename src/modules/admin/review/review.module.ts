import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { ReviewController } from './review.controller';
import { ReviewService } from 'src/shared/services/review/review.service';
import { ReviewsRepository } from 'src/shared/services/review/review.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewsRepository],
})
export class ReviewModule {}
