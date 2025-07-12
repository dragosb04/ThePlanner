const Group = require('../models/group');

exports.createGroup = (req, res) => {
    const groupData = req.body;
    Group.create(groupData, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Group created', groupId: results.insertId });
    });
};

exports.updateGroup = (req, res) => {
    const groupId = req.params.id;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Group name is required' });
    }

    Group.updateName(groupId, name, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Group not found or name unchanged' });
        }

        res.json({ message: 'Group updated' });
    });
};

exports.deleteGroup = (req, res) => {
    Group.delete(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Group deleted' });
    });
};

exports.getGroups = (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
    }

    Group.getAllForUser(userId, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.getGroupById = (req, res) => {
    Group.getById(req.params.id, (err, group) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!group) return res.status(404).json({ message: 'Group not found' });

        res.json(group);
    });
};

exports.addUserToGroup = (req, res) => {
    const groupId = req.params.groupId;
    const { userId } = req.body;

    Group.addUser(groupId, userId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'User is already in the group' });
        }

        res.status(201).json({ message: 'User added to group' });
    });
};

exports.removeUserFromGroup = (req, res) => {
    const groupId = req.params.groupId;
    const userId = req.params.userId;

    Group.removeUser(groupId, userId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found in group' });
        }

        res.json({ message: 'User removed from group' });
    });
};