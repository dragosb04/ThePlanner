const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models/db');

const app = express();
const PORT = process.env.PORT || 3000;
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Serverul rulează corect!');
});

//Add routes
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

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
