import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'entities/administator.entity';
import { AddAdministratorDto } from 'src/dtos/administrator/add.administrator.dto';
import { EditAdministratorDto } from 'src/dtos/administrator/edit.administrator.dto';
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

    // getById(id: number): Promise<Administrator>{
    //     return this.administrator.findOne({ where: { id } } as FindOneOptions<Administrator>);
    // }
    getById(administratorId: number): Promise<Administrator> { 
        return this.administrator.findOne({where:{administratorId}});}


    add(data: AddAdministratorDto): Promise<Administrator>{
        const crypto = require('crypto');

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);

        const passwordHashString = passwordHash.digest('hex');

        let newAdmin: Administrator = new Administrator();
        newAdmin.username = data.username;
        newAdmin.passwordHash = passwordHashString;

        return this.administrator.save(newAdmin)
        // DTO          -> Model
        // username     -> username
        // password     -[~]-> passwordHash


    }

    async editById(id: number, data: EditAdministratorDto): Promise<Administrator>{
        let admin: Administrator = await this.administrator.findOne({ where: { id } } as FindOneOptions<Administrator>);

        // if(admin === null){
        //     return new Promise((resolve) => {
        //         resolve(new ApiResponse("error", -1002));
        //     });
        // }

        const crypto = require('crypto');

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        admin.passwordHash = passwordHashString;

        return this.administrator.save(admin);
    }
    
}

