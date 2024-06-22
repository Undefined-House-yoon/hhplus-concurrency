import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LectureService } from './lecture/lecture.service';
import { LectureController } from './lecture/lecture.controller';
import { LectureModule } from './lecture/lecture.module';
import { ApplicationModule } from './application/application.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';

@Module({
  imports: [
    LectureModule,
    UserModule,
    ApplicationModule,
    TypeOrmModule.forRoot(typeormConfig),
  ],
  controllers: [AppController, LectureController],
  providers: [AppService, LectureService],
})
export class AppModule {}
