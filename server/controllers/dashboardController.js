const { Member, Teacher, Visitor, Donation } = require('../models');
const { sequelize } = require('../models'); // Import sequelize instance if needed, or rely on model methods

exports.getDashboardStats = async (req, res) => {
    try {
        const totalMembers = await Member.count();
        const totalTeachers = await Teacher.count();
        const totalVisitors = await Visitor.count();

        // Calculate total donations using Sequelize sum (safe for empty tables)
        const totalDonations = await Donation.sum('amount') || 0;

        // Get class distribution
        const classStats = await Member.findAll({
            attributes: ['class', [sequelize.fn('COUNT', sequelize.col('class')), 'count']],
            group: ['class'],
            raw: true
        });

        // Format class distribution for frontend
        const classDistribution = [
            { name: 'Beginners', value: 0, color: '#3b82f6' },
            { name: 'Middle', value: 0, color: '#8b5cf6' },
            { name: 'Senior', value: 0, color: '#10b981' }
        ];

        classStats.forEach(stat => {
            const index = classDistribution.findIndex(item => item.name === stat.class);
            if (index !== -1) {
                classDistribution[index].value = parseInt(stat.count);
            }
        });

        res.json({
            totalMembers,
            totalTeachers,
            totalVisitors,
            totalDonations: Number(totalDonations).toFixed(2),
            classDistribution
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
