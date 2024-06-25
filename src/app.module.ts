import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LectureModule } from './lecture.module';
import { UserModule } from './user.module';
import { ApplicationModule } from './application.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './infrastructure/orm/typeorm.config';

@Module({
  imports: [
    LectureModule,
    UserModule,
    ApplicationModule,
    TypeOrmModule.forRoot(typeormConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
