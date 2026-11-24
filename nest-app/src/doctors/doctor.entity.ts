import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Appointment } from '../appointments/appointment.entity';

// Doctor table: one doctor has many appointments
@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  specialization: string;

  // One-to-many relation with appointments
  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];
}
