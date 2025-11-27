import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './components/pages/Dashboard';
import { Members } from './components/pages/Members';
import { Visitors } from './components/pages/Visitors';
import { Teachers } from './components/pages/Teachers';
import { Attendance } from './components/pages/Attendance';
import Notifications from './components/pages/Notifications';
import { Finance } from './components/pages/Finance';
import { BulkSMS } from './components/pages/BulkSMS';
import { Equipment } from './components/pages/Equipment';
import { Reports } from './components/pages/Reports';
import { Settings } from './components/pages/Settings';
import { ClusterFollowUp } from './components/pages/ClusterFollowUp';
import { AdminProfile } from './components/pages/AdminProfile';

// Protected Route Component
function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

// Login Page Component
function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <LoginForm />
        </div>
    );
}

// Placeholder for components not yet implemented
const Placeholder = ({ title }) => (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p className="text-gray-600">This feature is coming soon.</p>
    </div>
);

export default function App() {
    return (
        <Router>
            <Routes>
                {/* Login Route */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="members" element={<Members />} />
                    <Route path="visitors" element={<Visitors />} />
                    <Route path="teachers" element={<Teachers />} />
                    <Route path="attendance" element={<Attendance />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="finance" element={<Finance />} />
                    <Route path="bulk-sms" element={<BulkSMS />} />
                    <Route path="equipment" element={<Equipment />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="cluster-followup" element={<ClusterFollowUp />} />
                    <Route path="profile" element={<AdminProfile />} />
                </Route>
            </Routes>
        </Router>
    );
}
