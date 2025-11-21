/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { getDb, closeDb } = require('../src/config/database');

function runSeeds() {
  const db = getDb();
  const seedsDir = path.resolve(process.cwd(), 'db/seeds');
  const files = fs
    .readdirSync(seedsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  files.forEach((file) => {
    const sql = fs.readFileSync(path.join(seedsDir, file), 'utf-8');
    db.exec(sql);
    console.log(`✓ Seed ejecutado: ${file}`);
  });
  closeDb();
}

runSeeds();

