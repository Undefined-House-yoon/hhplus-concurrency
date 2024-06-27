import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../ports/inbound/user.service';
import { UserServiceImpl } from '../user.service.impl';
import { UserRepository } from '../../ports/outbound/user.repository';
import { UserRepositoryImpl } from '../../../infrastructure/adapters/out/user.repository.impl';
import { testTypeormConfig } from '../../../infrastructure/orm/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../domain/entities/user.entity';
import { Lecture } from '../../../domain/entities/lecture.entity';
import { Application } from '../../../domain/entities/application.entity';
import { DataSource } from 'typeorm';

/**
 * user crud
 * */

describe('UserService', () => {
  let service: UserService;
  // let repository: UserRepository;
  let dataSource: DataSource;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({ ...testTypeormConfig }),
        TypeOrmModule.forFeature([User, Application, Lecture]),
      ],
      providers: [
        { provide: UserService, useClass: UserServiceImpl },
        { provide: UserRepository, useClass: UserRepositoryImpl },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    // repository = module.get<UserRepository>(UserRepository);
    dataSource = module.get<DataSource>(DataSource);
  });
  // 각 테스트 후 데이터베이스 초기화
  afterEach(async () => {
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.clear();
    }
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should create a user', async () => {
    await service.createUser({ username: 'admin' });
    const user = await service.getUserById(1);
    expect(user.username).toEqual('admin');
  });

  it('should retrieve all users', async () => {
    await service.createUser({ username: 'admin' });
    await service.createUser({ username: 'user1' });
    const users = await service.getAllUsers();
    expect(users.length).toBe(2);
  });

  it('should update a user', async () => {
    const createdUser = await service.createUser({ username: 'admin' });
    await service.updateUser(createdUser.id, { username: 'admin_updated' });
    const updatedUser = await service.getUserById(createdUser.id);
    expect(updatedUser.username).toEqual('admin_updated');
  });

  it('should delete a user', async () => {
    const createdUser = await service.createUser({ username: 'admin' });
    await service.deleteUser(createdUser.id);
    const user = await service.getUserById(createdUser.id);
    expect(user).toBeNull();
  });
});
