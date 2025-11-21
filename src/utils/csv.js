const { Parser } = require('json2csv');

function toCsv(data, fields) {
  const parser = new Parser({ fields });
  return parser.parse(data);
}

module.exports = { toCsv };

