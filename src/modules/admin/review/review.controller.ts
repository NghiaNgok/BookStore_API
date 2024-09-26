import {
    Controller,
    Get,
    Logger,
    Render,
    Query,
  } from '@nestjs/common';

import { FilterReviewDto } from 'src/dtos/review/filter-review.dto';
import { ReviewService } from 'src/shared/services/review/review.service';
  
  @Controller('admin/review')
  export class ReviewController {
    private readonly logger = new Logger(ReviewController.name);
    constructor(private readonly reviewService: ReviewService) {}
  
    @Get()
    @Render('adminPage')
    async findAll(
      @Query('title') title: string,
      @Query('page') page: number,
      @Query('limit') limit: number,
    ) {
      this.logger.log('find all Category');
      try {
        let filter: FilterReviewDto = {
          bookTitle: title,
          page: page || 1,
          limit: limit || 5,
        };
        const result = await this.reviewService.findAll(filter);
        return {
          module: 'review',
          title: filter.bookTitle,
          pages: result.totalPages,
          currentPage: filter.page,
          data: result.list,
        };
      } catch (error) {
        return { errMessage: error };
      }
    }

  }
  