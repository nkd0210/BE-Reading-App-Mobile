import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReadingProgressDto {
  @ApiProperty({
    description: 'The ID of the user who is reading the book',
    example: '6701646ca74cc28551f85cb8', // Updated example value for user ID
  })
  @IsNotEmpty()
  user: string;

  @ApiProperty({
    description: 'The ID of the book being read',
    example: '60d5ec49e15a6c001f4e8a3b', // Example value for book ID
  })
  @IsNotEmpty()
  book: string;

  @ApiProperty({
    description: 'The ID of the current chapter the user is on',
    example: '60d5ec49e15a6c001f4e8a3c', // Example value for current chapter ID
  })
  @IsOptional()
  currentChapter: string;

  @ApiProperty({
    description: 'The reading progress percentage (optional)',
    example: 75, // Example value for progress
    required: false, // Not required since it's optional
  })
  @IsOptional()
  progress?: number;

  @ApiProperty({
    description: 'Indicates whether the reading is completed (optional)',
    required: false, // Not required since it's optional
  })
  @IsOptional()
  isCompleted?: boolean;
}
