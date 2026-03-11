import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axiosInstance from '../api/axiosConfig';

const AdminRecruiterRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [filter, setFilter] = useState('PENDING');

    const loadRequests = async () => {
        try {
            const endpoint = filter === 'PENDING' ? '/admin/job-requests' : '/admin/job-requests/all';
            const res = await axiosInstance.get(endpoint);
            const data = filter === 'PENDING' ? res.data : res.data.filter(r => r.status === filter || filter === 'ALL');
            setRequests(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { setLoading(true); loadRequests(); }, [filter]);

    const handleApprove = async (id) => {
        setActionLoading(id);
        try {
            await axiosInstance.put(`/admin/job-requests/${id}/approve`);
            loadRequests();
        } catch (err) { console.error(err); }
        finally { setActionLoading(null); }
    };

    const handleReject = async () => {
        if (!rejectModal) return;
        setActionLoading(rejectModal);
        try {
            await axiosInstance.put(`/admin/job-requests/${rejectModal}/reject`, { reason: rejectReason });
            setRejectModal(null);
            setRejectReason('');
            loadRequests();
        } catch (err) { console.error(err); }
        finally { setActionLoading(null); }
    };

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
                <title>Recruiter Requests – Admin – JobConnect</title>
            </Helmet>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Recruiter Job Requests</h1>
                <p className="text-gray-400 mb-8">Review, verify, and approve job postings submitted by recruiters</p>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6">
                    {['PENDING', 'ALL', 'APPROVED', 'REJECTED'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === f
                                ? 'bg-indigo-600 text-white' : 'bg-gray-900/50 text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700'}`}>
                            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center text-gray-400 py-20">Loading...</div>
                ) : requests.length === 0 ? (
                    <div className="text-center text-gray-500 py-20 bg-gray-900/30 rounded-2xl border border-gray-800">
                        No {filter.toLowerCase()} requests found.
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {requests.map(req => (
                            <div key={req.id} className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-semibold text-white">{req.title}</h3>
                                            {statusBadge(req.status)}
                                        </div>
                                        <p className="text-indigo-400 font-medium">{req.company}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">{new Date(req.postedDate).toLocaleDateString()}</span>
                                </div>

                                {/* Recruiter Info */}
                                {req.recruiter && (
                                    <div className="bg-gray-800/30 rounded-xl px-4 py-3 mb-4">
                                        <p className="text-gray-300 text-sm font-medium mb-1">👤 Recruiter Information</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-400">
                                            <span><strong className="text-gray-300">Name:</strong> {req.recruiter.name}</span>
                                            <span><strong className="text-gray-300">Email:</strong> {req.recruiter.email}</span>
                                            <span><strong className="text-gray-300">Company:</strong> {req.recruiter.company || 'N/A'}</span>
                                            <span><strong className="text-gray-300">Phone:</strong> {req.recruiter.phone || 'N/A'}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Job Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">📍 Location</p>
                                        <p className="text-white text-sm">{req.location || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">💰 Salary Range</p>
                                        <p className="text-white text-sm">
                                            {req.salaryMin || req.salaryMax
                                                ? `₹${req.salaryMin ? Number(req.salaryMin).toLocaleString() : '0'} - ₹${req.salaryMax ? Number(req.salaryMax).toLocaleString() : 'N/A'}`
                                                : 'Not specified'}
                                        </p>
                                    </div>
                                </div>

                                {req.description && (
                                    <div className="mb-4">
                                        <p className="text-gray-400 text-sm mb-1">📝 Description</p>
                                        <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{req.description}</p>
                                    </div>
                                )}

                                {req.requirements && (
                                    <div className="mb-4">
                                        <p className="text-gray-400 text-sm mb-1">✅ Requirements</p>
                                        <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{req.requirements}</p>
                                    </div>
                                )}

                                {req.rejectionReason && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
                                        <p className="text-red-400 text-sm"><span className="font-medium">Rejection Reason:</span> {req.rejectionReason}</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {req.status === 'PENDING' && (
                                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-800">
                                        <button onClick={() => handleApprove(req.id)} disabled={actionLoading === req.id}
                                            className="flex-1 bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-white font-medium py-3 rounded-xl transition">
                                            {actionLoading === req.id ? 'Processing...' : '✅ Approve & Publish'}
                                        </button>
                                        <button onClick={() => setRejectModal(req.id)} disabled={actionLoading === req.id}
                                            className="flex-1 bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white font-medium py-3 rounded-xl transition">
                                            ❌ Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg">
                        <h3 className="text-xl font-bold text-white mb-4">Reject Job Request</h3>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Reason for Rejection *</label>
                            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                                rows={4}
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition resize-none"
                                placeholder="Explain why this job request is being rejected..." />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => { setRejectModal(null); setRejectReason(''); }}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3 rounded-xl transition">
                                Cancel
                            </button>
                            <button onClick={handleReject} disabled={!rejectReason.trim() || actionLoading}
                                className="flex-1 bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition">
                                {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRecruiterRequests;
