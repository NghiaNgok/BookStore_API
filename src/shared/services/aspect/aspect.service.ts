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

 // Updated function to get sentiment summary by category for a specific bookId and optional category filter
 async getReviewSentimentOfCategory(bookId: string, category?: string): Promise<{ category: string, sentiment: SentimentSummaryDto }[]> {
  const reviews = await this.reviewRepository.findMany({
    where: { bookId },
  });

  if (!reviews || reviews.length === 0) {
    return []; // Return empty array if no reviews are found
  }

  // If a category is provided, filter reviews by that category
  const filteredReviews = category ? reviews.filter(review => review.category === category) : reviews;

  // Group reviews by category
  const categoryGroups = filteredReviews.reduce((acc, review) => {
    const category = review.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(review);
    return acc;
  }, {});

  // For each category, calculate sentiment summary (positive, neutral, negative)
  const sentimentByCategory = Object.keys(categoryGroups).map((category) => {
    const categoryReviews = categoryGroups[category];

    const sentimentSummary = {
      positive: categoryReviews.filter(review => review.overallSentiment === 'Positive').length,
      neutral: categoryReviews.filter(review => review.overallSentiment === 'Neutral').length,
      negative: categoryReviews.filter(review => review.overallSentiment === 'Negative').length,
    };

    return {
      category,
      sentiment: plainToInstance(SentimentSummaryDto, sentimentSummary),
    };
  });

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

  // Iterate through each review and split combined categories
  reviews.forEach((review) => {
    const categories = review.category.split(','); // Split the combined categories by comma

    categories.forEach((category) => {
      category = category.trim(); // Remove any leading or trailing spaces
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
