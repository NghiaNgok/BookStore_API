import { Injectable } from '@nestjs/common';
import { SentimentSummaryDto } from 'src/entities/sentiment-summary.dto';
import { AspectRepository } from './aspect.repository';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AspectService {
  constructor(private reviewRepository: AspectRepository) {}

  // Existing function to get sentiment summary for a specific bookId
  async getAspectData(bookId: string): Promise<SentimentSummaryDto> {
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

  async getReviewSentimentOfCategory(bookId: string, category?: string): Promise<{ category: string, sentiment: SentimentSummaryDto }[]> {
    const reviews = await this.reviewRepository.findMany({
      where: { bookId },
    });
  
    if (!reviews || reviews.length === 0) {
      return []; // Return empty array if no reviews are found
    }
  
    // Map to store sentiment counts by category
    const categorySentimentMap: Record<string, { positive: number, neutral: number, negative: number }> = {};
  
    reviews.forEach((review) => {
      // Normalize and split categories in each review
      const uniqueCategories = Array.from(
        new Set(review.category.split(/[,;]/).map((cat) => cat.trim())) // Split and remove duplicates
      );
  
      uniqueCategories.forEach((cat) => {
        // If a category filter is provided, skip unrelated categories
        if (category && !cat.toLowerCase().includes(category.toLowerCase())) {
          return;
        }
  
        // Initialize sentiment counts for this category if not present
        if (!categorySentimentMap[cat]) {
          categorySentimentMap[cat] = { positive: 0, neutral: 0, negative: 0 };
        }
  
        // Increment sentiment count based on the review's overall sentiment
        if (review.overallSentiment === 'Positive') {
          categorySentimentMap[cat].positive += 1;
        } else if (review.overallSentiment === 'Neutral') {
          categorySentimentMap[cat].neutral += 1;
        } else if (review.overallSentiment === 'Negative') {
          categorySentimentMap[cat].negative += 1;
        }
      });
    });
  
    // Convert the map into an array of results
    const sentimentByCategory = Object.keys(categorySentimentMap).map((cat) => ({
      category: cat,
      sentiment: plainToInstance(SentimentSummaryDto, categorySentimentMap[cat]),
    }));
  
    return sentimentByCategory; // Return the final result with sentiment counts per category
  }
  

async getReviewCategoryCounts(bookId: string): Promise<{ category: string, count: number }[]> {
  // Fetch all reviews for the given bookId
  const reviews = await this.reviewRepository.findMany({
    where: {
      bookId, // Filter reviews by the provided bookId
    },
  });

  // Initialize an accumulator to store category counts
  const categoryCounts: { [key: string]: number } = {};

  // Iterate through each review
  reviews.forEach((review) => {
    // Split the combined categories by comma and use a Set to ensure uniqueness
    const uniqueCategories = new Set(review.category.split(',').map((category) => category.trim()));

    uniqueCategories.forEach((category) => {
      if (categoryCounts[category]) {
        categoryCounts[category] += 1; // Increment the count for each category
      } else {
        categoryCounts[category] = 1; // Initialize count if the category is new
      }
    });
  });

  // Convert the object into an array of { category, count } objects
  const result = Object.keys(categoryCounts).map((category) => ({
    category,
    count: categoryCounts[category],
  }));

  return result;
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
}
