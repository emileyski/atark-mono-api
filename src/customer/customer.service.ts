import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { Roles } from 'src/core/enums/roles.enum';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly userService: UserService,
  ) {}

  async create(userId: string): Promise<Customer> {
    const user = await this.userService.findOne(userId);

    const customer = this.customerRepository.create({
      id: userId,
      name: user.name,
    });

    await this.customerRepository.save(customer);
    await this.userService.setRole(userId, Roles.CUSTOMER);

    return customer;
  }

  async findAll(
    page = 1,
    perPage = 10,
  ): Promise<{
    data: Customer[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  }> {
    const [customers, total] = await this.customerRepository.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
    });

    const totalPages = Math.ceil(total / perPage);

    return {
      data: customers,
      total,
      page: +page,
      perPage: +perPage,
      totalPages: +totalPages,
    };
  }
}
