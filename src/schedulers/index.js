const cron = require('node-cron');
const {
  refreshSubscriptionStatuses,
  enqueueExpiringNotifications
} = require('../modules/subscriptions/subscriptions.service');

function initSchedulers() {
  // Corre cada día a las 03:00 AM hora del servidor.
  cron.schedule('0 3 * * *', () => {
    try {
      refreshSubscriptionStatuses();
      enqueueExpiringNotifications();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error en scheduler de suscripciones', err);
    }
  });
}

module.exports = { initSchedulers };

