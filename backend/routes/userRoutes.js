// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Înregistrare utilizator
router.post('/register', userController.register);

// Obține utilizator după ID
router.get('/:id', userController.getUserById);

module.exports = router;
