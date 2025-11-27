// testAllSaves.js - Test script to verify all create operations work
const axios = require('axios');
const API = 'http://localhost:5000/api';

async function testCreate(endpoint, data, moduleName) {
    try {
        const res = await axios.post(`${API}/${endpoint}`, data);
        console.log(`✅ ${moduleName}: Successfully created (ID: ${res.data.id || res.data.name || 'Success'})`);
        return true;
    } catch (e) {
        console.error(`❌ ${moduleName}: FAILED -`, e.response?.data?.message || e.message);
        return false;
    }
}

(async () => {
    console.log('🧪 Testing Create Operations for All Modules\n');

    const results = {
        passed: 0,
        failed: 0
    };

    // 1. Test Member
    if (await testCreate('members', {
        firstName: 'API', lastName: 'Test', class: 'Beginners',
        phone: '0240999001', email: 'apitest1@test.com'
    }, 'Members')) results.passed++; else results.failed++;

    // 2. Test Teacher
    if (await testCreate('teachers', {
        firstName: 'API', lastName: 'Teacher', phone: '0240999002',
        email: 'apitest2@test.com'
    }, 'Teachers')) results.passed++; else results.failed++;

    // 3. Test Visitor
    if (await testCreate('visitors', {
        name: 'API Visitor', phone: '0240999003',
        email: 'apitest3@test.com', purpose: 'Testing'
    }, 'Visitors')) results.passed++; else results.failed++;

    // 4. Test Equipment
    if (await testCreate('equipment', {
        name: 'API Test Equipment', category: 'Other',
        quantity: 1, condition: 'Good'
    }, 'Equipment')) results.passed++; else results.failed++;

    // 5. Test Donation (Finance)
    if (await testCreate('finance/donations', {
        amount: 100, type: 'Offering', category: 'General',
        date: '2025-11-26', status: 'Completed'
    }, 'Finance - Donations')) results.passed++; else results.failed++;

    // 6. Test Expense (Finance)
    if (await testCreate('finance/expenses', {
        amount: 50, category: 'Other', department: 'General',
        description: 'API Test Expense', date: '2025-11-26',
        status: 'Pending'
    }, 'Finance - Expenses')) results.passed++; else results.failed++;

    // 7. Test Cluster
    if (await testCreate('clusters/clusters', {
        name: 'API Test Cluster', leader: 'API Tester',
        location: 'Test Location', status: 'Active'
    }, 'Clusters')) results.passed++; else results.failed++;

    // 8. Test Follow-up
    if (await testCreate('clusters/followups', {
        memberName: 'API Test', type: 'General',
        priority: 'Low', status: 'Pending',
        assignedTo: 'API Tester', dueDate: '2025-12-01'
    }, 'Cluster Follow-ups')) results.passed++; else results.failed++;

    // 9. Test Attendance (needs existing member)
    try {
        const membersRes = await axios.get(`${API}/members`);
        if (membersRes.data.length > 0) {
            if (await testCreate('attendance', {
                MemberId: membersRes.data[0].id,
                date: '2025-11-26', status: 'Present',
                checkInTime: '09:00', mode: 'Manual',
                serviceType: 'Test Service'
            }, 'Attendance')) results.passed++; else results.failed++;
        } else {
            console.log('⚠️  Attendance: Skipped (no members found)');
        }
    } catch (e) {
        console.error('❌ Attendance: FAILED -', e.message);
        results.failed++;
    }

    // 10. Test SMS (Bulk SMS)
    if (await testCreate('sms/messages', {
        subject: 'API Test', message: 'Testing SMS creation',
        recipientType: 'All Members', status: 'Draft'
    }, 'Bulk SMS')) results.passed++; else results.failed++;

    // 11. Test Report
    if (await testCreate('analytics/reports', {
        name: 'API Test Report', type: 'Custom',
        dateRange: { start: '2025-11-01', end: '2025-11-30' },
        format: 'PDF', status: 'Generating'
    }, 'Reports')) results.passed++; else results.failed++;

    console.log(`\n📊 Test Results: ${results.passed} passed, ${results.failed} failed`);

    if (results.failed === 0) {
        console.log('✅ All create operations are working!');
    } else {
        console.log('⚠️  Some operations failed. Check the errors above.');
    }
})();
