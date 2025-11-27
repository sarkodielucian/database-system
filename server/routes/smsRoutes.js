const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');

router.get('/stats', smsController.getSMSStats);
router.get('/messages', smsController.getAllMessages);
router.post('/messages', smsController.createMessage);
router.get('/templates', smsController.getAllTemplates);
router.post('/templates', smsController.createTemplate);

module.exports = router;
