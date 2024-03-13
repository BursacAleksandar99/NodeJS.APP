import { Body, Controller, HttpException, HttpStatus, Post, Req} from "@nestjs/common";
import { resolve } from "path";
import { LoginAdministratorDto } from "src/dtos/administrator/login.administrator.dto";
import { AdministatorService } from "src/services/administator/administator.service";
import * as crypto from 'crypto';
import { LoginInfoAdministratorDto } from "src/dtos/administrator/login.info.administrator.dto";
import { ApiResponse } from "src/misc/api.response.class";
import * as jwt from 'jsonwebtoken'; 
import { JwtDataAdministratorDto } from "src/dtos/administrator/jwt.data.administrator.dto";
import { Request } from "express";
import { jwtSecret } from "config/jwt.secret";



@Controller('auth')
export class AuthController {
    constructor(public administratorService: AdministatorService){
        
    }

    @Post('login') // http://localhost:3000/auth/login/
    async doLogin(@Body() data: LoginAdministratorDto, @Req() req: Request): Promise<LoginInfoAdministratorDto |ApiResponse> {
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

        const jwtData = new JwtDataAdministratorDto();
        jwtData.administratorId = administator.administratorId;
        jwtData.username = administator.username;
        let sada = new Date();
        sada.setDate(sada.getDate() + 14);
        const istekTimestamp = sada.getTime() / 1000;
        jwtData.exp = istekTimestamp;

        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];


        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const responseObject = new LoginInfoAdministratorDto(
            administator.administratorId,
            administator.username,
            token
        );
        return new Promise(resolve => resolve(responseObject));
    }
        
    
}