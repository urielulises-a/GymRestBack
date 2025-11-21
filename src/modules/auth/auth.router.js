const { Router } = require('express');
const { success, created, error } = require('../../utils/response');
const authService = require('./auth.service');

const router = Router();

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return error(res, 400, 'Email y password son requeridos');
    }
    const data = authService.login(email, password);
    return success(res, data);
  } catch (err) {
    return error(res, 401, err.message);
  }
});

router.post('/register', (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return error(res, 400, 'Faltan campos obligatorios');
    }
    const data = authService.register({ name, email, password, role });
    return created(res, data);
  } catch (err) {
    return error(res, 400, err.message);
  }
});

router.post('/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return error(res, 400, 'Email requerido');
    }
    const data = authService.forgotPassword(email);
    return success(res, data);
  } catch (err) {
    return error(res, 400, err.message);
  }
});

router.post('/logout', (req, res) => success(res, { message: 'Logout lado cliente' }));

module.exports = router;

