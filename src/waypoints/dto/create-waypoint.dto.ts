import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Coordinates } from 'src/orders/entities/order.entity';

export class CreateWaypointDto {
  @ApiProperty({
    description: 'The description of the waypoint',
    example: 'Pick up the package',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The coordinates of the waypoint',
    example: { lat: 49.35, lng: 34.33 },
  })
  coordinates: Coordinates;
}
