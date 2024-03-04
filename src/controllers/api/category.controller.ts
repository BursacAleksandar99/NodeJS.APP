import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Category } from "entities/category.entity";
import { join } from "path";
import { AddCategoryDto } from "src/dtos/category/add.category.dto";
import { EditCategoryDto } from "src/dtos/category/edit.category.dto";
import { CategoryService } from "src/services/category/category.service";
import { JoinTable } from "typeorm";

@Controller('api/category')

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
    // @Get(':id') 
    // getById(@Param('id') categoryId: number): Promise<Category>{
    //     return this.categoryService.getById(categoryId);
        

    // }

    @Post()
    createOne(@Body() AddArticleDto: AddCategoryDto): Promise<Category> {
    return this.categoryService.createOne(AddArticleDto)
    }
    
   @Put(':id')
   async update(@Param('id') categoryId: number, @Body() EditCategoryDto: EditCategoryDto): Promise<Category>{
    return this.categoryService.update(categoryId, EditCategoryDto);
   }

   @Delete(':id')
    async delete(@Param('id') articleId: number): Promise<void>{
        return this.categoryService.deleteCategory(articleId);
    }
}