// order.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { OrderStatus } from './order-status.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Driver } from 'src/driver/entities/driver.entity';
import { Tariff } from 'src/tariff/entities/tariff.entity';
import { OrderStatusTypes } from 'src/core/enums/order-status.enum';
import { Waypoint } from 'src/waypoints/entities/waypoint.entity';
import { Complaint } from 'src/complaint/entities/complaint.entity';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cargoDescription: string;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  weight: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  volume: number;

  @ManyToOne((type) => Customer, (customer) => customer.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne((type) => Driver, (driver) => driver.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @OneToMany((type) => OrderStatus, (orderStatus) => orderStatus.order, {
    onDelete: 'CASCADE',
  })
  statuses: OrderStatus[];

  @Column({ default: OrderStatusTypes.CREATED })
  currentStatus: OrderStatusTypes;

  @ManyToOne(() => Tariff)
  @JoinColumn({ name: 'tariff_id' })
  tariff: Tariff;

  @OneToMany(() => Waypoint, (waypoint) => waypoint.order, {
    onDelete: 'CASCADE',
  })
  waypoints: Waypoint[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'jsonb', nullable: false })
  originCoordinates: Coordinates;

  @Column({ type: 'jsonb', nullable: false })
  destinationCoordinates: Coordinates;

  @OneToMany(() => Complaint, (complaint) => complaint.order)
  complaints: Complaint[];
}
