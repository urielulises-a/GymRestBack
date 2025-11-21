const { getDb } = require('../../config/database');
const { generateId, nowISO } = require('../../utils/ids');

function mapSettings(row) {
  if (!row) return null;
  return {
    language: row.language,
    gymName: row.gym_name,
    address: row.address,
    phone: row.phone,
    email: row.email,
    schedules: row.schedules ? JSON.parse(row.schedules) : {},
    paymentMethods: row.payment_methods ? JSON.parse(row.payment_methods) : [],
    autoBackup: row.auto_backup === 1,
    lastBackupAt: row.last_backup_at
  };
}

function getSettings() {
  const db = getDb();
  const row = db.prepare('SELECT * FROM gym_settings WHERE id = 1').get();
  return mapSettings(row);
}

function updateSettings(payload) {
  const db = getDb();
  const current = getSettings() || {};
  const autoBackupValue = payload.autoBackup ?? current.autoBackup ?? false;
  db.prepare(
    `INSERT INTO gym_settings (id, language, gym_name, address, phone, email, schedules, payment_methods, auto_backup, last_backup_at)
     VALUES (1, @language, @gymName, @address, @phone, @email, @schedules, @paymentMethods, @autoBackup, @lastBackupAt)
     ON CONFLICT(id) DO UPDATE SET
       language=excluded.language,
       gym_name=excluded.gym_name,
       address=excluded.address,
       phone=excluded.phone,
       email=excluded.email,
       schedules=excluded.schedules,
       payment_methods=excluded.payment_methods,
       auto_backup=excluded.auto_backup,
       last_backup_at=excluded.last_backup_at`
  ).run({
    language: payload.language || current.language || 'es-MX',
    gymName: payload.gymName || current.gymName || 'Mi Gimnasio',
    address: payload.address || current.address || '',
    phone: payload.phone || current.phone || '',
    email: payload.email || current.email || '',
    schedules: JSON.stringify(payload.schedules || current.schedules || {}),
    paymentMethods: JSON.stringify(payload.paymentMethods || current.paymentMethods || []),
    autoBackup: autoBackupValue ? 1 : 0,
    lastBackupAt: payload.lastBackupAt || current.lastBackupAt || null
  });
  return getSettings();
}

function listBackups() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM backups ORDER BY created_at DESC LIMIT 50').all();
  return rows.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    location: row.location,
    status: row.status
  }));
}

function createBackup() {
  const db = getDb();
  const id = generateId('backup-');
  const now = nowISO();
  const location = `local://backups/${id}.json`;
  db.prepare('INSERT INTO backups (id, location, status, created_at) VALUES (?, ?, ?, ?)')
    .run(id, location, 'completado', now);
  db.prepare('UPDATE gym_settings SET last_backup_at = ? WHERE id = 1').run(now);
  return { id, location, status: 'completado', createdAt: now };
}

module.exports = {
  getSettings,
  updateSettings,
  listBackups,
  createBackup
};

