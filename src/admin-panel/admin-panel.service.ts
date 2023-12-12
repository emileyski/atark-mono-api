import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UpdateUserByAdminDto } from './dto/update-user-by-admin.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';
import { OrderStatus } from 'src/orders/entities/order-status.entity';
import { UpdateOrderDto } from 'src/orders/dto/update-order.dto';
import { Tariff } from 'src/tariff/entities/tariff.entity';
import { UpdateTariffDto } from 'src/tariff/dto/update-tariff.dto';
import { CreateTariffDto } from 'src/tariff/dto/create-tariff.dto';
import { Complaint } from 'src/complaint/entities/complaint.entity';
import { Driver } from 'src/driver/entities/driver.entity';
@Injectable()
export class AdminPanelService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderStatus)
    private readonly orderStatusRepository: Repository<OrderStatus>,
    @InjectRepository(Tariff)
    private readonly tariffRepository: Repository<Tariff>,
    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}
  async getAllUsers(page = 1, perPage = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
    });

    const totalPages = Math.ceil(total / perPage);

    return {
      data: users.map((user) => {
        delete user.password;
        delete user.token;
        return user;
      }),
      total,
      page: +page,
      perPage: +perPage,
      totalPages: +totalPages,
    };
  }

  async updateUser(id: string, updateUserByAdminDto: UpdateUserByAdminDto) {
    const user = await this.userService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    this.userRepository.merge(user, updateUserByAdminDto);

    return await this.userRepository.save(user);
  }

  async deleteUser(id: string) {
    const deleteResult = await this.userRepository.delete(id);

    if (!deleteResult.affected) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return { message: `User with id ${id} deleted successfully` };
  }

  async getAllOrders(
    page = 1,
    perPage = 10,
  ): Promise<{
    data: Order[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  }> {
    const [orders, total] = await this.orderRepository.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
      relations: ['tariff', 'driver', 'customer', 'statuses'],
    });

    const totalPages = Math.ceil(total / perPage);

    return {
      data: orders,
      total,
      page: +page,
      perPage: +perPage,
      totalPages: +totalPages,
    };
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['tariff', 'driver', 'customer', 'statuses'],
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    this.orderRepository.merge(order, updateOrderDto);

    return await this.orderRepository.save(order);
  }

  async deleteOrder(id: number) {
    const deleteResult = await this.orderRepository.delete(id);

    if (!deleteResult.affected) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return { message: `Order with id ${id} deleted successfully` };
  }

  createTariff(createTariffDto: CreateTariffDto) {
    return this.tariffRepository.save(createTariffDto);
  }

  async getAllTariffs(page = 1, perPage = 10) {
    const [tariffs, total] = await this.tariffRepository.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
    });

    const totalPages = Math.ceil(total / perPage);

    return {
      data: tariffs,
      total,
      page: +page,
      perPage: +perPage,
      totalPages: +totalPages,
    };
  }

  async updateTariff(id: number, updateTariffDto: UpdateTariffDto) {
    const tariff = await this.tariffRepository.findOne({
      where: { id },
    });

    if (!tariff) {
      throw new NotFoundException(`Tariff with id ${id} not found`);
    }

    this.tariffRepository.merge(tariff, updateTariffDto);

    return await this.tariffRepository.save(tariff);
  }

  async deleteTariff(id: number) {
    const deleteResult = await this.tariffRepository.delete(id);

    if (!deleteResult.affected) {
      throw new NotFoundException(`Tariff with id ${id} not found`);
    }

    return { message: `Tariff with id ${id} deleted successfully` };
  }

  async getAllComplaints(page = 1, perPage = 10) {
    const [complaints, total] = await this.complaintRepository.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
      relations: ['order', 'order.customer', 'order.driver'],
    });

    const totalPages = Math.ceil(total / perPage);

    return {
      data: complaints,
      total,
      page: +page,
      perPage: +perPage,
      totalPages: +totalPages,
    };
  }

  async deleteComplaint(id: string) {
    const deleteResult = await this.complaintRepository.delete(id);

    if (!deleteResult.affected) {
      throw new NotFoundException(`Complaint with id ${id} not found`);
    }

    return { message: `Complaint with id ${id} deleted successfully` };
  }

  getAllDrivers(page = 1, perPage = 10) {
    return this.driverRepository.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
    });
  }
}
