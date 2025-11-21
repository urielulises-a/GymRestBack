const { DateTime } = require('luxon');
const { getDb } = require('../../config/database');
const { generateId, nowISO } = require('../../utils/ids');
const notificationsService = require('../notifications/notifications.service');

const sortableFields = {
  startDate: 's.start_date',
  endDate: 's.end_date',
  status: 's.status',
  amount: 's.amount'
};

function mapSubscription(row) {
  if (!row) return null;
  return {
    id: row.id,
    displayId: row.displayId,
    memberId: row.memberId,
    memberName: row.memberName,
    planId: row.planId,
    planName: row.planName,
    startDate: row.startDate,
    endDate: row.endDate,
    status: row.status,
    amount: row.amount,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

function buildWhere(filters, params) {
  let where = 'WHERE 1=1';
  if (filters.search) {
    params.search = `%${filters.search.toLowerCase()}%`;
    where +=
      ' AND (lower(m.name) LIKE @search OR lower(m.email) LIKE @search OR lower(s.display_id) LIKE @search)';
  }
  if (filters.status) {
    params.status = filters.status;
    where += ' AND s.status = @status';
  }
  if (filters.planId) {
    params.planId = filters.planId;
    where += ' AND s.plan_id = @planId';
  }
  if (filters.memberId) {
    params.memberId = filters.memberId;
    where += ' AND s.member_id = @memberId';
  }
  if (filters.startFrom) {
    params.startFrom = filters.startFrom;
    where += ' AND s.start_date >= @startFrom';
  }
  if (filters.startTo) {
    params.startTo = filters.startTo;
    where += ' AND s.start_date <= @startTo';
  }
  return where;
}

function listSubscriptions(filters) {
  const db = getDb();
  const params = {};
  const where = buildWhere(filters, params);
  const sortField = sortableFields[filters.sortBy] || 's.created_at';
  const sortOrder = filters.order === 'asc' ? 'ASC' : 'DESC';

  const total = db
    .prepare(`SELECT COUNT(*) as count FROM subscriptions s LEFT JOIN members m ON m.id = s.member_id ${where}`)
    .get(params).count;

  const rows = db
    .prepare(
      `SELECT s.id,
              s.display_id AS displayId,
              s.member_id AS memberId,
              m.name AS memberName,
              s.plan_id AS planId,
              p.name AS planName,
              s.start_date AS startDate,
              s.end_date AS endDate,
              s.status,
              s.amount,
              s.created_at AS createdAt,
              s.updated_at AS updatedAt
       FROM subscriptions s
       LEFT JOIN members m ON m.id = s.member_id
       LEFT JOIN plans p ON p.id = s.plan_id
       ${where}
       ORDER BY ${sortField} ${sortOrder}
       LIMIT @limit OFFSET @offset`
    )
    .all({ ...params, limit: filters.limit, offset: filters.offset });

  return { data: rows.map(mapSubscription), total };
}

function getSubscriptionById(id) {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT s.id,
              s.display_id AS displayId,
              s.member_id AS memberId,
              m.name AS memberName,
              s.plan_id AS planId,
              p.name AS planName,
              s.start_date AS startDate,
              s.end_date AS endDate,
              s.status,
              s.amount,
              s.created_at AS createdAt,
              s.updated_at AS updatedAt
       FROM subscriptions s
       LEFT JOIN members m ON m.id = s.member_id
       LEFT JOIN plans p ON p.id = s.plan_id
       WHERE s.id = ?`
    )
    .get(id);
  return mapSubscription(row);
}

function upsertMemberPlan(memberId, planId) {
  if (!planId) return;
  const db = getDb();
  db.prepare('UPDATE members SET plan_id = ?, updated_at = ? WHERE id = ?').run(planId, nowISO(), memberId);
}

function createSubscription(payload) {
  const db = getDb();
  const member = db.prepare('SELECT * FROM members WHERE id = ?').get(payload.memberId);
  if (!member) {
    throw new Error('Miembro no válido');
  }
  const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(payload.planId);
  if (!plan) {
    throw new Error('Plan no válido');
  }
  const startDate = payload.startDate || nowISO();
  const endDate = DateTime.fromISO(startDate).plus({ days: plan.duration_days }).toISO();
  const id = generateId('sub-');
  const displayId = generateId('S');
  const now = nowISO();
  db.prepare(
    `INSERT INTO subscriptions
      (id, display_id, member_id, plan_id, start_date, end_date, status, amount, created_at, updated_at)
     VALUES
      (@id, @displayId, @memberId, @planId, @startDate, @endDate, @status, @amount, @now, @now)`
  ).run({
    id,
    displayId,
    memberId: payload.memberId,
    planId: payload.planId,
    startDate,
    endDate,
    status: payload.status || 'Activa',
    amount: payload.amount ?? plan.price,
    now
  });
  upsertMemberPlan(payload.memberId, payload.planId);
  return getSubscriptionById(id);
}

function updateSubscription(id, payload) {
  const db = getDb();
  const subscription = getSubscriptionById(id);
  if (!subscription) {
    throw new Error('Suscripción no encontrada');
  }
  let planId = payload.planId || subscription.planId;
  let amount = payload.amount ?? subscription.amount;
  let endDate = subscription.endDate;
  if (payload.planId) {
    const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(payload.planId);
    if (!plan) {
      throw new Error('Plan no válido');
    }
    planId = plan.id;
    amount = payload.amount ?? plan.price;
    const startDate = payload.startDate || subscription.startDate;
    endDate = DateTime.fromISO(startDate).plus({ days: plan.duration_days }).toISO();
  }
  const now = nowISO();
  db.prepare(
    `UPDATE subscriptions
     SET member_id=@memberId,
         plan_id=@planId,
         start_date=@startDate,
         end_date=@endDate,
         status=@status,
         amount=@amount,
         updated_at=@now
     WHERE id=@id`
  ).run({
    id,
    memberId: payload.memberId || subscription.memberId,
    planId,
    startDate: payload.startDate || subscription.startDate,
    endDate,
    status: payload.status || subscription.status,
    amount,
    now
  });
  upsertMemberPlan(payload.memberId || subscription.memberId, planId);
  return getSubscriptionById(id);
}

function deleteSubscription(id) {
  const db = getDb();
  db.prepare('DELETE FROM subscriptions WHERE id = ?').run(id);
  return true;
}

function refreshSubscriptionStatuses() {
  const db = getDb();
  const now = nowISO();
  const expired = db.prepare('SELECT id FROM subscriptions WHERE status != "Vencida" AND end_date < ?').all(now);
  expired.forEach((row) => {
    db.prepare('UPDATE subscriptions SET status = "Vencida", updated_at = ? WHERE id = ?').run(now, row.id);
  });
  return expired.length;
}

function enqueueExpiringNotifications() {
  const db = getDb();
  const now = DateTime.now();
  const limitDate = now.plus({ days: 3 }).toISO();
  const rows = db
    .prepare(
      `SELECT s.id, s.display_id AS displayId, s.end_date AS endDate, m.name AS memberName
       FROM subscriptions s
       LEFT JOIN members m ON m.id = s.member_id
       WHERE s.status = 'Activa' AND s.end_date <= @limitDate`
    )
    .all({ limitDate });
  rows.forEach((row) => {
    notificationsService.createNotification({
      type: 'planWarning',
      title: 'Suscripción por vencer',
      message: `${row.memberName} vence el ${row.endDate}`,
      payload: { subscriptionId: row.id, displayId: row.displayId, endDate: row.endDate }
    });
  });
  return rows.length;
}

module.exports = {
  listSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  refreshSubscriptionStatuses,
  enqueueExpiringNotifications
};

