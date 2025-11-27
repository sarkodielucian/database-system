import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';

export function Reports() {
    const [recentReports, setRecentReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reportType, setReportType] = useState('Attendance');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [format, setFormat] = useState('PDF');

    const reportTypes = [
        {
            title: 'Attendance Report',
            description: 'Monthly and weekly attendance statistics',
            icon: Users,
            color: 'from-blue-500 to-blue-700'
        },
        {
            title: 'Financial Report',
            description: 'Income, expenses, and financial summaries',
            icon: DollarSign,
            color: 'from-green-500 to-green-700'
        },
        {
            title: 'Member Report',
            description: 'Membership growth and demographics',
            icon: Users,
            color: 'from-purple-500 to-purple-700'
        },
        {
            title: 'Ministry Report',
            description: 'Activities and ministry effectiveness',
            icon: TrendingUp,
            color: 'from-orange-500 to-orange-700'
        },
    ];

    useEffect(() => {
        fetchRecentReports();
    }, []);

    const fetchRecentReports = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/analytics/reports');
            const data = await response.json();
            setRecentReports(data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const handleGenerateReport = async () => {
        if (!startDate || !endDate) {
            alert('Please select date range');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/analytics/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: reportType,
                    format,
                    startDate,
                    endDate,
                    parameters: {}
                })
            });

            const data = await response.json();
            alert(`Report generated successfully! ID: ${data.id}`);
            fetchRecentReports();
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (report) => {
        const element = document.createElement("a");
        const file = new Blob([`Report: ${report.name}\nType: ${report.type}\nDate: ${new Date().toLocaleDateString()}`], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${report.name.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="space-y-6 fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-gray-900">Reports & Analytics</h1>
                    <p className="text-gray-600 mt-1">Generate comprehensive reports and insights</p>
                </div>
                <button
                    onClick={handleGenerateReport}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 gradient-blue text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                    <FileText className="w-4 h-4" />
                    <span>{loading ? 'Generating...' : 'Generate Report'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reportTypes.map((report, index) => {
                    const Icon = report.icon;
                    return (
                        <div key={index} className="card p-6 hover:scale-105 transition-transform cursor-pointer">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${report.color} flex items-center justify-center mb-4`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h5 className="text-gray-900">{report.title}</h5>
                            <p className="text-sm text-gray-600 mt-2">{report.description}</p>
                        </div>
                    );
                })}
            </div>

            <div className="card p-6">
                <h4 className="text-gray-900 mb-4">Custom Report Generator</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm text-gray-700 mb-2">Report Type</label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option>Attendance</option>
                            <option>Financial</option>
                            <option>Member</option>
                            <option>Ministry</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-2">Date Range</label>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-2">Format</label>
                        <select
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option>PDF</option>
                            <option>Excel</option>
                            <option>CSV</option>
                        </select>
                    </div>
                </div>
                <button
                    onClick={handleGenerateReport}
                    disabled={loading}
                    className="mt-4 w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 gradient-blue text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                    <Download className="w-4 h-4" />
                    <span>{loading ? 'Generating...' : 'Generate & Download'}</span>
                </button>
            </div>

            <div className="card p-6">
                <h4 className="text-gray-900 mb-4">Recent Reports</h4>
                <div className="space-y-3">
                    {recentReports.length === 0 && (
                        <p className="text-gray-500 text-center py-8">No reports generated yet</p>
                    )}
                    {recentReports.map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg gradient-blue flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-gray-900">{report.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="w-3 h-3 text-gray-500" />
                                        <p className="text-xs text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</p>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-500">{report.type}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${report.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                            report.status === 'Failed' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {report.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {report.status === 'Completed' && (
                                <button
                                    onClick={() => handleDownload(report)}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Download</span>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
