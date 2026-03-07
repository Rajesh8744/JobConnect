import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

const statusColors = {
    PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    REVIEWED: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    SHORTLISTED: 'bg-green-500/10 text-green-400 border-green-500/30',
    REJECTED: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const AdminJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState({ title: '', company: '', location: '', description: '', requirements: '', salaryMin: '', salaryMax: '' });
    const [selectedJob, setSelectedJob] = useState(null);
    const [apps, setApps] = useState([]);
    const [msg, setMsg] = useState('');

    useEffect(() => { loadJobs(); }, []);

    const loadJobs = async () => {
        try { const res = await axiosInstance.get('/admin/jobs'); setJobs(res.data); } catch (err) { console.error(err); }
    };

    const createJob = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/admin/jobs', form);
            setMsg('✅ Job created');
            setShowCreate(false);
            setForm({ title: '', company: '', location: '', description: '', requirements: '', salaryMin: '', salaryMax: '' });
            loadJobs();
        } catch (err) { setMsg('Failed to create job'); }
        setTimeout(() => setMsg(''), 3000);
    };

    const deleteJob = async (id) => {
        if (!window.confirm('Delete this job?')) return;
        try { await axiosInstance.delete(`/admin/jobs/${id}`); loadJobs(); } catch (err) { console.error(err); }
    };

    const viewApplicants = async (jobId) => {
        try {
            const res = await axiosInstance.get(`/admin/applications/job/${jobId}`);
            setApps(res.data);
            setSelectedJob(jobs.find(j => j.id === jobId));
        } catch (err) { console.error(err); }
    };

    const updateStatus = async (appId, status) => {
        try {
            await axiosInstance.put(`/admin/applications/${appId}/status?status=${status}`);
            viewApplicants(selectedJob.id);
        } catch (err) { console.error(err); }
    };

    return (
        <div className="min-h-screen bg-gray-950 py-10 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Manage Jobs</h1>
                        <p className="text-gray-400 mt-1">{jobs.length} jobs in the system</p>
                    </div>
                    <button onClick={() => setShowCreate(!showCreate)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition">
                        {showCreate ? 'Cancel' : '+ Create Job'}
                    </button>
                </div>

                {msg && <div className="mb-6 px-4 py-3 rounded-xl text-sm bg-green-500/10 text-green-400 border border-green-500/30">{msg}</div>}

                {/* Create Form */}
                {showCreate && (
                    <form onSubmit={createJob} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-8 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['title', 'company', 'location', 'requirements'].map(k => (
                                <div key={k}>
                                    <label className="block text-sm text-gray-400 mb-1 capitalize">{k}</label>
                                    <input type="text" value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} required={k === 'title' || k === 'company'}
                                        className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Description</label>
                            <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Min Salary</label>
                                <input type="number" value={form.salaryMin} onChange={e => setForm({ ...form, salaryMin: e.target.value })}
                                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Max Salary</label>
                                <input type="number" value={form.salaryMax} onChange={e => setForm({ ...form, salaryMax: e.target.value })}
                                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500" />
                            </div>
                        </div>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium transition">Create Job</button>
                    </form>
                )}

                {/* Applicants Modal */}
                {selectedJob && (
                    <div className="bg-gray-900/50 border border-indigo-500/30 rounded-2xl p-8 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-white">Applicants for: {selectedJob.title}</h2>
                                <p className="text-gray-400 text-sm">{apps.length} applications</p>
                            </div>
                            <button onClick={() => { setSelectedJob(null); setApps([]); }} className="text-gray-400 hover:text-white transition">✕ Close</button>
                        </div>
                        {apps.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No applications yet</p>
                        ) : (
                            <div className="space-y-3">
                                {apps.map(app => (
                                    <div key={app.id} className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-medium">{app.seekerName}</p>
                                            <p className="text-gray-400 text-sm">{app.seekerEmail} • {new Date(app.appliedDate).toLocaleDateString()}</p>
                                            {app.coverLetter && <p className="text-gray-500 text-sm mt-1 line-clamp-1">{app.coverLetter}</p>}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusColors[app.status]}`}>{app.status}</span>
                                            <select value={app.status} onChange={e => updateStatus(app.id, e.target.value)}
                                                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none">
                                                <option value="PENDING">Pending</option>
                                                <option value="REVIEWED">Reviewed</option>
                                                <option value="SHORTLISTED">Shortlisted</option>
                                                <option value="REJECTED">Rejected</option>
                                            </select>
                                            <a href={`http://localhost:8080/api/applications/${app.id}/resume`} target="_blank" rel="noreferrer"
                                                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">📄 Resume</a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Job List */}
                <div className="space-y-3">
                    {jobs.map(job => (
                        <div key={job.id} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 flex items-center justify-between hover:border-gray-700 transition">
                            <div className="flex items-center gap-4">
                                {job.logo ? (
                                    <img src={job.logo} alt="" className="w-10 h-10 rounded-lg bg-gray-800 object-cover" onError={e => e.target.style.display='none'} />
                                ) : (
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">{job.company?.[0]}</div>
                                )}
                                <div>
                                    <h3 className="text-white font-medium">{job.title}</h3>
                                    <p className="text-gray-400 text-sm">{job.company} • {job.location}</p>
                                </div>
                                {job.source === 'LINKEDIN' && <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">LinkedIn</span>}
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => viewApplicants(job.id)} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition">View Apps</button>
                                <button onClick={() => deleteJob(job.id)} className="text-red-400 hover:text-red-300 text-sm font-medium transition">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminJobs;
