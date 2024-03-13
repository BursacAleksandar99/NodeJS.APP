import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Photo } from "src/entities/photo.entity";
import { Repository } from "typeorm";

@Injectable()
export class PhotoService {
    constructor(
        @InjectRepository(Photo) 
        private readonly photo: Repository<Photo>
    )   {

        }

        add(newPhoto: Photo): Promise<Photo>{
            return this.photo.save(newPhoto);
        }

    
        
    }