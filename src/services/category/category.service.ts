import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Category } from "entities/category.entity";
import { AddCategoryDto } from "src/dtos/category/add.category.dto";
import { EditCategoryDto } from "src/dtos/category/edit.category.dto";
import { Repository } from "typeorm";


@Injectable()
export class CategoryService  {
    getAll(): Promise<Category[]> {
        throw new Error("Method not implemented.");
    }
    constructor(
        @InjectRepository(Category)
        private readonly category: Repository<Category> // MORA DA SE EVIDENTIRA U APP MODULU JER SMO GA OVDE KORISTILI(REPOSITORY)
    ){
        
    }
    getall(): Promise<Category[]>{ // obecanje da ce vratiti niz category!
        return this.category.find();
    }
    // getById(categoryId: number): Promise<Category> { 
    //     return this.category.find({where:{categoryId}});
    // }
    getAllWithCategories(): Promise<Category[]>{
        return this.category.find({relations: ['categories']});
    }
    getAllWithCategoriesAndFeaturesandArticle(): Promise<Category[]>{
        return this.category.find({relations: ['categories', 'features', 'articles']});
    }
    
    getAllWithFeatuers(): Promise<Category[]>{
        return this.category.find({relations: ['features']});
    }
    getAllWithParentCategory(): Promise<Category[]>{
        return this.category.find({relations: ['parentCategory']})
    }

    getAllWithArticle(): Promise<Category[]>{
        return this.category.find({relations: ['articles']});
    }

    // POST ---------------------------------------------------------------

    createOne(AddArticleDto: AddCategoryDto): Promise<Category>{ 
        const article = this.category.create(AddArticleDto);
        return this.category.save(article);
    }

    async update(categoryId: number, EditCategoryDto: EditCategoryDto): Promise<Category>{
        const category = await this.category.findOne({ where: { categoryId } });

        if(!category){
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
        return this.category.save({...category, ...EditCategoryDto});
    }

    async deleteCategory(categoryId: number): Promise<void>{
        const category = await this.category.findOne({where: { categoryId}});

        if(!category){
            throw new NotFoundException('Article not found');
        }
        await this.category.remove(category);
    }
    
}

