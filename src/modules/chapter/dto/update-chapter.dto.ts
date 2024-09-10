import { PartialType } from '@nestjs/mapped-types';
import { CreateChapterDto } from './create-chapter.dto';
import { IsNotEmpty, IsOptional, IsNumber } from "class-validator";

export class UpdateChapterDto extends PartialType(CreateChapterDto) {
    @IsOptional()
    title: string;

    @IsOptional()
    chapterNumber: number;

    @IsOptional()
    chapterImage: string;

    @IsOptional()
    content: string;
}
