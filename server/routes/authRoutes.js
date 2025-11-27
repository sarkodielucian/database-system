const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock user database (in production, use real database)
const mockUsers = [
    {
        id: 1,
        phone: '+233241234567',
        password: 'admin123', // In production, use hashed passwords
        name: 'Church Admin',
        role: 'admin'
    },
    {
        id: 2,
        phone: '+233247654321',
        password: 'user123',
        name: 'Church User',
        role: 'user'
    }
];

// JWT Secret (in production, use environment variable)
const JWT_SECRET = 'your-secret-key-change-in-production';

// @route   POST /api/auth/login
// @desc    Login user and get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Validation
        if (!phone || !password) {
            return res.status(400).json({
                message: 'Please provide phone number and password'
            });
        }

        // Find user by phone
        const user = mockUsers.find(u => u.phone === phone);

        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Check password (in production, use bcrypt.compare)
        if (user.password !== password) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Create JWT token
        const payload = {
            user: {
                id: user.id,
                phone: user.phone,
                name: user.name,
                role: user.role
            }
        };

        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                phone: user.phone,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Server error during login'
        });
    }
});

// @route   POST /api/auth/verify
// @desc    Verify JWT token
// @access  Private
router.post('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        res.json({
            success: true,
            user: decoded.user
        });

    } catch (error) {
        res.status(401).json({
            message: 'Invalid token'
        });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Public
router.post('/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

module.exports = router;
