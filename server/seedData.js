// Sample data seeder for Mt. Olivet Church Management System
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Sample data
const sampleMembers = [
    { firstName: 'John', lastName: 'Mensah', class: 'Beginners', phone: '0244123456', email: 'john.mensah@test.com', organization: 'ABC School', status: 'Active' },
    { firstName: 'Mary', lastName: 'Owusu', class: 'Middle', phone: '0244567890', email: 'mary.owusu@test.com', organization: 'XYZ School', status: 'Active' },
    { firstName: 'James', lastName: 'Agyei', class: 'Senior', phone: '0244111222', email: 'james.agyei@test.com', organization: 'DEF School', status: 'Active' },
    { firstName: 'Grace', lastName: 'Asante', class: 'Beginners', phone: '0244333444', email: 'grace.asante@test.com', organization: 'ABC School', status: 'Active' },
    { firstName: 'David', lastName: 'Boateng', class: 'Middle', phone: '0244555666', email: 'david.boateng@test.com', organization: 'GHI School', status: 'Active' }
];

const sampleTeachers = [
    { firstName: 'Sarah', lastName: 'Johnson', phone: '0244777888', email: 'sarah.j@test.com', subject: 'Bible Studies', status: 'Active', qualification: 'Diploma in Theology' },
    { firstName: 'Michael', lastName: 'Appiah', phone: '0244999000', email: 'michael.a@test.com', subject: 'Sunday School', status: 'Active', qualification: 'BA in Education' },
    { firstName: 'Elizabeth', lastName: 'Osei', phone: '0244222333', email: 'elizabeth.o@test.com', subject: 'Music & Worship', status: 'Active', qualification: 'Music Certificate' }
];

const sampleVisitors = [
    { name: 'Peter Akoto', phone: '0244444555', email: 'peter.a@test.com', visitDate: '2025-11-20', purpose: 'Interest in Children Ministry', status: 'First Time', followUpStatus: 'Pending' },
    { name: 'Hannah Adu', phone: '0244666777', email: 'hannah.a@test.com', visitDate: '2025-11-22', purpose: 'Visiting from another branch', status: 'Returning', followUpStatus: 'Contacted' },
    { name: 'Samuel Nkrumah', phone: '0244888999', email: 'samuel.n@test.com', visitDate: '2025-11-24', purpose: 'New to the area', status: 'First Time', followUpStatus: 'Pending' }
];

const sampleEquipment = [
    { name: 'Projector', category: 'Electronics', quantity: 2, condition: 'Good', location: 'Main Hall', purchaseDate: '2024-01-15', status: 'Active' },
    { name: 'Whiteboard', category: 'Furniture', quantity: 5, condition: 'Good', location: 'Classrooms', purchaseDate: '2024-03-10', status: 'Active' },
    { name: 'Sound System', category: 'Electronics', quantity: 1, condition: 'Fair', location: 'Main Hall', purchaseDate: '2023-06-20', status: 'Active' },
    { name: 'Chairs', category: 'Furniture', quantity: 50, condition: 'Good', location: 'Main Hall', purchaseDate: '2024-02-05', status: 'Active' }
];

const sampleDonations = [
    { amount: 500, type: 'Tithe', category: 'Tithe', date: '2025-11-01', status: 'Received', notes: 'Monthly tithe collection' },
    { amount: 1200, type: 'Offering', category: 'Offering', date: '2025-11-10', status: 'Received', notes: 'Special offering for children ministry' },
    { amount: 300, type: 'Donation', category: 'Donation', date: '2025-11-15', status: 'Received', notes: 'Anonymous donation' },
    { amount: 800, type: 'Event', category: 'Event Offering', date: '2025-11-20', status: 'Received', notes: 'Harvest thanksgiving' }
];

const sampleExpenses = [
    { amount: 250, category: 'Utilities', description: 'Electricity bill', date: '2025-11-05', status: 'Paid' },
    { amount: 400, category: 'Ministry', description: 'Teaching materials', date: '2025-11-08', status: 'Paid' },
    { amount: 150, category: 'Maintenance', description: 'Repairs and maintenance', date: '2025-11-12', status: 'Paid' },
    { amount: 500, category: 'Events', description: 'Children program expenses', date: '2025-11-18', status: 'Paid' }
];

const sampleClusters = [
    { name: 'North Zone', leader: 'John Mensah', location: 'North Kumasi', meetingDay: 'Saturday', status: 'Active' },
    { name: 'South Zone', leader: 'Mary Owusu', location: 'South Kumasi', meetingDay: 'Sunday', status: 'Active' },
    { name: 'East Zone', leader: 'James Agyei', location: 'East Kumasi', meetingDay: 'Friday', status: 'Active' }
];

async function seedData() {
    console.log('🌱 Starting data seeding...\n');

    try {
        // Seed Members
        console.log('Adding Members...');
        for (const member of sampleMembers) {
            await axios.post(`${API_BASE}/members`, member);
            console.log(`✓ Added member: ${member.firstName} ${member.lastName}`);
        }

        // Seed Teachers
        console.log('\nAdding Teachers...');
        for (const teacher of sampleTeachers) {
            await axios.post(`${API_BASE}/teachers`, teacher);
            console.log(`✓ Added teacher: ${teacher.firstName} ${teacher.lastName}`);
        }

        // Seed Visitors
        console.log('\nAdding Visitors...');
        for (const visitor of sampleVisitors) {
            await axios.post(`${API_BASE}/visitors`, visitor);
            console.log(`✓ Added visitor: ${visitor.name}`);
        }

        // Seed Equipment
        console.log('\nAdding Equipment...');
        for (const equipment of sampleEquipment) {
            await axios.post(`${API_BASE}/equipment`, equipment);
            console.log(`✓ Added equipment: ${equipment.name}`);
        }

        // Seed Donations
        console.log('\nAdding Donations...');
        for (const donation of sampleDonations) {
            await axios.post(`${API_BASE}/finance/donations`, donation);
            console.log(`✓ Added donation: GHS ${donation.amount}`);
        }

        // Seed Expenses
        console.log('\nAdding Expenses...');
        for (const expense of sampleExpenses) {
            await axios.post(`${API_BASE}/finance/expenses`, expense);
            console.log(`✓ Added expense: ${expense.description}`);
        }

        // Seed Clusters
        console.log('\nAdding Clusters...');
        for (const cluster of sampleClusters) {
            await axios.post(`${API_BASE}/clusters/clusters`, cluster);
            console.log(`✓ Added cluster: ${cluster.name}`);
        }

        console.log('\n✅ Data seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - ${sampleMembers.length} Members`);
        console.log(`   - ${sampleTeachers.length} Teachers`);
        console.log(`   - ${sampleVisitors.length} Visitors`);
        console.log(`   - ${sampleEquipment.length} Equipment items`);
        console.log(`   - ${sampleDonations.length} Donations`);
        console.log(`   - ${sampleExpenses.length} Expenses`);
        console.log(`   - ${sampleClusters.length} Clusters`);

    } catch (error) {
        console.error('❌ Error seeding data:', error.response?.data || error.message);
    }
}

// Run the seeder
seedData();
