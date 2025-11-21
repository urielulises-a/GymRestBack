const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../../config/database');
const { ENV } = require('../../config/env');
const { generateId, nowISO } = require('../../utils/ids');

function mapUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    displayId: row.display_id,
    name: row.name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at
  };
}

function generateToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    ENV.JWT_SECRET,
    { expiresIn: ENV.TOKEN_EXPIRES_IN }
  );
}

function login(email, password) {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM users WHERE lower(email) = lower(?)');
  const user = stmt.get(email);
  if (!user) {
    throw new Error('Credenciales inválidas');
  }
  const isValid = bcrypt.compareSync(password, user.password_hash);
  if (!isValid) {
    throw new Error('Credenciales inválidas');
  }
  const payload = mapUser(user);
  const token = generateToken(payload);
  return { token, user: payload };
}

function register({ name, email, password, role = 'staff' }) {
  const db = getDb();
  const exists = db.prepare('SELECT id FROM users WHERE lower(email) = lower(?)').get(email);
  if (exists) {
    throw new Error('El correo ya está registrado');
  }
  const id = generateId('user-');
  const displayId = generateId('U');
  const passwordHash = bcrypt.hashSync(password, 10);
  const now = nowISO();
  db.prepare(
    `INSERT INTO users (id, display_id, name, email, password_hash, role, created_at, updated_at)
     VALUES (@id, @displayId, @name, @email, @passwordHash, @role, @now, @now)`
  ).run({ id, displayId, name, email, passwordHash, role, now });
  const user = mapUser(
    db.prepare('SELECT * FROM users WHERE id = ?').get(id)
  );
  const token = generateToken(user);
  return { token, user };
}

function forgotPassword(email) {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE lower(email) = lower(?)').get(email);
  if (!user) {
    return { message: 'Si el correo existe recibirás instrucciones' };
  }
  return { message: 'Se envió un correo de recuperación (simulado)' };
}

module.exports = {
  login,
  register,
  forgotPassword
};

