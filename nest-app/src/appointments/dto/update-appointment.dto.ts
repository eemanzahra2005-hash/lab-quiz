import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { CreateAppointmentDto } from './create-appointment.dto';

// All create fields become optional for PATCH; status can also be changed
export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsOptional()
  @IsIn(['booked', 'completed', 'cancelled'], {
    message: 'status must be booked, completed or cancelled',
  })
  status?: string;
}
