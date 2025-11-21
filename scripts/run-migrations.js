/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { getDb, closeDb } = require('../src/config/database');

function runMigrations() {
  const db = getDb();
  const migrationsDir = path.resolve(process.cwd(), 'db/migrations');
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  files.forEach((file) => {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    db.exec(sql);
    console.log(`✓ Migración ejecutada: ${file}`);
  });
  closeDb();
}

runMigrations();

