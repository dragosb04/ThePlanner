// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Înregistrare utilizator
router.post('/register', userController.register);

//me
router.get('/me', verifyToken, (req, res) => {
  const userId = req.user.userId;

  db.query('SELECT id, username, email, profile_picture, status, role FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Eroare la interogare DB' });
    if (results.length === 0) return res.status(404).json({ error: 'Utilizator inexistent' });

    res.json(results[0]);
  });
});

router.put('/me', verifyToken, userController.updateCurrentUser);

// Obține utilizator după ID
router.get('/:id', userController.getUserById);
router.get('/', userController.getAllUsers);

const jwt = require('jsonwebtoken');
const db = require('../models/db');

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware pentru verificarea tokenului
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // format: "Bearer token"

  if (!token) return res.status(401).json({ message: 'Token lipsă' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token invalid' });
    req.user = decoded; // aici avem userId-ul în decoded
    next();
  });
}

// Exemplu de răspuns pentru autentificare reușită
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Eroare la autentificare' });
    if (results.length === 0) return res.status(401).json({ message: 'Email sau parolă greșită' });

    const user = results[0];
    require('bcrypt').compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'Eroare la autentificare' });
      if (!isMatch) return res.status(401).json({ message: 'Email sau parolă greșită' });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Autentificare reușită', token });
    });
  });
});

module.exports = router;
