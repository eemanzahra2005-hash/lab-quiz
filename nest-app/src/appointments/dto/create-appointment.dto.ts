import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

// Data needed to book an appointment
export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty({ message: 'patientName must not be empty' })
  patientName: string;

  @IsDateString({}, { message: 'date must be a valid date' })
  date: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsInt({ message: 'doctorId must be an integer' })
  doctorId: number;
}
