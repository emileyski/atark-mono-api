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
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from 'src/core/decorators/role.decorator';
import { Roles } from 'src/core/enums/roles.enum';
import { Public } from 'src/core/decorators/public.decorator';

@ApiUnauthorizedResponse({
  description: 'You are not authorized, please provide correct access token',
})
@ApiForbiddenResponse({
  description: 'You are not allowed to perform this action',
})
@ApiTags('tariff')
@Controller('tariff')
export class TariffController {
  constructor(private readonly tariffService: TariffService) {}

  @ApiBearerAuth()
  @Role(Roles.ADMIN)
  @Post()
  create(@Body() createTariffDto: CreateTariffDto) {
    return this.tariffService.create(createTariffDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.tariffService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tariffService.findOne(+id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTariffDto: UpdateTariffDto) {
    return this.tariffService.update(+id, updateTariffDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tariffService.remove(+id);
  }
}
