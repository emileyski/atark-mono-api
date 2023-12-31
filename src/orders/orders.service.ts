import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coordinates, Order } from './entities/order.entity';
import { In, Not, Repository } from 'typeorm';
import { OrderStatus } from './entities/order-status.entity';
import { OrderStatusTypes } from 'src/core/enums/order-status.enum';
import { Tariff } from 'src/tariff/entities/tariff.entity';
import { CreateComplaintDto } from 'src/complaint/dto/create-complaint.dto';
import { JwtPayload } from 'src/core/interfaces/jwt-payload.interface';
import { ComplaintService } from 'src/complaint/complaint.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderStatus)
    private readonly orderStatusRepository: Repository<OrderStatus>,
    @InjectRepository(Tariff)
    private readonly tariffRepository: Repository<Tariff>,
    private readonly complaintService: ComplaintService,
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

  async rejectOrderDelivery(id: number, customer_id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: {
        id,
        customer: { id: customer_id },
        currentStatus: OrderStatusTypes.DELIVERED,
      },
      relations: ['statuses'],
    });

    const orderStatus = this.orderStatusRepository.create({
      type: OrderStatusTypes.REJECTED,
      order: { id: order.id },
    });

    await this.orderStatusRepository.save(orderStatus);

    await this.ordersRepository.update(
      { id },
      { currentStatus: OrderStatusTypes.REJECTED },
    );

    return { ...order, statuses: [...order.statuses, orderStatus] };
  }

  async complainOrder(
    id: number,
    user: JwtPayload,
    createComplaintDto: CreateComplaintDto,
  ) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['driver'],
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (!order.driver) {
      throw new BadRequestException('Order is not assigned to driver');
    }

    const complaint = this.complaintService.create(
      id,
      createComplaintDto,
      user,
    );

    await this.createOrderStatus(id, OrderStatusTypes.COMPLAINED);
    order.currentStatus = OrderStatusTypes.COMPLAINED;

    await this.ordersRepository.save(order);

    return complaint;
  }

  async confirmOrderDelivery(id: number, customer_id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: {
        id,
        customer: { id: customer_id },
        currentStatus: OrderStatusTypes.DELIVERED,
      },
      relations: ['statuses'],
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const orderStatus = this.orderStatusRepository.create({
      type: OrderStatusTypes.CONFIRMED,
      order: { id: order.id },
    });
    await this.orderStatusRepository.save(orderStatus);

    await this.ordersRepository.update(
      { id },
      { currentStatus: OrderStatusTypes.CONFIRMED },
    );

    const completedStatus: OrderStatus | null =
      await this.checkIfIsCompleted(id);

    if (completedStatus) {
      order.currentStatus = OrderStatusTypes.COMPLETED;

      return {
        ...order,
        statuses: [...order.statuses, orderStatus, completedStatus],
      };
    }

    return { ...order, statuses: [...order.statuses, orderStatus] };
  }

  async findAllAsCustomer(customer_id: string): Promise<Order[]> {
    const orders = await this.ordersRepository.find({
      where: { customer: { id: customer_id } },
      relations: ['statuses'],
    });

    return orders;
  }

  async findAllAsDriver(driver_id: string): Promise<Order[]> {
    const orders = await this.ordersRepository.find({
      where: {
        driver: { id: driver_id },
        // currentStatus: OrderStatusTypes.COMPLETED,
      },
      relations: ['statuses'],
    });

    return orders;
  }

  async findAvailableOrders(): Promise<Order[]> {
    const orders = await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.statuses', 'status') // Join statuses relation
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
        'order.currentStatus',
      ])
      .addSelect([
        'status.id', // Add fields from the statuses relation
        'status.dateTime',
        'status.type',
      ])
      .getMany();

    return orders;
  }

  async cancelOrder(id: number, customer_id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: {
        id,
        customer: { id: customer_id },
        currentStatus: OrderStatusTypes.CREATED,
      },
      relations: ['statuses'],
    });

    if (!order) {
      throw new BadRequestException(
        'Order not found or not available for cancel',
      );
    }

    const orderStatus = this.orderStatusRepository.create({
      type: OrderStatusTypes.CANCELLED,
      order: { id: order.id },
    });

    await this.orderStatusRepository.save(orderStatus);

    await this.ordersRepository.update(
      { id },
      { currentStatus: OrderStatusTypes.CANCELLED },
    );

    return { ...order, statuses: [...order.statuses, orderStatus] };
  }

  //#region for driver

  async findCurrentOrder(
    driver_id: string,
    throwException = true,
  ): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: {
        driver: { id: driver_id },
        currentStatus: Not(OrderStatusTypes.COMPLETED),
      },
      relations: ['statuses', 'driver'],
    });

    if (!order && throwException) {
      throw new BadRequestException('You have no current order');
    }

    return order;
  }

  async assignOrder(id: number, driver_id: string): Promise<Order> {
    const currentOrder = await this.findCurrentOrder(driver_id, false);
    if (currentOrder) {
      throw new BadRequestException('You already have an order');
    }

    const order = await this.ordersRepository.findOne({
      where: { id, currentStatus: OrderStatusTypes.CREATED, driver: null },
      relations: ['statuses'],
    });

    if (!order) {
      throw new BadRequestException(
        'Order not found or not available for assign',
      );
    }

    await this.ordersRepository.update(
      { id },
      { driver: { id: driver_id }, currentStatus: OrderStatusTypes.ASSIGNED },
    );

    const orderStatus = this.orderStatusRepository.create({
      type: OrderStatusTypes.ASSIGNED,
      order: { id: order.id },
    });

    await this.orderStatusRepository.save(orderStatus);

    return { ...order, statuses: [...order.statuses, orderStatus] };
  }

  async pickupOrder(id: number, driver_id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: {
        id,
        currentStatus: OrderStatusTypes.ASSIGNED,
        driver: { id: driver_id },
      },
      relations: ['statuses', 'driver'],
    });

    if (!order) {
      throw new BadRequestException(
        'Order not found or not available for pickup',
      );
    }

    const orderStatus = this.orderStatusRepository.create({
      type: OrderStatusTypes.PICKED_UP,
      order: { id: order.id },
    });
    await this.orderStatusRepository.save(orderStatus);

    await this.ordersRepository.update(
      { id },
      { currentStatus: OrderStatusTypes.PICKED_UP },
    );

    return { ...order, statuses: [...order.statuses, orderStatus] };
  }

  //TODO: add position validation
  async deliverOrder(id: number, driver_id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: {
        id,
        driver: { id: driver_id },
        currentStatus: In([
          OrderStatusTypes.PICKED_UP,
          OrderStatusTypes.REJECTED,
        ]),
      },
      relations: ['statuses', 'driver'],
    });

    if (!order) {
      throw new BadRequestException(
        'Order not found or not available for deliver',
      );
    }

    const orderStatus = this.orderStatusRepository.create({
      type: OrderStatusTypes.DELIVERED,
      order: { id: order.id },
    });
    await this.orderStatusRepository.save(orderStatus);

    await this.ordersRepository.update(
      { id },
      { currentStatus: OrderStatusTypes.DELIVERED },
    );

    return { ...order, statuses: [...order.statuses, orderStatus] };
  }

  //#endregion

  async createOrderStatus(orderId: number, type: OrderStatusTypes) {
    const order = await this.findOne(orderId, { relations: ['statuses'] });

    const orderStatus = this.orderStatusRepository.create({
      type,
      order: { id: order.id },
    });

    await this.orderStatusRepository.save(orderStatus);

    return { ...order, statuses: [...order.statuses, orderStatus] };
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

  //метод для проверки, что заказ завершен
  async checkIfIsCompleted(id: number): Promise<OrderStatus | null> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['statuses'],
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const orderStatuses = order.statuses.map((status) => status.type);
    const isCompleted =
      orderStatuses.includes(OrderStatusTypes.CONFIRMED) &&
      orderStatuses.includes(OrderStatusTypes.PAID);

    if (isCompleted) {
      const newOrder = await this.createOrderStatus(
        id,
        OrderStatusTypes.COMPLETED,
      );
      await this.ordersRepository.update(
        { id },
        { currentStatus: OrderStatusTypes.COMPLETED },
      );

      return newOrder.statuses[newOrder.statuses.length - 1];
    }

    return null;
  }

  async changeOrderStatus(id: number, type: OrderStatusTypes) {
    const order = await this.findOne(id, { relations: ['statuses'] });

    order.currentStatus = type;

    await this.ordersRepository.save(order);

    return order;
  }

  //#region
  async estimatePrice(distance: number, tariffId: number): Promise<number> {
    const tariff = await this.tariffRepository.findOne({
      where: { id: tariffId },
    });

    if (!tariff) {
      throw new BadRequestException('Tariff not found');
    }

    return distance * tariff.value;
  }

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
