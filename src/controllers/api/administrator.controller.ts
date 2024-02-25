import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { Administrator } from "entities/administator.entity";
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { EditAdministratorDto } from "src/dtos/administrator/edit.administrator.dto";
import { AdministatorService } from "src/services/administator/administator.service";

@Controller('api/administrator')
export class AdministratorController{
    constructor(
        private administratorService: AdministatorService
    ) {}
        // GET http://localhost:3000/api/administrator/
    @Get() 
    getAll(): Promise<Administrator[]>{
        return this.administratorService.getall();
    }
        // http://localhost:3000/api/administrator/1/
    @Get(':id') 
    getById(@Param('id') administratorId: number): Promise<Administrator>{
        return this.administratorService.getById(administratorId);
    }
    // PUT http://localhost:3000/api/administrator/
    @Put()
    add( @Body() data: AddAdministratorDto): Promise<Administrator>{
        return this.administratorService.add(data);

    }

    @Post(':id')
    edit(@Param('id') id: number, @Body() data: EditAdministratorDto): Promise<Administrator>{
        return this.administratorService.editById(id, data);
    }
}

