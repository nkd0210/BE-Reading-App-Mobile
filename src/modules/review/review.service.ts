import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './entities/review.entity';
import { Model } from 'mongoose';
import { Book } from '../book/entities/book.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // tạo review
  async createReview(
    createReviewDto: CreateReviewDto,
    user: any,
  ): Promise<Review> {
    const { bookId, positive, review } = createReviewDto;
    const userId = user._id;

    // Create a new review
    const newReview = await this.reviewModel.create({
      userId,
      bookId,
      positive,
      review,
    });

    await this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { reviewList: bookId } },
      { new: true },
    );

    return newReview;
  }

  // lấy tất cả reviews trong hệ thống
  async getAllReviews(page: number, limit: number): Promise<any> {
    const skip = (page - 1) * limit;

    const allReviews = await this.reviewModel
      .find()
      .populate('user book')
      .exec();

    if (!allReviews) {
      throw new HttpException('No reviews found', HttpStatus.NOT_FOUND);
    }

    const totalReviews = await this.reviewModel.countDocuments();
    const totalPages = Math.ceil(totalReviews / limit);

    return {
      totalReviews,
      page,
      totalPages,
      allReviews,
    };
  }

  // lấy tất cả reviews của 1 cuốn sách
  async getBookReviews(
    bookId: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const skip = (page - 1) * limit;
    const allReviewsOfBook = await this.reviewModel
      .find({ bookId })
      // .populate('userId')
      .skip(skip)
      .limit(limit)
      .exec();

    if (!allReviewsOfBook) {
      throw new HttpException(
        'No reviews found for this book',
        HttpStatus.NOT_FOUND,
      );
    }

    const totalReviewsOfBook = await this.reviewModel
      .countDocuments({ bookId })
      .exec();
    const totalPages = Math.ceil(totalReviewsOfBook / limit);

    return {
      totalReviewsOfBook,
      page,
      totalPages,
      allReviewsOfBook,
    };
  }

  // lấy từng review
  async getEachReview(reviewId: string): Promise<Review> {
    const findReview = await this.reviewModel
      .findById(reviewId)
      .populate('user book');

    if (!findReview) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }

    return findReview;
  }

  // cập nhật review
  async updateReview(
    reviewId: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const { positive, review } = updateReviewDto;

    const updatedReview = await this.reviewModel.findByIdAndUpdate(
      reviewId,
      {
        $set: {
          positive,
          review,
        },
      },
      { new: true },
    );

    if (!updatedReview) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }

    return updatedReview;
  }

  // xóa review
  async deleteReview(reviewId: string): Promise<any> {
    try {
      await this.reviewModel.findByIdAndUpdate(reviewId);

      return {
        message: 'Review deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        'Review deleted failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
