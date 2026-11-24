import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Injectable()
export class DoctorsService implements OnModuleInit {
  // Doctor repository injected through the constructor
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  // Seed 2 doctors when the app starts if the table is empty
  async onModuleInit() {
    const count = await this.doctorRepository.count();
    if (count === 0) {
      await this.doctorRepository.save([
        { name: 'Dr. Ahmed Raza', specialization: 'Cardiology' },
        { name: 'Dr. Fatima Khan', specialization: 'Dermatology' },
      ]);
      console.log('Seeded 2 doctors');
    }
  }

  // Get all doctors together with their appointments
  findAll() {
    return this.doctorRepository.find({
      relations: { appointments: true },
      order: { id: 'ASC' },
    });
  }

  // Create a new doctor
  create(dto: CreateDoctorDto) {
    const doctor = this.doctorRepository.create(dto);
    return this.doctorRepository.save(doctor);
  }
}
