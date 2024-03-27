import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { promises } from "dns";
import { ArticleFeature } from "src/entities/article-feature.entity";
import { ArticlePrice } from "src/entities/article-price.entity";
import { Article } from "src/entities/article.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { EditArticleDto } from "src/dtos/article/edit.article.dto";
import { Any, In, Repository } from "typeorm";
import { ApiResponse } from "src/misc/api.response.class";
import { ArticleSearchDto } from "src/dtos/article/article.search.dto";

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
                    "articlePrices",
                    "photos"
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

    async getByCategoryId(categoryId: number): Promise<Article[]> {
        return this.article.find({ where: { categoryId } });
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

    async search(data: ArticleSearchDto): Promise<Article[]>{
        const builder = await this.article.createQueryBuilder("article");
        builder.innerJoinAndSelect("article.articlePrices", "ap",
        "ap.createdAt = (SELECT MAX(ap.created_at) FROM article_price AS ap WHERE ap.article_id = article.article_id)"
        );
        builder.leftJoinAndSelect("article.articleFeatures", "af")

        builder.where('article.categoryId = :categoryId', { categoryId: data.categoryId})

        if(data.keywords && data.keywords.length > 0){
            builder.andWhere(
            `
            (   article.name LIKE :kw OR
                article.excerpt LIKE :kw OR
                article.description LIKE :kw
            )`,
            {kw: '%' + data.keywords.trim() + '%'})
        }
        if(data.priceMin && typeof data.priceMin === 'number'){
            builder.andWhere('ap.price >= :min', {min: data.priceMin});
        }
        if(data.priceMax && typeof data.priceMax === 'number'){
            builder.andWhere('ap.price <= :max', {max: data.priceMax});
        }
        if(data.features && data.features.length > 0){
            for(const feature of data.features){
                builder.andWhere('af.featureId = :fId AND af.value IN(:fVals)' ,
                 {
                    fId: feature.featureId,
                    fVals: feature.values 
                 })
            }
        }
        let orderBy = 'article.name';
        let orderDirection: 'ASC' | 'DESC' = 'ASC';

        if (data.orderBy) {
            orderBy = data.orderBy;

            if (orderBy === 'price') {
                orderBy = 'ap.price';
            }
    
            if (orderBy === 'name') {
                orderBy = 'article.name';
            }
        }
        if(data.orderDirection){
            orderDirection = data.orderDirection;
        }

        builder.orderBy(orderBy, orderDirection)

        let page = 0;
        let perPage = 25;

        if(data.page && typeof data.page === 'number'){
            page = data.page;
        }

        if(data.itemsPerPage && typeof data.itemsPerPage === 'number'){
            perPage = data.itemsPerPage;
        }
        builder.skip(page * perPage);
        builder.take(perPage);

        let articlesIds = await (await builder.getMany()).map(article => article.articleId);

        return await this.article.find({
            where: { articleId: In(articlesIds)},
            relations: [
                    "category",
                    "articleFeatures",
                    "features",
                    "articlePrices",
                    "photos"
            ]
        })
    }
}

