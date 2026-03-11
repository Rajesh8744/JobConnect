import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axiosInstance from '../api/axiosConfig';

const RecruiterApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyModal, setReplyModal] = useState(null);
    const [replyData, setReplyData] = useState({ status: '', notes: '' });
    const [replying, setReplying] = useState(false);

    const loadApplications = async () => {
        try {
            const res = await axiosInstance.get('/recruiter/applications');
            setApplications(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadApplications(); }, []);

    const handleReply = async () => {
        if (!replyData.status && !replyData.notes) return;
        setReplying(true);
        try {
            const payload = {};
            if (replyData.status) payload.status = replyData.status;
            if (replyData.notes) payload.notes = replyData.notes;
            await axiosInstance.put(`/recruiter/applications/${replyModal.id}/reply`, payload);
            setReplyModal(null);
            setReplyData({ status: '', notes: '' });
            loadApplications();
        } catch (err) { console.error(err); }
        finally { setReplying(false); }
    };

    const statusBadge = (status) => {
        const styles = {
            PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
            REVIEWED: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
            SHORTLISTED: 'bg-green-500/10 text-green-400 border-green-500/30',
            REJECTED: 'bg-red-500/10 text-red-400 border-red-500/30',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
                {status}
            </span>
        );
    };

    // Group applications by job
    const grouped = applications.reduce((acc, app) => {
        const key = app.jobId;
        if (!acc[key]) acc[key] = { jobTitle: app.jobTitle, company: app.company, apps: [] };
        acc[key].apps.push(app);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gray-950 py-10 px-6">
            <Helmet>
                <title>Applications – JobConnect Recruiter</title>
            </Helmet>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Applications</h1>
                <p className="text-gray-400 mb-8">Review and reply to job seekers who applied to your positions</p>

                {loading ? (
                    <div className="text-center text-gray-400 py-20">Loading...</div>
                ) : applications.length === 0 ? (
                    <div className="text-center text-gray-500 py-20 bg-gray-900/30 rounded-2xl border border-gray-800">
                        No applications yet. Once your jobs are approved and seekers apply, they'll appear here.
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(grouped).map(([jobId, group]) => (
                            <div key={jobId} className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/80">
                                    <h2 className="text-lg font-semibold text-white">{group.jobTitle}</h2>
                                    <p className="text-indigo-400 text-sm">{group.company} · {group.apps.length} applicant(s)</p>
                                </div>
                                <div className="divide-y divide-gray-800">
                                    {group.apps.map(app => (
                                        <div key={app.id} className="px-6 py-4 hover:bg-gray-800/30 transition">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-white font-medium">{app.seekerName}</p>
                                                    <p className="text-gray-400 text-sm">{app.seekerEmail}</p>
                                                    <p className="text-gray-500 text-xs mt-1">Applied: {new Date(app.appliedDate).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {statusBadge(app.status)}
                                                    <button
                                                        onClick={() => { setReplyModal(app); setReplyData({ status: app.status, notes: app.notes || '' }); }}
                                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
                                                        Reply
                                                    </button>
                                                </div>
                                            </div>
                                            {app.coverLetter && (
                                                <div className="mt-3 bg-gray-800/30 rounded-xl px-4 py-3">
                                                    <p className="text-gray-400 text-sm"><span className="text-gray-300 font-medium">Cover Letter:</span> {app.coverLetter}</p>
                                                </div>
                                            )}
                                            {app.notes && (
                                                <div className="mt-2 bg-indigo-500/5 border border-indigo-500/20 rounded-xl px-4 py-3">
                                                    <p className="text-indigo-300 text-sm"><span className="font-medium">Your Reply:</span> {app.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reply Modal */}
            {replyModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg">
                        <h3 className="text-xl font-bold text-white mb-1">Reply to {replyModal.seekerName}</h3>
                        <p className="text-gray-400 text-sm mb-6">For: {replyModal.jobTitle}</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Update Status</label>
                                <select value={replyData.status} onChange={e => setReplyData({ ...replyData, status: e.target.value })}
                                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition">
                                    <option value="PENDING">Pending</option>
                                    <option value="REVIEWED">Reviewed</option>
                                    <option value="SHORTLISTED">Shortlisted</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Message / Notes</label>
                                <textarea value={replyData.notes} onChange={e => setReplyData({ ...replyData, notes: e.target.value })}
                                    rows={4}
                                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition resize-none"
                                    placeholder="Write a message to the applicant..." />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setReplyModal(null)}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3 rounded-xl transition">
                                Cancel
                            </button>
                            <button onClick={handleReply} disabled={replying}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-medium py-3 rounded-xl transition">
                                {replying ? 'Sending...' : 'Send Reply'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterApplications;
