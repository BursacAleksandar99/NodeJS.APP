import { Body, Controller, Get, Param, Post, Put, SetMetadata, UseGuards } from "@nestjs/common";
import { Administrator } from "src/entities/administator.entity";
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { EditAdministratorDto } from "src/dtos/administrator/edit.administrator.dto";
import { AdministatorService } from "src/services/administator/administator.service";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptior";
import { RoleCheckedGuard } from "src/misc/role.checker.guard";

@Controller('api/administrator')
export class AdministratorController{
    constructor(
        private administratorService: AdministatorService
    ) {}
        // GET http://localhost:3000/api/administrator/
    
    //@SetMetadata('allow_to_roles', ['administrator'])
   // @AllowToRoles('administrator') // pravo korisnika da koristi metodu, u ovom slucaju to samo admin moze!
   @Get()
   @UseGuards(RoleCheckedGuard)
   @AllowToRoles('administrator')
   getAll(): Promise<Administrator[]> {
       return this.administratorService.getall();
   }
        // http://localhost:3000/api/administrator/1/
    @Get(':id') 
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('administrator')
    getById(@Param('administratorId') administratorId: number): Promise<Administrator>{
        return this.administratorService.getById(administratorId);
    }
    // PUT http://localhost:3000/api/administrator/
    @Put()
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('administrator')
    add( @Body() data: AddAdministratorDto): Promise<Administrator>{
        return this.administratorService.add(data);

    }

    @Post(':id')
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('administrator')
    edit(@Param('administratorId') id: number, @Body() data: EditAdministratorDto): Promise<Administrator>{
        return this.administratorService.editById(id, data);
    }
}

