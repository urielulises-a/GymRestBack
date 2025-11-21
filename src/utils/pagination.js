function getPagination(query) {
  const page = Math.max(parseInt(query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(query.limit || '20', 10), 1), 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

function buildMeta(page, limit, total) {
  const totalPages = Math.ceil(total / limit) || 1;
  return { page, limit, total, totalPages };
}

module.exports = { getPagination, buildMeta };

