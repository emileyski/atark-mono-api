import { Injectable } from '@nestjs/common';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { JwtPayload } from 'src/core/interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Complaint } from './entities/complaint.entity';
import { Repository } from 'typeorm';
import { ComplainantsTypes } from 'src/core/enums/complainants-types.enum';
import { ComplaintStatusTypes } from 'src/core/enums/complaint-status.enum';
import { MakeVerdictDto } from './dto/make-verdict.dto';

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

  findAllMyComplaints(userId: string) {
    return this.complaintRepository.find({
      where: [
        {
          order: { customer: { id: userId } },
          complainant: ComplainantsTypes.CUSTOMER,
        },
        {
          order: { driver: { id: userId } },
          complainant: ComplainantsTypes.DRIVER,
        },
      ],
      relations: ['order', 'order.customer', 'order.driver'],
    });
  }

  findOne(id: string) {
    return this.complaintRepository.findOne({
      where: { id },
      relations: ['order', 'order.customer', 'order.driver'],
    });
  }

  async makeVerdict(makeVerdictDto: MakeVerdictDto) {
    const { id, verdict, status } = makeVerdictDto;
    const complaint = await this.complaintRepository.findOne({
      where: { id },
      relations: ['order', 'order.customer', 'order.driver'],
    });

    if (!complaint) {
      throw new Error('Complaint not found');
    }

    complaint.verdict = verdict;
    complaint.status = status;

    await this.complaintRepository.save(complaint);

    return complaint;
  }

  async changeStatus(id: string, status: ComplaintStatusTypes) {
    const complaint = await this.complaintRepository.findOne({
      where: { id },
    });

    if (!complaint) {
      throw new Error('Complaint not found');
    }

    complaint.status = status;

    await this.complaintRepository.save(complaint);

    return complaint;
  }

  update(id: number, updateComplaintDto: UpdateComplaintDto) {
    return `This action updates a #${id} complaint`;
  }

  findAll() {
    return this.complaintRepository.find({
      relations: ['order', 'order.customer', 'order.driver'],
    });
  }

  async remove(id: string, userId: string) {
    const complaint = await this.complaintRepository.findOne({
      where: [
        {
          id,
          order: { customer: { id: userId } },
          complainant: ComplainantsTypes.CUSTOMER,
        },
        {
          id,
          order: { driver: { id: userId } },
          complainant: ComplainantsTypes.DRIVER,
        },
      ],
      relations: ['order', 'order.customer', 'order.driver'],
    });

    if (!complaint) {
      throw new Error('Complaint not found or you are not the owner');
    }

    await this.complaintRepository.remove(complaint);

    return { message: `Complaint #${id} removed` };
  }
}
