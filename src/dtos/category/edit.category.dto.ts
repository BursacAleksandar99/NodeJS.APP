import { from } from "rxjs";
import { IsString, IsOptional, IsInt} from 'class-validator';

export class EditCategoryDto {
    @IsInt()
    @IsOptional()
    categoryId: number;

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    imagePath: string;

    @IsInt()
    @IsOptional()
    parentCategoryId: number;
}