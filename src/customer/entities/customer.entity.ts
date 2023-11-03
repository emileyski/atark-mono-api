// customer.entity.ts
import { Order } from 'src/orders/entities/order.entity';
import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryColumn()
  id: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @OneToMany((type) => Order, (order) => order.customer)
  orders: Order[];
}
