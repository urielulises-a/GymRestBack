const { ENV } = require('../config/env');
const { error } = require('../utils/response');

function notFoundHandler(req, res) {
  return error(res, 404, 'Recurso no encontrado');
}

function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Error inesperado';
  const details = ENV.NODE_ENV === 'development' ? err.stack : null;
  return error(res, status, message, details);
}

module.exports = { notFoundHandler, errorHandler };

