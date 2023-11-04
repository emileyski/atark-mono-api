// driver.entity.ts
import { Order } from 'src/orders/entities/order.entity';
import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Driver {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column()
  driverLicense: string;

  @OneToMany((type) => Order, (order) => order.driver, { onDelete: 'CASCADE' })
  orders: Order[];
}
