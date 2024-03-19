import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Crud } from "@nestjsx/crud";
import { Article } from "src/entities/article.entity";
import { join } from "path";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { EditArticleDto } from "src/dtos/article/edit.article.dto";
import { ArticleService } from "src/services/article/article.service";
import { diskStorage } from 'multer'
import { StorageConfig } from "config/storage.config";
import { Photo } from "src/entities/photo.entity";
import { PhotoService } from "src/services/photo/photo.service";
import { ApiResponse } from "src/misc/api.response.class";
import * as fileType from 'file-type';
import * as fs from 'fs';
import * as sharp from "sharp";
import { RoleCheckedGuard } from "src/misc/role.checker.guard";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptior";


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
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('administrator')
    createFullArticle(@Body() data: AddArticleDto){
        return this.articleService.createFullArticle(data);
    }
    
    @Patch(':id') // http://localhost:3000/api/article/2
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('administrator')
    editFullArticle(@Param('id') id: number, @Body() data: EditArticleDto){
        return this.articleService.editFullArticle(id, data);
    }
    
    @Post(':id/uploadPhoto/') // POST http://localhost:3000/api/article/:id/uploadPhoto/
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('administrator')
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: diskStorage({
                destination: StorageConfig.photo.destination,
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
                fileSize: StorageConfig.photo.maxSize,
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

        await this.createResizedImage(photo, StorageConfig.photo.resize.thumb)
        await this.createResizedImage(photo, StorageConfig.photo.resize.small)


       
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
        // const originalFilePath = photo.path;
        // const fileName = photo.filename;

        // const destinationFilePath = StorageConfig.photo.destination + StorageConfig.photo.resize.thumb.directory + fileName; // lokacija naseg Thumb foldera gde ce cuvati slike! 

        // await sharp(originalFilePath)
        // .resize({
        //     fit: 'cover',
        //     width: StorageConfig.photo.resize.thumb.width,
        //     height: StorageConfig.photo.resize.thumb.height,
            
        // })
        // .toFile(destinationFilePath);
        await this.createResizedImage(photo, StorageConfig.photo.resize.thumb)

    }
    async createSmallImage(photo){

        // const originalFilePath = photo.path;
        // const fileName = photo.filename;

        // const destinationFilePath = StorageConfig.photo.destination + StorageConfig.photo.resize.small.directory + fileName; // lokacija naseg Thumb foldera gde ce cuvati slike! 

        // await sharp(originalFilePath)
        // .resize({
        //     fit: 'cover',
        //     width: StorageConfig.photo.resize.small.width,
        //     height: StorageConfig.photo.resize.small.height,
            
        // })
        // .toFile(destinationFilePath);
        await this.createResizedImage(photo, StorageConfig.photo.resize.small)

    }
    async createResizedImage(photo, resizeSettings){
        const originalFilePath = photo.path;
        const fileName = photo.filename;

        const destinationFilePath = StorageConfig.photo.destination + resizeSettings.directory + fileName; // lokacija naseg Thumb foldera gde ce cuvati slike! 

        await sharp(originalFilePath)
        .resize({
            fit: 'cover',
            width: resizeSettings.width,
            height: resizeSettings.height,
            // StorageConfig.photo.resize smo promenili sa resizeSettings
            
        })
        .toFile(destinationFilePath);
    }
    // ruta na primer http://localhost:3000/api/article/1/deletePhoto/45/
    @Delete(':articleId/deletePhoto/:photoId')
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('administrator')
    public async deletePhoto(
        @Param('articleId') articleId: number,
        @Param('photoId') photoId: number,
    ){
        const photo = await this.photoService.findOne({
            where: { articleId: articleId, photoId: photoId }
        });

        if (!photo) {
            return new ApiResponse('error', -4004, 'Photo not found!');
        }
        try{
            fs.unlinkSync(StorageConfig.photo.destination + photo.imagePath);
        fs.unlinkSync(StorageConfig.photo.destination + 
            StorageConfig.photo.resize.thumb.directory + photo.imagePath);
            fs.unlinkSync(StorageConfig.photo.destination + 
                StorageConfig.photo.resize.small.directory + photo.imagePath);

        }catch(e){}
        

        const deleteResult = await this.photoService.deleteById(photoId);      
        if(deleteResult.affected === 0){
            return new ApiResponse('error', -4004, 'Photo not found!');
        }    
        
        return new ApiResponse('ok', 0, 'One photo deleted!');
    }
    

    @Get()
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('administrator')
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
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('administrator')
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
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('administrator')
    createOne(@Body() AddArticleDto: AddArticleDto): Promise<Article> {
    return this.articleService.createOne(AddArticleDto)
    }

    @Put(':id')
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('administrator')
    async update(@Param('id') articleId: number, @Body() EditArticleDto: EditArticleDto): Promise<Article>{
        return this.articleService.update(articleId, EditArticleDto);
    }

    @Delete(':id')
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('administrator')
    async delete(@Param('id') articleId: number): Promise<void>{
        return this.articleService.deleteArticle(articleId);
    }

    }
    
