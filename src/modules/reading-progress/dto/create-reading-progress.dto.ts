import { IsNotEmpty } from "class-validator";

export class CreateReadingProgressDto {

    @IsNotEmpty()
    user: string;

    @IsNotEmpty()
    book: string;

    @IsNotEmpty()
    currentChapter: string;

    @IsNotEmpty()
    progress: number;
}
