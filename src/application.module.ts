import { Module } from '@nestjs/common';
import { ApplicationServiceImpl } from './application/services/application.service.impl';
import { ApplicationController } from './infrastructure/adapters/in/application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './domain/entities/application.entity';
import { ApplicationService } from './application/ports/inbound/application.service';
import { ApplicationRepository } from './application/ports/outbound/application.repository';
import { ApplicationRepositoryImpl } from './infrastructure/adapters/out/application.repository.impl';
import { Lecture } from './domain/entities/lecture.entity';
import { User } from './domain/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Application, Lecture, User])],
  controllers: [ApplicationController],
  providers: [
    { provide: ApplicationService, useClass: ApplicationServiceImpl },
    { provide: ApplicationRepository, useClass: ApplicationRepositoryImpl },
  ],
  exports: [ApplicationService, ApplicationRepository],
})
export class ApplicationModule {}
