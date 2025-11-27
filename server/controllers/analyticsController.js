const { Member, Attendance, Donation, Expense, Teacher, Report } = require('../models');
const { Op } = require('sequelize');

// Get analytics summary for dashboard
exports.getAnalyticsSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const dateFilter = startDate && endDate ? {
            [Op.between]: [startDate, endDate]
        } : {};

        // Attendance analytics
        const totalAttendance = await Attendance.count();
        const avgAttendanceRate = await Attendance.count({
            where: { status: 'Present', ...(startDate && endDate ? { date: dateFilter } : {}) }
        }) / totalAttendance * 100 || 0;

        // Financial analytics
        const totalIncome = await Donation.sum('amount') || 0;
        const totalExpenses = await Expense.sum('amount', { where: { status: 'Paid' } }) || 0;

        // Member growth
        const totalMembers = await Member.count();
        const newMembersThisMonth = await Member.count({
            where: {
                joinDate: {
                    [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        });

        // Teacher stats
        const totalTeachers = await Teacher.count();
        const activeTeachers = await Teacher.count({ where: { status: 'Active' } });

        res.json({
            attendance: {
                total: totalAttendance,
                averageRate: avgAttendanceRate.toFixed(1)
            },
            finance: {
                totalIncome: parseFloat(totalIncome),
                totalExpenses: parseFloat(totalExpenses),
                balance: parseFloat(totalIncome - totalExpenses)
            },
            members: {
                total: totalMembers,
                newThisMonth: newMembersThisMonth,
                growthRate: totalMembers > 0 ? ((newMembersThisMonth / totalMembers) * 100).toFixed(1) : 0
            },
            teachers: {
                total: totalTeachers,
                active: activeTeachers
            }
        });
    } catch (error) {
        console.error('Error fetching analytics summary:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get attendance patterns
exports.getAttendancePatterns = async (req, res) => {
    try {
        const { period = 'monthly' } = req.query;

        // Get last 12 months of attendance
        const patterns = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const present = await Attendance.count({
                where: {
                    date: { [Op.between]: [monthStart, monthEnd] },
                    status: 'Present'
                }
            });

            const total = await Attendance.count({
                where: {
                    date: { [Op.between]: [monthStart, monthEnd] }
                }
            });

            patterns.push({
                month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
                present,
                total,
                rate: total > 0 ? ((present / total) * 100).toFixed(1) : 0
            });
        }

        res.json(patterns);
    } catch (error) {
        console.error('Error fetching attendance patterns:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get financial trends
exports.getFinancialTrends = async (req, res) => {
    try {
        const trends = [];

        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const income = await Donation.sum('amount', {
                where: { date: { [Op.between]: [monthStart, monthEnd] } }
            }) || 0;

            const expenses = await Expense.sum('amount', {
                where: {
                    date: { [Op.between]: [monthStart, monthEnd] },
                    status: 'Paid'
                }
            }) || 0;

            trends.push({
                month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
                income: parseFloat(income),
                expenses: parseFloat(expenses),
                net: parseFloat(income - expenses)
            });
        }

        res.json(trends);
    } catch (error) {
        console.error('Error fetching financial trends:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get member demographics
exports.getMemberDemographics = async (req, res) => {
    try {
        const byClass = await Member.findAll({
            attributes: [
                'class',
                [Member.sequelize.fn('COUNT', Member.sequelize.col('id')), 'count']
            ],
            group: ['class']
        });

        const byGender = await Member.findAll({
            attributes: [
                'gender',
                [Member.sequelize.fn('COUNT', Member.sequelize.col('id')), 'count']
            ],
            group: ['gender']
        });

        const byStatus = await Member.findAll({
            attributes: [
                'status',
                [Member.sequelize.fn('COUNT', Member.sequelize.col('id')), 'count']
            ],
            group: ['status']
        });

        res.json({
            byClass: byClass.map(c => ({ name: c.class, value: parseInt(c.dataValues.count) })),
            byGender: byGender.map(g => ({ name: g.gender, value: parseInt(g.dataValues.count) })),
            byStatus: byStatus.map(s => ({ name: s.status, value: parseInt(s.dataValues.count) }))
        });
    } catch (error) {
        console.error('Error fetching demographics:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Generate report
exports.generateReport = async (req, res) => {
    try {
        const { type, format, startDate, endDate, parameters } = req.body;

        const report = await Report.create({
            name: `${type} Report - ${new Date().toLocaleDateString()}`,
            type,
            format,
            dateRange: { start: startDate, end: endDate },
            parameters,
            status: 'Generating',
            generatedBy: 'Admin' // Placeholder
        });

        // In a real app, this would trigger background job
        // For now, mark as completed immediately
        await report.update({
            status: 'Completed',
            fileUrl: `/reports/${report.id}.${format.toLowerCase()}`
        });

        res.status(201).json(report);
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get recent reports
exports.getRecentReports = async (req, res) => {
    try {
        const reports = await Report.findAll({
            order: [['createdAt', 'DESC']],
            limit: 10
        });
        res.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
