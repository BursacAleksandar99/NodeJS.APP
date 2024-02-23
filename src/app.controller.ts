import { Controller, Get } from '@nestjs/common';
import { AdministatorService } from './services/administator/administator.service';
import { Administrator } from 'entities/administator.entity';


@Controller()
export class AppController {
  constructor(
    private administratorService: AdministatorService
  ){}
  @Get() //http://localhost:3000
  getHello(): string {
    return 'Home page!';
  }

  @Get('api/administrator') // http://localhost:3000/api/administrator/
  getAllAdmins(): Promise<Administrator[]>{
    return this.administratorService.getall();
  }
}
