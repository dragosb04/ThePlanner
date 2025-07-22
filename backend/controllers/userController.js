// controllers/userController.js
const User = require('../models/user');

const userController = {
  register: (req, res) => {
    const { username, email, password, profile_picture, status } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Toate câmpurile obligatorii trebuie completate.' });
    }

    User.create({ username, email, password, profile_picture, status }, (err, result) => {
      if (err) {
        console.error('Eroare la crearea utilizatorului:', err);
        return res.status(500).json({ error: 'Eroare la crearea utilizatorului.' });
      }

      res.status(201).json({ message: 'Utilizator creat cu succes!', userId: result.insertId });
    });
  },

  getUserById: (req, res) => {
    const userId = req.params.id;

    User.findById(userId, (err, results) => {
      if (err) return res.status(500).json({ error: 'Eroare la căutarea utilizatorului.' });
      if (results.length === 0) return res.status(404).json({ error: 'Utilizatorul nu a fost găsit.' });

      res.json(results[0]);
    });
  },
  getAllUsers: (req, res) => {
    User.getAll((err, results) => {
      if (err) {
        console.error('Eroare la preluarea utilizatorilor:', err);
        return res.status(500).json({ error: 'Eroare la preluarea utilizatorilor.' });
      }

      res.json(results);
    });
  }
};

module.exports = userController;
