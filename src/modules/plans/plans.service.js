const { getDb } = require('../../config/database');
const { generateId, nowISO } = require('../../utils/ids');

function mapPlan(row) {
  if (!row) return null;
  return {
    id: row.id,
    displayId: row.display_id,
    name: row.name,
    description: row.description,
    price: row.price,
    durationDays: row.duration_days,
    features: row.features ? JSON.parse(row.features) : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function listPlans() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM plans ORDER BY price ASC').all();
  return rows.map(mapPlan);
}

function getPlanById(id) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM plans WHERE id = ?').get(id);
  return mapPlan(row);
}

function createPlan(payload) {
  const db = getDb();
  const id = generateId('plan-');
  const displayId = generateId('P');
  const now = nowISO();
  const features = JSON.stringify(payload.features || []);
  db.prepare(
    `INSERT INTO plans (id, display_id, name, description, price, duration_days, features, created_at, updated_at)
     VALUES (@id, @displayId, @name, @description, @price, @durationDays, @features, @now, @now)`
  ).run({
    id,
    displayId,
    name: payload.name,
    description: payload.description || '',
    price: payload.price,
    durationDays: payload.durationDays,
    features,
    now
  });
  return getPlanById(id);
}

function updatePlan(id, payload) {
  const db = getDb();
  const plan = getPlanById(id);
  if (!plan) {
    throw new Error('Plan no encontrado');
  }
  const now = nowISO();
  db.prepare(
    `UPDATE plans
     SET name=@name,
         description=@description,
         price=@price,
         duration_days=@durationDays,
         features=@features,
         updated_at=@now
     WHERE id=@id`
  ).run({
    id,
    name: payload.name ?? plan.name,
    description: payload.description ?? plan.description,
    price: payload.price ?? plan.price,
    durationDays: payload.durationDays ?? plan.durationDays,
    features: JSON.stringify(payload.features ?? plan.features),
    now
  });
  return getPlanById(id);
}

function deletePlan(id) {
  const db = getDb();
  db.prepare('DELETE FROM plans WHERE id = ?').run(id);
  return true;
}

module.exports = {
  listPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan
};

