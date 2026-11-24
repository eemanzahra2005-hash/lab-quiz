import { IsNotEmpty, IsString } from 'class-validator';

// Data needed to create a doctor
export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty({ message: 'name must not be empty' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'specialization must not be empty' })
  specialization: string;
}
