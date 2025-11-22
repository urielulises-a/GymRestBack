const { Router } = require('express');
const reportsService = require('./reports.service');
const { success } = require('../../utils/response');
const { toCsv } = require('../../utils/csv');

const router = Router();

router.get('/summary', (req, res) => success(res, reportsService.getSummary()));

router.get('/export-csv', (req, res) => {
  const summary = reportsService.getSummary();
  const rows = summary.revenue.monthly.map((item) => ({
    metric: `Ingresos ${item.month}`,
    value: item.amount
  }));
  rows.push(
    { metric: 'Miembros activos', value: summary.members.active },
    { metric: 'Total miembros', value: summary.members.total },
    { metric: 'Ingreso total', value: summary.revenue.total },
    { metric: 'Asistencia promedio %', value: summary.avgAttendance },
    { metric: 'Renovación %', value: summary.renewalRate }
  );
  const csv = toCsv(rows, [
    { label: 'Métrica', value: 'metric' },
    { label: 'Valor', value: 'value' }
  ]);
  res.header('Content-Type', 'text/csv');
  res.attachment('reports.csv');
  return res.send(csv);
});

router.get('/export-pdf', (req, res) => {
  const summary = reportsService.getSummary();
  return success(res, {
    fileName: 'reports.pdf',
    generatedAt: new Date().toISOString(),
    content: Buffer.from(JSON.stringify(summary, null, 2)).toString('base64'),
    note: 'Contenido simulado: renderiza en frontend'
  });
});

module.exports = router;

