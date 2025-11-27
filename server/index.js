const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dashboardRoutes = require('./routes/dashboardRoutes');
const memberRoutes = require('./routes/memberRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const financeRoutes = require('./routes/financeRoutes');
const smsRoutes = require('./routes/smsRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const clusterRoutes = require('./routes/clusterRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/clusters', clusterRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/visitors', visitorRoutes);

app.get('/', (req, res) => {
    res.send('Mt. Olivet CMS API is running');
});

// Sync database and start server
sequelize.sync({ force: true }).then(() => {
    console.log('Database synced successfully');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to sync database:', err);
});
