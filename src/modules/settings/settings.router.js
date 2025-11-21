const { Router } = require('express');
const settingsService = require('./settings.service');
const { success, created } = require('../../utils/response');
const { allowRoles } = require('../../middlewares/auth');

const router = Router();

router.get('/', (req, res) => success(res, settingsService.getSettings()));

router.put('/', allowRoles('admin'), (req, res) => {
  const settings = settingsService.updateSettings(req.body);
  return success(res, settings);
});

router.post('/backup', allowRoles('admin'), (req, res) => {
  const backup = settingsService.createBackup();
  return created(res, backup);
});

router.get('/backups', allowRoles('admin'), (req, res) =>
  success(res, settingsService.listBackups())
);

module.exports = router;

