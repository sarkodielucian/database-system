const { Equipment } = require('../models');

// Get equipment statistics
exports.getEquipmentStats = async (req, res) => {
    try {
        const totalItems = await Equipment.sum('quantity') || 0;
        const goodCondition = await Equipment.sum('quantity', { where: { condition: 'Good' } }) || 0;
        const fairCondition = await Equipment.sum('quantity', { where: { condition: 'Fair' } }) || 0;
        const needsRepair = await Equipment.sum('quantity', { where: { condition: 'Needs Repair' } }) || 0;

        res.json({
            totalItems,
            goodCondition,
            fairCondition,
            needsRepair
        });
    } catch (error) {
        console.error('Error fetching equipment stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all equipment
exports.getAllEquipment = async (req, res) => {
    try {
        const { category } = req.query;
        const where = category && category !== 'All Categories' ? { category } : {};

        const equipment = await Equipment.findAll({
            where,
            order: [['name', 'ASC']]
        });

        res.json(equipment || []);
    } catch (error) {
        console.error('Error fetching equipment:', error);
        res.json([]);  // Return empty array
    }
};

// Get single equipment item
exports.getEquipmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const equipment = await Equipment.findByPk(id);

        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        res.json(equipment);
    } catch (error) {
        console.error('Error fetching equipment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create equipment
exports.createEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.create(req.body);
        res.status(201).json(equipment);
    } catch (error) {
        console.error('Error creating equipment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update equipment
exports.updateEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const equipment = await Equipment.findByPk(id);

        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        await equipment.update(req.body);
        res.json(equipment);
    } catch (error) {
        console.error('Error updating equipment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete equipment
exports.deleteEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const equipment = await Equipment.findByPk(id);

        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        await equipment.destroy();
        res.json({ message: 'Equipment deleted successfully' });
    } catch (error) {
        console.error('Error deleting equipment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
