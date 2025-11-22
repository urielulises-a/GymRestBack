const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { ENV } = require('./config/env');
const { notFoundHandler, errorHandler } = require('./middlewares/error-handler');
const authRouter = require('./modules/auth/auth.router');
const membersRouter = require('./modules/members/members.router');
const plansRouter = require('./modules/plans/plans.router');
const subscriptionsRouter = require('./modules/subscriptions/subscriptions.router');
const paymentsRouter = require('./modules/payments/payments.router');
const attendanceRouter = require('./modules/attendance/attendance.router');
const settingsRouter = require('./modules/settings/settings.router');
const notificationsRouter = require('./modules/notifications/notifications.router');
const reportsRouter = require('./modules/reports/reports.router');
const { authGuard } = require('./middlewares/auth');
const { success } = require('./utils/response');

const app = express();

const allowedOrigins = ENV.FRONTEND_ORIGIN.split(',').map((origin) => origin.trim());

console.log('Orígenes permitidos:', allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      console.log('Petición desde origen:', origin);
      // Permitir peticiones sin origen (Postman, curl, etc.) o desde localhost
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        return callback(null, origin);
      }
      console.log('Origen rechazado:', origin);
      return callback(new Error('Origen no permitido'));
    },
    credentials: true
  })
);

app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/v1/health', (req, res) =>
  success(res, {
    name: ENV.APP_NAME,
    status: 'ok',
    timestamp: new Date().toISOString()
  })
);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/members', authGuard, membersRouter);
app.use('/api/v1/plans', authGuard, plansRouter);
app.use('/api/v1/subscriptions', authGuard, subscriptionsRouter);
app.use('/api/v1/payments', authGuard, paymentsRouter);
app.use('/api/v1/attendance', authGuard, attendanceRouter);
app.use('/api/v1/settings', authGuard, settingsRouter);
app.use('/api/v1/notifications', authGuard, notificationsRouter);
app.use('/api/v1/reports', authGuard, reportsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

