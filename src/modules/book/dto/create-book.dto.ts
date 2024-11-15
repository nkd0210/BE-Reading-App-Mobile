import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { TagsType } from '../enum/tags.enum';

export class CreateBookDto {
  @ApiProperty({
    description: 'The title of the book',
    example: 'The Combat Baker And Automation Waitress',
  })
  @IsNotEmpty()
  title: string;

  @IsOptional()
  plot: string;

  @IsOptional()
  coverImage?: string;

  @IsOptional()
  authorImage?: string;

  @IsOptional()
  authorId: string;

  @IsOptional()
  authorName: string;

  @IsOptional()
  tags?: TagsType;

  @IsOptional()
  views?: number;

  @IsOptional()
  totalVotes?: number;

  @IsOptional()
  positiveVotes?: number;

  @IsOptional()
  @IsArray()
  chapters?: Types.ObjectId[];
}
