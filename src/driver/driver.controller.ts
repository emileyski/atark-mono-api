import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { Role } from 'src/core/decorators/role.decorator';
import { Roles } from 'src/core/enums/roles.enum';
import { UserId } from 'src/core/decorators/user-id.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/public.decorator';

//контроллер для водителя
@ApiTags('driver')
@Controller('driver')
export class DriverController {
  //инициализация сервиса
  constructor(private readonly driverService: DriverService) {}

  //создание водителя
  @Role(Roles.USER)
  @Post()
  create(@Body() createDriverDto: CreateDriverDto, @UserId() userId: string) {
    //вызов метода создания водителя, передача в него данных и id пользователя
    return this.driverService.create(createDriverDto, userId);
  }

  //получение всех водителей
  @Public()
  @Get()
  findAll(@Query('page') page = 1, @Query('perPage') perPage = 10) {
    //вызов метода получения всех водителей, передача в него страницы и количества водителей на странице
    return this.driverService.findAll(page, perPage);
  }
}
