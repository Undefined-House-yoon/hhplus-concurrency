import { UserRepository } from '../../../application/ports/outbound/user.repository';
import { CreateUserDto } from '../../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../../application/dto/update-user.dto';
import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepositoryImpl
  extends Repository<User>
  implements UserRepository
{
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.create(createUserDto);
    return await this.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.find();
  }

  async getUserById(id: number): Promise<User> {
    return await this.findOneBy({ id: id });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    await this.update(id, updateUserDto);
  }
}
