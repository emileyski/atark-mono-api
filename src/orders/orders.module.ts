// orders.module.ts
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderStatus } from './entities/order-status.entity';
import { Tariff } from 'src/tariff/entities/tariff.entity';
import { ComplaintModule } from 'src/complaint/complaint.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderStatus, Tariff]),
    ComplaintModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
