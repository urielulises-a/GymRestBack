const { getDb } = require('../../config/database');
const { generateId, nowISO } = require('../../utils/ids');

function mapNotification(row) {
  if (!row) return null;
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    message: row.message,
    createdAt: row.created_at,
    read: row.read === 1,
    payload: row.payload ? JSON.parse(row.payload) : null
  };
}

function listNotifications(filters = {}) {
  const db = getDb();
  let where = 'WHERE 1=1';
  const params = {};
  if (filters.type) {
    params.type = filters.type;
    where += ' AND type = @type';
  }
  if (filters.unread === 'true') {
    where += ' AND read = 0';
  }
  const rows = db
    .prepare(`SELECT * FROM notifications ${where} ORDER BY created_at DESC LIMIT 100`)
    .all(params);
  return rows.map(mapNotification);
}

function createNotification({ type, title, message, payload = null }) {
  const db = getDb();
  const id = generateId('notif-');
  const now = nowISO();
  db.prepare(
    `INSERT INTO notifications (id, type, title, message, created_at, read, payload)
     VALUES (@id, @type, @title, @message, @now, 0, @payload)`
  ).run({
    id,
    type,
    title,
    message,
    now,
    payload: payload ? JSON.stringify(payload) : null
  });
  return mapNotification(
    db.prepare('SELECT * FROM notifications WHERE id = ?').get(id)
  );
}

function markNotificationAsRead(id) {
  const db = getDb();
  db.prepare('UPDATE notifications SET read = 1 WHERE id = ?').run(id);
  return mapNotification(
    db.prepare('SELECT * FROM notifications WHERE id = ?').get(id)
  );
}

module.exports = {
  listNotifications,
  createNotification,
  markNotificationAsRead
};

