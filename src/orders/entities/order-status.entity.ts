// order-status.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { OrderStatusTypes } from 'src/core/enums/order-status.enum';

@Entity()
export class OrderStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  dateTime: Date;

  @Column({
    type: 'enum',
    enum: OrderStatusTypes,
    default: OrderStatusTypes.CREATED,
  })
  type: OrderStatusTypes;

  @ManyToOne((type) => Order, (order) => order.statuses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
