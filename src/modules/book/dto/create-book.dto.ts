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
  @IsOptional() // This should be required based on the schema
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
  @IsOptional()
  authorId: string;

  @ApiProperty({
    description: 'The name of the author',
    example: 'SOW',
  })
  @IsOptional()
  authorName: string;

  @ApiProperty({
    description: 'Array of Genre IDs',
    example: ['670fe41b16a89971003bea08', '670fe42b16a89971003bea0a'], // Example ObjectIds
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
    example: [], // Example ObjectIds
    required: false,
  })
  @IsOptional()
  @IsArray()
  chapters?: Types.ObjectId[];
}
