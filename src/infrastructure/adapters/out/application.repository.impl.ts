import { CreateApplicationDto } from '../../../application/dto/create-application.dto';
import { UpdateApplicationDto } from '../../../application/dto/update-application.dto';
import { ApplicationRepository } from '../../../application/ports/outbound/application.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from '../../../domain/entities/application.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApplicationRepositoryImpl implements ApplicationRepository {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}
  async create(createApplicationDto: CreateApplicationDto): Promise<void> {
    const application = this.applicationRepository.create(createApplicationDto);
    await this.applicationRepository.save(application);
  }

  async findAll(): Promise<Application[]> {
    return this.applicationRepository.find();
  }

  async findOne(id: number): Promise<Application> {
    return this.applicationRepository.findOne({ where: { id: id } });
  }

  async remove(id: number): Promise<void> {
    await this.applicationRepository.delete(id);
  }

  async update(
    id: number,
    updateApplicationDto: UpdateApplicationDto,
  ): Promise<void> {
    await this.applicationRepository.update(id, updateApplicationDto);
  }
}
