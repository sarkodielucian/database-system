const { Attendance, Member } = require('../models');
const { Op } = require('sequelize');

// Get attendance for a specific date
exports.getAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date || new Date().toISOString().split('T')[0];

        const attendance = await Attendance.findAll({
            where: { date: targetDate },
            include: [{ model: Member, attributes: ['id', 'firstName', 'lastName', 'class'] }]
        });

        res.json(attendance || []);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        // Return empty array instead of error object to prevent frontend crash
        res.json([]);
    }
};

// Mark attendance (Single or Bulk)
exports.markAttendance = async (req, res) => {
    try {
        const { memberId, status, date, checkInTime, mode } = req.body;

        // Check if record exists
        let attendance = await Attendance.findOne({
            where: {
                MemberId: memberId,
                date: date || new Date().toISOString().split('T')[0]
            }
        });

        if (attendance) {
            await attendance.update({ status, checkInTime, mode });
        } else {
            attendance = await Attendance.create({
                MemberId: memberId,
                status,
                date: date || new Date().toISOString().split('T')[0],
                checkInTime: checkInTime || new Date().toLocaleTimeString(),
                mode: mode || 'Manual'
            });
        }

        res.json(attendance);
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get attendance stats
exports.getAttendanceStats = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const stats = await Attendance.findAll({
            where: { date: today },
            attributes: ['status', [Attendance.sequelize.fn('COUNT', 'status'), 'count']],
            group: ['status']
        });

        res.json(stats || []);
    } catch (error) {
        console.error('Error fetching attendance stats:', error);
        // Return empty array to prevent frontend crash
        res.json([]);
    }
};
