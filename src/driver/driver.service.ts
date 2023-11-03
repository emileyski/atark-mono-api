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
    const driver = this.driverRepository.create({
      ...createDriverDto,
      id: userId,
    });

    await this.userService.setRole(userId, Roles.DRIVER);

    return this.driverRepository.save(driver);
  }

  findAll() {
    return `This action returns all driver`;
  }

  findOne(id: number) {
    return `This action returns a #${id} driver`;
  }

  update(id: number, updateDriverDto: UpdateDriverDto) {
    return `This action updates a #${id} driver`;
  }

  remove(id: number) {
    return `This action removes a #${id} driver`;
  }
}
