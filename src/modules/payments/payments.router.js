const { Router } = require('express');
const paymentsService = require('./payments.service');
const { success, created, error } = require('../../utils/response');
const { getPagination, buildMeta } = require('../../utils/pagination');
const { toCsv } = require('../../utils/csv');

const router = Router();

function buildFilters(req) {
  const pagination = getPagination(req.query);
  return {
    search: req.query.search || null,
    memberId: req.query.memberId || null,
    method: req.query.method || null,
    status: req.query.status || null,
    dateFrom: req.query.dateFrom || null,
    dateTo: req.query.dateTo || null,
    sortBy: req.query.sortBy || 'paymentDate',
    order: req.query.order || 'desc',
    ...pagination
  };
}

router.get('/', (req, res) => {
  const filters = buildFilters(req);
  const result = paymentsService.listPayments(filters);
  return success(res, result.data, buildMeta(filters.page, filters.limit, result.total));
});

router.get('/export', (req, res) => {
  try {
    const filters = buildFilters(req);
    filters.limit = 5000;
    filters.offset = 0;
    const result = paymentsService.listPayments(filters);
    const csv = toCsv(result.data, [
      { label: 'ID', value: 'displayId' },
      { label: 'Miembro', value: 'memberName' },
      { label: 'Plan', value: 'planName' },
      { label: 'Fecha', value: 'paymentDate' },
      { label: 'Monto', value: 'amount' },
      { label: 'Método', value: 'method' },
      { label: 'Estado', value: 'status' }
    ]);
    res.header('Content-Type', 'text/csv');
    res.attachment('payments.csv');
    return res.send(csv);
  } catch (err) {
    return error(res, 400, err.message);
  }
});

router.get('/:id', (req, res) => {
  const payment = paymentsService.getPaymentById(req.params.id);
  if (!payment) {
    return error(res, 404, 'Pago no encontrado');
  }
  return success(res, payment);
});

router.get('/:id/receipt', (req, res) => {
  const receipt = paymentsService.getReceipt(req.params.id);
  if (!receipt) {
    return error(res, 404, 'Recibo no disponible');
  }
  return success(res, receipt);
});

router.post('/', (req, res) => {
  try {
    if (!req.body.memberId || !req.body.subscriptionId) {
      return error(res, 400, 'memberId y subscriptionId son obligatorios');
    }
    const payment = paymentsService.createPayment(req.body);
    return created(res, payment);
  } catch (err) {
    return error(res, 400, err.message);
  }
});

router.put('/:id', (req, res) => {
  try {
    const payment = paymentsService.updatePayment(req.params.id, req.body);
    return success(res, payment);
  } catch (err) {
    return error(res, 400, err.message);
  }
});

router.delete('/:id', (req, res) => {
  paymentsService.deletePayment(req.params.id);
  return success(res, { deleted: true });
});

module.exports = router;

