const db = require('./models/db.js');

function deleteExpiredEvents() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // luna începe de la 0
    const dd = String(today.getDate()).padStart(2, '0');

    const todayStr = `${yyyy}-${mm}-${dd}`;  // format YYYY-MM-DD corect în local time

    const query = 'DELETE FROM events WHERE eventDate < ?';
    console.log(todayStr); // pentru debugging
    db.query(query, [todayStr], (err, result) => {
        if (err) {
            console.error('Eroare:', err);
            return;
        }
        console.log(`${result.affectedRows} evenimente expirate au fost șterse.`);
    });
}

module.exports = { deleteExpiredEvents };