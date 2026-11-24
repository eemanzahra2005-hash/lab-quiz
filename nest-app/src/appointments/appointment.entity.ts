import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Doctor } from '../doctors/doctor.entity';

// Appointment table: each appointment belongs to one doctor
@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientName: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ nullable: true })
  reason: string;

  @Column({ default: 'booked' })
  status: string;

  // Foreign key column for the doctor
  @Column()
  doctorId: number;

  // Many-to-one relation; deleting a doctor deletes their appointments
  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;
}
