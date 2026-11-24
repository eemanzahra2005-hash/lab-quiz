# Hospital Appointment System (Lab Quiz 01 – Q2)

Submitted by: Eeman Zahra | Roll No: ___ | BSCS-V-C

NestJS + TypeORM + PostgreSQL API with a Bootstrap 5 frontend, served at **http://localhost:3001**.

## Requirements

- Node.js 20.19+ / 22.12+ (tested on Node 24)
- PostgreSQL running on `localhost:5432`

## Setup

```bash
npm install
# edit .env and set DB_PASSWORD to your PostgreSQL password
npm run db:create    # creates the hospital_db database if it does not exist
npm run start:dev    # starts the server on http://localhost:3001 (watch mode)
```

On the first start TypeORM creates the `doctors` and `appointments` tables (`synchronize: true`), and 2 doctors are added if the `doctors` table is empty.

## Environment variables (`.env`)

| Variable      | Example        | Purpose                                   |
|---------------|----------------|-------------------------------------------|
| `DB_HOST`     | `localhost`    | PostgreSQL host                           |
| `DB_PORT`     | `5432`         | PostgreSQL port                           |
| `DB_USERNAME` | `postgres`     | PostgreSQL user                           |
| `DB_PASSWORD` | `MY_PASSWORD`  | PostgreSQL password                       |
| `DB_NAME`     | `hospital_db`  | Database name                             |
| `API_KEY`     | `lab-quiz-key` | Value required in the `x-api-key` header  |

## Endpoints

| Method | URL                 | Auth        | Description                                  | Success |
|--------|---------------------|-------------|----------------------------------------------|---------|
| GET    | `/doctors`          | –           | All doctors with their appointments          | 200     |
| POST   | `/doctors`          | –           | Create a doctor `{ name, specialization }`   | 201     |
| GET    | `/appointments`     | `x-api-key` | All appointments with their doctor           | 200     |
| GET    | `/appointments/:id` | `x-api-key` | One appointment                              | 200     |
| POST   | `/appointments`     | `x-api-key` | Book `{ patientName, date, reason?, doctorId }` | 201  |
| PATCH  | `/appointments/:id` | `x-api-key` | Update any field, or `status` (`booked`, `completed`, `cancelled`) | 200 |
| DELETE | `/appointments/:id` | `x-api-key` | Delete and return the appointment            | 200     |

Errors:

- **400**: validation failed (e.g. empty `patientName`, invalid `date`, unknown fields)
- **403**: `x-api-key` header missing or wrong
- **404**: appointment or doctor id not found

Every `/appointments` request is logged by `LoggerMiddleware` (method, URL, status code, time).

## Postman

Import `postman/Q2_Hospital_API.postman_collection.json` and run the collection in order. It uses the variables `baseUrl` (`http://localhost:3001`) and `apiKey` (`lab-quiz-key`).

## Project structure

```
src/
  main.ts                        app setup: CORS, ValidationPipe, static files, port 3001
  app.module.ts                  TypeORM connection
  common/api-key.guard.ts        ApiKeyGuard (x-api-key -> 403)
  common/logger.middleware.ts    LoggerMiddleware
  doctors/                       Doctor entity, DTO, service, controller, module
  appointments/                  Appointment entity, DTOs, service, controller, module
public/                          index.html, style.css, script.js
scripts/create-db.js             npm run db:create
postman/                         Postman collection
```
