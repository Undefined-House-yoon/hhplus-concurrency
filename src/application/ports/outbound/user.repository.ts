import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { User } from '../../../domain/entities/user.entity';

export abstract class UserRepository {
  abstract createUser(createUserDto: CreateUserDto): Promise<User>;

  abstract getAllUsers(): Promise<User[]>;

  abstract getUserById(id: number): Promise<User>;

  abstract updateUser(id: number, updateUserDto: UpdateUserDto): Promise<void>;

  abstract deleteUser(id: number): Promise<void>;
}
