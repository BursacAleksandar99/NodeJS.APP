import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response  } from "express";
import { AdministatorService } from "src/services/administator/administator.service";
import * as jwt from 'jsonwebtoken';
import { JwtDataDto } from "src/dtos/auth/jwt.data.dto";
import { jwtSecret } from "config/jwt.secret";
import { UserService } from "src/services/user/user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware{
    constructor(private readonly administratorService: AdministatorService,
        private readonly userService: UserService){}
    async use(req: Request, res: Response, next: NextFunction) {
        if(!req.headers.authorization){
            throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
        }

        const token = req.headers.authorization;

        const tokenParts = token.split(' ');
        if(tokenParts.length !== 2){
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }
        const tokenString = tokenParts[1];

        let jwtData: JwtDataDto;
        try{
            jwtData = jwt.verify(tokenString, jwtSecret);
        }catch(e){

            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }
        
        

        const ip = req.ip.toString();
        if(jwtData.ip !== req.ip.toString()){
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }
        if(jwtData.ua !== req.headers["user-agent"]){
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }
        if(jwtData.role === "administrator"){
            const administator = await this.administratorService.getById(jwtData.id);
            if(!administator){
                throw new HttpException('Account not found', HttpStatus.UNAUTHORIZED);
            }
        } else if(jwtData.role === "user"){
            const user = await this.userService.getOneById(jwtData.id);
            if(!user){
                throw new HttpException('Account not found', HttpStatus.UNAUTHORIZED);
            }
        }

        

        const trenutniTimestamp = new Date().getTime() / 1000;

        if(trenutniTimestamp >= jwtData.exp){
            throw new HttpException('The token has expired', HttpStatus.UNAUTHORIZED);
        }

        req.token = jwtData;


        next();
    }
    
}