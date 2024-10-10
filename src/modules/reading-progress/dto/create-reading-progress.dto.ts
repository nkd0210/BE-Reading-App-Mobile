import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReadingProgressDto {
  @IsNotEmpty()
  user: string;

  @IsNotEmpty()
  book: string;

  @IsNotEmpty()
  currentChapter: string;

  @IsOptional()
  progress: number;

  @IsOptional()
  isCompleted: boolean;
}
