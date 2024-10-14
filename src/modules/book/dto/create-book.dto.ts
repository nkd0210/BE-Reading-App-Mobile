import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    description: 'The title of the book',
    example: 'The Great Gatsby', // Example value for the title
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The author of the book',
    example: 'F. Scott Fitzgerald', // Example value for the author
  })
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    description: 'A brief plot summary of the book',
    example: 'A story about the American dream set in the 1920s', // Example value for the plot
  })
  @IsNotEmpty()
  plot: string;

  @ApiProperty({
    description: 'URL of the book cover image',
    example: 'https://i.postimg.cc/8ckPPDky/image-1.png', // Example value for the cover image
    required: false, // Since it's optional, you can set this to false
  })
  @IsOptional()
  coverImage?: string; // Using optional chaining

  @ApiProperty({
    description: 'URL of the book cover image',
    example: 'https://i.postimg.cc/jq1v1hhR/image.png', // Example value for the cover image
    required: false, // Since it's optional, you can set this to false
  })
  @IsOptional()
  authorImage?: string; // Using optional chaining
}
