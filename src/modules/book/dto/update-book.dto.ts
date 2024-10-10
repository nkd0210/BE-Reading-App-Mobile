import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @ApiProperty({
    description: 'The title of the book',
    example: 'The Great Gatsby', // Example value for the title
    required: false, // Not required since this is an update DTO
  })
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'The author of the book',
    example: 'F. Scott Fitzgerald', // Example value for the author
    required: false,
  })
  @IsOptional()
  author?: string;

  @ApiProperty({
    description: 'Tags associated with the book',
    example: ['Classic', 'Fiction'], // Example value for the tags
    required: false,
  })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'A brief plot summary of the book',
    example: 'A story about the American dream set in the 1920s', // Example value for the plot
    required: false,
  })
  @IsOptional()
  plot?: string;

  @ApiProperty({
    description: 'The number of views the book has received',
    example: 150, // Example value for views
    required: false,
  })
  @IsOptional()
  views?: number;

  @ApiProperty({
    description: 'The total number of votes the book has received',
    example: 200, // Example value for totalVotes
    required: false,
  })
  @IsOptional()
  totalVotes?: number;

  @ApiProperty({
    description: 'The number of positive votes the book has received',
    example: 180, // Example value for positiveVotes
    required: false,
  })
  @IsOptional()
  positiveVotes?: number;

  @ApiProperty({
    description: 'URL of the book cover image',
    example: 'https://example.com/cover.jpg', // Example value for the cover image
    required: false,
  })
  @IsOptional()
  coverImage?: string;

  @ApiProperty({
    description: 'Array of chapter IDs associated with the book',
    example: ['chapterId1', 'chapterId2'], // Example value for chapters
    required: false,
  })
  @IsOptional()
  chapters?: string[];
}
