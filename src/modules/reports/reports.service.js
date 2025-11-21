const { DateTime } = require('luxon');
const { getDb } = require('../../config/database');

function getSummary() {
  const db = getDb();
  const totalRevenue =
    db.prepare(`SELECT IFNULL(SUM(amount), 0) as total FROM payments WHERE status = 'Completado'`).get().total || 0;
  const activeMembers =
    db.prepare(`SELECT COUNT(*) as total FROM members WHERE status = 'Activo'`).get().total || 0;
  const attendanceData = db
    .prepare(
      `SELECT COUNT(*) as total
       FROM attendance
       WHERE status = 'Completado' AND check_in_time >= ?`
    )
    .get(DateTime.now().minus({ days: 30 }).toISO());
  const avgAttendance = activeMembers ? ((attendanceData.total / activeMembers) * 100).toFixed(2) : '0.00';
  const subs = db.prepare('SELECT status, COUNT(*) as total FROM subscriptions GROUP BY status').all();
  const totalSubs = subs.reduce((acc, item) => acc + item.total, 0);
  const activeSubs = subs.find((item) => item.status === 'Activa');
  const renewalRate = totalSubs ? (((activeSubs?.total || 0) / totalSubs) * 100).toFixed(2) : '0.00';

  const revenueByMonth = [];
  const memberGrowth = [];
  for (let i = 5; i >= 0; i -= 1) {
    const monthStart = DateTime.now().minus({ months: i }).startOf('month');
    const monthEnd = monthStart.endOf('month');
    const revenue = db
      .prepare(
        `SELECT IFNULL(SUM(amount),0) as total
         FROM payments
         WHERE status='Completado' AND payment_date BETWEEN ? AND ?`
      )
      .get(monthStart.toISO(), monthEnd.toISO()).total;
    revenueByMonth.push({
      month: monthStart.toFormat('yyyy-LL'),
      amount: revenue
    });
    const members = db
      .prepare(
        `SELECT COUNT(*) as total
         FROM members
         WHERE join_date BETWEEN ? AND ?`
      )
      .get(monthStart.toISO(), monthEnd.toISO()).total;
    memberGrowth.push({
      month: monthStart.toFormat('yyyy-LL'),
      members
    });
  }

  const planDistributionRaw = db
    .prepare(
      `SELECT p.name as planName, COUNT(m.id) as total
       FROM plans p
       LEFT JOIN members m ON m.plan_id = p.id
       GROUP BY p.id`
    )
    .all();
  const totalPlans = planDistributionRaw.reduce((acc, item) => acc + item.total, 0) || 1;
  const planDistribution = planDistributionRaw.map((item) => ({
    planName: item.planName,
    percentage: ((item.total / totalPlans) * 100).toFixed(2)
  }));

  return {
    totalRevenue,
    activeMembers,
    avgAttendance: Number(avgAttendance),
    renewalRate: Number(renewalRate),
    revenueByMonth,
    memberGrowth,
    planDistribution
  };
}

module.exports = { getSummary };

