import { Module } from '@nestjs/common';
import { UserService } from './application/ports/inbound/user.service';
import { UserController } from './infrastructure/adapters/in/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { UserServiceImpl } from './application/services/user.service.impl';
import { UserRepository } from './application/ports/outbound/user.repository';
import { UserRepositoryImpl } from './infrastructure/adapters/out/user.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    { provide: UserService, useClass: UserServiceImpl },
    { provide: UserRepository, useClass: UserRepositoryImpl },
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}
