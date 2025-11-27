const { Visitor } = require('../models');
const { Op } = require('sequelize');

// Get visitor statistics
exports.getVisitorStats = async (req, res) => {
    try {
        const totalVisitors = await Visitor.count();

        // Visitors this month
        const thisMonth = await Visitor.count({
            where: {
                visitDate: {
                    [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        });

        // Last month for comparison
        const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
        const lastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
        const lastMonth = await Visitor.count({
            where: {
                visitDate: {
                    [Op.between]: [lastMonthStart, lastMonthEnd]
                }
            }
        });

        const monthlyGrowth = lastMonth > 0 ? (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(0) : 0;

        // Converted members
        const converted = await Visitor.count({ where: { status: 'Converted' } });
        const conversionRate = totalVisitors > 0 ? ((converted / totalVisitors) * 100).toFixed(0) : 0;

        // Pending follow-ups
        const pendingFollowUps = await Visitor.count({ where: { followUpStatus: 'Pending' } });

        res.json({
            totalVisitors,
            thisMonth,
            monthlyGrowth,
            converted,
            conversionRate,
            pendingFollowUps
        });
    } catch (error) {
        console.error('Error fetching visitor stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all visitors
exports.getAllVisitors = async (req, res) => {
    try {
        const { status, followUpStatus } = req.query;
        const where = {};

        if (status) where.status = status;
        if (followUpStatus) where.followUpStatus = followUpStatus;

        const visitors = await Visitor.findAll({
            where,
            order: [['visitDate', 'DESC']]
        });

        res.json(visitors || []);
    } catch (error) {
        console.error('Error fetching visitors:', error);
        res.json([]);  // Return empty array
    }
};

// Get single visitor
exports.getVisitorById = async (req, res) => {
    try {
        const { id } = req.params;
        const visitor = await Visitor.findByPk(id);

        if (!visitor) {
            return res.status(404).json({ message: 'Visitor not found' });
        }

        res.json(visitor);
    } catch (error) {
        console.error('Error fetching visitor:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create visitor
exports.createVisitor = async (req, res) => {
    try {
        const visitor = await Visitor.create(req.body);
        res.status(201).json(visitor);
    } catch (error) {
        console.error('Error creating visitor:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update visitor
exports.updateVisitor = async (req, res) => {
    try {
        const { id } = req.params;
        const visitor = await Visitor.findByPk(id);

        if (!visitor) {
            return res.status(404).json({ message: 'Visitor not found' });
        }

        await visitor.update(req.body);
        res.json(visitor);
    } catch (error) {
        console.error('Error updating visitor:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete visitor
exports.deleteVisitor = async (req, res) => {
    try {
        const { id } = req.params;
        const visitor = await Visitor.findByPk(id);

        if (!visitor) {
            return res.status(404).json({ message: 'Visitor not found' });
        }

        await visitor.destroy();
        res.json({ message: 'Visitor deleted successfully' });
    } catch (error) {
        console.error('Error deleting visitor:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
