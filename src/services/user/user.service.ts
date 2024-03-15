import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity"
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Repository } from "typeorm";
import { AddFeatureDto } from "src/dtos/feature/add.feature.dto";
import {  UserRegistrationDto } from "src/dtos/user/user.registration.dto";
import { ApiResponse } from "src/misc/api.response.class";
import * as crypto from 'crypto';



@Injectable()
export class UserService{
    getAll(): Promise<User[]>{
        throw new Error("Method not implemented.");
    }
    constructor(@InjectRepository(User) private readonly user: Repository<User>)
    {

    }
    async register(data: UserRegistrationDto): Promise<User | ApiResponse> {
        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        const newUser: User = new User();
        newUser.email         = data.email;
        newUser.passwordHash  = passwordHashString;
        newUser.forname      = data.forname;
        newUser.surname       = data.surname;
        newUser.phoneNumber   = data.phoneNumber;
        

        // try {
        //     const savedUser = await this.user.save(newUser);

        //     if (!savedUser) {
        //         throw new Error('');
        //     }

        //     return savedUser;
        // } catch (e) {
        //     return new ApiResponse('error', -6001, 'This user account cannot be created.');
        // }
        const savedUser = await this.user.save(newUser);

            if (!savedUser) {
                throw new Error('');
            }

            return savedUser;
    }
    async getByEmail(email: string): Promise<User | null>{
        const user = await this.user.findOne({where:{email: email}});
        if(user){
            return user;
        }
        return null;
    }
    
    // getall(): Promise<Feature[]>{
    //     return this.feature.find();
    // }

    getAllWithForname(): Promise<User[]>{
        return this.user.find({relations: ['forname']});
    }
    getAllWithSurname(): Promise<User[]>{
        return this.user.find({relations: ['surname']});
    }
    getAllWithEmail(): Promise<User[]>{
        return this.user.find({relations: ['email']});
    }
    getAllWithPasswordHash(): Promise<User[]>{
        return this.user.find({relations: ['passwordHash']});
    }
    getall(): Promise<User[]>{
        return this.user.find({relations: ['forname','surname', 'email', 'passwordHash']});
    }
    getOneById(userId: number): Promise<User>{
        return this.user.findOne({where: {userId}});
    } 
    // POST ---------------------------------------------------------------

    // createOne(AddFeatureDto: AddFeatureDto): Promise<User>{
    //     const feature = this.feature.create(AddFeatureDto);
    //     return this.feature.save(feature);
    // }

    // async update(featureId: number, ) UPDATE TREBA ODARADITI, NAPRAVI EDITDTO!!!
}