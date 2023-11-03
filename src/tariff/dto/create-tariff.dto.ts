import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTariffDto {
  @ApiProperty({
    description: 'The name',
    example: 'Tariff name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description',
    example: 'Tariff description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The value',
    example: 30,
  })
  @IsNotEmpty()
  @IsNumber()
  value: number;
}
