import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { promises } from "dns";
import { ArticleFeature } from "entities/article-feature.entity";
import { ArticlePrice } from "entities/article-price.entity";
import { Article } from "entities/article.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { EditArticleDto } from "src/dtos/article/edit.article.dto";
import { Repository } from "typeorm";
import { ApiResponse, ApiResponseMetadata, ApiResponseOptions } from "@nestjs/swagger";

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(Article) 
        private readonly article: Repository<Article>,

        @InjectRepository(ArticlePrice)
        private readonly articlePrice: Repository<ArticlePrice>,

        @InjectRepository(ArticleFeature)
        private readonly articleFeature: Repository<ArticleFeature>
        ){
        
    }
    async createFullArticle(data: AddArticleDto): Promise<Article | ApiResponseOptions> {
        let newArticle: Article = new Article();
        newArticle.name = data.name;
        newArticle.categoryId = data.categoryId;
        newArticle.excerpt = data.excerpt;
        newArticle.description = data.description;

        let savedArticle = await this.article.save(newArticle);

        let newArticlePrice: ArticlePrice = new ArticlePrice();
        newArticlePrice.articleId = savedArticle.articleId;
        newArticlePrice.price = data.price;

        this.articlePrice.save(newArticlePrice);

        for(let feature of data.features){
            let newArticleFeature = new ArticleFeature();
            newArticleFeature.articleId = savedArticle.articleId;
            newArticleFeature.featureId = feature.featureId;
            newArticleFeature.value = feature.value;

            this.articleFeature.save(newArticleFeature);
        }

       return await this.article.findOne(
        {
            where: { articleId: savedArticle.articleId }, 
            relations: [
                "category",
                "articleFeatures",
                "features",
                "articlePrices"
            ]
        });
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

