import { ComplainantsTypes } from 'src/core/enums/complainants-types.enum';
import { ComplaintStatusTypes } from 'src/core/enums/complaint-status.enum';
import { ComplaintTypes } from 'src/core/enums/complaint-types.enum';
import { Order } from 'src/orders/entities/order.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Complaint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.complaints)
  order: Order;

  @Column()
  description: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ type: 'enum', enum: ComplaintTypes, default: ComplaintTypes.OTHER })
  type: ComplaintTypes;

  @Column({
    type: 'enum',
    enum: ComplaintStatusTypes,
    default: ComplaintStatusTypes.SUBMITTED,
  })
  status: ComplaintStatusTypes;

  @Column({
    type: 'enum',
    enum: ComplainantsTypes,
    default: ComplainantsTypes.CUSTOMER,
  })
  complainant: ComplainantsTypes;

  @Column({ nullable: true })
  verdict?: string;
}
