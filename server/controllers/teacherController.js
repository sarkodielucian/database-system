const { Teacher } = require('../models');

// Get all teachers
exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.findAll({
            order: [['lastName', 'ASC']]
        });
        res.json(teachers || []);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.json([]);  // Return empty array
    }
};

// Get single teacher
exports.getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json(teacher);
    } catch (error) {
        console.error('Error fetching teacher:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create teacher
exports.createTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.create(req.body);
        res.status(201).json(teacher);
    } catch (error) {
        console.error('Error creating teacher:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update teacher
exports.updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        await teacher.update(req.body);
        res.json(teacher);
    } catch (error) {
        console.error('Error updating teacher:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete teacher
exports.deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        await teacher.destroy();
        res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.error('Error deleting teacher:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
