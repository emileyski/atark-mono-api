import { Module } from '@nestjs/common';
import { AdminPanelController } from './admin-panel.controller';
import { AdminPanelService } from './admin-panel.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';
import { OrderStatus } from 'src/orders/entities/order-status.entity';
import { Tariff } from 'src/tariff/entities/tariff.entity';
import { Complaint } from 'src/complaint/entities/complaint.entity';
import { Driver } from 'src/driver/entities/driver.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { TariffsController } from './tariffs/tariffs.controller';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      User,
      Order,
      OrderStatus,
      Tariff,
      Complaint,
      Driver,
      Customer,
    ]),
    AdminPanelModule,
  ],
  controllers: [AdminPanelController, TariffsController],
  providers: [AdminPanelService],
})
export class AdminPanelModule {}
