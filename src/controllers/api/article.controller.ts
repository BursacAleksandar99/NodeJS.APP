import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Crud } from "@nestjsx/crud";
import { Article } from "entities/article.entity";
import { join } from "path";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { EditArticleDto } from "src/dtos/article/edit.article.dto";
import { ArticleService } from "src/services/article/article.service";
import { diskStorage } from 'multer'
import { StorageConfig } from "config/storage.config";
import { Photo } from "entities/photo.entity";
import { PhotoService } from "src/services/photo/photo.service";
import { ApiResponse } from "src/misc/api.response.class";
import * as fileType from 'file-type';
import * as fs from 'fs';
import * as sharp from "sharp";


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
    constructor(public articleService: ArticleService,
           public photoService: PhotoService    // moze da se koristi vise od jednog servisa u kontroleru! 
        ){
        
    }
    @Post('createFull')
    createFullArticle(@Body() data: AddArticleDto){
        return this.articleService.createFullArticle(data);
    }
    @Post(':id/uploadPhoto/') // POST http://localhost:3000/api/article/:id/uploadPhoto/
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: diskStorage({
                destination: StorageConfig.photoDestination,
                filename: (req, file, callback) => {
                    // 'Neka   slika.jpg' ->
                    // '20200420-1253634563-Neka-slika.jpg'

                    let original: string = file.originalname;

                    let normalized = original.replace(/\s/g, '-'); // uklanja se nepotreban razmak
                    normalized = normalized.replace(/[^A-z0-9\.\-]/g, ''); 
                    let sada = new Date();
                    let datePart = '';
                    datePart += sada.getFullYear().toString();
                    datePart += (sada.getMonth() + 1).toString();
                    datePart += sada.getDate().toString();

                    let randomPart: string = 
                    new Array(10)
                    .fill(0)
                    .map(e => (Math.random() * 9).toFixed(0).toString())
                    .join('');
                    
                    let fileName = datePart + '-' + randomPart + '-' + normalized; 
                    fileName = fileName.toLocaleLowerCase();

                    callback(null, fileName);
                }
            }),
            fileFilter: (req, file, callback) => {
                // 1. Provera ekstenzije: JPG, PNG
                // 2. Provera tipa sadrzaja: image/jpeg, image/png(minetype)

                if(!file.originalname.match(/\.(jpg|png)$/)){
                    req.fileFilterError = 'Bad file extension!';
                    callback(null, false);
                    return;
                }
                if(!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))){
                    req.fileFilterError = 'Bad file content!';
                    callback(null, false);
                    return;
                }
                callback(null, true);
            },
            limits: {
                files: 1,
                fileSize: StorageConfig.photoMaxFileSize,
            },

        })
    )
    async uploadPhoto(@Param('id') articleId: number, @UploadedFile() photo, @Req() req): Promise <ApiResponse | Photo>{
        if(req.fileFilterError){
            return new ApiResponse('error', -4002, req.fileFilterError);
        }
        if(!photo){
            return new ApiResponse('error', -4002, 'File not uploaded!');
        }
        // console.log(photo);
        

        const fileTypeResult = await fileType.fromFile(photo.path);
        if(!fileTypeResult){
            fs.unlinkSync(photo.path)
            return new ApiResponse('error', -4002, 'Cannot detect file type!');
        }

        const realMineType = fileTypeResult.mime;
        if(!(realMineType.includes('jpeg') || realMineType.includes('png'))){
            fs.unlinkSync(photo.path)
            return new ApiResponse('error', -4002, 'Bad file content type!');
        }

        await this.createThumb(photo);
        await this.createSmallImage(photo);


       
        const newPhoto: Photo = new Photo();
        newPhoto.articleId = articleId;
        newPhoto.imagePath = photo.filename;

        const savedPhoto = await this.photoService.add(newPhoto);
        if(!savedPhoto){
            return new ApiResponse('error', -4001);
        }
        return savedPhoto;

    } 
    async createThumb(photo){
        const originalFilePath = photo.path;
        const fileName = photo.filename;

        const destinationFilePath = StorageConfig.photoDestination + "thumb/" + fileName; // lokacija naseg Thumb foldera gde ce cuvati slike! 

        await sharp(originalFilePath)
        .resize({
            fit: 'cover',
            width: StorageConfig.photoThumbSize.width,
            height: StorageConfig.photoThumbSize.height,
            background:{
                r: 255, g: 255, b: 255, alpha: 0.0
            }

        })
        .toFile(destinationFilePath);

    }
    async createSmallImage(photo){

        const originalFilePath = photo.path;
        const fileName = photo.filename;

        const destinationFilePath = StorageConfig.photoDestination + "small/" + fileName; // lokacija naseg Thumb foldera gde ce cuvati slike! 

        await sharp(originalFilePath)
        .resize({
            fit: 'cover',
            width: StorageConfig.photoSmallSize.width,
            height: StorageConfig.photoSmallSize.height,
            background:{
                r: 255, g: 255, b: 255, alpha: 0.0
            }

        })
        .toFile(destinationFilePath);

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
    @Get(':id')
    getOne(@Param('id') articleId: number, @Query('join') join?: string) : Promise<Article>{
        if (join === 'category') {
            return this.articleService.getOneWithCategory(articleId);
        } else if (join === 'photos') {
            return this.articleService.getOneWithPhotos(articleId);
        } else if (join === 'articlePrices') {
            return this.articleService.getOneWithArticlePrices(articleId);
        } else if (join === 'articleFeatures') {
            return this.articleService.getOneWithArticleFeatures(articleId);
        } else if (join === 'features') {
            return this.articleService.getOneWithFeatures(articleId);
        }
        return this.articleService.getOne(articleId);
    }
    // @Get('id')
    // getOneWithAllData(@Param('id') articleId: number): Promise<Article>{
    //     return this.articleService.getOneWithAllData(articleId);
    // }

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
    
