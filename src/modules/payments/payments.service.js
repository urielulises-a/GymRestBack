const { getDb } = require('../../config/database');
const { generateId, nowISO } = require('../../utils/ids');
const notificationsService = require('../notifications/notifications.service');

const sortableFields = {
  paymentDate: 'p.payment_date',
  amount: 'p.amount',
  status: 'p.status'
};

function mapPayment(row) {
  if (!row) return null;
  return {
    id: row.id,
    displayId: row.displayId,
    memberId: row.memberId,
    memberName: row.memberName,
    subscriptionId: row.subscriptionId,
    planName: row.planName,
    amount: row.amount,
    paymentDate: row.paymentDate,
    method: row.method,
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
      ' AND (lower(m.name) LIKE @search OR lower(m.email) LIKE @search OR lower(p.display_id) LIKE @search)';
  }
  if (filters.memberId) {
    params.memberId = filters.memberId;
    where += ' AND p.member_id = @memberId';
  }
  if (filters.method) {
    params.method = filters.method;
    where += ' AND p.method = @method';
  }
  if (filters.status) {
    params.status = filters.status;
    where += ' AND p.status = @status';
  }
  if (filters.dateFrom) {
    params.dateFrom = filters.dateFrom;
    where += ' AND p.payment_date >= @dateFrom';
  }
  if (filters.dateTo) {
    params.dateTo = filters.dateTo;
    where += ' AND p.payment_date <= @dateTo';
  }
  return where;
}

function listPayments(filters) {
  const db = getDb();
  const params = {};
  const where = buildWhere(filters, params);
  const sortField = sortableFields[filters.sortBy] || 'p.payment_date';
  const sortOrder = filters.order === 'asc' ? 'ASC' : 'DESC';
  const total = db
    .prepare(`SELECT COUNT(*) as count FROM payments p LEFT JOIN members m ON m.id = p.member_id ${where}`)
    .get(params).count;
  const rows = db
    .prepare(
      `SELECT p.id,
              p.display_id AS displayId,
              p.member_id AS memberId,
              m.name AS memberName,
              p.subscription_id AS subscriptionId,
              s.plan_id AS planId,
              pl.name AS planName,
              p.amount,
              p.payment_date AS paymentDate,
              p.method,
              p.status,
              p.created_at AS createdAt,
              p.updated_at AS updatedAt
       FROM payments p
       LEFT JOIN members m ON m.id = p.member_id
       LEFT JOIN subscriptions s ON s.id = p.subscription_id
       LEFT JOIN plans pl ON pl.id = s.plan_id
       ${where}
       ORDER BY ${sortField} ${sortOrder}
       LIMIT @limit OFFSET @offset`
    )
    .all({ ...params, limit: filters.limit, offset: filters.offset });
  return { data: rows.map(mapPayment), total };
}

function getPaymentById(id) {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT p.id,
              p.display_id AS displayId,
              p.member_id AS memberId,
              m.name AS memberName,
              p.subscription_id AS subscriptionId,
              s.plan_id AS planId,
              pl.name AS planName,
              p.amount,
              p.payment_date AS paymentDate,
              p.method,
              p.status,
              p.created_at AS createdAt,
              p.updated_at AS updatedAt
       FROM payments p
       LEFT JOIN members m ON m.id = p.member_id
       LEFT JOIN subscriptions s ON s.id = p.subscription_id
       LEFT JOIN plans pl ON pl.id = s.plan_id
       WHERE p.id = ?`
    )
    .get(id);
  return mapPayment(row);
}

function validateRelations(memberId, subscriptionId) {
  const db = getDb();
  const member = db.prepare('SELECT id FROM members WHERE id = ?').get(memberId);
  if (!member) throw new Error('Miembro no válido');
  const subscription = db.prepare('SELECT id, plan_id, member_id, amount FROM subscriptions WHERE id = ?').get(subscriptionId);
  if (!subscription) throw new Error('Suscripción no válida');
  if (subscription.member_id && subscription.member_id !== memberId) {
    throw new Error('La suscripción no pertenece al miembro');
  }
  return subscription;
}

function createPayment(payload) {
  const db = getDb();
  const subscription = validateRelations(payload.memberId, payload.subscriptionId);
  const id = generateId('pay-');
  const displayId = generateId('PAY');
  const now = nowISO();
  db.prepare(
    `INSERT INTO payments
      (id, display_id, member_id, subscription_id, amount, payment_date, method, status, created_at, updated_at)
     VALUES
      (@id, @displayId, @memberId, @subscriptionId, @amount, @paymentDate, @method, @status, @now, @now)`
  ).run({
    id,
    displayId,
    memberId: payload.memberId,
    subscriptionId: payload.subscriptionId,
    amount: payload.amount ?? subscription.amount ?? 0,
    paymentDate: payload.paymentDate || now,
    method: payload.method || 'Efectivo',
    status: payload.status || 'Completado',
    now
  });
  notificationsService.createNotification({
    type: 'payment',
    title: 'Pago confirmado',
    message: `Pago registrado (${displayId})`,
    payload: { paymentId: id, memberId: payload.memberId }
  });
  return getPaymentById(id);
}

function updatePayment(id, payload) {
  const db = getDb();
  const payment = getPaymentById(id);
  if (!payment) {
    throw new Error('Pago no encontrado');
  }
  if (payload.memberId || payload.subscriptionId) {
    validateRelations(payload.memberId || payment.memberId, payload.subscriptionId || payment.subscriptionId);
  }
  const now = nowISO();
  db.prepare(
    `UPDATE payments
     SET member_id=@memberId,
         subscription_id=@subscriptionId,
         amount=@amount,
         payment_date=@paymentDate,
         method=@method,
         status=@status,
         updated_at=@now
     WHERE id=@id`
  ).run({
    id,
    memberId: payload.memberId || payment.memberId,
    subscriptionId: payload.subscriptionId || payment.subscriptionId,
    amount: payload.amount ?? payment.amount,
    paymentDate: payload.paymentDate || payment.paymentDate,
    method: payload.method || payment.method,
    status: payload.status || payment.status,
    now
  });
  return getPaymentById(id);
}

function deletePayment(id) {
  const db = getDb();
  db.prepare('DELETE FROM payments WHERE id = ?').run(id);
  return true;
}

function getReceipt(id) {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT p.display_id AS receiptId,
              p.amount,
              p.payment_date AS paymentDate,
              p.method,
              m.display_id AS memberDisplayId,
              m.name AS memberName,
              s.display_id AS subscriptionDisplayId,
              pl.name AS planName
       FROM payments p
       LEFT JOIN members m ON m.id = p.member_id
       LEFT JOIN subscriptions s ON s.id = p.subscription_id
       LEFT JOIN plans pl ON pl.id = s.plan_id
       WHERE p.id = ?`
    )
    .get(id);
  if (!row) return null;
  return {
    receiptId: row.receiptId,
    amount: row.amount,
    paymentDate: row.paymentDate,
    method: row.method,
    member: { id: row.memberDisplayId, name: row.memberName },
    subscription: { id: row.subscriptionDisplayId, planName: row.planName }
  };
}

module.exports = {
  listPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  getReceipt
};

