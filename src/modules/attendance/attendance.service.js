const { getDb } = require('../../config/database');
const { generateId, nowISO } = require('../../utils/ids');
const notificationsService = require('../notifications/notifications.service');

const sortableFields = {
  checkInTime: 'a.check_in_time',
  status: 'a.status'
};

function mapAttendance(row) {
  if (!row) return null;
  return {
    id: row.id,
    displayId: row.displayId,
    memberId: row.memberId,
    memberName: row.memberName,
    checkInTime: row.checkInTime,
    checkOutTime: row.checkOutTime,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

function buildWhere(filters, params) {
  let where = 'WHERE 1=1';
  if (filters.search) {
    params.search = `%${filters.search.toLowerCase()}%`;
    where +=
      ' AND (lower(m.name) LIKE @search OR lower(m.email) LIKE @search OR lower(a.display_id) LIKE @search)';
  }
  if (filters.memberId) {
    params.memberId = filters.memberId;
    where += ' AND a.member_id = @memberId';
  }
  if (filters.status) {
    params.status = filters.status;
    where += ' AND a.status = @status';
  }
  if (filters.dateFrom) {
    params.dateFrom = filters.dateFrom;
    where += ' AND a.check_in_time >= @dateFrom';
  }
  if (filters.dateTo) {
    params.dateTo = filters.dateTo;
    where += ' AND a.check_in_time <= @dateTo';
  }
  return where;
}

function listAttendance(filters) {
  const db = getDb();
  const params = {};
  const where = buildWhere(filters, params);
  const sortField = sortableFields[filters.sortBy] || 'a.check_in_time';
  const sortOrder = filters.order === 'asc' ? 'ASC' : 'DESC';
  const total = db
    .prepare(`SELECT COUNT(*) as count FROM attendance a LEFT JOIN members m ON m.id = a.member_id ${where}`)
    .get(params).count;
  const rows = db
    .prepare(
      `SELECT a.id,
              a.display_id AS displayId,
              a.member_id AS memberId,
              m.name AS memberName,
              a.check_in_time AS checkInTime,
              a.check_out_time AS checkOutTime,
              a.status,
              a.created_at AS createdAt,
              a.updated_at AS updatedAt
       FROM attendance a
       LEFT JOIN members m ON m.id = a.member_id
       ${where}
       ORDER BY ${sortField} ${sortOrder}
       LIMIT @limit OFFSET @offset`
    )
    .all({ ...params, limit: filters.limit, offset: filters.offset });
  return { data: rows.map(mapAttendance), total };
}

function ensureActiveSubscription(memberId) {
  const db = getDb();
  const now = nowISO();
  const sub = db
    .prepare(
      `SELECT id FROM subscriptions
       WHERE member_id = ? AND status = 'Activa' AND end_date >= ?`
    )
    .get(memberId, now);
  if (!sub) {
    throw new Error('El miembro no tiene suscripción activa');
  }
}

function checkIn(memberId) {
  const db = getDb();
  const member = db.prepare('SELECT * FROM members WHERE id = ?').get(memberId);
  if (!member) {
    throw new Error('Miembro no válido');
  }
  ensureActiveSubscription(memberId);
  const existing = db.prepare('SELECT id FROM attendance WHERE member_id = ? AND status = "En curso"').get(memberId);
  if (existing) {
    throw new Error('Ya existe un check-in en curso');
  }
  const id = generateId('att-');
  const displayId = generateId('A');
  const now = nowISO();
  db.prepare(
    `INSERT INTO attendance (id, display_id, member_id, check_in_time, status, created_at, updated_at)
     VALUES (@id, @displayId, @memberId, @now, 'En curso', @now, @now)`
  ).run({ id, displayId, memberId, now });
  notificationsService.createNotification({
    type: 'attendance',
    title: 'Nuevo check-in',
    message: `${member.name} acaba de registrar ingreso`,
    payload: { memberId }
  });
  return mapAttendance(
    db
      .prepare(
        `SELECT a.id, a.display_id AS displayId, a.member_id AS memberId, m.name AS memberName,
                a.check_in_time AS checkInTime, a.check_out_time AS checkOutTime, a.status,
                a.created_at AS createdAt, a.updated_at AS updatedAt
         FROM attendance a
         LEFT JOIN members m ON m.id = a.member_id
         WHERE a.id = ?`
      )
      .get(id)
  );
}

function checkOut(id) {
  const db = getDb();
  const record = db.prepare('SELECT * FROM attendance WHERE id = ?').get(id);
  if (!record) {
    throw new Error('Registro no encontrado');
  }
  if (record.status !== 'En curso') {
    throw new Error('El check-in ya fue cerrado');
  }
  const now = nowISO();
  db.prepare(
    `UPDATE attendance
     SET check_out_time = @now,
         status = 'Completado',
         updated_at = @now
     WHERE id = @id`
  ).run({ id, now });
  return getAttendanceById(id);
}

function getAttendanceById(id) {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT a.id,
              a.display_id AS displayId,
              a.member_id AS memberId,
              m.name AS memberName,
              a.check_in_time AS checkInTime,
              a.check_out_time AS checkOutTime,
              a.status,
              a.created_at AS createdAt,
              a.updated_at AS updatedAt
       FROM attendance a
       LEFT JOIN members m ON m.id = a.member_id
       WHERE a.id = ?`
    )
    .get(id);
  return mapAttendance(row);
}

function updateAttendance(id, payload) {
  const db = getDb();
  const record = getAttendanceById(id);
  if (!record) throw new Error('Registro no encontrado');
  const now = nowISO();
  db.prepare(
    `UPDATE attendance
     SET member_id=@memberId,
         check_in_time=@checkInTime,
         check_out_time=@checkOutTime,
         status=@status,
         updated_at=@now
     WHERE id=@id`
  ).run({
    id,
    memberId: payload.memberId || record.memberId,
    checkInTime: payload.checkInTime || record.checkInTime,
    checkOutTime: payload.checkOutTime || record.checkOutTime,
    status: payload.status || record.status,
    now
  });
  return getAttendanceById(id);
}

function deleteAttendance(id) {
  const db = getDb();
  db.prepare('DELETE FROM attendance WHERE id = ?').run(id);
  return true;
}

module.exports = {
  listAttendance,
  checkIn,
  checkOut,
  getAttendanceById,
  updateAttendance,
  deleteAttendance
};

