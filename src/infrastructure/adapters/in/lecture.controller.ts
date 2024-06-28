import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LectureService } from '../../../application/ports/inbound/lecture.service';
import { CreateLectureDto } from '../../../application/dto/create-lecture.dto';

@Controller('lecture')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Post()
  createLecture(@Body() createLectureDto: CreateLectureDto) {
    return this.lectureService.createLecture(createLectureDto);
  }

  @Get()
  getAllLectures() {
    return this.lectureService.getAllLectures();
  }

  // @Delete(':id')
  // apply(@Param('id') id: string) {
  //   return this.lectureService.apply(applyLectureDto);
  // }

  @Delete(':id')
  deleteLecture(@Param('id') id: string) {
    return this.lectureService.deleteLecture(+id);
  }
}
