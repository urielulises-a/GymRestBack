const { getDb } = require('../../config/database');
const { generateId, nowISO } = require('../../utils/ids');

const sortableFields = {
  name: 'm.name',
  joinDate: 'm.join_date',
  status: 'm.status',
  createdAt: 'm.created_at'
};

function mapMember(row) {
  if (!row) return null;
  return {
    id: row.id,
    displayId: row.displayId,
    name: row.name,
    email: row.email,
    phone: row.phone,
    joinDate: row.joinDate,
    status: row.status,
    planId: row.planId,
    planName: row.planName,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

function buildWhere(filters, params) {
  let where = 'WHERE 1=1';
  if (filters.search) {
    params.search = `%${filters.search.toLowerCase()}%`;
    where += ' AND (lower(m.name) LIKE @search OR lower(m.email) LIKE @search OR lower(m.display_id) LIKE @search)';
  }
  if (filters.status) {
    params.status = filters.status;
    where += ' AND m.status = @status';
  }
  if (filters.planId) {
    params.planId = filters.planId;
    where += ' AND m.plan_id = @planId';
  }
  if (filters.fromDate) {
    params.fromDate = filters.fromDate;
    where += ' AND m.join_date >= @fromDate';
  }
  if (filters.toDate) {
    params.toDate = filters.toDate;
    where += ' AND m.join_date <= @toDate';
  }
  return where;
}

function listMembers(filters) {
  const db = getDb();
  const params = {};
  const where = buildWhere(filters, params);
  const sortField = sortableFields[filters.sortBy] || 'm.created_at';
  const sortOrder = filters.order === 'asc' ? 'ASC' : 'DESC';

  const total = db
    .prepare(`SELECT COUNT(*) as count FROM members m ${where}`)
    .get(params).count;

  const rows = db
    .prepare(
      `SELECT m.id,
              m.display_id AS displayId,
              m.name,
              m.email,
              m.phone,
              m.join_date AS joinDate,
              m.status,
              m.plan_id AS planId,
              m.created_at AS createdAt,
              m.updated_at AS updatedAt,
              p.name AS planName
       FROM members m
       LEFT JOIN plans p ON p.id = m.plan_id
       ${where}
       ORDER BY ${sortField} ${sortOrder}
       LIMIT @limit OFFSET @offset`
    )
    .all({ ...params, limit: filters.limit, offset: filters.offset });

  return { data: rows.map(mapMember), total };
}

function getMemberById(id) {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT m.id,
              m.display_id AS displayId,
              m.name,
              m.email,
              m.phone,
              m.join_date AS joinDate,
              m.status,
              m.plan_id AS planId,
              m.created_at AS createdAt,
              m.updated_at AS updatedAt,
              p.name AS planName
       FROM members m
       LEFT JOIN plans p ON p.id = m.plan_id
       WHERE m.id = ?`
    )
    .get(id);
  return mapMember(row);
}

function createMember(payload) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM members WHERE lower(email) = lower(?)').get(payload.email);
  if (existing) {
    throw new Error('El correo ya está registrado');
  }
  if (payload.planId) {
    const plan = db.prepare('SELECT id FROM plans WHERE id = ?').get(payload.planId);
    if (!plan) {
      throw new Error('Plan no válido');
    }
  }
  const id = generateId('member-');
  const displayId = generateId('M');
  const now = nowISO();
  db.prepare(
    `INSERT INTO members
      (id, display_id, name, email, phone, join_date, status, plan_id, created_at, updated_at)
     VALUES
      (@id, @displayId, @name, @email, @phone, @joinDate, @status, @planId, @now, @now)`
  ).run({
    id,
    displayId,
    name: payload.name,
    email: payload.email,
    phone: payload.phone || null,
    joinDate: payload.joinDate || now,
    status: payload.status || 'Activo',
    planId: payload.planId || null,
    now
  });
  return getMemberById(id);
}

function updateMember(id, payload) {
  const db = getDb();
  const member = getMemberById(id);
  if (!member) {
    throw new Error('Socio no encontrado');
  }
  if (payload.email && payload.email !== member.email) {
    const existing = db.prepare('SELECT id FROM members WHERE lower(email) = lower(?)').get(payload.email);
    if (existing) {
      throw new Error('El correo ya está registrado');
    }
  }
  if (payload.planId) {
    const plan = db.prepare('SELECT id FROM plans WHERE id = ?').get(payload.planId);
    if (!plan) {
      throw new Error('Plan no válido');
    }
  }
  const now = nowISO();
  db.prepare(
    `UPDATE members
     SET name=@name,
         email=@email,
         phone=@phone,
         join_date=@joinDate,
         status=@status,
         plan_id=@planId,
         updated_at=@now
     WHERE id=@id`
  ).run({
    id,
    name: payload.name ?? member.name,
    email: payload.email ?? member.email,
    phone: payload.phone ?? member.phone,
    joinDate: payload.joinDate ?? member.joinDate,
    status: payload.status ?? member.status,
    planId: payload.planId ?? member.planId,
    now
  });
  return getMemberById(id);
}

function deleteMember(id) {
  const db = getDb();
  db.prepare('DELETE FROM members WHERE id = ?').run(id);
  return true;
}

module.exports = {
  listMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
};

