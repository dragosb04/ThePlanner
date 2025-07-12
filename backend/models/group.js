const db = require('./db');

const Group = {
    // Creează un nou grup
    create: (groupData, callback) => {
        const { name, owner_id, members } = groupData;
        if (!name || !owner_id) {
            return callback(new Error("Name și owner_id sunt obligatorii."));
        }
        const insertGroupSql = `INSERT INTO groups (name, owner_id) VALUES (?, ?)`;
        db.query(insertGroupSql, [name, owner_id], (err, result) => {
            if (err) return callback(err);
            const groupId = result.insertId;

            if (members && members.length > 0) {
                const values = members.map(userId => [groupId, userId]);
                const insertMembersSql = `INSERT INTO group_members (group_id, user_id) VALUES ?`;

                db.query(insertMembersSql, [values], (err2) => {
                    if (err2) return callback(err2);
                    callback(null, groupId);
                });
            } else {
                callback(null, groupId);
            }
        });
    },

    // Actualizează numele grupului
    updateName: (groupId, newName, callback) => {
        db.query(`UPDATE groups SET name = ? WHERE id = ?`, [newName, groupId], callback);
    },

    // Șterge grupul și membrii
    delete: (groupId, callback) => {
        db.query(`DELETE FROM group_members WHERE group_id = ?`, [groupId], (err) => {
            if (err) return callback(err);
            db.query(`DELETE FROM groups WHERE id = ?`, [groupId], callback);
        });
    },

    // Obține toate grupurile create de un user
    getAllForUser: (userId, callback) => {
        const sql = `SELECT * FROM groups WHERE owner_id = ?`;
        db.query(sql, [userId], callback);
    },

    // Obține un grup după ID + membri
    getById: (groupId, callback) => {
        const sql = `SELECT * FROM groups WHERE id = ?`;
        db.query(sql, [groupId], (err, groupResults) => {
            if (err) return callback(err);
            if (groupResults.length === 0) return callback(null, null);

            const group = groupResults[0];

            db.query(
                `SELECT user_id FROM group_members WHERE group_id = ?`,
                [groupId],
                (err2, memberResults) => {
                    if (err2) return callback(err2);
                    group.members = memberResults.map(row => row.user_id);
                    callback(null, group);
                }
            );
        });
    },

    // Adaugă un user într-un grup
    addUser: (groupId, userId, callback) => {
        db.query(
            `INSERT IGNORE INTO group_members (group_id, user_id) VALUES (?, ?)`,
            [groupId, userId],
            callback
        );
    },

    // Elimină un user dintr-un grup
    removeUser: (groupId, userId, callback) => {
        db.query(
            `DELETE FROM group_members WHERE group_id = ? AND user_id = ?`,
            [groupId, userId],
            callback
        );
    }
};

module.exports = Group;
