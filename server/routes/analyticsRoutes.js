const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/summary', analyticsController.getAnalyticsSummary);
router.get('/attendance-patterns', analyticsController.getAttendancePatterns);
router.get('/financial-trends', analyticsController.getFinancialTrends);
router.get('/member-demographics', analyticsController.getMemberDemographics);
router.post('/reports', analyticsController.generateReport);
router.get('/reports', analyticsController.getRecentReports);

module.exports = router;
