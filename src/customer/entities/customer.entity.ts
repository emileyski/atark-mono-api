// customer.entity.ts
import { Order } from 'src/orders/entities/order.entity';
import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryColumn()
  id: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column()
  name: string;

  @OneToMany((type) => Order, (order) => order.customer, {
    onDelete: 'CASCADE',
  })
  orders: Order[];
}
