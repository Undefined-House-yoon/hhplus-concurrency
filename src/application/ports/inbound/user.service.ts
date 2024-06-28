import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../../../domain/entities/user.entity';
import { UpdateUserDto } from '../../dto/update-user.dto';

export abstract class UserService {
  abstract createUser(createUserDto: CreateUserDto): Promise<User>;

  abstract getUserById(id: number): Promise<User>;

  abstract updateUser(id: number, updateUserDto: UpdateUserDto): Promise<void>;

  abstract deleteUser(id: number): Promise<void>;

  abstract getAllUsers(): Promise<User[]>;
}
