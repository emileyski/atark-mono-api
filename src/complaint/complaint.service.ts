import { Injectable } from '@nestjs/common';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { JwtPayload } from 'src/core/interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Complaint } from './entities/complaint.entity';
import { Repository } from 'typeorm';
import { ComplainantsTypes } from 'src/core/enums/complainants-types.enum';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
  ) {}

  async create(
    order_id: number,
    createComplaintDto: CreateComplaintDto,
    user: JwtPayload,
  ) {
    const complainant =
      user.role === 'customer'
        ? ComplainantsTypes.CUSTOMER
        : ComplainantsTypes.DRIVER;

    const complaint = this.complaintRepository.create({
      ...createComplaintDto,
      complainant,
      order: { id: order_id },
    });

    await this.complaintRepository.save(complaint);

    return complaint;
  }

  findAll() {
    return this.complaintRepository.find({
      relations: ['order', 'order.customer', 'order.driver'],
    });
  }

  findOne(id: string) {
    return this.complaintRepository.findOne({
      where: { id },
      relations: ['order', 'order.customer', 'order.driver'],
    });
  }

  update(id: number, updateComplaintDto: UpdateComplaintDto) {
    return `This action updates a #${id} complaint`;
  }

  remove(id: number) {
    return `This action removes a #${id} complaint`;
  }
}
