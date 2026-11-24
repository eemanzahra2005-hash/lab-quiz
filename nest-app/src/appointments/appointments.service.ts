import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { Doctor } from '../doctors/doctor.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  // Repositories injected through the constructor
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  // Get all appointments with their doctor
  findAll() {
    return this.appointmentRepository.find({
      relations: { doctor: true },
      order: { id: 'ASC' },
    });
  }

  // Get one appointment, 404 if the id does not exist
  async findOne(id: number) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: { doctor: true },
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }
    return appointment;
  }

  // Create an appointment after checking that the doctor exists
  async create(dto: CreateAppointmentDto) {
    await this.checkDoctorExists(dto.doctorId);
    const appointment = this.appointmentRepository.create(dto);
    const saved = await this.appointmentRepository.save(appointment);
    return this.findOne(saved.id);
  }

  // Update only the fields that were sent
  async update(id: number, dto: UpdateAppointmentDto) {
    await this.findOne(id);
    if (dto.doctorId !== undefined) {
      await this.checkDoctorExists(dto.doctorId);
    }

    // Keep only the fields that have a value
    const changes = Object.fromEntries(
      Object.entries(dto).filter(([, value]) => value !== undefined),
    );
    if (Object.keys(changes).length > 0) {
      await this.appointmentRepository.update(id, changes);
    }
    return this.findOne(id);
  }

  // Delete an appointment and return it
  async remove(id: number) {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.delete(id);
    return appointment;
  }

  // Helper: 404 if the doctor id does not exist
  private async checkDoctorExists(doctorId: number) {
    const exists = await this.doctorRepository.existsBy({ id: doctorId });
    if (!exists) {
      throw new NotFoundException(`Doctor with id ${doctorId} not found`);
    }
  }
}
