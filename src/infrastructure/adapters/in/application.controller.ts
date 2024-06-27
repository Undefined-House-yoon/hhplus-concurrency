import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApplicationService } from '../../../application/ports/inbound/application.service';
import { ApplyLectureDto } from '../../../application/dto/apply-lecture.dto';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('apply')
  async applyLecture(
    @Body() applyLectureDto: ApplyLectureDto,
  ): Promise<boolean> {
    return this.applicationService.applyLecture(applyLectureDto);
  }

  @Get('status/:userId/:lectureId')
  async getApplicationStatus(
    @Param('userId') userId: number,
    @Param('lectureId') lectureId: number,
  ): Promise<{ hasApplied: boolean }> {
    const hasApplied = await this.applicationService.hasUserAppliedForLecture(
      userId,
      lectureId,
    );
    return { hasApplied };
  }
}
