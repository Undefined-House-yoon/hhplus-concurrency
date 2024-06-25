import { Injectable } from '@nestjs/common';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { UpdateApplicationDto } from '../dto/update-application.dto';
import { ApplicationService } from '../ports/inbound/application.service';

@Injectable()
export class ApplicationServiceImpl implements ApplicationService {}
