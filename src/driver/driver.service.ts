import { Injectable } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './entities/driver.entity';
import { UserService } from 'src/user/user.service';
import { Roles } from 'src/core/enums/roles.enum';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    private readonly userService: UserService,
  ) {}

  async create(createDriverDto: CreateDriverDto, userId: string) {
    const user = await this.userService.findOne(userId);

    const driver = this.driverRepository.create({
      name: user.name,
      ...createDriverDto,
      id: userId,
    });

    await this.userService.setRole(userId, Roles.DRIVER);

    return this.driverRepository.save(driver);
  }

  async findAll(
    page = 1,
    perPage = 10,
  ): Promise<{
    data: Driver[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  }> {
    const [drivers, total] = await this.driverRepository.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
    });

    const totalPages = Math.ceil(total / perPage);

    return {
      data: drivers,
      total,
      page: +page,
      perPage: +perPage,
      totalPages: +totalPages,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} driver`;
  }
}
