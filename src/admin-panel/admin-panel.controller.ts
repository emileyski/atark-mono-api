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
import { AdminPanelService } from './admin-panel.service';
import { Role } from 'src/core/decorators/role.decorator';
import { Roles } from 'src/core/enums/roles.enum';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { UpdateUserByAdminDto } from './dto/update-user-by-admin.dto';
import { UpdateOrderDto } from 'src/orders/dto/update-order.dto';
import { UpdateTariffDto } from 'src/tariff/dto/update-tariff.dto';
import { CreateTariffDto } from 'src/tariff/dto/create-tariff.dto';
import { RoleGuard } from 'src/core/guards/role.guard';

@ApiTags('admin-panel')
@Controller('admin-panel')
export class AdminPanelController {
  constructor(
    private readonly adminPanelService: AdminPanelService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Get('users')
  async getAllUsers(@Query('page') page = 1, @Query('perPage') perPage = 10) {
    return await this.adminPanelService.getAllUsers(page, perPage);
  }

  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Put('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserByAdminDto: UpdateUserByAdminDto,
  ) {
    return await this.adminPanelService.updateUser(id, updateUserByAdminDto);
  }

  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.adminPanelService.deleteUser(id);
  }

  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Get('orders')
  async getAllOrders(@Query('page') page = 1, @Query('perPage') perPage = 10) {
    return await this.adminPanelService.getAllOrders(page, perPage);
  }

  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Put('orders/:orderId')
  async updateOrder(
    @Param('orderId') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.adminPanelService.updateOrder(id, updateOrderDto);
  }

  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Delete('orders/:orderId')
  async deleteOrder(@Param('orderId') id: number) {
    return await this.adminPanelService.deleteOrder(id);
  }

  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Post('tariffs')
  async createTariff(@Body() createTariffDto: CreateTariffDto) {
    return await this.adminPanelService.createTariff(createTariffDto);
  }

  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Get('tariffs')
  async getAllTariffs(@Query('page') page = 1, @Query('perPage') perPage = 10) {
    return await this.adminPanelService.getAllTariffs(page, perPage);
  }

  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Put('tariffs/:tariffId')
  async updateTariff(
    @Param('tariffId') id: number,
    @Body() updateTariffDto: UpdateTariffDto,
  ) {
    return await this.adminPanelService.updateTariff(id, updateTariffDto);
  }

  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Delete('tariffs/:tariffId')
  async deleteTariff(@Param('tariffId') id: number) {
    return await this.adminPanelService.deleteTariff(id);
  }

  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Get('complaints')
  getAllComplaints(@Query('page') page = 1, @Query('perPage') perPage = 10) {
    return this.adminPanelService.getAllComplaints(page, perPage);
  }

  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Delete('complaints/:id')
  deleteComplaint(@Param('id') id: string) {
    return this.adminPanelService.deleteComplaint(id);
  }

  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Get('drivers')
  getAllDrivers(@Query('page') page = 1, @Query('perPage') perPage = 10) {
    return this.adminPanelService.getAllDrivers(page, perPage);
  }
}
