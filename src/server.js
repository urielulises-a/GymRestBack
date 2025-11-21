const http = require('http');
const app = require('./app');
const { ENV } = require('./config/env');
const { getDb } = require('./config/database');
const { initSchedulers } = require('./schedulers');

getDb();

const server = http.createServer(app);

server.listen(ENV.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`${ENV.APP_NAME} escuchando en http://localhost:${ENV.PORT}`);
});

initSchedulers();

module.exports = server;

