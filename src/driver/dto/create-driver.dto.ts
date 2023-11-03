import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class CreateDriverDto {
  @ApiProperty({
    description: 'The license',
    example: 'AB1234567',
  })
  @IsString()
  @Matches(/^[A-Za-z]{2}\d{7}$/, { message: 'Invalid driver license format' })
  driverLicense: string;
}
