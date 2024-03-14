import { Controller, Query, Get, Post, Body, Param } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { identity } from "rxjs";
import { AddFeatureDto } from "src/dtos/feature/add.feature.dto";
import { Feature } from "src/entities/feature.entity";
import { FeatureService } from "src/services/feature/feature.service";



// @Crud({
//     model: {
//         type: Feature
//     },
//     params: {
//         id:{
//             field: 'feature_id',
//             type: 'number',
//             primary: true
//         }
//     },
//     query: {
//         join: {
//             category: {
//                 eager: true
//             },
//              articleFeatures: {
//                 eager: false
//              },
//              articles: {
//                 eager: false
//              }
//         }
//     }
// })
@Controller('api/feature')
export class FeatureController{
    constructor(public feature: FeatureService){
        
    }
    @Get()
    getall(@Query('join') join?: string): Promise<Feature[]>{
        if(join == 'articleFeatures'){
            return this.feature.getAllWithArticleFeatures();
        }else if(join == 'articles'){
            return this.feature.getAllWithArticle();
        }else if(join == 'category'){
            return this.feature.getAllWithCategories();
        }
        return this.feature.getall();
    }
    @Get(':id')
    getOne(@Param('id') id: number): Promise<Feature>{
        return this.feature.getOneById(id);
    }
    @Post()
    createOne(@Body() AddFeatureDto: AddFeatureDto): Promise<Feature>{
        return this.feature.createOne(AddFeatureDto);
    }
}