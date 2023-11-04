import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Role } from 'src/core/decorators/role.decorator';
import { Roles } from 'src/core/enums/roles.enum';
import { UserId } from 'src/core/decorators/user-id.decorator';
import { Public } from 'src/core/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('driver')
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Role(Roles.USER)
  @Post()
  create(@Body() createDriverDto: CreateDriverDto, @UserId() userId: string) {
    return this.driverService.create(createDriverDto, userId);
  }

  @Public()
  @Get()
  findAll() {
    return this.driverService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driverService.findOne(+id);
  }
}
