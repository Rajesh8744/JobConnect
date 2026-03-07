import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

const statusColors = {
    PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    REVIEWED: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    SHORTLISTED: 'bg-green-500/10 text-green-400 border-green-500/30',
    REJECTED: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const SeekerDashboard = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance.get('/applications/me').then(res => setApps(res.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center text-gray-400 py-20 min-h-screen bg-gray-950">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-950 py-10 px-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">My Applications</h1>
                <p className="text-gray-400 mb-8">Track the status of your job applications</p>

                {apps.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900/30 rounded-2xl border border-gray-800">
                        <p className="text-gray-500 text-lg">No applications yet</p>
                        <a href="/" className="text-indigo-400 hover:text-indigo-300 mt-2 inline-block">Browse Jobs →</a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {apps.map(app => (
                            <div key={app.id} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {app.jobLogo ? (
                                            <img src={app.jobLogo} alt="" className="w-12 h-12 rounded-xl bg-gray-800" onError={e => e.target.style.display='none'} />
                                        ) : (
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">{app.jobCompany?.[0] || '?'}</div>
                                        )}
                                        <div>
                                            <h3 className="text-white font-semibold text-lg">{app.jobTitle}</h3>
                                            <p className="text-gray-400 text-sm">{app.jobCompany} • {app.jobLocation}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${statusColors[app.status] || statusColors.PENDING}`}>
                                            {app.status}
                                        </span>
                                        <p className="text-gray-500 text-xs mt-2">{new Date(app.appliedDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                {app.notes && (
                                    <div className="mt-4 bg-gray-800/30 rounded-xl p-3 text-sm text-gray-300 border border-gray-700/50">
                                        <span className="text-gray-500">Admin Note:</span> {app.notes}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeekerDashboard;
