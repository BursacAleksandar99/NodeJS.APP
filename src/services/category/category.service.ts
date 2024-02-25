import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Category } from "entities/category.entity";
import { Repository } from "typeorm";


@Injectable()
export class CategoryService extends TypeOrmCrudService<Category> {
    getAll(): Promise<Category[]> {
        throw new Error("Method not implemented.");
    }
    constructor(
        @InjectRepository(Category)
        private readonly category: Repository<Category> // MORA DA SE EVIDENTIRA U APP MODULU JER SMO GA OVDE KORISTILI(REPOSITORY)
    ){
        super(category)
    }
    getall(): Promise<Category[]>{ // obecanje da ce vratiti niz category!
        return this.category.find();
    }
    getById(categoryId: number): Promise<Category> { 
        return this.category.findOne({where:{categoryId}});
    }
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
    
}

