import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/core/decorators/role.decorator';
import { Roles } from 'src/core/enums/roles.enum';
import { RoleGuard } from 'src/core/guards/role.guard';
import { CreateTariffDto } from 'src/tariff/dto/create-tariff.dto';
import { UpdateTariffDto } from 'src/tariff/dto/update-tariff.dto';
import { AdminPanelService } from '../admin-panel.service';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('admin-panel/tariffs')
@Controller('tariffs')
export class TariffsController {
  constructor(private readonly adminPanelService: AdminPanelService) {}

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @ApiOperation({
    summary: 'Create a new tariff',
    description: 'Creates a new tariff.',
  })
  @Post()
  async createTariff(@Body() createTariffDto: CreateTariffDto) {
    return await this.adminPanelService.createTariff(createTariffDto);
  }

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @ApiOperation({
    summary: 'Get all tariffs',
    description: 'Retrieves a list of all tariffs.',
  })
  @Get()
  async getAllTariffs(@Query('page') page = 1, @Query('perPage') perPage = 10) {
    return await this.adminPanelService.getAllTariffs(page, perPage);
  }

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @ApiOperation({
    summary: 'Update a tariff',
    description: 'Updates an existing tariff.',
  })
  @Put(':tariffId')
  async updateTariff(
    @Param('tariffId') id: number,
    @Body() updateTariffDto: UpdateTariffDto,
  ) {
    return await this.adminPanelService.updateTariff(id, updateTariffDto);
  }

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @ApiOperation({
    summary: 'Delete a tariff',
    description: 'Deletes an existing tariff.',
  })
  @Delete(':tariffId')
  async deleteTariff(@Param('tariffId') id: number) {
    return await this.adminPanelService.deleteTariff(id);
  }
}
