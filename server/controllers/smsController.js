const { SMSMessage, SMSTemplate, Member } = require('../models');
const { Op } = require('sequelize');

// Get SMS statistics
exports.getSMSStats = async (req, res) => {
    try {
        const totalSent = await SMSMessage.count({ where: { status: 'Sent' } });
        const thisMonth = await SMSMessage.count({
            where: {
                status: 'Sent',
                sentDate: {
                    [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        });
        const scheduled = await SMSMessage.count({ where: { status: 'Scheduled' } });

        res.json({ totalSent, thisMonth, scheduled });
    } catch (error) {
        console.error('Error fetching SMS stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all messages
exports.getAllMessages = async (req, res) => {
    try {
        const messages = await SMSMessage.findAll({
            order: [['createdAt', 'DESC']],
            limit: 50
        });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create/Send message
exports.createMessage = async (req, res) => {
    try {
        const { message, recipientType, scheduledDate, selectedGroups } = req.body;

        // Calculate recipient count based on groups
        let recipientCount = 0;
        if (selectedGroups && selectedGroups.length > 0) {
            // In a real app, you'd query members by class/role
            recipientCount = selectedGroups.length * 50; // Placeholder
        }

        const smsMessage = await SMSMessage.create({
            message,
            recipientType: recipientType || 'Custom',
            recipientCount,
            status: scheduledDate ? 'Scheduled' : 'Sent',
            scheduledDate,
            sentDate: scheduledDate ? null : new Date(),
            deliveryCount: scheduledDate ? 0 : recipientCount,
            createdBy: 'Admin' // Placeholder for auth
        });

        res.status(201).json(smsMessage);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all templates
exports.getAllTemplates = async (req, res) => {
    try {
        const templates = await SMSTemplate.findAll({
            where: { isActive: true },
            order: [['usageCount', 'DESC']]
        });
        res.json(templates);
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create template
exports.createTemplate = async (req, res) => {
    try {
        const template = await SMSTemplate.create(req.body);
        res.status(201).json(template);
    } catch (error) {
        console.error('Error creating template:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
