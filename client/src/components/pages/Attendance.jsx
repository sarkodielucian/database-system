import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
    ClipboardList,
    UserPlus,
    Check,
    X,
    Clock,
    Trash2,
    QrCode,
    Copy,
    CheckCircle,
    UserCheck,
    AlertCircle
} from 'lucide-react';

// ==================== ADD PARTICIPANT FORM COMPONENT ====================

function AddParticipantForm({ onAdd }) {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd(name.trim());
            setName('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-3 items-center">
            <UserPlus className="w-5 h-5 text-indigo-600" />
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter participant name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
                Add Participant
            </button>
        </form>
    );
}

// ==================== ATTENDANCE SHEET COMPONENT ====================

function AttendanceSheet({
    participants,
    selectedDate,
    getAttendanceStatus,
    markAttendance,
    removeParticipant,
}) {
    if (participants.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p>No participants added yet. Add participants to start marking attendance.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 text-gray-700">S.No</th>
                        <th className="text-left py-4 px-4 text-gray-700">Name</th>
                        <th className="text-center py-4 px-4 text-gray-700">Mark Attendance</th>
                        <th className="text-center py-4 px-4 text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {participants.map((participant, index) => {
                        const status = getAttendanceStatus(participant.id, selectedDate);
                        return (
                            <tr key={participant.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-4 px-4 text-gray-600">{index + 1}</td>
                                <td className="py-4 px-4 text-gray-900">{participant.name}</td>
                                <td className="py-4 px-4">
                                    <div className="flex gap-2 justify-center">
                                        <button
                                            onClick={() => markAttendance(participant.id, 'present')}
                                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${status === 'present'
                                                    ? 'bg-green-600 text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                                                }`}
                                        >
                                            <Check className="w-4 h-4" />
                                            Present
                                        </button>
                                        <button
                                            onClick={() => markAttendance(participant.id, 'absent')}
                                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${status === 'absent'
                                                    ? 'bg-red-600 text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                                                }`}
                                        >
                                            <X className="w-4 h-4" />
                                            Absent
                                        </button>
                                        <button
                                            onClick={() => markAttendance(participant.id, 'late')}
                                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${status === 'late'
                                                    ? 'bg-yellow-600 text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-yellow-100'
                                                }`}
                                        >
                                            <Clock className="w-4 h-4" />
                                            Late
                                        </button>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <button
                                        onClick={() => {
                                            if (window.confirm(`Remove ${participant.name} from the list?`)) {
                                                removeParticipant(participant.id);
                                            }
                                        }}
                                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

// ==================== QR CODE MODE COMPONENT ====================

function QRCodeMode({
    selectedDate,
    activeSession,
    onGenerateSession,
    stats,
    participants,
    getAttendanceStatus,
}) {
    const [copied, setCopied] = useState(false);

    const handleGenerateQR = () => {
        onGenerateSession();
    };

    const getCheckInUrl = () => {
        if (!activeSession) return '';
        const baseUrl = window.location.origin + window.location.pathname;
        return `${baseUrl}?session=${activeSession.token}`;
    };

    const copyToClipboard = () => {
        const url = getCheckInUrl();
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const isSessionExpired = () => {
        return activeSession && Date.now() > activeSession.expiresAt;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* QR Code Generator */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                    <QrCode className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-lg font-semibold text-indigo-900">QR Code Generator</h2>
                </div>

                {!activeSession || isSessionExpired() ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-6">
                            Generate a QR code for participants to scan and mark their attendance for{' '}
                            <span className="text-indigo-600">{formatDate(selectedDate)}</span>
                        </p>
                        <button
                            onClick={handleGenerateQR}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                        >
                            Generate QR Code
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        {/* QR Code Display */}
                        <div className="bg-white p-6 rounded-lg border-4 border-indigo-100 mb-4">
                            <QRCodeSVG value={getCheckInUrl()} size={256} level="H" />
                        </div>

                        {/* Session Info */}
                        <div className="w-full mb-4 p-4 bg-indigo-50 rounded-lg">
                            <p className="text-sm text-indigo-900 mb-2">
                                <strong>Date:</strong> {formatDate(activeSession.date)}
                            </p>
                            <p className="text-sm text-indigo-700 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Expires in 24 hours
                            </p>
                        </div>

                        {/* Copy Link Button */}
                        <div className="w-full">
                            <button
                                onClick={copyToClipboard}
                                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Link Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        <span>Copy Check-in Link</span>
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Share this link for participants to check in
                            </p>
                        </div>

                        {/* Regenerate Button */}
                        <button
                            onClick={handleGenerateQR}
                            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                        >
                            Generate New QR Code
                        </button>
                    </div>
                )}
            </div>

            {/* Real-time Attendance List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold text-indigo-900 mb-4">Checked In Participants</h2>

                {stats.present === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>No participants have checked in yet.</p>
                        <p className="text-sm mt-2">They will appear here once they scan the QR code.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {participants.map((participant) => {
                            const status = getAttendanceStatus(participant.id, selectedDate);
                            if (status === 'present') {
                                return (
                                    <div
                                        key={participant.id}
                                        className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <span className="text-gray-900">{participant.name}</span>
                                        </div>
                                        <span className="text-sm text-green-700">Present</span>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                )}

                {/* Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <p className="text-3xl text-indigo-600">{stats.present}</p>
                            <p className="text-sm text-gray-600">Checked In</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl text-gray-400">{stats.total - stats.present}</p>
                            <p className="text-sm text-gray-600">Pending</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==================== SELF CHECK-IN COMPONENT ====================

function SelfCheckIn({ participants, sessionToken, onCheckIn }) {
    const [selectedParticipant, setSelectedParticipant] = useState('');
    const [checkedIn, setCheckedIn] = useState(false);
    const [error, setError] = useState(false);
    const [participantName, setParticipantName] = useState('');

    const handleCheckIn = () => {
        if (!selectedParticipant) {
            return;
        }

        const result = onCheckIn(sessionToken, selectedParticipant);

        if (result.success) {
            const participant = participants.find(p => p.id === selectedParticipant);
            setParticipantName(participant?.name || '');
            setCheckedIn(true);
            setError(false);
        } else {
            setError(true);
        }
    };

    if (checkedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-green-900 mb-4">Check-in Successful!</h1>
                    <p className="text-gray-700 mb-2">
                        Welcome, <span className="text-green-600 font-semibold">{participantName}</span>
                    </p>
                    <p className="text-gray-600">
                        Your attendance has been marked as present.
                    </p>
                    <div className="mt-8 p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                            You can now close this window.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-12 h-12 text-red-600" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-red-900 mb-4">Session Expired</h1>
                    <p className="text-gray-700 mb-6">
                        This QR code has expired or is no longer valid. Please request a new QR code from your administrator.
                    </p>
                    <button
                        onClick={() => window.location.href = window.location.origin + window.location.pathname}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
                <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                        <UserCheck className="w-8 h-8 text-indigo-600" />
                    </div>
                </div>

                <h1 className="text-center text-2xl font-bold text-indigo-900 mb-2">Attendance Check-In</h1>
                <p className="text-center text-gray-600 mb-8">
                    Select your name to mark your attendance
                </p>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="participant" className="block text-gray-700 mb-2 font-medium">
                            Your Name
                        </label>
                        <select
                            id="participant"
                            value={selectedParticipant}
                            onChange={(e) => setSelectedParticipant(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                        >
                            <option value="">-- Select your name --</option>
                            {participants.map((participant) => (
                                <option key={participant.id} value={participant.id}>
                                    {participant.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleCheckIn}
                        disabled={!selectedParticipant}
                        className={`w-full py-3 rounded-lg transition-colors ${selectedParticipant
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        Check In
                    </button>
                </div>

                <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-indigo-800 text-center">
                        Make sure to select the correct name before checking in.
                    </p>
                </div>
            </div>
        </div>
    );
}

// ==================== MAIN APP COMPONENT ====================

export function Attendance() {
    const [participants, setParticipants] = useState([
        { id: '1', name: 'John Smith' },
        { id: '2', name: 'Emma Johnson' },
        { id: '3', name: 'Michael Brown' },
        { id: '4', name: 'Sarah Davis' },
    ]);

    const [attendance, setAttendance] = useState([]);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [mode, setMode] = useState('manual');
    const [activeSession, setActiveSession] = useState(null);

    // Check if viewing as a participant (from QR code scan)
    const urlParams = new URLSearchParams(window.location.search);
    const sessionToken = urlParams.get('session');

    const addParticipant = (name) => {
        const newParticipant = {
            id: Date.now().toString(),
            name,
        };
        setParticipants([...participants, newParticipant]);
    };

    const removeParticipant = (id) => {
        setParticipants(participants.filter(p => p.id !== id));
        setAttendance(attendance.filter(a => a.participantId !== id));
    };

    const markAttendance = (participantId, status) => {
        const existingIndex = attendance.findIndex(
            a => a.participantId === participantId && a.date === selectedDate
        );

        if (existingIndex >= 0) {
            const newAttendance = [...attendance];
            newAttendance[existingIndex].status = status;
            setAttendance(newAttendance);
        } else {
            setAttendance([
                ...attendance,
                { participantId, date: selectedDate, status },
            ]);
        }
    };

    const generateSession = () => {
        const token = Math.random().toString(36).substring(2, 15);
        const session = {
            token,
            date: selectedDate,
            expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        };
        setActiveSession(session);
        return session;
    };

    const validateSessionAndMarkAttendance = (token, participantId) => {
        if (activeSession && activeSession.token === token && Date.now() < activeSession.expiresAt) {
            markAttendance(participantId, 'present');
            return { success: true, date: activeSession.date };
        }
        return { success: false, date: null };
    };

    const getAttendanceStatus = (participantId, date) => {
        return attendance.find(
            a => a.participantId === participantId && a.date === date
        )?.status;
    };

    const getStats = () => {
        const todayAttendance = attendance.filter(a => a.date === selectedDate);
        return {
            present: todayAttendance.filter(a => a.status === 'present').length,
            absent: todayAttendance.filter(a => a.status === 'absent').length,
            late: todayAttendance.filter(a => a.status === 'late').length,
            total: participants.length,
        };
    };

    const stats = getStats();

    // If user came from QR code scan, show check-in page
    if (sessionToken) {
        return (
            <SelfCheckIn
                participants={participants}
                sessionToken={sessionToken}
                onCheckIn={validateSessionAndMarkAttendance}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <ClipboardList className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-2xl font-bold text-indigo-900">Attendance Sheet</h1>
                    </div>

                    {/* Date Selector and Mode Toggle */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <div className="flex items-center gap-3">
                                <label htmlFor="date" className="text-gray-700 font-medium">
                                    Select Date:
                                </label>
                                <input
                                    id="date"
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Statistics */}
                            <div className="flex gap-4 flex-wrap">
                                <div className="px-4 py-2 bg-green-100 rounded-lg">
                                    <span className="text-green-800 font-medium">Present: {stats.present}</span>
                                </div>
                                <div className="px-4 py-2 bg-red-100 rounded-lg">
                                    <span className="text-red-800 font-medium">Absent: {stats.absent}</span>
                                </div>
                                <div className="px-4 py-2 bg-yellow-100 rounded-lg">
                                    <span className="text-yellow-800 font-medium">Late: {stats.late}</span>
                                </div>
                                <div className="px-4 py-2 bg-indigo-100 rounded-lg">
                                    <span className="text-indigo-800 font-medium">Total: {stats.total}</span>
                                </div>
                            </div>
                        </div>

                        {/* Mode Toggle */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setMode('manual')}
                                className={`px-6 py-2 rounded-lg transition-all ${mode === 'manual'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Manual Mode
                            </button>
                            <button
                                onClick={() => setMode('qr')}
                                className={`px-6 py-2 rounded-lg transition-all ${mode === 'qr'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                QR Code Mode
                            </button>
                        </div>
                    </div>
                </div>

                {/* Add Participant Form */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <AddParticipantForm onAdd={addParticipant} />
                </div>

                {/* Content based on mode */}
                {mode === 'manual' ? (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <AttendanceSheet
                            participants={participants}
                            selectedDate={selectedDate}
                            getAttendanceStatus={getAttendanceStatus}
                            markAttendance={markAttendance}
                            removeParticipant={removeParticipant}
                        />
                    </div>
                ) : (
                    <QRCodeMode
                        selectedDate={selectedDate}
                        activeSession={activeSession}
                        onGenerateSession={generateSession}
                        stats={stats}
                        participants={participants}
                        getAttendanceStatus={getAttendanceStatus}
                    />
                )}
            </div>
        </div>
    );
}
