import { Injectable } from '@nestjs/common';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tariff } from './entities/tariff.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TariffService {
  constructor(
    @InjectRepository(Tariff)
    private readonly tariffRepository: Repository<Tariff>,
  ) {}

  create(createTariffDto: CreateTariffDto) {
    return this.tariffRepository.save(createTariffDto);
  }

  findAll() {
    return this.tariffRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} tariff`;
  }

  update(id: number, updateTariffDto: UpdateTariffDto) {
    return `This action updates a #${id} tariff`;
  }

  remove(id: number) {
    return `This action removes a #${id} tariff`;
  }
}
