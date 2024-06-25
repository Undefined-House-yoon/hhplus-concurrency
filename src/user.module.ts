import { Module } from '@nestjs/common';
import { UserService } from './application/ports/inbound/user.service';
import { UserController } from './infrastructure/adapters/in/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from './domain/entities/lecture.entity';
import { User } from './domain/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],

  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
