const { Setting } = require('../models');

// Get all settings
exports.getAllSettings = async (req, res) => {
    try {
        const settings = await Setting.findAll();

        // Convert to key-value object
        const settingsObj = {};
        settings.forEach(setting => {
            settingsObj[setting.key] = setting.value;
        });

        res.json(settingsObj);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get setting by key
exports.getSettingByKey = async (req, res) => {
    try {
        const { key } = req.params;
        const setting = await Setting.findOne({ where: { key } });

        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }

        res.json({ key: setting.key, value: setting.value });
    } catch (error) {
        console.error('Error fetching setting:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update or create setting
exports.updateSetting = async (req, res) => {
    try {
        const { key, value } = req.body;

        const [setting, created] = await Setting.findOrCreate({
            where: { key },
            defaults: { value }
        });

        if (!created) {
            await setting.update({ value });
        }

        res.json({ key: setting.key, value: setting.value });
    } catch (error) {
        console.error('Error updating setting:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete setting
exports.deleteSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const setting = await Setting.findOne({ where: { key } });

        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }

        await setting.destroy();
        res.json({ message: 'Setting deleted successfully' });
    } catch (error) {
        console.error('Error deleting setting:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
