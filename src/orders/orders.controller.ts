import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
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

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Role(Roles.CUSTOMER)
  @Post(':orderId/cancel')
  cancelOrder(@Param('orderId') orderId: number, @UserId() userId: string) {
    return this.ordersService.cancelOrder(orderId, userId);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Role(Roles.CUSTOMER)
  @Post(':orderId/confirm-delivery')
  confirmOrderDelivery(
    @Param('orderId') orderId: number,
    @UserId() userId: string,
  ) {
    return this.ordersService.confirmOrderDelivery(orderId, userId);
  }

  @Public()
  @Get('available')
  findAvailableOrders() {
    return this.ordersService.findAvailableOrders();
  }

  @Public()
  @Get('estimated-price')
  estimatePrice(
    @Query('distance') distance: number,
    @Query('tariffId') tariffId: number,
  ) {
    return this.ordersService.estimatePrice(distance, tariffId);
  }

  @Role(Roles.CUSTOMER)
  @Post(':orderId/reject')
  rejectOrder(@Param('orderId') orderId: number, @UserId() userId: string) {
    return this.ordersService.rejectOrderDelivery(orderId, userId);
  }

  //#region Driver actions
  @Role(Roles.DRIVER)
  @Post(':orderId/assign')
  assignOrder(@Param('orderId') orderId: number, @UserId() userId: string) {
    return this.ordersService.assignOrder(orderId, userId);
  }

  @Role(Roles.DRIVER)
  @Post(':orderId/pickup')
  pickupOrder(@Param('orderId') orderId: number, @UserId() userId: string) {
    return this.ordersService.pickupOrder(orderId, userId);
  }

  @Role(Roles.DRIVER)
  @Post(':orderId/deliver')
  deliverOrder(@Param('orderId') orderId: number, @UserId() userId: string) {
    return this.ordersService.deliverOrder(orderId, userId);
  }
  //#endregion

  @Role(Roles.CUSTOMER)
  @Get('as-customer')
  findAllAsCustomer(@UserId() userId: string) {
    return this.ordersService.findAllAsCustomer(userId);
  }

  @Role(Roles.DRIVER)
  @Get('as-driver')
  findAllAsDriver(@UserId() userId: string) {
    return this.ordersService.findAllAsDriver(userId);
  }

  @Role(Roles.CUSTOMER)
  @Get(':orderId/as-customer')
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

  @Role(Roles.DRIVER)
  @Get('current')
  findCurrentOrder(@UserId() userId: string) {
    return this.ordersService.findCurrentOrder(userId);
  }
}
