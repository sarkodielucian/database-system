const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.get('/', attendanceController.getAttendanceByDate);
router.post('/', attendanceController.markAttendance);
router.get('/stats', attendanceController.getAttendanceStats);

module.exports = router;
