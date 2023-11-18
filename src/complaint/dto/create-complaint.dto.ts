import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ComplaintTypes } from 'src/core/enums/complaint-types.enum';

export class CreateComplaintDto {
  @ApiProperty({
    description: 'Complaint description',
    type: String,
    example: 'I have a problem with my order',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Complaint type',
    type: 'enum',
    example: ComplaintTypes.OTHER,
  })
  @IsOptional()
  @IsString()
  type: ComplaintTypes;
}
