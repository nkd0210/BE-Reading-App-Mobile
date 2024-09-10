import { IsNotEmpty, IsOptional, IsNumber } from "class-validator";

export class CreateChapterDto {

    @IsNotEmpty()
    title: string;

    @IsOptional()
    chapterNumber: number;

    @IsOptional() 
    chapterImage: string;

    @IsNotEmpty()
    content: string;
}
