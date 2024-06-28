import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateLectureDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date: string;

  @IsDateString()
  time: string;

  @IsOptional()
  @IsInt()
  capacity?: number;
}
