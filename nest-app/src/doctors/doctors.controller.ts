import { Body, Controller, Get, Post } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Controller('doctors')
export class DoctorsController {
  // DoctorsService injected through the constructor
  constructor(private readonly doctorsService: DoctorsService) {}

  // GET /doctors - all doctors with their appointments
  @Get()
  findAll() {
    return this.doctorsService.findAll();
  }

  // POST /doctors - create a doctor
  @Post()
  create(@Body() dto: CreateDoctorDto) {
    return this.doctorsService.create(dto);
  }
}
