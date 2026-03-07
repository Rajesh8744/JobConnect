import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, jobs: 0, activeJobs: 0, linkedinJobs: 0 });

    useEffect(() => {
        const load = async () => {
            try {
                const [usersRes, jobsRes] = await Promise.all([
                    axiosInstance.get('/admin/users'),
                    axiosInstance.get('/admin/jobs')
                ]);
                const jobs = jobsRes.data;
                setStats({
                    users: usersRes.data.length,
                    jobs: jobs.length,
                    activeJobs: jobs.filter(j => j.isActive).length,
                    linkedinJobs: jobs.filter(j => j.source === 'LINKEDIN').length,
                });
            } catch (err) { console.error(err); }
        };
        load();
    }, []);

    const cards = [
        { label: 'Total Users', value: stats.users, color: 'from-blue-600 to-blue-400', link: '/admin/users' },
        { label: 'Total Jobs', value: stats.jobs, color: 'from-indigo-600 to-indigo-400', link: '/admin/jobs' },
        { label: 'Active Jobs', value: stats.activeJobs, color: 'from-green-600 to-green-400', link: '/admin/jobs' },
        { label: 'LinkedIn Imports', value: stats.linkedinJobs, color: 'from-purple-600 to-purple-400', link: '/admin/linkedin' },
    ];

    return (
        <div className="min-h-screen bg-gray-950 py-10 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-gray-400 mb-10">Overview of your JobConnect platform</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {cards.map(c => (
                        <Link to={c.link} key={c.label} className="group bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-bold text-lg mb-4`}>
                                {c.value}
                            </div>
                            <p className="text-white font-semibold">{c.label}</p>
                            <p className="text-gray-500 text-sm mt-1">Click to manage →</p>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link to="/admin/jobs" className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/50 transition group">
                        <h3 className="text-white font-semibold text-lg group-hover:text-indigo-400 transition">Manage Jobs</h3>
                        <p className="text-gray-400 text-sm mt-2">Create, edit, and delete job listings</p>
                    </Link>
                    <Link to="/admin/users" className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/50 transition group">
                        <h3 className="text-white font-semibold text-lg group-hover:text-indigo-400 transition">Manage Users</h3>
                        <p className="text-gray-400 text-sm mt-2">View and manage platform users</p>
                    </Link>
                    <Link to="/admin/linkedin" className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/50 transition group">
                        <h3 className="text-white font-semibold text-lg group-hover:text-indigo-400 transition">LinkedIn Import</h3>
                        <p className="text-gray-400 text-sm mt-2">Fetch and import jobs from LinkedIn</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
