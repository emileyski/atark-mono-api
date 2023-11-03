import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import { OrderStatusTypes } from 'src/core/enums/order-status.enum';
import { OrdersService } from 'src/orders/orders.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly ordersService: OrdersService,
  ) {}

  async createPayment(orderId: number, userId: string) {
    const order = await this.ordersService.findOne(orderId, {
      relations: ['customer'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.customer.id !== userId) {
      throw new ForbiddenException('You are not allowed to pay for this order');
    }

    return await this.ordersService.createOrderStatus(
      orderId,
      OrderStatusTypes.PAID,
    );
  }
}
