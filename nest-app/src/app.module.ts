import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsModule } from './doctors/doctors.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { Doctor } from './doctors/doctor.entity';
import { Appointment } from './appointments/appointment.entity';

@Module({
  imports: [
    // PostgreSQL connection, settings come from the .env file
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Doctor, Appointment],
      synchronize: true, // creates/updates tables from the entities (dev only)
    }),
    DoctorsModule,
    AppointmentsModule,
  ],
})
export class AppModule {}
