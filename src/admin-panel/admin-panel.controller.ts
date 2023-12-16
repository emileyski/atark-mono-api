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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Post('users')
  async createUser(@Body() createUserDto) {
    return await this.userService.create(createUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Get('users')
  async getAllUsers(@Query('page') page = 1, @Query('perPage') perPage = 10) {
    return await this.adminPanelService.getAllUsers(page, perPage);
  }

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Put('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserByAdminDto: UpdateUserByAdminDto,
  ) {
    return await this.adminPanelService.updateUser(id, updateUserByAdminDto);
  }

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.adminPanelService.deleteUser(id);
  }

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Get('orders')
  async getAllOrders(@Query('page') page = 1, @Query('perPage') perPage = 10) {
    return await this.adminPanelService.getAllOrders(page, perPage);
  }

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Put('orders/:orderId')
  async updateOrder(
    @Param('orderId') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.adminPanelService.updateOrder(id, updateOrderDto);
  }

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Delete('orders/:orderId')
  async deleteOrder(@Param('orderId') id: number) {
    return await this.adminPanelService.deleteOrder(id);
  }

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Post('complaints')
  createComplaint(@Body() createComplaintDto) {
    // return this.adminPanelService.createComplaint(createComplaintDto);
    return;
  }

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Get('complaints')
  getAllComplaints(@Query('page') page = 1, @Query('perPage') perPage = 10) {
    return this.adminPanelService.getAllComplaints(page, perPage);
  }

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Delete('complaints/:id')
  deleteComplaint(@Param('id') id: string) {
    return this.adminPanelService.deleteComplaint(id);
  }

  @ApiBearerAuth()
  @UseGuards(RoleGuard)
  @Role(Roles.ADMIN)
  @Get('drivers')
  getAllDrivers(@Query('page') page = 1, @Query('perPage') perPage = 10) {
    return this.adminPanelService.getAllDrivers(page, perPage);
  }
}
