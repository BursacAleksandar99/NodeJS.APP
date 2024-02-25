import { Controller, Get, Param, Query } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Category } from "entities/category.entity";
import { join } from "path";
import { CategoryService } from "src/services/category/category.service";
import { JoinTable } from "typeorm";

@Controller('api/category')
// @Crud({
//     model: {
//         type: Category
//     },
//     params: {
//         id:{
//             field: 'id',
//             type: 'number',
//             primary: true
//         }
//     },
//     query: {
//         join: {
//             categories: {
//                 eager: true
//             }
//         }
//     }
// })
export class CategoryController{
    constructor(
        public categoryService: CategoryService
    ){}

    // @Get() 
    // getAll(): Promise<Category[]>{
    //     return this.categoryService.getall();
    // }
    @Get()
    getAll(@Query('join') join?: string): Promise<Category[]>{
        if(join === 'categories'){
            return this.categoryService.getAllWithCategories();
        } else if(join === 'features'){
            return this.categoryService.getAllWithFeatuers();
        } else if(join === 'parentCategory'){
            return this.categoryService.getAllWithParentCategory();
        } else if(join === 'articles'){
            return this.categoryService.getAllWithArticle();
        }
            return this.categoryService.getAllWithCategoriesAndFeaturesandArticle();
        
    }
    

        // http://localhost:3000/api/category/1/
    @Get(':id') 
    getById(@Param('id') categoryId: number): Promise<Category>{
        return this.categoryService.getById(categoryId);
        

    }
   
}