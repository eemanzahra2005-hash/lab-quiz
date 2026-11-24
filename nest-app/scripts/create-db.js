// Creates the hospital_db database if it does not exist yet (npm run db:create)
require('dotenv').config();
const { Client } = require('pg');

async function createDatabase() {
  const dbName = process.env.DB_NAME || 'hospital_db';

  // Connect to the default "postgres" database (hospital_db may not exist yet)
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'postgres',
  });

  try {
    await client.connect();

    // Check whether the database already exists
    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName],
    );

    if (result.rowCount > 0) {
      console.log(`Database "${dbName}" already exists.`);
    } else {
      // CREATE DATABASE cannot use $1 parameters, so the name is quoted safely
      await client.query(`CREATE DATABASE "${dbName.replace(/"/g, '""')}"`);
      console.log(`Database "${dbName}" created.`);
    }
  } catch (err) {
    console.error('Could not create the database:', err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

createDatabase();
