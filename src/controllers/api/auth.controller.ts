import { Body, Controller, HttpException, HttpStatus, Post, Put, Req} from "@nestjs/common";
import { resolve } from "path";
import { LoginAdministratorDto } from "src/dtos/administrator/login.administrator.dto";
import { AdministatorService } from "src/services/administator/administator.service";
import * as crypto from 'crypto';
import { LoginInfoDto } from "src/dtos/auth/login.info.dto";
import { ApiResponse } from "src/misc/api.response.class";
import * as jwt from 'jsonwebtoken'; 
import { JwtDataDto } from "src/dtos/auth/jwt.data.dto";
import { Request } from "express";
import { jwtSecret } from "config/jwt.secret";
import { UserRegistrationDto} from "src/dtos/user/user.registration.dto";
import { UserService } from "src/services/user/user.service";
import { LoginUserDto } from "src/dtos/user/login.user.dto";



@Controller('auth')
export class AuthController {
    constructor(public administratorService: AdministatorService,
        public userService: UserService){
        
    }

    @Post('administrator/login') // http://localhost:3000/auth/administrator/login/
    async doAdministratorLogin(@Body() data: LoginAdministratorDto, @Req() req: Request): Promise<LoginInfoDto |ApiResponse> {
        const administator = await this.administratorService.getByUsername(data.username);

        if(!administator){
            return new Promise(resolve => resolve(new ApiResponse('error', -3001)));
        }
        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex');

        if(administator.passwordHash !== passwordHashString){
            return new Promise(resolve => resolve(new ApiResponse('error', -3002)));
        }

        const jwtData = new JwtDataDto();
        jwtData.role = "administrator";
        jwtData.id = administator.administratorId;
        jwtData.identity = administator.username; // identity nam govori ko je ko, da li je user ili administrator!
        let sada = new Date();
        sada.setDate(sada.getDate() + 14);
        const istekTimestamp = sada.getTime() / 1000;
        jwtData.exp = istekTimestamp;

        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];


        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const responseObject = new LoginInfoDto(
            administator.administratorId,
            administator.username,
            token
        );
        return new Promise(resolve => resolve(responseObject));
    }
    @Post('user/login') // http://localhost:3000/auth/administrator/login/
    async doUserLogin(@Body() data: LoginUserDto, @Req() req: Request): Promise<LoginInfoDto |ApiResponse> {
        const user = await this.userService.getByEmail(data.email);

        if(!user){
            return new Promise(resolve => resolve(new ApiResponse('error', -3001)));
        }
        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();;

        if(user.passwordHash !== passwordHashString){
            return new Promise(resolve => resolve(new ApiResponse('error', -3002)));
        }

        const jwtData = new JwtDataDto();
        jwtData.role = "user";
        jwtData.id = user.userId;
        jwtData.identity = user.email; // identity nam govori ko je ko, da li je user ili administrator!
        let sada = new Date();
        sada.setDate(sada.getDate() + 14);
        const istekTimestamp = sada.getTime() / 1000;
        jwtData.exp = istekTimestamp;

        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];


        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const responseObject = new LoginInfoDto(
            user.userId,
            user.email,
            token
        );
        return new Promise(resolve => resolve(responseObject));
    }

    @Put('user/register') // PUT http://localhost:3000?auth/user/register
    async userRegister(@Body() data: UserRegistrationDto){
        return await this.userService.register(data);
    }
        
    
}