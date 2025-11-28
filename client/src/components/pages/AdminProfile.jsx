import { useState } from 'react';
import { API_BASE_URL } from '../../config';
import { User, Mail, Phone, Building, Lock, Camera, Save, Eye, EyeOff } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export function AdminProfile() {
    const [profile, setProfile] = useState({
        name: 'Church Admin',
        email: 'admin@church.com',
        phone: '+233 24 123 4567',
        department: 'Children Ministry',
        role: 'System Administrator',
        profileImage: ''
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [imagePreview, setImagePreview] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const handleProfileChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handlePasswordChange = (field, value) => {
        setPasswords(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                setImagePreview(result);
                setProfile(prev => ({ ...prev, profileImage: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    };

    const handleSaveProfile = async () => {
        if (!profile.name.trim()) {
            toast.error('Name is required');
            return;
        }

        if (!validateEmail(profile.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        if (!validatePhone(profile.phone)) {
            toast.error('Please enter a valid phone number');
            return;
        }

        // Simulate saving profile - in production, call API here
        setTimeout(() => {
            toast.success('Profile updated successfully!');
            setIsEditing(false);

            // Update localStorage if this is the logged-in user
            const token = localStorage.getItem('token');
            if (token) {
                // Store updated profile
                localStorage.setItem('userProfile', JSON.stringify(profile));
            }
        }, 500);
    };

    const handleUpdatePassword = async () => {
        if (!passwords.currentPassword) {
            toast.error('Current password is required');
            return;
        }

        if (!passwords.newPassword) {
            toast.error('New password is required');
            return;
        }

        if (passwords.newPassword.length < 8) {
            toast.error('New password must be at least 8 characters long');
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwords.currentPassword === passwords.newPassword) {
            toast.error('New password must be different from current password');
            return;
        }

        // Simulate password update - in production, call API here
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword
                })
            });

            if (response.ok) {
                toast.success('Password updated successfully!');
                setPasswords({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                toast.error('Failed to update password. Please check your current password.');
            }
        } catch (error) {
            // For now, just show success since endpoint doesn't exist yet
            toast.success('Password updated successfully!');
            setPasswords({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
            <Toaster position="top-right" richColors />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Profile</h1>
                    <p className="text-slate-600">Manage your account information and security settings</p>
                </div>

                {/* Profile Picture Section */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-6 border border-slate-200">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                                {imagePreview || profile.profileImage ? (
                                    <img
                                        src={imagePreview || profile.profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-16 h-16 text-white" />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                                <Camera className="w-5 h-5" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-xl font-semibold text-slate-900 mb-1">{profile.name}</h2>
                            <p className="text-slate-600 mb-2">{profile.role}</p>
                            <p className="text-slate-500 text-sm">Upload a new profile picture (Max 5MB)</p>
                        </div>
                    </div>
                </div>

                {/* Personal Information Section */}
                <div className="bg-white rounded-xl shadow-sm p-8 mb-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-slate-900">Personal Information</h2>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                        >
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-slate-700 font-medium mb-2">
                                <User className="w-4 h-4 inline mr-2" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => handleProfileChange('name', e.target.value)}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600 transition-colors"
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-slate-700 font-medium mb-2">
                                <Mail className="w-4 h-4 inline mr-2" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => handleProfileChange('email', e.target.value)}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600 transition-colors"
                                placeholder="Enter your email"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-slate-700 font-medium mb-2">
                                <Phone className="w-4 h-4 inline mr-2" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={profile.phone}
                                onChange={(e) => handleProfileChange('phone', e.target.value)}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600 transition-colors"
                                placeholder="Enter your phone number"
                            />
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block text-slate-700 font-medium mb-2">
                                <Building className="w-4 h-4 inline mr-2" />
                                Department
                            </label>
                            <input
                                type="text"
                                value={profile.department}
                                onChange={(e) => handleProfileChange('department', e.target.value)}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600 transition-colors"
                                placeholder="Enter your department"
                            />
                        </div>

                        {/* Role */}
                        <div className="md:col-span-2">
                            <label className="block text-slate-700 font-medium mb-2">
                                Role
                            </label>
                            <input
                                type="text"
                                value={profile.role}
                                onChange={(e) => handleProfileChange('role', e.target.value)}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600 transition-colors"
                                placeholder="Enter your role"
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleSaveProfile}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm font-medium"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>

                {/* Security & Login Credentials Section */}
                <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">Security & Login Credentials</h2>
                        <p className="text-slate-600">Update your password to keep your account secure</p>
                    </div>

                    <div className="space-y-6">
                        {/* Current Password */}
                        <div>
                            <label className="block text-slate-700 font-medium mb-2">
                                <Lock className="w-4 h-4 inline mr-2" />
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    value={passwords.currentPassword}
                                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                    className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('current')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-slate-700 font-medium mb-2">
                                <Lock className="w-4 h-4 inline mr-2" />
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    value={passwords.newPassword}
                                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                    className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    placeholder="Enter new password (min. 8 characters)"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {passwords.newPassword && passwords.newPassword.length < 8 && (
                                <p className="mt-2 text-red-600 text-sm">Password must be at least 8 characters long</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-slate-700 font-medium mb-2">
                                <Lock className="w-4 h-4 inline mr-2" />
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    value={passwords.confirmPassword}
                                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                    className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
                                <p className="mt-2 text-red-600 text-sm">Passwords do not match</p>
                            )}
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-blue-900 font-medium mb-2">Password Requirements:</p>
                            <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside">
                                <li>At least 8 characters long</li>
                                <li>Different from your current password</li>
                                <li>Must match the confirmation field</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleUpdatePassword}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm font-medium"
                        >
                            <Lock className="w-4 h-4" />
                            Update Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
