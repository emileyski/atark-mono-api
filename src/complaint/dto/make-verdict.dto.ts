import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ComplainantsTypes } from 'src/core/enums/complainants-types.enum';
import { ComplaintStatusTypes } from 'src/core/enums/complaint-status.enum';
import { OrderStatusTypes } from 'src/core/enums/order-status.enum';

export class MakeVerdictDto {
  @ApiProperty({
    description: 'Verdict',
    type: String,
    default: 'Verdict',
  })
  @IsNotEmpty()
  @IsString()
  verdict: string;

  @ApiProperty({
    description: 'Status',
    enum: ComplaintStatusTypes,
    default: ComplaintStatusTypes.IN_PROGRESS,
  })
  @IsNotEmpty()
  @IsString()
  status: ComplaintStatusTypes;

  @ApiProperty({
    description: 'Order status',
    enum: OrderStatusTypes,
    required: false,
  })
  @IsString()
  orderStatus?: OrderStatusTypes;

  @ApiProperty({
    description: 'Complaint id',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}
