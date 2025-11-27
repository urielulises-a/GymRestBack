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

-- Usuario administrador
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

-- Planes
INSERT INTO plans (id, display_id, name, description, price, duration_days, features, created_at, updated_at) VALUES
('plan-basic', 'P001', 'Plan Básico', 'Acceso básico al gimnasio', 500.00, 30, '["Acceso al gimnasio","Vestidores","Ducha"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('plan-premium', 'P002', 'Plan Premium', 'Acceso completo con clases grupales', 800.00, 30, '["Acceso al gimnasio","Clases grupales","Entrenador personal","Nutricionista"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('plan-vip', 'P003', 'Plan VIP', 'Acceso premium con servicios exclusivos', 1200.00, 30, '["Acceso completo","Clases privadas","Masajes","Spa","Nutricionista personal"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 25 Miembros distribuidos en los últimos meses
INSERT INTO members (id, display_id, name, email, phone, join_date, status, plan_id, created_at, updated_at) VALUES
('member-1', 'M001', 'María García López', 'maria.garcia@email.com', '+52 55 1234 5678', '2025-05-15T10:00:00.000Z', 'Activo', 'plan-premium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-2', 'M002', 'Juan Pérez Martínez', 'juan.perez@email.com', '+52 55 2345 6789', '2025-06-10T10:00:00.000Z', 'Activo', 'plan-basic', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-3', 'M003', 'Ana Torres Ramírez', 'ana.torres@email.com', '+52 55 3456 7890', '2025-07-05T10:00:00.000Z', 'Activo', 'plan-vip', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-4', 'M004', 'Carlos Hernández Sánchez', 'carlos.hernandez@email.com', '+52 55 4567 8901', '2025-05-20T10:00:00.000Z', 'Activo', 'plan-basic', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-5', 'M005', 'Laura Fernández Gómez', 'laura.fernandez@email.com', '+52 55 5678 9012', '2025-06-25T10:00:00.000Z', 'Activo', 'plan-premium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-6', 'M006', 'Roberto Díaz Jiménez', 'roberto.diaz@email.com', '+52 55 6789 0123', '2025-07-12T10:00:00.000Z', 'Activo', 'plan-basic', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-7', 'M007', 'Patricia Morales Ruiz', 'patricia.morales@email.com', '+52 55 7890 1234', '2025-08-01T10:00:00.000Z', 'Activo', 'plan-premium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-8', 'M008', 'Miguel Ángel Vega', 'miguel.vega@email.com', '+52 55 8901 2345', '2025-08-15T10:00:00.000Z', 'Activo', 'plan-vip', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-9', 'M009', 'Sofía Ramírez Castro', 'sofia.ramirez@email.com', '+52 55 9012 3456', '2025-09-03T10:00:00.000Z', 'Activo', 'plan-basic', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-10', 'M010', 'Diego Mendoza López', 'diego.mendoza@email.com', '+52 55 0123 4567', '2025-09-18T10:00:00.000Z', 'Activo', 'plan-premium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-11', 'M011', 'Valentina Cruz Ortiz', 'valentina.cruz@email.com', '+52 55 1234 5679', '2025-10-05T10:00:00.000Z', 'Activo', 'plan-basic', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-12', 'M012', 'Fernando Silva Reyes', 'fernando.silva@email.com', '+52 55 2345 6780', '2025-10-20T10:00:00.000Z', 'Activo', 'plan-vip', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-13', 'M013', 'Isabella Moreno Pacheco', 'isabella.moreno@email.com', '+52 55 3456 7891', '2025-11-01T10:00:00.000Z', 'Activo', 'plan-premium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-14', 'M014', 'Andrés Gutiérrez Flores', 'andres.gutierrez@email.com', '+52 55 4567 8902', '2025-11-05T10:00:00.000Z', 'Activo', 'plan-basic', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-15', 'M015', 'Camila Ríos Navarro', 'camila.rios@email.com', '+52 55 5678 9013', '2025-11-10T10:00:00.000Z', 'Activo', 'plan-premium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-16', 'M016', 'Ricardo Delgado Campos', 'ricardo.delgado@email.com', '+52 55 6789 0124', '2025-08-22T10:00:00.000Z', 'Inactivo', 'plan-basic', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-17', 'M017', 'Gabriela Luna Méndez', 'gabriela.luna@email.com', '+52 55 7890 1235', '2025-09-10T10:00:00.000Z', 'Activo', 'plan-premium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-18', 'M018', 'Javier Espinoza Rojas', 'javier.espinoza@email.com', '+52 55 8901 2346', '2025-10-15T10:00:00.000Z', 'Activo', 'plan-basic', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-19', 'M019', 'Daniela Vargas Medina', 'daniela.vargas@email.com', '+52 55 9012 3457', '2025-11-08T10:00:00.000Z', 'Activo', 'plan-vip', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-20', 'M020', 'Alejandro Núñez Herrera', 'alejandro.nunez@email.com', '+52 55 0123 4568', '2025-11-12T10:00:00.000Z', 'Activo', 'plan-premium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-21', 'M021', 'Natalia Salazar Guzmán', 'natalia.salazar@email.com', '+52 55 1234 5680', '2025-07-20T10:00:00.000Z', 'Suspendido', 'plan-basic', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-22', 'M022', 'Eduardo Castillo Fuentes', 'eduardo.castillo@email.com', '+52 55 2345 6791', '2025-09-25T10:00:00.000Z', 'Activo', 'plan-premium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-23', 'M023', 'Mariana Juárez Ávila', 'mariana.juarez@email.com', '+52 55 3456 7902', '2025-10-28T10:00:00.000Z', 'Activo', 'plan-basic', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-24', 'M024', 'Luis Fernando Ochoa', 'luis.ochoa@email.com', '+52 55 4567 8013', '2025-11-15T10:00:00.000Z', 'Activo', 'plan-vip', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('member-25', 'M025', 'Adriana Peña Solís', 'adriana.pena@email.com', '+52 55 5678 9024', '2025-11-18T10:00:00.000Z', 'Activo', 'plan-premium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Suscripciones distribuidas en varios meses
INSERT INTO subscriptions (id, display_id, member_id, plan_id, start_date, end_date, status, amount, created_at, updated_at) VALUES
-- Mayo 2025
('sub-1', 'S001', 'member-1', 'plan-premium', '2025-05-15T10:00:00.000Z', '2025-06-14T10:00:00.000Z', 'Vencida', 800.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-2', 'S002', 'member-4', 'plan-basic', '2025-05-20T10:00:00.000Z', '2025-06-19T10:00:00.000Z', 'Vencida', 500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Junio 2025
('sub-3', 'S003', 'member-2', 'plan-basic', '2025-06-10T10:00:00.000Z', '2025-07-09T10:00:00.000Z', 'Vencida', 500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-4', 'S004', 'member-5', 'plan-premium', '2025-06-25T10:00:00.000Z', '2025-07-24T10:00:00.000Z', 'Vencida', 800.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Julio 2025
('sub-5', 'S005', 'member-3', 'plan-vip', '2025-07-05T10:00:00.000Z', '2025-08-04T10:00:00.000Z', 'Vencida', 1200.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-6', 'S006', 'member-6', 'plan-basic', '2025-07-12T10:00:00.000Z', '2025-08-11T10:00:00.000Z', 'Vencida', 500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Agosto 2025
('sub-7', 'S007', 'member-7', 'plan-premium', '2025-08-01T10:00:00.000Z', '2025-08-31T10:00:00.000Z', 'Vencida', 800.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-8', 'S008', 'member-8', 'plan-vip', '2025-08-15T10:00:00.000Z', '2025-09-14T10:00:00.000Z', 'Vencida', 1200.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-9', 'S009', 'member-16', 'plan-basic', '2025-08-22T10:00:00.000Z', '2025-09-21T10:00:00.000Z', 'Vencida', 500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Septiembre 2025
('sub-10', 'S010', 'member-9', 'plan-basic', '2025-09-03T10:00:00.000Z', '2025-10-02T10:00:00.000Z', 'Vencida', 500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-11', 'S011', 'member-17', 'plan-premium', '2025-09-10T10:00:00.000Z', '2025-10-09T10:00:00.000Z', 'Vencida', 800.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-12', 'S012', 'member-10', 'plan-premium', '2025-09-18T10:00:00.000Z', '2025-10-17T10:00:00.000Z', 'Vencida', 800.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-13', 'S013', 'member-22', 'plan-premium', '2025-09-25T10:00:00.000Z', '2025-10-24T10:00:00.000Z', 'Vencida', 800.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Octubre 2025
('sub-14', 'S014', 'member-11', 'plan-basic', '2025-10-05T10:00:00.000Z', '2025-11-04T10:00:00.000Z', 'Vencida', 500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-15', 'S015', 'member-12', 'plan-vip', '2025-10-20T10:00:00.000Z', '2025-11-19T10:00:00.000Z', 'Activa', 1200.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-16', 'S016', 'member-18', 'plan-basic', '2025-10-15T10:00:00.000Z', '2025-11-14T10:00:00.000Z', 'Vencida', 500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-17', 'S017', 'member-23', 'plan-basic', '2025-10-28T10:00:00.000Z', '2025-11-27T10:00:00.000Z', 'Activa', 500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Noviembre 2025 (actual)
('sub-18', 'S018', 'member-1', 'plan-premium', '2025-11-01T10:00:00.000Z', '2025-11-30T10:00:00.000Z', 'Activa', 800.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-19', 'S019', 'member-2', 'plan-basic', '2025-11-01T10:00:00.000Z', '2025-11-30T10:00:00.000Z', 'Activa', 500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-20', 'S020', 'member-3', 'plan-vip', '2025-11-01T10:00:00.000Z', '2025-11-30T10:00:00.000Z', 'Activa', 1200.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-21', 'S021', 'member-4', 'plan-basic', '2025-11-01T10:00:00.000Z', '2025-11-30T10:00:00.000Z', 'Activa', 500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-22', 'S022', 'member-5', 'plan-premium', '2025-11-01T10:00:00.000Z', '2025-11-30T10:00:00.000Z', 'Activa', 800.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-23', 'S023', 'member-6', 'plan-basic', '2025-11-01T10:00:00.000Z', '2025-11-30T10:00:00.000Z', 'Activa', 500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-24', 'S024', 'member-7', 'plan-premium', '2025-11-01T10:00:00.000Z', '2025-11-30T10:00:00.000Z', 'Activa', 800.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-25', 'S025', 'member-8', 'plan-vip', '2025-11-01T10:00:00.000Z', '2025-11-30T10:00:00.000Z', 'Activa', 1200.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-26', 'S026', 'member-9', 'plan-basic', '2025-11-01T10:00:00.000Z', '2025-11-30T10:00:00.000Z', 'Activa', 500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-27', 'S027', 'member-10', 'plan-premium', '2025-11-01T10:00:00.000Z', '2025-11-30T10:00:00.000Z', 'Activa', 800.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-28', 'S028', 'member-13', 'plan-premium', '2025-11-01T10:00:00.000Z', '2025-11-30T10:00:00.000Z', 'Activa', 800.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-29', 'S029', 'member-14', 'plan-basic', '2025-11-05T10:00:00.000Z', '2025-12-04T10:00:00.000Z', 'Activa', 500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-30', 'S030', 'member-15', 'plan-premium', '2025-11-10T10:00:00.000Z', '2025-12-09T10:00:00.000Z', 'Activa', 800.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-31', 'S031', 'member-17', 'plan-premium', '2025-11-01T10:00:00.000Z', '2025-11-30T10:00:00.000Z', 'Activa', 800.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-32', 'S032', 'member-18', 'plan-basic', '2025-11-01T10:00:00.000Z', '2025-11-30T10:00:00.000Z', 'Activa', 500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-33', 'S033', 'member-19', 'plan-vip', '2025-11-08T10:00:00.000Z', '2025-12-07T10:00:00.000Z', 'Activa', 1200.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-34', 'S034', 'member-20', 'plan-premium', '2025-11-12T10:00:00.000Z', '2025-12-11T10:00:00.000Z', 'Activa', 800.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-35', 'S035', 'member-22', 'plan-premium', '2025-11-01T10:00:00.000Z', '2025-11-30T10:00:00.000Z', 'Activa', 800.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-36', 'S036', 'member-24', 'plan-vip', '2025-11-15T10:00:00.000Z', '2025-12-14T10:00:00.000Z', 'Activa', 1200.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sub-37', 'S037', 'member-25', 'plan-premium', '2025-11-18T10:00:00.000Z', '2025-12-17T10:00:00.000Z', 'Activa', 800.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Pagos distribuidos en los últimos 6 meses para gráficas
INSERT INTO payments (id, display_id, member_id, subscription_id, amount, payment_date, method, status, created_at, updated_at) VALUES
-- Mayo 2025
('pay-1', 'PAY001', 'member-1', 'sub-1', 800.00, '2025-05-15T10:00:00.000Z', 'Tarjeta', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-2', 'PAY002', 'member-4', 'sub-2', 500.00, '2025-05-20T10:00:00.000Z', 'Efectivo', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Junio 2025
('pay-3', 'PAY003', 'member-2', 'sub-3', 500.00, '2025-06-10T10:00:00.000Z', 'Transferencia', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-4', 'PAY004', 'member-5', 'sub-4', 800.00, '2025-06-25T10:00:00.000Z', 'Tarjeta', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-5', 'PAY005', 'member-1', 'sub-1', 800.00, '2025-06-15T10:00:00.000Z', 'Tarjeta', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Julio 2025
('pay-6', 'PAY006', 'member-3', 'sub-5', 1200.00, '2025-07-05T10:00:00.000Z', 'Transferencia', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-7', 'PAY007', 'member-6', 'sub-6', 500.00, '2025-07-12T10:00:00.000Z', 'Efectivo', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-8', 'PAY008', 'member-4', 'sub-2', 500.00, '2025-07-20T10:00:00.000Z', 'Efectivo', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Agosto 2025
('pay-9', 'PAY009', 'member-7', 'sub-7', 800.00, '2025-08-01T10:00:00.000Z', 'Tarjeta', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-10', 'PAY010', 'member-8', 'sub-8', 1200.00, '2025-08-15T10:00:00.000Z', 'Transferencia', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-11', 'PAY011', 'member-16', 'sub-9', 500.00, '2025-08-22T10:00:00.000Z', 'Efectivo', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-12', 'PAY012', 'member-1', 'sub-1', 800.00, '2025-08-15T10:00:00.000Z', 'Tarjeta', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Septiembre 2025
('pay-13', 'PAY013', 'member-9', 'sub-10', 500.00, '2025-09-03T10:00:00.000Z', 'Efectivo', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-14', 'PAY014', 'member-17', 'sub-11', 800.00, '2025-09-10T10:00:00.000Z', 'Tarjeta', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-15', 'PAY015', 'member-10', 'sub-12', 800.00, '2025-09-18T10:00:00.000Z', 'Transferencia', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-16', 'PAY016', 'member-22', 'sub-13', 800.00, '2025-09-25T10:00:00.000Z', 'Tarjeta', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-17', 'PAY017', 'member-2', 'sub-3', 500.00, '2025-09-10T10:00:00.000Z', 'Efectivo', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-18', 'PAY018', 'member-5', 'sub-4', 800.00, '2025-09-25T10:00:00.000Z', 'Tarjeta', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Octubre 2025
('pay-19', 'PAY019', 'member-11', 'sub-14', 500.00, '2025-10-05T10:00:00.000Z', 'Efectivo', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-20', 'PAY020', 'member-12', 'sub-15', 1200.00, '2025-10-20T10:00:00.000Z', 'Transferencia', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-21', 'PAY021', 'member-18', 'sub-16', 500.00, '2025-10-15T10:00:00.000Z', 'Efectivo', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-22', 'PAY022', 'member-23', 'sub-17', 500.00, '2025-10-28T10:00:00.000Z', 'Tarjeta', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-23', 'PAY023', 'member-3', 'sub-5', 1200.00, '2025-10-05T10:00:00.000Z', 'Transferencia', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-24', 'PAY024', 'member-6', 'sub-6', 500.00, '2025-10-12T10:00:00.000Z', 'Efectivo', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-25', 'PAY025', 'member-7', 'sub-7', 800.00, '2025-10-01T10:00:00.000Z', 'Tarjeta', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-26', 'PAY026', 'member-8', 'sub-8', 1200.00, '2025-10-15T10:00:00.000Z', 'Transferencia', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Noviembre 2025 (actual)
('pay-27', 'PAY027', 'member-1', 'sub-18', 800.00, '2025-11-01T10:00:00.000Z', 'Tarjeta', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-28', 'PAY028', 'member-2', 'sub-19', 500.00, '2025-11-01T10:00:00.000Z', 'Efectivo', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-29', 'PAY029', 'member-3', 'sub-20', 1200.00, '2025-11-01T10:00:00.000Z', 'Transferencia', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-30', 'PAY030', 'member-4', 'sub-21', 500.00, '2025-11-01T10:00:00.000Z', 'Efectivo', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-31', 'PAY031', 'member-5', 'sub-22', 800.00, '2025-11-01T10:00:00.000Z', 'Tarjeta', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-32', 'PAY032', 'member-6', 'sub-23', 500.00, '2025-11-01T10:00:00.000Z', 'Efectivo', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-33', 'PAY033', 'member-7', 'sub-24', 800.00, '2025-11-01T10:00:00.000Z', 'Tarjeta', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-34', 'PAY034', 'member-8', 'sub-25', 1200.00, '2025-11-01T10:00:00.000Z', 'Transferencia', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-35', 'PAY035', 'member-9', 'sub-26', 500.00, '2025-11-01T10:00:00.000Z', 'Efectivo', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-36', 'PAY036', 'member-10', 'sub-27', 800.00, '2025-11-01T10:00:00.000Z', 'Tarjeta', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-37', 'PAY037', 'member-13', 'sub-28', 800.00, '2025-11-01T10:00:00.000Z', 'Tarjeta', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-38', 'PAY038', 'member-14', 'sub-29', 500.00, '2025-11-05T10:00:00.000Z', 'Efectivo', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-39', 'PAY039', 'member-15', 'sub-30', 800.00, '2025-11-10T10:00:00.000Z', 'Tarjeta', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-40', 'PAY040', 'member-17', 'sub-31', 800.00, '2025-11-01T10:00:00.000Z', 'Transferencia', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-41', 'PAY041', 'member-18', 'sub-32', 500.00, '2025-11-01T10:00:00.000Z', 'Efectivo', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-42', 'PAY042', 'member-19', 'sub-33', 1200.00, '2025-11-08T10:00:00.000Z', 'Transferencia', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-43', 'PAY043', 'member-20', 'sub-34', 800.00, '2025-11-12T10:00:00.000Z', 'Tarjeta', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-44', 'PAY044', 'member-22', 'sub-35', 800.00, '2025-11-01T10:00:00.000Z', 'Tarjeta', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-45', 'PAY045', 'member-24', 'sub-36', 1200.00, '2025-11-15T10:00:00.000Z', 'Transferencia', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('pay-46', 'PAY046', 'member-25', 'sub-37', 800.00, '2025-11-18T10:00:00.000Z', 'Tarjeta', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Asistencias distribuidas en diferentes días
INSERT INTO attendance (id, display_id, member_id, check_in_time, check_out_time, status, created_at, updated_at) VALUES
-- Noviembre 2025 - Días anteriores
('att-1', 'A001', 'member-1', '2025-11-20T08:30:00.000Z', '2025-11-20T10:15:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-2', 'A002', 'member-2', '2025-11-20T09:00:00.000Z', '2025-11-20T11:00:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-3', 'A003', 'member-3', '2025-11-20T10:30:00.000Z', '2025-11-20T12:00:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-4', 'A004', 'member-4', '2025-11-20T14:00:00.000Z', '2025-11-20T15:30:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-5', 'A005', 'member-5', '2025-11-20T16:00:00.000Z', '2025-11-20T17:30:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-6', 'A006', 'member-6', '2025-11-21T07:00:00.000Z', '2025-11-21T08:30:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-7', 'A007', 'member-7', '2025-11-21T08:00:00.000Z', '2025-11-21T09:45:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-8', 'A008', 'member-8', '2025-11-21T09:30:00.000Z', '2025-11-21T11:15:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-9', 'A009', 'member-9', '2025-11-21T12:00:00.000Z', '2025-11-21T13:30:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-10', 'A010', 'member-10', '2025-11-21T17:00:00.000Z', '2025-11-21T18:30:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-11', 'A011', 'member-11', '2025-11-22T08:00:00.000Z', '2025-11-22T09:30:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-12', 'A012', 'member-12', '2025-11-22T10:00:00.000Z', '2025-11-22T11:45:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-13', 'A013', 'member-13', '2025-11-22T14:30:00.000Z', '2025-11-22T16:00:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-14', 'A014', 'member-14', '2025-11-22T18:00:00.000Z', '2025-11-22T19:30:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-15', 'A015', 'member-15', '2025-11-23T07:30:00.000Z', '2025-11-23T09:00:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-16', 'A016', 'member-1', '2025-11-23T09:00:00.000Z', '2025-11-23T10:30:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-17', 'A017', 'member-2', '2025-11-23T11:00:00.000Z', '2025-11-23T12:30:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-18', 'A018', 'member-3', '2025-11-23T15:00:00.000Z', '2025-11-23T16:30:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-19', 'A019', 'member-4', '2025-11-24T08:00:00.000Z', '2025-11-24T09:30:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-20', 'A020', 'member-5', '2025-11-24T10:00:00.000Z', '2025-11-24T11:45:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-21', 'A021', 'member-6', '2025-11-24T13:00:00.000Z', '2025-11-24T14:30:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-22', 'A022', 'member-7', '2025-11-24T17:00:00.000Z', '2025-11-24T18:30:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-23', 'A023', 'member-8', '2025-11-25T08:30:00.000Z', '2025-11-25T10:00:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-24', 'A024', 'member-9', '2025-11-25T11:00:00.000Z', '2025-11-25T12:30:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-25', 'A025', 'member-10', '2025-11-25T14:00:00.000Z', '2025-11-25T15:30:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-26', 'A026', 'member-11', '2025-11-25T16:00:00.000Z', '2025-11-25T17:30:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-27', 'A027', 'member-12', '2025-11-26T07:00:00.000Z', '2025-11-26T08:30:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-28', 'A028', 'member-13', '2025-11-26T09:00:00.000Z', '2025-11-26T10:30:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-29', 'A029', 'member-14', '2025-11-26T12:00:00.000Z', '2025-11-26T13:30:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-30', 'A030', 'member-15', '2025-11-26T15:00:00.000Z', '2025-11-26T16:30:00.000Z', 'Completado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Asistencias en curso (hoy)
('att-31', 'A031', 'member-1', '2025-11-27T08:00:00.000Z', NULL, 'En curso', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-32', 'A032', 'member-2', '2025-11-27T09:30:00.000Z', NULL, 'En curso', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-33', 'A033', 'member-3', '2025-11-27T10:00:00.000Z', NULL, 'En curso', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-34', 'A034', 'member-4', '2025-11-27T14:00:00.000Z', NULL, 'En curso', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('att-35', 'A035', 'member-5', '2025-11-27T16:00:00.000Z', NULL, 'En curso', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Configuración del gimnasio
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
  '2025-11-01T10:00:00.000Z'
);

-- Notificaciones recientes
INSERT INTO notifications (id, type, title, message, created_at, read, payload) VALUES
('notif-1', 'payment', 'Pago confirmado', 'María García López registró un pago de $800.00', '2025-11-01T10:00:00.000Z', 0, '{"memberId":"member-1","amount":800}'),
('notif-2', 'payment', 'Pago confirmado', 'Juan Pérez Martínez registró un pago de $500.00', '2025-11-01T10:00:00.000Z', 0, '{"memberId":"member-2","amount":500}'),
('notif-3', 'attendance', 'Nuevo check-in', 'Ana Torres Ramírez acaba de registrar ingreso', '2025-11-27T10:00:00.000Z', 0, '{"memberId":"member-3"}'),
('notif-4', 'attendance', 'Nuevo check-in', 'Carlos Hernández Sánchez acaba de registrar ingreso', '2025-11-27T14:00:00.000Z', 0, '{"memberId":"member-4"}'),
('notif-5', 'payment', 'Pago confirmado', 'Luis Fernando Ochoa registró un pago de $1,200.00', '2025-11-15T10:00:00.000Z', 0, '{"memberId":"member-24","amount":1200}'),
('notif-6', 'attendance', 'Nuevo check-in', 'Laura Fernández Gómez acaba de registrar ingreso', '2025-11-27T16:00:00.000Z', 0, '{"memberId":"member-5"}'),
('notif-7', 'payment', 'Pago confirmado', 'Adriana Peña Solís registró un pago de $800.00', '2025-11-18T10:00:00.000Z', 0, '{"memberId":"member-25","amount":800}'),
('notif-8', 'attendance', 'Nuevo check-in', 'Roberto Díaz Jiménez acaba de registrar ingreso', '2025-11-27T08:00:00.000Z', 0, '{"memberId":"member-6"}');

COMMIT;
