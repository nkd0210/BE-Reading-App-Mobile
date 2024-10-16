import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateBookDto {
  @ApiProperty({
    description: 'The title of the book',
    example: 'The Combat Baker And Automation Waitress',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'A brief plot summary of the book',
    example: 'A story about the American dream set in the 1920s',
  })
  @IsNotEmpty()
  plot: string;

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
  })
  @IsNotEmpty()
  authorId: string;

  @ApiProperty({
    description: 'The name of the author',
    example: 'SOW',
  })
  @IsNotEmpty()
  authorName: string;

  @ApiProperty({
    description: 'Array of Genre IDs',
    example: ['64afc8b0bcf86cd799439010', '64afc8b0bcf86cd799439012'], // Example ObjectIds
    required: false,
  })
  @IsOptional()
  @IsArray()
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
  positiveVotes?: number;

  @ApiProperty({
    description: 'Array of Chapter IDs',
    example: ['64afc8b0bcf86cd799439013', '64afc8b0bcf86cd799439014'], // Example ObjectIds
    required: false,
  })
  @IsOptional()
  @IsArray()
  chapters?: Types.ObjectId[];
}
