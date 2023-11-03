import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coordinates, Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from './entities/order-status.entity';
import { OrderStatusTypes } from 'src/core/enums/order-status.enum';
import { Tariff } from 'src/tariff/entities/tariff.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderStatus)
    private readonly orderStatusRepository: Repository<OrderStatus>,
    @InjectRepository(Tariff)
    private readonly tariffRepository: Repository<Tariff>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    const tariff = await this.tariffRepository.findOne({
      where: { id: createOrderDto.tariffId },
    });

    if (!tariff) {
      throw new BadRequestException('Tariff not found');
    }

    const distanceInKm = parseFloat(
      this.calculateDistance(
        createOrderDto.originCoordinates,
        createOrderDto.destinationCoordinates,
      ).toFixed(2),
    );

    console.log(distanceInKm * tariff.value);

    const price = distanceInKm * tariff.value;

    const order = this.ordersRepository.create({
      ...createOrderDto,
      price,
      customer: { id: userId },
      tariff: { id: createOrderDto.tariffId },
    });

    await this.ordersRepository.save(order);

    const orderStatus = this.orderStatusRepository.create({
      type: OrderStatusTypes.CREATED,
      order: { id: order.id },
    });

    await this.orderStatusRepository.save(orderStatus);

    return { ...order, statuses: [orderStatus] };
  }

  async findAvailableOrders(): Promise<Order[]> {
    const orders = await this.ordersRepository
      .createQueryBuilder('order')

      .where('order.currentStatus = :status', {
        status: OrderStatusTypes.CREATED,
      })
      .select([
        'order.id',
        'order.cargoDescription',
        'order.origin',
        'order.destination',
        'order.weight',
        'order.volume',
        'order.price',
        'order.originCoordinates',
        'order.destinationCoordinates',
      ])
      .getMany();

    return orders;
  }

  async assignOrder(id: number, driver_id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['statuses'],
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.currentStatus !== OrderStatusTypes.CREATED) {
      throw new BadRequestException('Order is not available');
    }

    await this.ordersRepository.update({ id }, { driver: { id: driver_id } });

    const orderStatus = this.orderStatusRepository.create({
      type: OrderStatusTypes.ASSIGNED,
      order: { id: order.id },
    });

    await this.orderStatusRepository.save(orderStatus);

    return { ...order, statuses: [...order.statuses, orderStatus] };
  }

  findAll() {
    return `This action returns all orders`;
  }

  async findOneByIdAndCustomerId(
    id: number,
    customerId: string,
    withWaypoints?,
  ) {
    const relations =
      withWaypoints === 'true' ? ['customer', 'waypoints'] : ['customer'];

    const order = await this.findOne(id, { relations });

    if (order.customer.id !== customerId) {
      throw new BadRequestException('Order not found');
    }

    return order;
  }

  async findOne(id: number, options?): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      ...options,
    });
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    return order;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  //#region
  calculateDistance(
    originCoordinates: Coordinates,
    destinationCoordinates: Coordinates,
  ): number {
    // Константа радиуса Земли в километрах
    const earthRadius = 6371;

    // Преобразование градусов в радианы
    const toRadians = (angle) => angle * (Math.PI / 180);

    // Извлечение координат
    const { latitude: lat1, longitude: lon1 } = originCoordinates;
    const { latitude: lat2, longitude: lon2 } = destinationCoordinates;

    // Разницы в координатах
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    // Вычисление расстояния по формуле гаверсинусов
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Расстояние в километрах
    const distanceInKm = earthRadius * c;

    const result = distanceInKm;

    return result;
  }
  //#endregion
}
