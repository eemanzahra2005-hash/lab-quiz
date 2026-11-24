import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { Doctor } from '../doctors/doctor.entity';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { LoggerMiddleware } from '../common/logger.middleware';

// Appointments feature module
@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Doctor])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule implements NestModule {
  // Apply the logger middleware to all appointment routes
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(AppointmentsController);
  }
}
