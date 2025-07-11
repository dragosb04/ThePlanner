const db = require('./db');

const User = {
  // Înregistrează un nou utilizator
  create: (userData, callback) => {
    const sql = `
      INSERT INTO users (username, email, password, profile_picture, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      userData.username,
      userData.email,
      userData.password,
      userData.profile_picture || null,
      userData.status || null
    ];
    db.query(sql, values, callback);
  },

  // Găsește un user după email (folosit la login)
  findByEmail: (email, callback) => {
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [email], callback);
  },

  // Găsește un user după ID
  findById: (id, callback) => {
    const sql = `SELECT * FROM users WHERE id = ?`;
    db.query(sql, [id], callback);
  },

  // Actualizează datele unui user (ex: în pagina de Setări)
  update: (id, updatedData, callback) => {
    const sql = `
      UPDATE users SET
        username = ?,
        email = ?,
        profile_picture = ?,
        status = ?
      WHERE id = ?
    `;
    const values = [
      updatedData.username,
      updatedData.email,
      updatedData.profile_picture || null,
      updatedData.status || null,
      id
    ];
    db.query(sql, values, callback);
  }
};

module.exports = User;
