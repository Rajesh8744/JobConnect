import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axiosInstance from '../api/axiosConfig';

const RecruiterPostJob = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '', company: '', location: '', description: '', requirements: '', salaryMin: '', salaryMax: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess(''); setLoading(true);
        try {
            const payload = { ...form };
            if (payload.salaryMin) payload.salaryMin = parseFloat(payload.salaryMin);
            if (payload.salaryMax) payload.salaryMax = parseFloat(payload.salaryMax);
            await axiosInstance.post('/recruiter/jobs', payload);
            setSuccess('Job request submitted! It will be reviewed by admin before publishing.');
            setTimeout(() => navigate('/recruiter/my-jobs'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit job request');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gray-950 py-10 px-6">
            <Helmet>
                <title>Post a Job – JobConnect</title>
            </Helmet>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Post a Job</h1>
                <p className="text-gray-400 mb-8">Submit your job details. An admin will review and approve before publishing.</p>

                <form onSubmit={handleSubmit} className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-8 space-y-5">
                    {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}
                    {success && <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm">{success}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Job Title *</label>
                            <input type="text" name="title" value={form.title} onChange={handleChange} required
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                                placeholder="e.g. Senior React Developer" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Company Name</label>
                            <input type="text" name="company" value={form.company} onChange={handleChange}
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                                placeholder="Auto-filled from your profile" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Location *</label>
                        <input type="text" name="location" value={form.location} onChange={handleChange} required
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                            placeholder="e.g. Mumbai, India or Remote" />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Job Description *</label>
                        <textarea name="description" value={form.description} onChange={handleChange} required rows={5}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition resize-none"
                            placeholder="Describe the role, responsibilities, and what makes this position great..." />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Requirements *</label>
                        <textarea name="requirements" value={form.requirements} onChange={handleChange} required rows={4}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition resize-none"
                            placeholder="List the skills, experience, and qualifications needed..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Min Salary (₹)</label>
                            <input type="number" name="salaryMin" value={form.salaryMin} onChange={handleChange}
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                                placeholder="e.g. 500000" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Max Salary (₹)</label>
                            <input type="number" name="salaryMax" value={form.salaryMax} onChange={handleChange}
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                                placeholder="e.g. 1200000" />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button type="submit" disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition">
                            {loading ? 'Submitting...' : '📤 Submit for Admin Approval'}
                        </button>
                    </div>

                    <p className="text-center text-gray-500 text-xs">
                        Your job will be reviewed by an admin before it appears on the platform.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RecruiterPostJob;
