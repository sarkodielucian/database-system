const { Member, Cluster, MemberHistory } = require('../models');

// Get all members
exports.getAllMembers = async (req, res) => {
    try {
        const members = await Member.findAll({
            include: [{ model: Cluster, attributes: ['name'] }],
            order: [['lastName', 'ASC']]
        });
        res.json(members || []);
    } catch (error) {
        console.error('Error fetching members:', error);
        res.json([]);  // Return empty array instead of error object
    }
};

// Get single member with history
exports.getMemberById = async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id, {
            include: [
                { model: Cluster, attributes: ['name'] },
                { model: MemberHistory, order: [['date', 'DESC']] }
            ]
        });
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.json(member);
    } catch (error) {
        console.error('Error fetching member:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new member
exports.createMember = async (req, res) => {
    try {
        const member = await Member.create(req.body);

        // Log creation history
        await MemberHistory.create({
            MemberId: member.id,
            action: 'Created',
            details: 'Member profile created',
            performedBy: 'Admin' // Placeholder for user system
        });

        res.status(201).json(member);
    } catch (error) {
        console.error('Error creating member:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update member
exports.updateMember = async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        const oldStatus = member.status;
        const oldClass = member.class;

        await member.update(req.body);

        // Log status changes
        if (req.body.status && req.body.status !== oldStatus) {
            await MemberHistory.create({
                MemberId: member.id,
                action: 'Status Change',
                details: `Status changed from ${oldStatus} to ${req.body.status}`,
                performedBy: 'Admin'
            });
        }

        // Log class changes
        if (req.body.class && req.body.class !== oldClass) {
            await MemberHistory.create({
                MemberId: member.id,
                action: 'Class Change',
                details: `Class changed from ${oldClass} to ${req.body.class}`,
                performedBy: 'Admin'
            });
        }

        res.json(member);
    } catch (error) {
        console.error('Error updating member:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete member
exports.deleteMember = async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        await member.destroy();
        res.json({ message: 'Member deleted successfully' });
    } catch (error) {
        console.error('Error deleting member:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
