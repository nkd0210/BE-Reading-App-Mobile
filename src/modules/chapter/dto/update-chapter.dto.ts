import { PartialType } from '@nestjs/mapped-types';
import { CreateChapterDto } from './create-chapter.dto';
import { IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChapterDto extends PartialType(CreateChapterDto) {
  @ApiProperty({
    description: 'The title of the chapter (optional)',
    example: 'Chapter 1: Basics of Programming', // Example value for the title
    required: false, // Not required since this is an update DTO
  })
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'The chapter number (optional)',
    example: 2, // Example value for chapterNumber
    required: false,
  })
  @IsOptional()
  @IsNumber() // Ensures that this is a number if provided
  chapterNumber?: number;

  @ApiProperty({
    description: 'URL of the chapter image (optional)',
    example: 'https://example.com/chapter2-image.jpg', // Example value for chapterImage
    required: false,
  })
  @IsOptional()
  chapterImage?: string;

  @ApiProperty({
    description: 'The content of the chapter (optional)',
    example: 'This chapter delves into advanced programming concepts...', // Example value for the content
    required: false,
  })
  @IsOptional()
  content?: string;

  @IsOptional()
  isPublish?: boolean;
}
