import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { OrdersModule } from 'src/orders/orders.module';

//TODO: implement stripe connect payments
@Module({
  imports: [OrdersModule],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
