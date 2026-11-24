import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ApiKeyGuard } from '../common/api-key.guard';

// Every appointment route needs a valid x-api-key header
@UseGuards(ApiKeyGuard)
@Controller('appointments')
export class AppointmentsController {
  // AppointmentsService injected through the constructor
  constructor(private readonly appointmentsService: AppointmentsService) {}

  // GET /appointments
  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  // GET /appointments/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.findOne(id);
  }

  // POST /appointments
  @Post()
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  // PATCH /appointments/:id
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, dto);
  }

  // DELETE /appointments/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.remove(id);
  }
}
