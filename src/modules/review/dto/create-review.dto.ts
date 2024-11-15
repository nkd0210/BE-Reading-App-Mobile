import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'ID of the book being reviewed',
    example: '6736e7dc867869cccd65fb27', // Example book ID
  })
  @IsNotEmpty()
  book: string;

  @ApiProperty({
    description: 'Indicates if the review is positive',
    example: true,
    default: true,
  })
  @IsNotEmpty()
  positive: boolean = true;

  @ApiProperty({
    description: 'Optional text of the review',
    example: 'This book was an amazing read with great character development.',
    required: false,
  })
  @IsOptional()
  review: string;
}
