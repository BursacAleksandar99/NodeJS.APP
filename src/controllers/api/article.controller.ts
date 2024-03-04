import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Article } from "entities/article.entity";
import { join } from "path";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { EditArticleDto } from "src/dtos/article/edit.article.dto";
import { ArticleService } from "src/services/article/article.service";

@Controller('api/article')
// @Crud({
//     model:{
//         type: Article
//     },
//     params: {
//         id: {
//             field: 'articleId',
//             type: 'number',
//             primary: true
//         }
//     },
//     query: {
//         join: {
//             category: {
//                 eager: true
//             }
//         }
//     }
// })
export class ArticleController{
    constructor(public articleService: ArticleService){
        
    }
    @Post('createFull')
    createFullArticle(@Body() data: AddArticleDto){
        return this.articleService.createFullArticle(data);
    }

    @Get()
    getAll(@Query('join') join?: string): Promise<Article[]>{
        if(join === 'category'){
            return this.articleService.getAllWithCategory();
        } else if(join === 'photos'){
            return this.articleService.getAllWithPhotos();
        } else if(join === 'articlePrices'){
            return this.articleService.getAllWithArticlePrices();
        } else if(join === 'articleFeatures'){
            return this.articleService.getAllWithArticleFeatures();
        } else if (join === 'features'){
            return this.articleService.getallWithFeatures();
        }
        return this.articleService.getAllWithCategoryAndPhotosAndAriclePricesAndArticleFeaturesAndFeatures();
    }

    @Post()
    createOne(@Body() AddArticleDto: AddArticleDto): Promise<Article> {
    return this.articleService.createOne(AddArticleDto)
    }

    @Put(':id')
    async update(@Param('id') articleId: number, @Body() EditArticleDto: EditArticleDto): Promise<Article>{
        return this.articleService.update(articleId, EditArticleDto);
    }

    @Delete(':id')
    async delete(@Param('id') articleId: number): Promise<void>{
        return this.articleService.deleteArticle(articleId);
    }

    }
    
