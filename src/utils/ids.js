const { v4: uuidv4 } = require('uuid');

function generateId(prefix = '') {
  const raw = uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase();
  return `${prefix}${raw}`;
}

function nowISO() {
  return new Date().toISOString();
}

module.exports = { generateId, nowISO };

