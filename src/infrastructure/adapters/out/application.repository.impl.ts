import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Application } from '../../../domain/entities/application.entity';
import { ApplicationRepository } from '../../../application/ports/outbound/application.repository';

@Injectable()
export class ApplicationRepositoryImpl
  extends Repository<Application>
  implements ApplicationRepository
{
  constructor(private dataSource: DataSource) {
    super(Application, dataSource.createEntityManager());
  }

  async apply(application: Application): Promise<Application> {
    return this.dataSource.manager.save(application);
  }

  async hasUserAppliedForLecture(
    userId: number,
    lectureId: number,
  ): Promise<boolean> {
    const application = await this.findOne({
      where: {
        user: { id: userId },
        lecture: { id: lectureId },
      },
    });
    return !!application;
  }
}
