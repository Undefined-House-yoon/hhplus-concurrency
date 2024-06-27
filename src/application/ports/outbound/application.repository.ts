import { Application } from '../../../domain/entities/application.entity';

export abstract class ApplicationRepository {
  abstract apply(application: Application): Promise<Application>;

  abstract hasUserAppliedForLecture(
    userId: number,
    lectureId: number,
  ): Promise<boolean>;
}
