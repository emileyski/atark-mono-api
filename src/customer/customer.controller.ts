import { Controller, Get, Post, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from 'src/core/decorators/role.decorator';
import { Roles } from 'src/core/enums/roles.enum';
import { UserId } from 'src/core/decorators/user-id.decorator';

@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden' })
@ApiTags('customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiBearerAuth()
  @Role(Roles.USER)
  @Post()
  create(@UserId() userId: string) {
    return this.customerService.create(userId);
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('perPage') perPage = 10) {
    return this.customerService.findAll(page, perPage);
  }
}
