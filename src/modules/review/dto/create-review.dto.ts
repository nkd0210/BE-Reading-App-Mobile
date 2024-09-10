import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateReviewDto {

    @IsNotEmpty()
    user: string;

    @IsNotEmpty()
    book: string;

    @IsNotEmpty()
    vote: boolean;

    @IsOptional()
    comment: string;

}
