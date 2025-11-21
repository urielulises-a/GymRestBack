const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { ENV } = require('./env');

let dbInstance = null;

function connect() {
  if (ENV.DB_DRIVER !== 'sqlite') {
    throw new Error('Solo se ha configurado el driver SQLite por ahora');
  }

  const dbPath = path.resolve(process.cwd(), ENV.SQLITE_FILE);
  if (!fs.existsSync(dbPath)) {
    fs.closeSync(fs.openSync(dbPath, 'w'));
  }

  const instance = new Database(dbPath);
  instance.pragma('foreign_keys = ON');
  instance.pragma('journal_mode = WAL');
  dbInstance = instance;
  return dbInstance;
}

function getDb() {
  if (!dbInstance) {
    return connect();
  }
  return dbInstance;
}

function closeDb() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

module.exports = { getDb, closeDb };

