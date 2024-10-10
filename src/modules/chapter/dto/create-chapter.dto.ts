import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChapterDto {
  @ApiProperty({
    description: 'The title of the chapter',
    example: 'Introduction to Programming', // Example value for the title
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The chapter number (optional)',
    example: 1, // Example value for chapterNumber
    required: false, // Not required since it's optional
  })
  @IsOptional()
  @IsNumber() // Adding a validation rule to ensure this is a number
  chapterNumber?: number;

  @ApiProperty({
    description: 'URL of the chapter image (optional)',
    example: 'https://example.com/chapter-image.jpg', // Example value for chapterImage
    required: false,
  })
  @IsOptional()
  chapterImage?: string;

  @ApiProperty({
    description: 'The content of the chapter',
    example: 'This chapter covers the basics of programming...', // Example value for the content
  })
  @IsNotEmpty()
  content: string;
}
