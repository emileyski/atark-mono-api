import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Roles } from 'src/core/enums/roles.enum';

export class UpdateUserByAdminDto {
  @ApiProperty({
    type: String,
    description: 'User name',
    required: false,
    example: 'John Doe',
  })
  @IsString()
  name?: string;

  @ApiProperty({
    type: String,
    description: 'User email',
    required: false,
    example: 'example@example.com',
  })
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'The birth date of the user',
    example: '2000-01-01',
    required: false,
  })
  @IsString()
  birthDate?: Date;

  @ApiProperty({
    description: 'The role of the user',
    example: Roles.DRIVER,
    required: false,
  })
  @IsEnum(Roles)
  role?: Roles;
}
