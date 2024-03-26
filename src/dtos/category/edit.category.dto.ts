import * as Validator from 'class-validator';
export class EditCategoryDto {
    categoryId: number;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(5, 32)
    name: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(1, 128)
    imagePath: string;
    parentCategoryId: number;
}