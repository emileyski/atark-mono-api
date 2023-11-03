import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'The cargo description',
    example: 'Cargo description',
  })
  @IsNotEmpty()
  @IsString()
  cargoDescription;

  @ApiProperty({
    description: 'The origin',
    example: 'Kharkiv, Myronosytska St, 12',
  })
  @IsNotEmpty()
  @IsString()
  origin;

  @ApiProperty({
    description: 'The destination',
    example: 'Kyiv, Saksahanskoho St, 126',
  })
  @IsNotEmpty()
  @IsString()
  destination;

  @ApiProperty({
    description: 'The weight',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  weight;

  @ApiProperty({
    description: 'The volume',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  volume;

  @ApiProperty({
    description: 'The tariff id',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  tariffId;

  @ApiProperty({
    description: 'The origin coordinates',
    example: { latitude: 50.004, longitude: 36.231 },
  })
  @IsNotEmpty()
  originCoordinates;

  @ApiProperty({
    description: 'The destination coordinates',
    example: { latitude: 50.27, longitude: 30.31 },
  })
  @IsNotEmpty()
  destinationCoordinates;
}
