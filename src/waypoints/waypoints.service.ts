import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateWaypointDto } from './dto/create-waypoint.dto';
import { Waypoint } from './entities/waypoint.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class WaypointsService {
  constructor(
    @InjectRepository(Waypoint)
    private readonly waypointsRepository: Repository<Waypoint>,
    private readonly ordersService: OrdersService,
  ) {}

  async create(
    createWaypointDto: CreateWaypointDto,
    orderId: number,
    userId: string,
  ) {
    const order = await this.ordersService.findOne(orderId, {
      relations: ['driver'],
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.driver.id !== userId) {
      throw new ForbiddenException('You are not assigned to this order');
    }

    const waypoint = this.waypointsRepository.create({
      ...createWaypointDto,
      order: { id: orderId },
    });

    return this.waypointsRepository.save(waypoint);
  }
}
