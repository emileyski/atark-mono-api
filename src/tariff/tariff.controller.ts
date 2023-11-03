import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TariffService } from './tariff.service';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Role } from 'src/core/decorators/role.decorator';
import { Roles } from 'src/core/enums/roles.enum';

@ApiTags('tariff')
@Controller('tariff')
export class TariffController {
  constructor(private readonly tariffService: TariffService) {}

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Role(Roles.ADMIN)
  @Post()
  create(@Body() createTariffDto: CreateTariffDto) {
    return this.tariffService.create(createTariffDto);
  }

  @Get()
  findAll() {
    return this.tariffService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tariffService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTariffDto: UpdateTariffDto) {
    return this.tariffService.update(+id, updateTariffDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tariffService.remove(+id);
  }
}
