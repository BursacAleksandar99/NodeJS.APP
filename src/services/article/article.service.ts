import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { promises } from "dns";
import { ArticleFeature } from "src/entities/article-feature.entity";
import { ArticlePrice } from "src/entities/article-price.entity";
import { Article } from "src/entities/article.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { EditArticleDto } from "src/dtos/article/edit.article.dto";
import { Repository } from "typeorm";
import { ApiResponse } from "src/misc/api.response.class";

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
    async createFullArticle(data: AddArticleDto): Promise<Article | ApiResponse> {
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
    async editFullArticle(articleId: number, data: EditArticleDto): Promise<Article | ApiResponse>{
        const existingArticle: Article = await this.article.findOne({where: {articleId}, relations: ['articlePrices', 'articleFeatures']})    
        if(!existingArticle){
            return new ApiResponse('error', -5001, 'Article not found!');
            
            
        }
        
        
        existingArticle.name = data.name;
        existingArticle.categoryId = data.categoryId;
        existingArticle.excerpt = data.excerpt;
        existingArticle.description = data.description;
        existingArticle.status = data.status;
        existingArticle.isPromoted = data.isPromoted;

        const savedArticle = await this.article.save(existingArticle);
        if(!savedArticle){
            return new ApiResponse('error', -5002, 'Could not save new article data!');
        }

        const newPriceString: string = Number(data.price).toFixed(2); // 50.1 -> "50.10" STRING JE! 

        const lastPrice = existingArticle.articlePrices[existingArticle.articlePrices.length - 1].price;
        const lastPriceString: string = Number(lastPrice).toFixed(2); // 50 -> "50.00"

        if(newPriceString !== lastPriceString){
            const newArticlePrice = new ArticlePrice();
            newArticlePrice.articleId = articleId;
            newArticlePrice.price = data.price;

            const savedArticlePrice = await this.articlePrice.save(newArticlePrice);
            if(!savedArticlePrice){
                return new ApiResponse('error', -5003, 'Could not save new article price!');
            }
        }

        if(data.features !== null){
            await this.articleFeature.remove(existingArticle.articleFeatures);

            for(let feature of data.features){
                let newArticleFeature = new ArticleFeature();
                newArticleFeature.articleId = articleId;
                newArticleFeature.featureId = feature.featureId;
                newArticleFeature.value = feature.value;
    
                this.articleFeature.save(newArticleFeature);
            }
            
        }
        return await this.article.findOne(
            {
                where: { articleId: articleId }, 
                relations: [
                    "category",
                    "articleFeatures",
                    "features",
                    "articlePrices"
                ]
            });
    }

    // GET ----------------------------------------------------------------

    getOne(articleId: number,): Promise<Article>{
        return this.article.findOne({where: {articleId}});
    }
    getOneWithCategory(articleId: number,): Promise<Article>{
        return this.article.findOne({where: {articleId}, relations: ['category']});
    }
    getOneWithArticlePrices(articleId: number): Promise<Article>{
        return this.article.findOne({where: {articleId}, relations: ['articlePrices']});
    }
    getOneWithArticleFeatures(articleId: number): Promise<Article>{
        return this.article.findOne({where: {articleId}, relations: ['articleFeatures']});
    }
    getOneWithFeatures(articleId: number): Promise<Article>{
        return this.article.findOne({where: {articleId}, relations: ['features']});
    }
    getOneWithPhotos(articleId: number): Promise<Article>{
        return this.article.findOne({where: {articleId}, relations: ['photos']});
    }
    // OVO ZAVRSI DO KRAJA, VIDI U article.controller.ts!!!
    // getOneWithAllData(articleId: number): Promise<Article>{
    //     return this.article.findOne({where: {articleId}, relations: ['category', 'photos', 'articlePrices', 'articleFeatures', 'features']});
    // }
    

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

