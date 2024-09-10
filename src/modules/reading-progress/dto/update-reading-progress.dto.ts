import { PartialType } from '@nestjs/mapped-types';
import { CreateReadingProgressDto } from './create-reading-progress.dto';
import { IsOptional } from 'class-validator';

export class UpdateReadingProgressDto extends PartialType(CreateReadingProgressDto) {

    @IsOptional()
    currentChapter: string;

    @IsOptional()
    progress: number;

}
