import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGenreDto {
  @ApiProperty({
    description: 'The name of the genre',
    example: 'Fantasy',
  })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Optional description of the genre',
    example: 'A genre of speculative fiction set in a fictional universe.',
  })
  @IsOptional()
  description: string;
}
