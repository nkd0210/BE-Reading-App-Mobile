import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { IsOptional } from 'class-validator';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @IsOptional()
  positive: boolean;

  @IsOptional()
  review: string;
}
