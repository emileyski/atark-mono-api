import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Role } from 'src/core/decorators/role.decorator';
import { Roles } from 'src/core/enums/roles.enum';
import { UserId } from 'src/core/decorators/user-id.decorator';
import { Public } from 'src/core/decorators/public.decorator';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Role(Roles.CUSTOMER)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @UserId() userId: string) {
    return this.ordersService.create(createOrderDto, userId);
  }

  @Public()
  @Get('available')
  findAvailableOrders() {
    return this.ordersService.findAvailableOrders();
  }

  @Role(Roles.DRIVER)
  @Post('assign/:orderId')
  assignOrder(@Param('orderId') orderId: number, @UserId() userId: string) {
    return this.ordersService.assignOrder(orderId, userId);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Role(Roles.CUSTOMER)
  @Get(':orderId')
  findOne(
    @Param('orderId') orderId: number,
    @UserId() userId: string,
    @Query('withWaypoints') withWaypoints?: boolean,
  ) {
    return this.ordersService.findOneByIdAndCustomerId(
      +orderId,
      userId,
      withWaypoints,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
