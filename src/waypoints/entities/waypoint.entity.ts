import { Coordinates, Order } from 'src/orders/entities/order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Waypoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: false })
  coordinates: Coordinates;

  @ManyToOne(() => Order, (order) => order.waypoints, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
