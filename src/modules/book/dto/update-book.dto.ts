import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { Types } from 'mongoose';
import { IsOptional } from 'class-validator';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @IsOptional()
  title: string;

  @IsOptional()
  author: string;

  @IsOptional()
  tags: string[];

  @IsOptional()
  plot: string;

  @IsOptional()
  views: number;

  @IsOptional()
  totalVotes: number;

  @IsOptional()
  positiveVotes: number;

  @IsOptional()
  coverImage: string;

  @IsOptional()
  chapters: string[];

  @IsOptional()
  isCompleted: boolean;
}
