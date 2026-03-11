import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axiosInstance from '../api/axiosConfig';

const RecruiterDashboard = () => {
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, applications: 0 });

    useEffect(() => {
        const load = async () => {
            try {
                const [jobsRes, appsRes] = await Promise.all([
                    axiosInstance.get('/recruiter/jobs'),
                    axiosInstance.get('/recruiter/applications')
                ]);
                const jobs = jobsRes.data;
                setStats({
                    total: jobs.length,
                    pending: jobs.filter(j => j.status === 'PENDING').length,
                    approved: jobs.filter(j => j.status === 'APPROVED').length,
                    rejected: jobs.filter(j => j.status === 'REJECTED').length,
                    applications: appsRes.data.length
                });
            } catch (err) { console.error(err); }
        };
        load();
    }, []);

    const cards = [
        { label: 'Total Requests', value: stats.total, color: 'from-blue-600 to-blue-400', link: '/recruiter/my-jobs' },
        { label: 'Pending', value: stats.pending, color: 'from-yellow-600 to-yellow-400', link: '/recruiter/my-jobs' },
        { label: 'Approved', value: stats.approved, color: 'from-green-600 to-green-400', link: '/recruiter/my-jobs' },
        { label: 'Applications', value: stats.applications, color: 'from-purple-600 to-purple-400', link: '/recruiter/applications' },
    ];

    return (
        <div className="min-h-screen bg-gray-950 py-10 px-6">
            <Helmet>
                <title>Recruiter Dashboard – JobConnect</title>
            </Helmet>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Recruiter Dashboard</h1>
                <p className="text-gray-400 mb-10">Manage your job postings and applicants</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {cards.map(c => (
                        <Link to={c.link} key={c.label} className="group bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-bold text-lg mb-4`}>
                                {c.value}
                            </div>
                            <p className="text-white font-semibold">{c.label}</p>
                            <p className="text-gray-500 text-sm mt-1">Click to view →</p>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link to="/recruiter/post-job" className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/50 transition group">
                        <h3 className="text-white font-semibold text-lg group-hover:text-indigo-400 transition">📝 Post a Job</h3>
                        <p className="text-gray-400 text-sm mt-2">Submit a new job for admin approval</p>
                    </Link>
                    <Link to="/recruiter/my-jobs" className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/50 transition group">
                        <h3 className="text-white font-semibold text-lg group-hover:text-indigo-400 transition">📋 My Job Requests</h3>
                        <p className="text-gray-400 text-sm mt-2">View status of your submitted jobs</p>
                    </Link>
                    <Link to="/recruiter/applications" className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/50 transition group">
                        <h3 className="text-white font-semibold text-lg group-hover:text-indigo-400 transition">👥 Applications</h3>
                        <p className="text-gray-400 text-sm mt-2">Review and reply to applicants</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
