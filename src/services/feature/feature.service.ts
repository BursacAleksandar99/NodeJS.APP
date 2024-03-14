import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Feature } from "src/entities/feature.entity"
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Repository } from "typeorm";
import { AddFeatureDto } from "src/dtos/feature/add.feature.dto";



@Injectable()
export class FeatureService{
    getAll(): Promise<Feature[]>{
        throw new Error("Method not implemented.");
    }
    constructor(@InjectRepository(Feature) private readonly feature: Repository<Feature>)
    {

    }
    // getall(): Promise<Feature[]>{
    //     return this.feature.find();
    // }

    getAllWithArticleFeatures(): Promise<Feature[]>{
        return this.feature.find({relations: ['articleFeatures']});
    }
    getAllWithArticle(): Promise<Feature[]>{
        return this.feature.find({relations: ['articles']});
    }
    getAllWithCategories(): Promise<Feature[]>{
        return this.feature.find({relations: ['category']});
    }
    getall(): Promise<Feature[]>{
        return this.feature.find({relations: ['articleFeatures', 'articleFeatures', 'category']});
    }
    getOneById(featureId: number): Promise<Feature>{
        return this.feature.findOne({where: {featureId}});
    } 
    // POST ---------------------------------------------------------------

    createOne(AddFeatureDto: AddFeatureDto): Promise<Feature>{
        const feature = this.feature.create(AddFeatureDto);
        return this.feature.save(feature);
    }

    // async update(featureId: number, ) UPDATE TREBA ODARADITI, NAPRAVI EDITDTO!!!
}