import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './appointment.entity';
import { Doctor } from '../doctors/doctor.entity';

describe('AppointmentsService', () => {
  let service: AppointmentsService;

  // Fake repositories instead of a real database
  const appointmentRepo = {
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const doctorRepo = { existsBy: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: getRepositoryToken(Appointment), useValue: appointmentRepo },
        { provide: getRepositoryToken(Doctor), useValue: doctorRepo },
      ],
    }).compile();
    service = moduleRef.get(AppointmentsService);
  });

  it('throws NotFoundException for an unknown appointment id', async () => {
    appointmentRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('throws NotFoundException when booking with an unknown doctor', async () => {
    doctorRepo.existsBy.mockResolvedValue(false);
    await expect(
      service.create({ patientName: 'A', date: '2026-12-15', doctorId: 99 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('updates only the fields that were sent', async () => {
    appointmentRepo.findOne.mockResolvedValue({ id: 1 });
    await service.update(1, {
      status: 'completed',
      patientName: undefined,
    });
    expect(appointmentRepo.update).toHaveBeenCalledWith(1, {
      status: 'completed',
    });
  });
});
