const { Router } = require('express');
const notificationsService = require('./notifications.service');
const { success, error } = require('../../utils/response');

const router = Router();

router.get('/', (req, res) => {
  const notifications = notificationsService.listNotifications({
    type: req.query.type || null,
    unread: req.query.unread || null
  });
  return success(res, notifications);
});

router.post('/:id/read', (req, res) => {
  const notification = notificationsService.markNotificationAsRead(req.params.id);
  if (!notification) {
    return error(res, 404, 'Notificación no encontrada');
  }
  return success(res, notification);
});

module.exports = router;

