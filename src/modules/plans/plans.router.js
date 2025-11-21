const { Router } = require('express');
const plansService = require('./plans.service');
const { success, created, error } = require('../../utils/response');

const router = Router();

router.get('/', (req, res) => {
  const plans = plansService.listPlans();
  return success(res, plans);
});

router.get('/:id', (req, res) => {
  const plan = plansService.getPlanById(req.params.id);
  if (!plan) {
    return error(res, 404, 'Plan no encontrado');
  }
  return success(res, plan);
});

router.post('/', (req, res) => {
  try {
    const plan = plansService.createPlan(req.body);
    return created(res, plan);
  } catch (err) {
    return error(res, 400, err.message);
  }
});

router.put('/:id', (req, res) => {
  try {
    const plan = plansService.updatePlan(req.params.id, req.body);
    return success(res, plan);
  } catch (err) {
    return error(res, 400, err.message);
  }
});

router.delete('/:id', (req, res) => {
  plansService.deletePlan(req.params.id);
  return success(res, { deleted: true });
});

module.exports = router;

