const jwt = require('jsonwebtoken');
const { ENV } = require('../config/env');
const { error } = require('../utils/response');

function authGuard(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return error(res, 401, 'Token requerido');
  }
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, ENV.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return error(res, 401, 'Token inválido');
  }
}

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return error(res, 403, 'No autorizado');
    }
    return next();
  };
}

module.exports = { authGuard, allowRoles };

