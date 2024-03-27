import * as Validator from 'class-validator';
import { ArticleSearchFeatureComponent } from './article.search.feature.component.dto';
export class ArticleSearchDto{
    @Validator.IsOptional()
    @Validator.IsString()
    @Validator.Length(2, 128)
    keywords: string;
    @Validator.IsNotEmpty()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2,
    })
    categoryId: number;
    @Validator.IsOptional()
    @Validator.IsPositive()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2,
    })
    priceMin: number;
    @Validator.IsOptional()
    @Validator.IsPositive()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2,
    })
    priceMax: number;
    features: ArticleSearchFeatureComponent[];
    @Validator.IsOptional()
    @Validator.IsIn( ['name' , 'price'])
    orderBy: 'name' | 'price';
    @Validator.IsOptional()
    @Validator.IsIn( ['ASC' , 'DESC'])
    orderDirection: 'ASC' | 'DESC';
    @Validator.IsOptional()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 0,
    })
    @Validator.IsPositive()
    page: number;
    @Validator.IsOptional()
    @Validator.IsPositive()
    @Validator.IsIn([5, 10, 25, 50, 75])
    itemsPerPage: 5 | 10 | 25 | 50 | 75;
}