import { Controller, Param, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Role } from 'src/core/decorators/role.decorator';
import { Roles } from 'src/core/enums/roles.enum';
import { UserId } from 'src/core/decorators/user-id.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Role(Roles.CUSTOMER)
  @Post(':orderId')
  createPayment(@Param('orderId') orderId: number, @UserId() userId: string) {
    return this.paymentsService.createPayment(orderId, userId);
  }
}
