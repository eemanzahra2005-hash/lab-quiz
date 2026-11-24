// Submitted by: Eeman Zahra | Roll No: ___ | BSCS-V-C
// Lab Quiz 01 - Q2: Hospital Appointment System

// Load .env before anything else reads process.env
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Allow requests from other origins (e.g. a frontend on another port)
  app.enableCors();

  // Validate every request body with the DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Serve the frontend (public folder) at http://localhost:3001
  app.useStaticAssets(join(__dirname, '..', 'public'));

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}
void bootstrap();
