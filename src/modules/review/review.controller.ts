import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('/createReview')
  createReview(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return this.reviewService.createReview(createReviewDto);
  }

  @Get('/getAllReviews')
  getAllReviews(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    return this.reviewService.getAllReviews(page, limit);
  }

  @Get('/getBookReviews/:bookId')
  getBookReviews(
    @Param('bookId') bookId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    return this.reviewService.getBookReviews(bookId, page, limit);
  }

  @Get('/getEachReview/:reviewId')
  getEachReview(@Param('reviewId') reviewId: string): Promise<Review> {
    return this.reviewService.getEachReview(reviewId);
  }

  @Put('/updateReview/:reviewId')
  updateReview(
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    return this.reviewService.updateReview(reviewId, updateReviewDto);
  }

  @Delete('/deleteReview/:reviewId')
  deleteReview(@Param('reviewId') reviewId: string): Promise<any> {
    return this.reviewService.deleteReview(reviewId);
  }
}
