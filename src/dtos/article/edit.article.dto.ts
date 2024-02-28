import {IsString, IsOptional, IsInt} from 'class-validator';

export class EditArticleDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsInt()
    @IsOptional()
    categoryId?: number;

    @IsInt()
    @IsOptional()
    excerpt?: string;

    @IsInt()
    @IsOptional()
    description?: string;
}