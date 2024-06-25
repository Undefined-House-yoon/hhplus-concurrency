import { CreateApplicationDto } from '../../dto/create-application.dto';
import { UpdateApplicationDto } from '../../dto/update-application.dto';
import { Application } from '../../../domain/entities/application.entity';

export abstract class ApplicationRepository {
  abstract create(createLectureDto: CreateApplicationDto): Promise<void>;

  abstract findAll(): Promise<Application[]>;

  abstract findOne(id: number): Promise<Application>;

  abstract update(
    id: number,
    updateLectureDto: UpdateApplicationDto,
  ): Promise<void>;

  abstract remove(id: number): Promise<void>;
}
