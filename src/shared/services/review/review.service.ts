import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { OrderEntity } from 'src/entities/order.entity';
import { ReviewsRepository } from './review.repository';
import { CreateReviewDto } from 'src/dtos/review/create-review.dto';
import { ReviewEntity } from 'src/entities/review.entity';
import { FilterReviewDto } from 'src/dtos/review/filter-review.dto';
import { SentimentSummaryDto } from 'src/entities/sentiment-summary.dto';
import { equal } from 'assert';
import axios from 'axios';
@Injectable()
export class ReviewService {
  constructor(private reviewRepository: ReviewsRepository) {}

  async create(creatReviewDTO: CreateReviewDto): Promise<ReviewEntity> {
    try {
      // Gửi yêu cầu đến Flask API để nhận kết quả phân tích cảm xúc
      const response = await axios.post('http://localhost:5000/predict', {
        sentence: creatReviewDTO.content,
      });
  
      console.log('Flask API Response:', response.data);
  
      // Lấy category từ kết quả, nếu có nhiều category thì nối lại bằng dấu phẩy
      const category = response.data.result.length > 0 
        ? response.data.result.map((item) => item.category).join(', ') 
        : "Khác";
      
      // Lấy overallSentiment và scores từ kết quả
      const overallSentiment = response.data.result[0].overall_sentiment;
      const scores = response.data.result[0].overall_scores;
      
      // Lấy aspect, nếu có nhiều thì nối lại bằng dấu phẩy
      const aspect = response.data.result.length > 0 
        ? response.data.result.map((item) => item.aspect).join(', ') 
        : "";
  
      console.log('Overall Sentiment:', overallSentiment);
      console.log('Scores:', scores);
      console.log('Aspect:', aspect);
  
      // Lưu review vào cơ sở dữ liệu
      const result = await this.reviewRepository.create({
        data: {
          content: creatReviewDTO.content,
          rate: creatReviewDTO.rate,
          category: category,  // Lưu category như chuỗi
          aspect: aspect,      // Lưu aspect như chuỗi
          overallSentiment: overallSentiment,
          scores: scores,
          book: {
            connect: { id: creatReviewDTO.bookId },
          },
          user: {
            connect: { id: creatReviewDTO.userId },
          },
        },
      });
  
      // Log kết quả sau khi lưu vào database
      console.log('Database Save Result:', result);
  
      // Chuyển đổi kết quả thành instance của ReviewEntity và trả về
      return plainToInstance(ReviewEntity, result);
    } catch (error) {
      console.error('Error communicating with Flask API or saving data:', error);
      throw new Error('Could not categorize the review');
    }
  }

 
// Get all unique review categories across all reviews
async getAllReviewCategories(): Promise<string[]> {
  // Fetch all reviews
  const reviews = await this.reviewRepository.findMany({
    // No need to select specific fields, just fetch all reviews
  });

  // Extract the categories from reviews and remove duplicates
  const categories = reviews.map((review) => review.category);
  const uniqueCategories = [...new Set(categories)]; // Remove duplicates
  return uniqueCategories;
}

async getSentimentSummary(bookId: string): Promise<SentimentSummaryDto> {
  const reviews = await this.reviewRepository.findMany({
    where: { bookId },
  });

  const summary = {
    positive: reviews.filter(review => review.overallSentiment === 'Positive').length,
    neutral: reviews.filter(review => review.overallSentiment === 'Neutral').length,
    negative: reviews.filter(review => review.overallSentiment === 'Negative').length,
  };

  return plainToInstance(SentimentSummaryDto, summary);
}

  
  async getAllForCalculate(bookId: string) {
    const response = await this.reviewRepository.findMany({
      where: { bookId: bookId },
    });
    return plainToInstance(ReviewEntity, response);
  }

  async findAll(filter: FilterReviewDto) {
    const itemPerPage: number = filter.limit || 5;
    const offset: number =
      filter.page && filter.page > 0 ? (filter.page - 1) * itemPerPage : 0;
    const currentPage: number = filter.page || 1;
  
    const whereCondition: any = {
      AND: [],
    };
  
    // Apply filters for book title, book ID, rate (star rating), category, and aspect
    if (filter.bookTitle) {
      whereCondition.AND.push({
        book: { title: { contains: filter.bookTitle } },
      });
    }
    if (filter.bookId) {
      whereCondition.AND.push({
        bookId: { equals: filter.bookId },
      });
    }
    if (filter.rate && filter.rate.length > 0) {
      whereCondition.AND.push({
        rate: { in: filter.rate },
      });
    }
  
    // Lọc theo category (vẫn giữ như cũ, vì category là chuỗi)
    if (filter.category && filter.category !== 'None') {
      whereCondition.AND.push({
        category: { contains: filter.category, mode: 'insensitive' }, // Tìm kiếm không phân biệt hoa thường
      });
    }
  
    // Sort by category if `category` is specified as sort criteria, otherwise default to createdAt
    const orderBy: any = {};
    if (filter.category && filter.category !== 'None') {
      orderBy.category = 'asc'; // Sort by category in ascending order, adjust to 'desc' if needed
    } else {
      orderBy.createdAt = 'desc'; // Default sort by creation date
    }
  
    const [list, total] = await Promise.all([
      this.reviewRepository.findMany({
        skip: offset,
        take: itemPerPage,
        where: whereCondition,
        orderBy: orderBy,
      }),
      this.reviewRepository.countReview({
        where: whereCondition,
      }),
    ]);
  
    const result = plainToInstance(ReviewEntity, list);
  
    return {
      list: result,
      totalProducts: total,
      totalPages: Math.ceil(total / itemPerPage),
      currentPage: currentPage,
      limit: itemPerPage,
    };
  }
  
  
  
}
