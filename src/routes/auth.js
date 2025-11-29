const express = require('express');
const router = express.Router();

// kontroler auth — upewnij się, że ten plik istnieje w src/controllers/authController.js
const authController = require('../controllers/authController');

// logujemy, żeby wiedzieć, że router został załadowany
console.log('Auth router loaded');

// rejestracja / logowanie
router.post('/register', authController.register);
router.post('/login', authController.login);

// eksport routera
module.exports = router;
