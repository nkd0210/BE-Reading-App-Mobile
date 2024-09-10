import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './entities/review.entity';
import { BookModule } from '../book/book.module';

@Module({
  imports: [
    BookModule,
    MongooseModule.forFeature([
      {
        name: Review.name,
        schema: ReviewSchema
      }
    ])
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService, MongooseModule]
})
export class ReviewModule { }
