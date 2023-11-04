import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Role } from 'src/core/decorators/role.decorator';
import { Roles } from 'src/core/enums/roles.enum';
import { UserId } from 'src/core/decorators/user-id.decorator';
import { Public } from 'src/core/decorators/public.decorator';
import { AccessTokenGuard } from 'src/core/guards/access-token.guard';

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

  //TODO: refactor this
  @UseGuards(AccessTokenGuard)
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
}
