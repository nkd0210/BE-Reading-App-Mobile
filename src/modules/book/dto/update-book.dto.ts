import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { IsOptional } from 'class-validator';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @ApiProperty({
    description: 'The title of the book',
    example: 'The Great Gatsby',
    required: false, // Not required in UpdateBookDto
  })
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'A brief plot summary of the book',
    example: 'A story about the American dream set in the 1920s',
    required: false,
  })
  @IsOptional()
  plot?: string;

  @ApiProperty({
    description: 'URL of the book cover image',
    example: 'https://i.postimg.cc/8ckPPDky/image-1.png',
    required: false,
  })
  @IsOptional()
  coverImage?: string;

  @ApiProperty({
    description: 'URL of the author image',
    example: 'https://i.postimg.cc/jq1v1hhR/image.png',
    required: false,
  })
  @IsOptional()
  authorImage?: string;

  @ApiProperty({
    description: 'The ID of the author',
    example: '6701646ca74cc28551f85cb8',
    required: false,
  })
  @IsOptional()
  authorId?: string;

  @ApiProperty({
    description: 'The name of the author',
    example: 'SOW',
    required: false,
  })
  @IsOptional()
  authorName?: string;

  @ApiProperty({
    description: 'Array of Genre IDs',
    example: ['64afc8b0bcf86cd799439010', '64afc8b0bcf86cd799439012'],
    required: false,
  })
  @IsOptional()
  tags?: Types.ObjectId[];

  @ApiProperty({
    description: 'Total number of views',
    example: 300,
    required: false,
  })
  @IsOptional()
  views?: number;

  @ApiProperty({
    description: 'Total number of votes',
    example: 100,
    required: false,
  })
  @IsOptional()
  totalVotes?: number;

  @ApiProperty({
    description: 'Total number of positive votes',
    example: 80,
    required: false,
  })
  @IsOptional()
  positiveVote?: number;

  @ApiProperty({
    description: 'Array of Chapter IDs',
    example: ['64afc8b0bcf86cd799439013', '64afc8b0bcf86cd799439014'],
    required: false,
  })
  @IsOptional()
  chapters?: Types.ObjectId[];

  @IsOptional()
  isPublish?: boolean;
}
