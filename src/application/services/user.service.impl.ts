import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../../domain/entities/user.entity';
import { UserService } from '../ports/inbound/user.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
class UserServiceImpl implements UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  getUserById(id: number): Promise<User> {
    throw new Error('Method not implemented.');
  }

  updateUser(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    throw new Error('Method not implemented.');
  }

  deleteUser(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getAllUsers(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
}
