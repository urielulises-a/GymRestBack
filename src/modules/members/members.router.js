const { Router } = require('express');
const membersService = require('./members.service');
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
    fromDate: req.query.fromDate || null,
    toDate: req.query.toDate || null,
    sortBy: req.query.sortBy || 'createdAt',
    order: req.query.order || 'desc',
    ...pagination
  };
}

router.get('/', (req, res) => {
  try {
    const filters = buildFilters(req);
    const result = membersService.listMembers(filters);
    return success(res, result.data, buildMeta(filters.page, filters.limit, result.total));
  } catch (err) {
    return error(res, 400, err.message);
  }
});

router.get('/export', (req, res) => {
  try {
    const filters = buildFilters(req);
    // Exportar todos: aumentar límite
    filters.limit = 5000;
    filters.offset = 0;
    const result = membersService.listMembers(filters);
    const csv = toCsv(result.data, [
      { label: 'ID', value: 'displayId' },
      { label: 'Nombre', value: 'name' },
      { label: 'Correo', value: 'email' },
      { label: 'Teléfono', value: 'phone' },
      { label: 'Estado', value: 'status' },
      { label: 'Plan', value: 'planName' }
    ]);
    res.header('Content-Type', 'text/csv');
    res.attachment('members.csv');
    return res.send(csv);
  } catch (err) {
    return error(res, 400, err.message);
  }
});

router.get('/:id', (req, res) => {
  const member = membersService.getMemberById(req.params.id);
  if (!member) {
    return error(res, 404, 'Socio no encontrado');
  }
  return success(res, member);
});

router.post('/', (req, res) => {
  try {
    if (!req.body.name || !req.body.email) {
      return error(res, 400, 'Nombre y correo son obligatorios');
    }
    const member = membersService.createMember(req.body);
    return created(res, member);
  } catch (err) {
    return error(res, 400, err.message);
  }
});

router.put('/:id', (req, res) => {
  try {
    const member = membersService.updateMember(req.params.id, req.body);
    return success(res, member);
  } catch (err) {
    return error(res, 400, err.message);
  }
});

router.delete('/:id', (req, res) => {
  membersService.deleteMember(req.params.id);
  return success(res, { deleted: true });
});

module.exports = router;

