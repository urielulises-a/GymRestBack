BEGIN TRANSACTION;

DELETE FROM notifications;
DELETE FROM backups;
DELETE FROM attendance;
DELETE FROM payments;
DELETE FROM subscriptions;
DELETE FROM members;
DELETE FROM plans;
DELETE FROM users;
DELETE FROM gym_settings;

INSERT INTO users (id, display_id, name, email, password_hash, role, created_at, updated_at)
VALUES (
  'user-admin',
  'U001',
  'Administrador',
  'admin@gymrest.test',
  '$2b$10$k5IB4nUGRpNjI1RjmkJ5n.1pd2tUl0qi.XMSytqfD/FKDrJMG8uJO',
  'admin',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

INSERT INTO plans (id, display_id, name, description, price, duration_days, features, created_at, updated_at) VALUES
('plan-basic', 'P001', 'Plan Básico', 'Acceso general', 35.00, 30, '["Gym","Locker"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('plan-premium', 'P002', 'Plan Premium', 'Clases ilimitadas', 55.00, 30, '["Gym","Locker","Clases"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('plan-annual', 'P003', 'Plan Anual', '12 meses con descuento', 500.00, 365, '["Gym","Locker","Clases","Nutrición"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO members (id, display_id, name, email, phone, join_date, status, plan_id, created_at, updated_at) VALUES
('member-1', 'M001', 'María García', 'maria@example.com', '+52 55 0000 0001', '2024-01-10T10:00:00.000Z', 'Activo', 'plan-premium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-2', 'M002', 'Luis Pérez', 'luis@example.com', '+52 55 0000 0002', '2024-02-15T10:00:00.000Z', 'Activo', 'plan-basic', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-3', 'M003', 'Ana Torres', 'ana@example.com', '+52 55 0000 0003', '2024-03-05T10:00:00.000Z', 'Suspendido', 'plan-annual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO subscriptions (id, display_id, member_id, plan_id, start_date, end_date, status, amount, created_at, updated_at) VALUES
('sub-1', 'S001', 'member-1', 'plan-premium', '2024-05-01T10:00:00.000Z', '2024-05-31T10:00:00.000Z', 'Vencida', 55.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-2', 'S002', 'member-2', 'plan-basic', '2024-11-01T10:00:00.000Z', '2024-11-30T10:00:00.000Z', 'Activa', 35.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-3', 'S003', 'member-3', 'plan-annual', '2024-01-01T10:00:00.000Z', '2024-12-31T10:00:00.000Z', 'Activa', 500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO payments (id, display_id, member_id, subscription_id, amount, payment_date, method, status, created_at, updated_at) VALUES
('pay-1', 'PAY001', 'member-1', 'sub-1', 55.00, '2024-04-30T10:00:00.000Z', 'Tarjeta', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-2', 'PAY002', 'member-2', 'sub-2', 35.00, '2024-10-30T10:00:00.000Z', 'Efectivo', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-3', 'PAY003', 'member-3', 'sub-3', 500.00, '2023-12-31T10:00:00.000Z', 'Transferencia', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO attendance (id, display_id, member_id, check_in_time, check_out_time, status, created_at, updated_at) VALUES
('att-1', 'A001', 'member-1', '2024-11-19T13:00:00.000Z', '2024-11-19T14:30:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-2', 'A002', 'member-2', '2024-11-20T13:00:00.000Z', NULL, 'En curso', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-3', 'A003', 'member-3', '2024-11-18T13:00:00.000Z', '2024-11-18T14:00:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO gym_settings (id, language, gym_name, address, phone, email, schedules, payment_methods, auto_backup, last_backup_at)
VALUES (
  1,
  'es-MX',
  'Gym Rest',
  'Av. Siempre Viva 123',
  '+52 55 1111 1111',
  'contacto@gymrest.test',
  '{"Lunes":{"open":"06:00","close":"22:00"},"Martes":{"open":"06:00","close":"22:00"},"Miércoles":{"open":"06:00","close":"22:00"},"Jueves":{"open":"06:00","close":"22:00"},"Viernes":{"open":"06:00","close":"22:00"},"Sábado":{"open":"08:00","close":"18:00"},"Domingo":{"open":"08:00","close":"14:00"}}',
  '["Efectivo","Tarjeta","Transferencia"]',
  1,
  '2024-11-01T10:00:00.000Z'
);

INSERT INTO notifications (id, type, title, message, created_at, read, payload) VALUES
('notif-1', 'payment', 'Pago confirmado', 'María García registró un pago', '2024-11-01T10:00:00.000Z', 0, '{"memberId":"member-1","amount":55}'),
('notif-2', 'attendance', 'Nuevo check-in', 'Luis Pérez acaba de registrar ingreso', '2024-11-20T13:00:00.000Z', 0, '{"memberId":"member-2"}');

COMMIT;

