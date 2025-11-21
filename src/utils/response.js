function success(res, data = null, meta = {}) {
  return res.json({ data, meta, errors: [] });
}

function created(res, data = null, meta = {}) {
  return res.status(201).json({ data, meta, errors: [] });
}

function error(res, status = 500, message = 'Error interno', details = null) {
  return res.status(status).json({
    data: null,
    meta: {},
    errors: [{ message, details }]
  });
}

module.exports = {
  success,
  created,
  error
};

