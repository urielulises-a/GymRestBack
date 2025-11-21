const { Router } = require('express');
const subscriptionsService = require('./subscriptions.service');
const { success, created, error } = require('../../utils/response');
const { getPagination, buildMeta } = require('../../utils/pagination');
const { toCsv } = require('../../utils/csv');

const router = Router();

function buildFilters(req) {
  const pagination = getPagination(req.query);
  return {
    search: req.query.search || null,
    status: req.query.status || null,
    planId: req.query.planId || null,
    memberId: req.query.memberId || null,
    startFrom: req.query.startFrom || null,
    startTo: req.query.startTo || null,
    sortBy: req.query.sortBy || 'startDate',
    order: req.query.order || 'desc',
    ...pagination
  };
}

router.get('/', (req, res) => {
  const filters = buildFilters(req);
  const result = subscriptionsService.listSubscriptions(filters);
  return success(res, result.data, buildMeta(filters.page, filters.limit, result.total));
});

router.get('/export', (req, res) => {
  try {
    const filters = buildFilters(req);
    filters.limit = 5000;
    filters.offset = 0;
    const result = subscriptionsService.listSubscriptions(filters);
    const csv = toCsv(result.data, [
      { label: 'ID', value: 'displayId' },
      { label: 'Miembro', value: 'memberName' },
      { label: 'Plan', value: 'planName' },
      { label: 'Inicio', value: 'startDate' },
      { label: 'Fin', value: 'endDate' },
      { label: 'Estado', value: 'status' }
    ]);
    res.header('Content-Type', 'text/csv');
    res.attachment('subscriptions.csv');
    return res.send(csv);
  } catch (err) {
    return error(res, 400, err.message);
  }
});

router.get('/:id', (req, res) => {
  const subscription = subscriptionsService.getSubscriptionById(req.params.id);
  if (!subscription) {
    return error(res, 404, 'Suscripción no encontrada');
  }
  return success(res, subscription);
});

router.post('/', (req, res) => {
  try {
    if (!req.body.memberId || !req.body.planId) {
      return error(res, 400, 'memberId y planId son obligatorios');
    }
    const subscription = subscriptionsService.createSubscription(req.body);
    return created(res, subscription);
  } catch (err) {
    return error(res, 400, err.message);
  }
});

router.put('/:id', (req, res) => {
  try {
    const subscription = subscriptionsService.updateSubscription(req.params.id, req.body);
    return success(res, subscription);
  } catch (err) {
    return error(res, 400, err.message);
  }
});

router.delete('/:id', (req, res) => {
  subscriptionsService.deleteSubscription(req.params.id);
  return success(res, { deleted: true });
});

module.exports = router;

