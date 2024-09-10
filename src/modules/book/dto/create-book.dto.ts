import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateBookDto {
    
    @IsNotEmpty()
    title: string;
    
    @IsNotEmpty()
    author: string;

    @IsNotEmpty()
    plot: string;

    @IsOptional()
    coverImage: string;
}
