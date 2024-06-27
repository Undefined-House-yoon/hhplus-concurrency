import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../../domain/entities/user.entity';
import { UserService } from '../ports/inbound/user.service';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../ports/outbound/user.repository';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.createUser(createUserDto);
  }

  async getUserById(id: number): Promise<User> {
    return await this.userRepository.getUserById(id);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    return await this.userRepository.updateUser(id, updateUserDto);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.deleteUser(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }
}
