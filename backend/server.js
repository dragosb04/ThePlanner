const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

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


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Eroare la autentificare' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Email sau parolă greșită' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Eroare la autentificare' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Email sau parolă greșită' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1h'
      });

      res.status(200).json({ message: 'Autentificare reușită', token });
    });
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
