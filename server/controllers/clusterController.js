const { Cluster, FollowUp, Member } = require('../models');
const { Op } = require('sequelize');

// Get cluster statistics
exports.getClusterStats = async (req, res) => {
    try {
        const totalClusters = await Cluster.count();
        const activeClusters = await Cluster.count({ where: { status: 'Active' } });

        const activeFollowUps = await FollowUp.count({
            where: { status: { [Op.in]: ['Pending', 'In Progress'] } }
        });

        const completedFollowUps = await FollowUp.count({ where: { status: 'Completed' } });

        const overdueFollowUps = await FollowUp.count({
            where: {
                dueDate: { [Op.lt]: new Date() },
                status: { [Op.ne]: 'Completed' }
            }
        });

        res.json({
            totalClusters,
            activeClusters,
            activeFollowUps,
            completedFollowUps,
            overdueFollowUps
        });
    } catch (error) {
        console.error('Error fetching cluster stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all clusters with member count
exports.getAllClusters = async (req, res) => {
    try {
        const clusters = await Cluster.findAll({
            include: [
                {
                    model: Member,
                    attributes: []
                }
            ],
            attributes: {
                include: [
                    [Cluster.sequelize.fn('COUNT', Cluster.sequelize.col('Members.id')), 'memberCount']
                ]
            },
            group: ['Cluster.id'],
            order: [['name', 'ASC']]
        });

        res.json(clusters || []);
    } catch (error) {
        console.error('Error fetching clusters:', error);
        res.json([]);  // Return empty array
    }
};

// Create cluster
exports.createCluster = async (req, res) => {
    try {
        const cluster = await Cluster.create(req.body);
        res.status(201).json(cluster);
    } catch (error) {
        console.error('Error creating cluster:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update cluster
exports.updateCluster = async (req, res) => {
    try {
        const { id } = req.params;
        const cluster = await Cluster.findByPk(id);

        if (!cluster) {
            return res.status(404).json({ message: 'Cluster not found' });
        }

        await cluster.update(req.body);
        res.json(cluster);
    } catch (error) {
        console.error('Error updating cluster:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all follow-ups
exports.getAllFollowUps = async (req, res) => {
    try {
        const { status, priority } = req.query;
        const where = {};

        if (status) where.status = status;
        if (priority) where.priority = priority;

        const followUps = await FollowUp.findAll({
            where,
            include: [
                { model: Cluster, attributes: ['name'] },
                { model: Member, attributes: ['firstName', 'lastName'] }
            ],
            order: [['dueDate', 'ASC']]
        });

        res.json(followUps || []);
    } catch (error) {
        console.error('Error fetching follow-ups:', error);
        res.json([]);  // Return empty array
    }
};

// Create follow-up
exports.createFollowUp = async (req, res) => {
    try {
        const followUp = await FollowUp.create(req.body);
        res.status(201).json(followUp);
    } catch (error) {
        console.error('Error creating follow-up:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update follow-up
exports.updateFollowUp = async (req, res) => {
    try {
        const { id } = req.params;
        const followUp = await FollowUp.findByPk(id);

        if (!followUp) {
            return res.status(404).json({ message: 'Follow-up not found' });
        }

        // If marking as completed, set completedDate
        if (req.body.status === 'Completed' && followUp.status !== 'Completed') {
            req.body.completedDate = new Date();
        }

        await followUp.update(req.body);
        res.json(followUp);
    } catch (error) {
        console.error('Error updating follow-up:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete follow-up
exports.deleteFollowUp = async (req, res) => {
    try {
        const { id } = req.params;
        const followUp = await FollowUp.findByPk(id);

        if (!followUp) {
            return res.status(404).json({ message: 'Follow-up not found' });
        }

        await followUp.destroy();
        res.json({ message: 'Follow-up deleted successfully' });
    } catch (error) {
        console.error('Error deleting follow-up:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
