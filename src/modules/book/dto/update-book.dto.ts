import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { IsOptional } from 'class-validator';
import { TagsType } from '../enum/tags.enum';

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

  @IsOptional()
  authorImage?: string;

  @IsOptional()
  authorId?: string;

  @IsOptional()
  authorName?: string;

  @ApiProperty({
    example: ['Fiction'],
    required: false,
  })
  @IsOptional()
  tags?: TagsType;

  @IsOptional()
  views?: number;

  @IsOptional()
  totalVotes?: number;

  @IsOptional()
  positiveVote?: number;

  @IsOptional()
  chapters?: Types.ObjectId[];

  @IsOptional()
  isPublish?: boolean;
}
