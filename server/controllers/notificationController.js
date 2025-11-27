const { Notification, Member, Sequelize } = require('../models');
const { Op } = require('sequelize');

// Get all notifications
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            order: [['date', 'DESC']],
            limit: 50
        });
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Mark as read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);
        if (notification) {
            await notification.update({ isRead: true });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error marking notification:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Run automated checks (Birthdays, etc.)
// In a real app, this would be a cron job. Here we expose it as an endpoint to trigger manually or on app load.
exports.runAutomatedChecks = async (req, res) => {
    try {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        // 1. Check Birthdays
        const birthdayMembers = await Member.findAll({
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('strftime', '%m', Sequelize.col('dateOfBirth')), month.toString().padStart(2, '0')),
                    Sequelize.where(Sequelize.fn('strftime', '%d', Sequelize.col('dateOfBirth')), day.toString().padStart(2, '0'))
                ]
            }
        });

        let newNotifications = 0;

        for (const member of birthdayMembers) {
            // Check if notification already exists for today
            const exists = await Notification.findOne({
                where: {
                    type: 'Birthday',
                    relatedId: member.id,
                    date: {
                        [Op.gte]: new Date(today.setHours(0, 0, 0, 0))
                    }
                }
            });

            if (!exists) {
                await Notification.create({
                    title: 'Birthday Alert',
                    message: `Today is ${member.firstName} ${member.lastName}'s birthday!`,
                    type: 'Birthday',
                    relatedId: member.id
                });
                newNotifications++;
            }
        }

        res.json({ message: 'Checks completed', newNotifications });
    } catch (error) {
        console.error('Error running checks:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
