import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AccessTokenGuard } from './core/guards/access-token.guard';
import { IsUUIDGuard } from './core/guards/is-uuid.guard';
import { ConfigModule } from '@nestjs/config';
import { DriverModule } from './driver/driver.module';
import { CustomerModule } from './customer/customer.module';
import { TariffModule } from './tariff/tariff.module';
import { WaypointsModule } from './waypoints/waypoints.module';
import { StripeModule } from 'nestjs-stripe';
import { PaymentsModule } from './payments/payments.module';
import { AdminPanelModule } from './admin-panel/admin-panel.module';
import Stripe from 'stripe';

const apiKey =
  'sk_test_51NIqpvG7sSsfaKMscC85DRYNmkQmH5aJGoFFsKbQvdhec8VN03yypn1QRcy0diFTz9r4yJoHaIhBp4lvmCXCmkSC00PJvazFHo'; //TODO: move to env
const apiVersion = '2023-10-16'; //TODO: move to env

export const getStripeInstance = async (): Promise<Stripe> => {
  return await loadStripe(apiKey, { apiVersion });
};

@Module({
  imports: [
    StripeModule.forRoot({ apiKey, apiVersion }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'orders_db',
      autoLoadEntities: true,
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    OrdersModule,
    UserModule,
    AuthModule,
    DriverModule,
    CustomerModule,
    TariffModule,
    WaypointsModule,
    PaymentsModule,
    AdminPanelModule,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AccessTokenGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: IsUUIDGuard,
    },
  ],
})
export class AppModule {}
function loadStripe(
  apiKey: any,
  arg1: { apiVersion: any },
): Stripe | PromiseLike<Stripe> {
  throw new Error('Function not implemented.');
}
