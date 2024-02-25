import { Controller, Get, Query } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Article } from "entities/article.entity";
import { join } from "path";
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

//         }
//     }
// })
export class ArticleController{
    constructor(public articleService: ArticleService){
        
    }
    @Get()
    getAll(): Promise<Article[]>{
        return this.articleService.getAll();
    }
    
}