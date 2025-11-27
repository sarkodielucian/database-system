// seedDirect.js - Direct Sequelize seeding for all modules
const {
    sequelize, Member, Teacher, Visitor, Equipment,
    Donation, Expense, Cluster, Attendance,
    SMSMessage, Report, FollowUp
} = require('./models');

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected\n');

        // 1. Teachers
        console.log('📚 Seeding Teachers...');
        const teachers = await Teacher.bulkCreate([
            {
                firstName: 'Sarah', lastName: 'Johnson', role: 'HoD',
                class: 'All Classes', phone: '0244777888',
                email: 'sarah.johnson@test.com', address: '45 Church Rd, Kumasi',
                maritalStatus: 'Married', employmentStatus: 'Full-time',
                status: 'Active', joinDate: '2024-01-15',
                emergencyContactName: 'David Johnson',
                emergencyContactPhone: '0244000222'
            },
            {
                firstName: 'James', lastName: 'Williams', role: 'Teacher',
                class: 'Beginners', phone: '0244333444',
                email: 'james.williams@test.com', address: '12 School St, Kumasi',
                maritalStatus: 'Single', employmentStatus: 'Volunteer',
                status: 'Active', joinDate: '2024-05-20'
            },
            {
                firstName: 'Mary', lastName: 'Adu', role: 'Teacher',
                class: 'Middle', phone: '0244555666',
                email: 'mary.adu@test.com', maritalStatus: 'Single',
                employmentStatus: 'Part-time', status: 'Active'
            }
        ]);
        console.log(`✅ Added ${teachers.length} teachers\n`);

        // 2. Visitors
        console.log('👥 Seeding Visitors...');
        const visitors = await Visitor.bulkCreate([
            {
                name: 'Peter Akoto', phone: '0244444555',
                email: 'peter.akoto@test.com', visitDate: '2025-11-20',
                purpose: 'Interest in Children Ministry', status: 'First Time',
                followUpStatus: 'Pending', address: '78 Market St, Kumasi',
                notes: 'Very enthusiastic about joining', referredBy: 'John Doe'
            },
            {
                name: 'Mary Osei', phone: '0244666777',
                email: 'mary.osei@test.com', visitDate: '2025-11-22',
                purpose: 'Visiting friend', status: 'Returning',
                followUpStatus: 'Contacted', address: '90 High St, Kumasi',
                notes: 'Looking for a new church home'
            },
            {
                name: 'Emmanuel Mensah', phone: '0244888999',
                email: 'emmanuel.m@test.com', visitDate: '2025-11-25',
                purpose: 'New to the area', status: 'First Time',
                followUpStatus: 'Pending', referredBy: 'Church website'
            }
        ]);
        console.log(`✅ Added ${visitors.length} visitors\n`);

        // 3. Equipment
        console.log('🔧 Seeding Equipment...');
        const equipment = await Equipment.bulkCreate([
            {
                name: 'Projector', category: 'Audio/Visual', quantity: 2,
                condition: 'Good', location: 'Main Hall',
                purchaseDate: '2024-01-15', purchasePrice: 2500.00,
                notes: 'Epson projectors for presentations'
            },
            {
                name: 'Plastic Chairs', category: 'Furniture', quantity: 100,
                condition: 'Good', location: 'Storage Room',
                purchaseDate: '2024-03-10', purchasePrice: 50.00,
                notes: 'White plastic chairs for events'
            },
            {
                name: 'Whiteboard', category: 'Teaching Materials', quantity: 5,
                condition: 'Good', location: 'Classrooms',
                purchaseDate: '2024-02-20', purchasePrice: 150.00
            },
            {
                name: 'Sound System', category: 'Audio/Visual', quantity: 1,
                condition: 'Fair', location: 'Main Hall',
                purchaseDate: '2023-06-15', purchasePrice: 5000.00,
                notes: 'Needs maintenance soon',
                lastMaintenanceDate: '2025-01-10'
            }
        ]);
        console.log(`✅ Added ${equipment.length} equipment items\n`);

        // 4. Finance - Donations
        console.log('💰 Seeding Donations...');
        const donations = await Donation.bulkCreate([
            {
                amount: 500, type: 'Tithe', category: 'General',
                date: '2025-11-01', status: 'Completed', paymentMethod: 'Cash',
                donorName: 'John Doe', donorEmail: 'john.doe@test.com',
                donorPhone: '0244123456', notes: 'Monthly tithe'
            },
            {
                amount: 1200, type: 'Offering', category: 'Building Fund',
                date: '2025-11-10', status: 'Completed', paymentMethod: 'Mobile Money',
                donorName: 'Anonymous', notes: 'Special thanksgiving offering'
            },
            {
                amount: 300, type: 'Donation', category: 'Missions',
                date: '2025-11-15', status: 'Completed', paymentMethod: 'Bank Transfer',
                donorName: 'Jane Smith', donorEmail: 'jane.smith@test.com',
                isRecurring: true, recurringFrequency: 'Monthly'
            }
        ]);
        console.log(`✅ Added ${donations.length} donations\n`);

        // 5. Finance - Expenses
        console.log('💸 Seeding Expenses...');
        const expenses = await Expense.bulkCreate([
            {
                amount: 300, category: 'Utilities', department: 'Operations',
                description: 'Electricity bill for November', date: '2025-11-05',
                status: 'Paid', paymentMethod: 'Bank Transfer',
                approvedBy: 'Sarah Johnson', approvalDate: '2025-11-04'
            },
            {
                amount: 450, category: 'Ministry', department: 'Children',
                description: 'Teaching materials and supplies', date: '2025-11-12',
                status: 'Paid', paymentMethod: 'Cash',
                approvedBy: 'Admin'
            },
            {
                amount: 200, category: 'Maintenance', department: 'Operations',
                description: 'Repairs to main hall chairs', date: '2025-11-18',
                status: 'Pending', paymentMethod: 'Cash'
            }
        ]);
        console.log(`✅ Added ${expenses.length} expenses\n`);

        // 6. Clusters
        console.log('🏘️ Seeding Clusters...');
        const clusters = await Cluster.bulkCreate([
            {
                name: 'North Zone', leader: 'John Doe',
                location: 'North Kumasi', status: 'Active',
                description: 'Members living in the northern part of the city',
                lastMeetingDate: '2025-11-15', nextMeetingDate: '2025-11-29'
            },
            {
                name: 'South Zone', leader: 'Jane Smith',
                location: 'South Kumasi', status: 'Active',
                description: 'Members living in the southern part of the city',
                lastMeetingDate: '2025-11-16', nextMeetingDate: '2025-11-30'
            },
            {
                name: 'East Zone', leader: 'James Williams',
                location: 'East Kumasi', status: 'Active',
                description: 'Members living in the eastern part of the city'
            }
        ]);
        console.log(`✅ Added ${clusters.length} clusters\n`);

        // 7. Cluster Follow-ups
        console.log('📋 Seeding Follow-ups...');
        const followUps = await FollowUp.bulkCreate([
            {
                memberName: 'Michael Brown', type: 'Absent',
                priority: 'High', status: 'Pending',
                assignedTo: 'John Doe', dueDate: '2025-11-30',
                notes: 'Missed 3 consecutive Sundays - needs pastoral care'
            },
            {
                memberName: 'Peter Akoto', type: 'Visitor',
                priority: 'Medium', status: 'In Progress',
                assignedTo: 'Jane Smith', dueDate: '2025-12-05',
                notes: 'Follow up on first visit, showed interest in Bible study'
            },
            {
                memberName: 'New Family', type: 'New Member',
                priority: 'High', status: 'Pending',
                assignedTo: 'Sarah Johnson', dueDate: '2025-12-01',
                notes: 'Family of 4, need to schedule orientation'
            }
        ]);
        console.log(`✅ Added ${followUps.length} follow-ups\n`);

        // 8. Bulk SMS
        console.log('📱 Seeding SMS Messages...');
        const smsMessages = await SMSMessage.bulkCreate([
            {
                subject: 'Sunday Service Reminder',
                message: 'Dear Member, join us this Sunday at 9am for a special service. God bless!',
                recipientType: 'All Members', recipientCount: 150,
                status: 'Sent', sentDate: '2025-11-23T09:00:00Z',
                deliveryCount: 145, failedCount: 5, createdBy: 'Admin'
            },
            {
                subject: 'Teachers Meeting',
                message: 'All teachers, please attend the meeting on Saturday at 4pm. Attendance is mandatory.',
                recipientType: 'Teachers', recipientCount: 20,
                status: 'Sent', sentDate: '2025-11-24T16:00:00Z',
                deliveryCount: 18, failedCount: 2, createdBy: 'Sarah Johnson'
            },
            {
                subject: 'Christmas Program Announcement',
                message: 'Save the date! Christmas program on Dec 24th. More details coming soon.',
                recipientType: 'All Members', recipientCount: 150,
                status: 'Scheduled', scheduledDate: '2025-12-15T10:00:00Z',
                createdBy: 'Admin'
            }
        ]);
        console.log(`✅ Added ${smsMessages.length} SMS messages\n`);

        // 9. Reports
        console.log('📊 Seeding Reports...');
        const reports = await Report.bulkCreate([
            {
                name: 'Monthly Attendance Report', type: 'Attendance',
                dateRange: { start: '2025-11-01', end: '2025-11-30' },
                format: 'PDF', status: 'Completed',
                fileUrl: '/reports/attendance_nov_2025.pdf',
                fileSize: 10240, generatedBy: 'Admin'
            },
            {
                name: 'Q4 Financial Summary', type: 'Financial',
                dateRange: { start: '2025-10-01', end: '2025-12-31' },
                format: 'Excel', status: 'Completed',
                fileUrl: '/reports/finance_q4_2025.xlsx',
                fileSize: 25600, generatedBy: 'Treasurer'
            },
            {
                name: 'Member Growth Report', type: 'Member',
                dateRange: { start: '2025-01-01', end: '2025-11-30' },
                format: 'PDF', status: 'Generating',
                generatedBy: 'Admin'
            }
        ]);
        console.log(`✅ Added ${reports.length} reports\n`);

        // 10. Attendance
        console.log('✅ Seeding Attendance...');
        const members = await Member.findAll();
        if (members.length > 0) {
            const attendanceRecords = [];
            // Add attendance for first 3 members
            for (let i = 0; i < Math.min(3, members.length); i++) {
                attendanceRecords.push({
                    MemberId: members[i].id,
                    date: '2025-11-24',
                    status: 'Present',
                    checkInTime: '08:55:00',
                    mode: 'Manual',
                    serviceType: 'Sunday Service'
                });
                attendanceRecords.push({
                    MemberId: members[i].id,
                    date: '2025-11-17',
                    status: 'Present',
                    checkInTime: '09:10:00',
                    mode: 'QR',
                    serviceType: 'Sunday Service'
                });
            }
            const attendance = await Attendance.bulkCreate(attendanceRecords);
            console.log(`✅ Added ${attendance.length} attendance records\n`);
        } else {
            console.log('⚠️  No members found, skipping attendance\n');
        }

        console.log('🎉 All test data seeded successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - ${teachers.length} Teachers`);
        console.log(`   - ${visitors.length} Visitors`);
        console.log(`   - ${equipment.length} Equipment items`);
        console.log(`   - ${donations.length} Donations`);
        console.log(`   - ${expenses.length} Expenses`);
        console.log(`   - ${clusters.length} Clusters`);
        console.log(`   - ${followUps.length} Follow-ups`);
        console.log(`   - ${smsMessages.length} SMS Messages`);
        console.log(`   - ${reports.length} Reports`);

    } catch (error) {
        console.error('❌ Seeding error:', error);
    } finally {
        await sequelize.close();
    }
}

seed();
