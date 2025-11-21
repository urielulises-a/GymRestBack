const { Router } = require('express');
const attendanceService = require('./attendance.service');
const { success, created, error } = require('../../utils/response');
const { getPagination, buildMeta } = require('../../utils/pagination');
const { toCsv } = require('../../utils/csv');

const router = Router();

function buildFilters(req) {
  const pagination = getPagination(req.query);
  return {
    search: req.query.search || null,
    memberId: req.query.memberId || null,
    status: req.query.status || null,
    dateFrom: req.query.dateFrom || null,
    dateTo: req.query.dateTo || null,
    sortBy: req.query.sortBy || 'checkInTime',
    order: req.query.order || 'desc',
    ...pagination
  };
}

router.get('/', (req, res) => {
  const filters = buildFilters(req);
  const result = attendanceService.listAttendance(filters);
  return success(res, result.data, buildMeta(filters.page, filters.limit, result.total));
});

router.get('/export', (req, res) => {
  const filters = buildFilters(req);
  filters.limit = 5000;
  filters.offset = 0;
  const result = attendanceService.listAttendance(filters);
  const csv = toCsv(result.data, [
    { label: 'ID', value: 'displayId' },
    { label: 'Miembro', value: 'memberName' },
    { label: 'Entrada', value: 'checkInTime' },
    { label: 'Salida', value: 'checkOutTime' },
    { label: 'Estado', value: 'status' }
  ]);
  res.header('Content-Type', 'text/csv');
  res.attachment('attendance.csv');
  return res.send(csv);
});

router.post('/check-in', (req, res) => {
  try {
    if (!req.body.memberId) {
      return error(res, 400, 'memberId requerido');
    }
    const record = attendanceService.checkIn(req.body.memberId);
    return created(res, record);
  } catch (err) {
    return error(res, 400, err.message);
  }
});

router.post('/check-out/:id', (req, res) => {
  try {
    const record = attendanceService.checkOut(req.params.id);
    return success(res, record);
  } catch (err) {
    return error(res, 400, err.message);
  }
});

router.get('/:id', (req, res) => {
  const record = attendanceService.getAttendanceById(req.params.id);
  if (!record) return error(res, 404, 'Registro no encontrado');
  return success(res, record);
});

router.put('/:id', (req, res) => {
  try {
    const record = attendanceService.updateAttendance(req.params.id, req.body);
    return success(res, record);
  } catch (err) {
    return error(res, 400, err.message);
  }
});

router.delete('/:id', (req, res) => {
  attendanceService.deleteAttendance(req.params.id);
  return success(res, { deleted: true });
});

module.exports = router;

