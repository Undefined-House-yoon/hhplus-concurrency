import { Module } from '@nestjs/common';
import { ApplicationServiceImpl } from './application/services/application.service.impl';
import { ApplicationController } from './infrastructure/adapters/in/application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './domain/entities/application.entity';
import { ApplicationService } from './application/ports/inbound/application.service';

@Module({
  imports: [TypeOrmModule.forFeature([Application])],
  controllers: [ApplicationController],
  providers: [ApplicationServiceImpl],
})
export class ApplicationModule {}
