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

@Module({
  imports: [
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
