const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');

// Summary and analytics
router.get('/summary', financeController.getSummary);
router.get('/monthly-data', financeController.getMonthlyData);
router.get('/expense-categories', financeController.getExpenseCategories);
router.get('/transactions', financeController.getRecentTransactions);

// Donations
router.get('/donations', financeController.getAllDonations);
router.post('/donations', financeController.createDonation);

// Pledges
router.get('/pledges', financeController.getAllPledges);
router.post('/pledges', financeController.createPledge);

// Expenses
router.get('/expenses', financeController.getAllExpenses);
router.post('/expenses', financeController.createExpense);

module.exports = router;
