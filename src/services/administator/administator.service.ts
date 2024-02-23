import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'entities/administator.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class AdministatorService {
    constructor(
        @InjectRepository(Administrator) 
        private readonly administrator: Repository<Administrator>
    ){}

    getall(): Promise<Administrator[]>{ // obecanje da ce vratiti niz administatora!
        return this.administrator.find();
    }

    getById(id: number): Promise<Administrator>{
        return this.administrator.findOne({ where: { id } } as FindOneOptions<Administrator>);
    }
    
}

