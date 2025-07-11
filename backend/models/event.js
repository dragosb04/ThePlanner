// models/Event.js
const db = require('./db');

const Event = {
    create: (eventData, callback) => {
        const sql = `INSERT INTO events (name, eventDate, eventTime, groups, location, details, creator)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            eventData.name,
            eventData.eventDate,
            eventData.eventTime,
            eventData.groups,
            eventData.location,
            eventData.details,
            eventData.creator,
        ];

        db.query(sql, values, (err, result) => {
            if (err) return callback(err);
            callback(null, result.insertId); // returnează ID-ul noului eveniment
        });
    
    },

    getAll: (callback) => {
        db.query('SELECT * FROM events', callback);
    },

    getById: (id, callback) => {
        db.query('SELECT * FROM events WHERE id = ?', [id], callback);
    },

    update: (id, eventData, callback) => {
        const sql = `UPDATE events SET name=?, eventDate=?, eventTime=?, groups=?, location=?, details=?
                 WHERE id = ?`;
        const values = [
            eventData.name,
            eventData.eventDate,
            eventData.eventTime,
            eventData.groups,
            eventData.location,
            eventData.details,
            id,
        ];
        db.query(sql, values, callback);
    },

    delete: (id, callback) => {
        db.query('DELETE FROM events WHERE id = ?', [id], callback);
    },
};

module.exports = Event;
