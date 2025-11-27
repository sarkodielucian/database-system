const sequelize = require('../config/database');
const Member = require('./Member');
const Event = require('./Event');
const Attendance = require('./Attendance');
const Donation = require('./Donation');
const User = require('./User');
const Teacher = require('./Teacher');
const Visitor = require('./Visitor');
const Equipment = require('./Equipment');
const Cluster = require('./Cluster');
const MemberHistory = require('./MemberHistory');
const Notification = require('./Notification');
const Pledge = require('./Pledge');
const Expense = require('./Expense');
const SMSMessage = require('./SMSMessage');
const SMSTemplate = require('./SMSTemplate');
const PrayerRequest = require('./PrayerRequest');
const Report = require('./Report');
const FollowUp = require('./FollowUp');
const Setting = require('./Setting');

// Associations
Member.hasMany(Attendance);
Attendance.belongsTo(Member);

Member.hasMany(MemberHistory);
MemberHistory.belongsTo(Member);

Event.hasMany(Attendance);
Attendance.belongsTo(Event);

Member.hasMany(Donation);
Donation.belongsTo(Member);

Member.hasMany(Pledge);
Pledge.belongsTo(Member);

Member.hasMany(PrayerRequest);
PrayerRequest.belongsTo(Member);

// Cluster associations
Cluster.hasMany(Member);
Member.belongsTo(Cluster);

Cluster.hasMany(FollowUp);
FollowUp.belongsTo(Cluster);

Member.hasMany(FollowUp);
FollowUp.belongsTo(Member);

module.exports = {
    sequelize,
    Member,
    Event,
    Attendance,
    Donation,
    User,
    Teacher,
    Visitor,
    Equipment,
    Cluster,
    MemberHistory,
    Notification,
    Pledge,
    Expense,
    SMSMessage,
    SMSTemplate,
    PrayerRequest,
    Report,
    FollowUp,
    Setting
};
