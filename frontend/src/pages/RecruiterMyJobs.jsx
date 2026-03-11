import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axiosInstance from '../api/axiosConfig';

const RecruiterMyJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        const load = async () => {
            try {
                const res = await axiosInstance.get('/recruiter/jobs');
                setJobs(res.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const filteredJobs = filter === 'ALL' ? jobs : jobs.filter(j => j.status === filter);

    const statusBadge = (status) => {
        const styles = {
            PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
            APPROVED: 'bg-green-500/10 text-green-400 border-green-500/30',
            REJECTED: 'bg-red-500/10 text-red-400 border-red-500/30',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-950 py-10 px-6">
            <Helmet>
                <title>My Job Requests – JobConnect</title>
            </Helmet>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Job Requests</h1>
                        <p className="text-gray-400">Track the status of your submitted job postings</p>
                    </div>
                    <Link to="/recruiter/post-job" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition">
                        + Post New Job
                    </Link>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6">
                    {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === f
                                ? 'bg-indigo-600 text-white' : 'bg-gray-900/50 text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700'}`}>
                            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()} ({f === 'ALL' ? jobs.length : jobs.filter(j => j.status === f).length})
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center text-gray-400 py-20">Loading...</div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center text-gray-500 py-20 bg-gray-900/30 rounded-2xl border border-gray-800">
                        No job requests found.{' '}
                        <Link to="/recruiter/post-job" className="text-indigo-400 hover:text-indigo-300">Post your first job →</Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredJobs.map(job => (
                            <div key={job.id} className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                                            {statusBadge(job.status)}
                                        </div>
                                        <p className="text-indigo-400 font-medium">{job.company}</p>
                                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                                            {job.location && <span>📍 {job.location}</span>}
                                            {(job.salaryMin || job.salaryMax) && (
                                                <span>💰 {job.salaryMin ? `₹${Number(job.salaryMin).toLocaleString()}` : ''} {job.salaryMin && job.salaryMax ? '-' : ''} {job.salaryMax ? `₹${Number(job.salaryMax).toLocaleString()}` : ''}</span>
                                            )}
                                            <span>🕐 {new Date(job.postedDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {job.status === 'REJECTED' && job.rejectionReason && (
                                    <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                        <p className="text-red-400 text-sm"><span className="font-medium">Rejection Reason:</span> {job.rejectionReason}</p>
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

export default RecruiterMyJobs;
