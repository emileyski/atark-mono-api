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
import { CreateComplaintDto } from 'src/complaint/dto/create-complaint.dto';
import { User } from 'src/core/decorators/user.decorator';
import { JwtPayload } from 'src/core/interfaces/jwt-payload.interface';

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

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AccessTokenGuard)
  @Post(':orderId/complain')
  complainOrder(
    @Param('orderId') orderId: number,
    @Body() createComplaintDto: CreateComplaintDto,
    @User() user: JwtPayload,
  ) {
    return this.ordersService.complainOrder(orderId, user, createComplaintDto);
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

  @UseGuards(AccessTokenGuard)
  @Role(Roles.CUSTOMER)
  @Post(':orderId/reject')
  rejectOrder(@Param('orderId') orderId: number, @UserId() userId: string) {
    return this.ordersService.rejectOrderDelivery(orderId, userId);
  }

  //#region Driver actions
  @UseGuards(AccessTokenGuard)
  @Role(Roles.DRIVER)
  @Post(':orderId/assign')
  assignOrder(@Param('orderId') orderId: number, @UserId() userId: string) {
    return this.ordersService.assignOrder(orderId, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Role(Roles.DRIVER)
  @Post(':orderId/pickup')
  pickupOrder(@Param('orderId') orderId: number, @UserId() userId: string) {
    return this.ordersService.pickupOrder(orderId, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Role(Roles.DRIVER)
  @Post(':orderId/deliver')
  deliverOrder(@Param('orderId') orderId: number, @UserId() userId: string) {
    return this.ordersService.deliverOrder(orderId, userId);
  }
  //#endregion

  @UseGuards(AccessTokenGuard)
  @Role(Roles.CUSTOMER)
  @Get('as-customer')
  findAllAsCustomer(@UserId() userId: string) {
    return this.ordersService.findAllAsCustomer(userId);
  }

  @UseGuards(AccessTokenGuard)
  @Role(Roles.DRIVER)
  @Get('as-driver')
  findAllAsDriver(@UserId() userId: string) {
    return this.ordersService.findAllAsDriver(userId);
  }

  @UseGuards(AccessTokenGuard)
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

  @UseGuards(AccessTokenGuard)
  @Role(Roles.DRIVER)
  @Get('current')
  findCurrentOrder(@UserId() userId: string) {
    return this.ordersService.findCurrentOrder(userId);
  }
}
