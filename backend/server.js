const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const db = require('./models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3001', // frontend URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');

//Login and Register
const JWT_SECRET = process.env.JWT_SECRET;

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii.' });
  }

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Eroare la verificarea utilizatorului.' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Utilizatorul există deja.' });
    }

    // Hash parola
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Eroare la criptarea parolei.' });
      }

      db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Eroare la crearea utilizatorului.' });
          }
          res.status(201).json({ message: 'Utilizator creat cu succes.' });
        }
      );
    });
  });
});


const COOKIE_EXPIRES_IN_DAYS = 7;

function generateAccessToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: `${COOKIE_EXPIRES_IN_DAYS}d` });
}

app.post('/login', (req, res) => {
    console.log('Body primit:', req.body);
  console.log('Cookies primite:', req.cookies);
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Eroare la autentificare' });
    if (results.length === 0) return res.status(401).json({ message: 'Email sau parolă greșită' });

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) return res.status(401).json({ message: 'Email sau parolă greșită' });

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // trimitem refresh token ca HttpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,       // IMPORTANT: la localhost să fie false
        sameSite: 'Lax',     // sau 'None' + secure: true, dar ai nevoie de HTTPS
        maxAge: COOKIE_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
      });
      console.log('Cookie refreshToken set.');
      res.json({ accessToken });
    });
  });
});

app.get('/test-cookie', (req, res) => {
  res.cookie('test', '12345', { httpOnly: true, secure: false });
  res.send('Cookie setat');
});

app.post('/api/refresh-token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token lipsă' });
  }

  jwt.verify(refreshToken, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Refresh token invalid' });
    }
    const userId = decoded.id;
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
      if (err || results.length === 0) {
        return res.status(403).json({ message: 'Utilizator inexistent' });
      }
      const user = results[0];
      const newAccessToken = generateAccessToken(user);
      res.json({ accessToken: newAccessToken });
    });
  });
});

app.put('/api/settings', (req, res) => {
  // Preia profilePicture din body și mapează-l la profile_picture
  const { username, email, profilePicture, status, role } = req.body;

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token lipsă sau invalid' });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token invalid' });
    }

    const userId = decoded.id;
    db.query(
      'UPDATE users SET username = ?, email = ?, profile_picture = ?, status = ?, role = ? WHERE id = ?',
      [username, email, profilePicture || null, status || null, role || null, userId],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Eroare la actualizarea setărilor' });
        }
        res.status(200).json({ message: 'Setările au fost actualizate cu succes' });
      }
    );
  });
});

app.get('/api/events/search', (req, res) => {
  const searchQuery = req.query.q;

  if (!searchQuery) return res.status(400).json({ message: 'Căutare goală' });

  const sql = 'SELECT * FROM events WHERE name LIKE ?';
  db.query(sql, [`%${searchQuery}%`], (err, results) => {
    if (err) return res.status(500).json({ message: 'Eroare server' });
    res.json(results);
  });
});


// Test route
app.get('/', (req, res) => {
  res.send('Serverul rulează corect!');
});

//Add routes
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);

// Test DB
app.get('/test-db', (req, res) => {
  db.query('SELECT NOW() AS now', (err, result) => {
    if (err) {
      return res.status(500).send('Eroare DB');
    }
    res.send(`DB conectată! Ora serverului: ${result[0].now}`);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Serverul rulează pe portul ${PORT}`);
});
