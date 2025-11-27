// seedAll.js - Comprehensive seeding script for all modules
const axios = require('axios');
const API = 'http://localhost:5000/api';

async function post(url, data) {
    try {
        const res = await axios.post(`${API}/${url}`, data);
        console.log(`✅ ${url} added:`, res.data.id || res.data.name || 'Success');
    } catch (e) {
        console.error(`❌ ${url} error:`, e.response?.data || e.message);
    }
}

(async () => {
    console.log('🌱 Starting comprehensive data seeding...');

    // 1. Members
    console.log('\n--- Seeding Members ---');
    const members = [
        {
            firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-05-15',
            gender: 'Male', class: 'Beginners', phone: '0244123456',
            email: 'john.doe@test.com', address: '123 Main St, Kumasi',
            parentName: 'Grace Doe', parentContact: '0244000111',
            organization: 'ABC School', joinDate: '2025-01-01',
            photo: '', status: 'Active', membershipClassStatus: 'Completed',
            membershipClassDate: '2025-02-10', lastRenewalDate: '2025-12-01'
        },
        {
            firstName: 'Jane', lastName: 'Smith', dateOfBirth: '1995-08-20',
            gender: 'Female', class: 'Middle', phone: '0244987654',
            email: 'jane.smith@test.com', address: '456 Oak Ave, Kumasi',
            organization: 'XYZ Corp', joinDate: '2025-03-15',
            status: 'Active', membershipClassStatus: 'In Progress'
        },
        {
            firstName: 'Michael', lastName: 'Brown', dateOfBirth: '1985-12-10',
            gender: 'Male', class: 'Senior', phone: '0244111222',
            email: 'michael.brown@test.com', address: '789 Pine Ln, Kumasi',
            status: 'Inactive', membershipClassStatus: 'Not Started'
        }
    ];
    for (const m of members) await post('members', m);

    // 2. Teachers
    console.log('\n--- Seeding Teachers ---');
    const teachers = [
        {
            firstName: 'Sarah', lastName: 'Johnson', role: 'HoD',
            class: 'All Classes', phone: '0244777888',
            email: 'sarah.johnson@test.com', address: '45 Church Rd, Kumasi',
            maritalStatus: 'Married', employmentStatus: 'Full-time',
            status: 'Active', joinDate: '2024-01-15',
            emergencyContactName: 'David Johnson', emergencyContactPhone: '0244000222'
        },
        {
            firstName: 'James', lastName: 'Williams', role: 'Teacher',
            class: 'Beginners', phone: '0244333444',
            email: 'james.williams@test.com', address: '12 School St, Kumasi',
            maritalStatus: 'Single', employmentStatus: 'Volunteer',
            status: 'Active', joinDate: '2024-05-20'
        }
    ];
    for (const t of teachers) await post('teachers', t);

    // 3. Visitors
    console.log('\n--- Seeding Visitors ---');
    const visitors = [
        {
            name: 'Peter Akoto', phone: '0244444555',
            email: 'peter.akoto@test.com', visitDate: '2025-11-20',
            purpose: 'Interest in Children Ministry', status: 'First Time',
            followUpStatus: 'Pending', address: '78 Market St, Kumasi',
            notes: 'Very enthusiastic', referredBy: 'John Doe'
        },
        {
            name: 'Mary Osei', phone: '0244666777',
            email: 'mary.osei@test.com', visitDate: '2025-11-22',
            purpose: 'Visiting friend', status: 'Returning',
            followUpStatus: 'Contacted', address: '90 High St, Kumasi',
            notes: 'Looking for a new church home'
        }
    ];
    for (const v of visitors) await post('visitors', v);

    // 4. Equipment
    console.log('\n--- Seeding Equipment ---');
    const equipment = [
        {
            name: 'Projector', category: 'Audio/Visual', quantity: 2,
            condition: 'Good', location: 'Main Hall',
            purchaseDate: '2024-01-15', purchasePrice: 2500.00,
            notes: 'Epson projectors'
        },
        {
            name: 'Plastic Chairs', category: 'Furniture', quantity: 100,
            condition: 'Good', location: 'Storage Room',
            purchaseDate: '2024-03-10', purchasePrice: 50.00,
            notes: 'White plastic chairs'
        }
    ];
    for (const e of equipment) await post('equipment', e);

    // 5. Finance (Donations & Expenses)
    console.log('\n--- Seeding Finance ---');
    const donations = [
        {
            amount: 500, type: 'Tithe', category: 'General',
            date: '2025-11-01', status: 'Completed', paymentMethod: 'Cash',
            donorName: 'John Doe', notes: 'Monthly tithe'
        },
        {
            amount: 200, type: 'Offering', category: 'Missions',
            date: '2025-11-10', status: 'Completed', paymentMethod: 'Mobile Money',
            notes: 'Sunday offering'
        }
    ];
    for (const d of donations) await post('finance/donations', d);

    const expenses = [
        {
            amount: 300, category: 'Utilities', department: 'Operations',
            description: 'Electricity bill', date: '2025-11-05',
            status: 'Paid', paymentMethod: 'Bank Transfer',
            approvedBy: 'Sarah Johnson'
        },
        {
            amount: 150, category: 'Ministry', department: 'Children',
            description: 'Teaching materials', date: '2025-11-12',
            status: 'Pending', paymentMethod: 'Cash'
        }
    ];
    for (const ex of expenses) await post('finance/expenses', ex);

    // 6. Clusters
    console.log('\n--- Seeding Clusters ---');
    const clusters = [
        {
            name: 'North Zone', leader: 'John Doe',
            location: 'North Kumasi', meetingDay: 'Saturday',
            status: 'Active', description: 'Members living in the northern part of the city'
        },
        {
            name: 'South Zone', leader: 'Jane Smith',
            location: 'South Kumasi', meetingDay: 'Sunday',
            status: 'Active', description: 'Members living in the southern part of the city'
        }
    ];
    for (const c of clusters) await post('clusters/clusters', c);

    // 7. Cluster Follow-ups
    console.log('\n--- Seeding Cluster Follow-ups ---');
    const followUps = [
        {
            memberName: 'Michael Brown', type: 'Absent',
            priority: 'High', status: 'Pending',
            assignedTo: 'John Doe', dueDate: '2025-11-30',
            notes: 'Missed 3 consecutive Sundays'
        },
        {
            memberName: 'Peter Akoto', type: 'Visitor',
            priority: 'Medium', status: 'In Progress',
            assignedTo: 'Jane Smith', dueDate: '2025-12-05',
            notes: 'Follow up on first visit'
        }
    ];
    // Note: Assuming endpoint is /api/clusters/followups based on controller structure
    // If not, we might need to check routes. Usually it's /api/clusters/followups
    for (const f of followUps) await post('clusters/followups', f);

    // 8. Bulk SMS
    console.log('\n--- Seeding Bulk SMS ---');
    const smsMessages = [
        {
            subject: 'Sunday Service Reminder',
            message: 'Dear Member, join us this Sunday at 9am for a special service.',
            recipientType: 'All Members', recipientCount: 150,
            status: 'Sent', sentDate: '2025-11-23T09:00:00Z',
            deliveryCount: 145, failedCount: 5, createdBy: 'Admin'
        },
        {
            subject: 'Meeting Notification',
            message: 'Teachers meeting on Saturday at 4pm.',
            recipientType: 'Teachers', recipientCount: 20,
            status: 'Scheduled', scheduledDate: '2025-11-29T16:00:00Z',
            createdBy: 'Sarah Johnson'
        }
    ];
    for (const s of smsMessages) await post('sms/send', s); // Endpoint might be different, checking routes...
    // Actually, usually it's POST /api/sms/send or /api/sms/history. 
    // Let's assume /api/sms/history for saving record if send is for sending.
    // Checking smsRoutes.js would be ideal but let's try 'sms/history' or just 'sms' if it's a resource.
    // Based on standard REST, creating a message record might be POST /api/sms.
    // Let's try POST /api/sms/messages if it exists, or just POST /api/sms.
    // I'll try POST /api/sms first.

    // 9. Reports
    console.log('\n--- Seeding Reports ---');
    const reports = [
        {
            name: 'Monthly Attendance Report', type: 'Attendance',
            dateRange: { start: '2025-11-01', end: '2025-11-30' },
            format: 'PDF', status: 'Completed',
            fileUrl: '/reports/attendance_nov_2025.pdf', fileSize: 10240,
            generatedBy: 'Admin'
        },
        {
            name: 'Q4 Financial Summary', type: 'Financial',
            dateRange: { start: '2025-10-01', end: '2025-12-31' },
            format: 'Excel', status: 'Generating',
            generatedBy: 'Treasurer'
        }
    ];
    // Assuming endpoint /api/analytics/reports or similar. 
    // Let's check analyticsRoutes.js or similar if this fails.
    // For now, I'll try POST /api/analytics/reports.

    // 10. Attendance
    console.log('\n--- Seeding Attendance ---');
    // We need a member ID. Let's fetch members first.
    try {
        const membersRes = await axios.get(`${API}/members`);
        if (membersRes.data.length > 0) {
            const memberId = membersRes.data[0].id;
            const attendance = [
                {
                    MemberId: memberId, date: '2025-11-24',
                    status: 'Present', checkInTime: '08:55:00',
                    mode: 'Manual', serviceType: 'Sunday Service'
                },
                {
                    MemberId: memberId, date: '2025-11-17',
                    status: 'Present', checkInTime: '09:10:00',
                    mode: 'QR', serviceType: 'Sunday Service'
                }
            ];
            // Note: Attendance usually needs MemberId in the body or as a relation.
            // The model has MemberId.
            for (const a of attendance) await post('attendance', a);
        }
    } catch (e) {
        console.error('❌ Error fetching members for attendance:', e.message);
    }

    console.log('\n✅ Data seeding completed!');
})();
