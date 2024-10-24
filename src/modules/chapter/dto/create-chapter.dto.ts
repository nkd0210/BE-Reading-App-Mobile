import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChapterDto {
  @IsOptional()
  title: string;

  @IsOptional()
  @IsNumber() // Adding a validation rule to ensure this is a number
  chapterNumber?: number;

  @IsOptional()
  chapterImage?: string;

  @IsOptional()
  content: string;
}
