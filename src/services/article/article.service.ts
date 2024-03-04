import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { promises } from "dns";
import { Article } from "entities/article.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { EditArticleDto } from "src/dtos/article/edit.article.dto";
import { Repository } from "typeorm";

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(Article) 
        private readonly article: Repository<Article>){
        
    }

    // GET ----------------------------------------------------------------

    getAll(): Promise<Article[]>{
        return this.article.find();
    }
    getAllWithCategory(): Promise<Article[]>{
        return this.article.find({relations: ['category']})
    }
    getAllWithPhotos(): Promise<Article[]>{
        return this.article.find({relations: ['photos']})
    }
    getAllWithArticlePrices(): Promise<Article[]>{
        return this.article.find({relations: ['articlePrices']})
    }
    getAllWithArticleFeatures(): Promise<Article[]>{
        return this.article.find({relations:['articleFeatures']})
    }
    getallWithFeatures(): Promise<Article[]>{
        return this.article.find({relations: ['features']})
    }
    getAllWithCategoryAndPhotosAndAriclePricesAndArticleFeaturesAndFeatures(): Promise<Article[]>{
        return this.article.find({relations: ['category', 'photos', 'articlePrices', 'articleFeatures', 'features']})
    }

    // POST ---------------------------------------------------------------

    createOne(AddArticleDto: AddArticleDto): Promise<Article>{ 
        const article = this.article.create(AddArticleDto);
        return this.article.save(article);
    }

    // PUT -----------------------------------------------------------------

    async update(articleId: number, EditArticleDto: EditArticleDto): Promise<Article>{
        const article = await this.article.findOne({ where: { articleId } });

        if(!article){
            throw new NotFoundException('Article not found');
        }

        // if(EditArticleDto.name){
        //     article.name = EditArticleDto.name;
        // }
        // if(EditArticleDto.categoryId){
        //     article.categoryId = EditArticleDto.categoryId
        // }
        // if(EditArticleDto.excerpt){
        //     article.excerpt = EditArticleDto.excerpt
        // }
        // if(EditArticleDto.description){
        //     article.description = EditArticleDto.description
        // }
        return this.article.save({ ...article, ...EditArticleDto });
    }

    async deleteArticle(articleId: number): Promise<void>{
        const article = await this.article.findOne({where: { articleId}});

        if(!article){
            throw new NotFoundException('Article not found');
        }

        await this.article.remove(article);
    }
}

