const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router.post('/', groupController.createGroup);
router.put('/:id', groupController.updateGroup);
router.delete('/:id', groupController.deleteGroup);
router.get('/', groupController.getGroups);
router.get('/:id', groupController.getGroupById);

router.post('/:groupId/users', groupController.addUserToGroup); 
router.delete('/:groupId/users/:userId', groupController.removeUserFromGroup); 

module.exports = router;