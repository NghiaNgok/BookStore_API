import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CreateReviewDto } from 'src/dtos/review/create-review.dto';
import { FilterReviewDto } from 'src/dtos/review/filter-review.dto';
import { ResponseReviewDto } from 'src/dtos/review/response-list-review.dto';
import { ReviewEntity } from 'src/entities/review.entity';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { ReviewService } from 'src/shared/services/review/review.service';

@Resolver(() => ReviewEntity)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ReviewEntity)
  async createReview(@Args() data: CreateReviewDto): Promise<ReviewEntity> {
    const result = this.reviewService.create(data);
    return result;
  }

  @Query(() => ResponseReviewDto)
  async getAllReview(@Args() filter: FilterReviewDto) {
    try {
      const result = await this.reviewService.findAll(filter);
      const response = plainToInstance(ResponseReviewDto, result);
      return response;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch review');
    }
  }
}
