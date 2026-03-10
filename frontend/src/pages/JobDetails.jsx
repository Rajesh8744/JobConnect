import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axiosInstance from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const JobDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [resume, setResume] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [applying, setApplying] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        axiosInstance.get(`/jobs/${id}`).then(res => setJob(res.data)).catch(() => navigate('/'));
    }, [id]);

    const handleApply = async (e) => {
        e.preventDefault();
        if (!resume) return setMsg('Please upload your resume');
        setApplying(true);
        try {
            const formData = new FormData();
            formData.append('resume', resume);
            if (coverLetter) formData.append('coverLetter', coverLetter);
            await axiosInstance.post(`/applications/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setMsg('✅ Applied successfully!');
        } catch (err) {
            setMsg(err.response?.data?.message || 'Failed to apply');
        } finally { setApplying(false); }
    };

    if (!job) return <div className="text-center text-gray-400 py-20 bg-gray-950 min-h-screen">Loading...</div>;

    const formatSalary = (min, max) => {
        const fmt = (v) => '$' + Number(v).toLocaleString();
        if (min && max) return `${fmt(min)} - ${fmt(max)}`;
        if (min) return `From ${fmt(min)}`;
        if (max) return `Up to ${fmt(max)}`;
        return 'Not specified';
    };

    return (
        <div className="min-h-screen bg-gray-950 py-10 px-6">
            <Helmet>
                <title>{`${job.title} at ${job.company} – JobConnect`}</title>
                <meta name="description" content={`Apply for ${job.title} at ${job.company}${job.location ? ` in ${job.location}` : ''}. ${job.description?.substring(0, 120)}...`} />
            </Helmet>
            <div className="max-w-4xl mx-auto">
                {/* Job Header */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-6">
                    <div className="flex items-start gap-5">
                        {job.logo ? (
                            <img src={job.logo} alt="" className="w-16 h-16 rounded-xl bg-gray-800" onError={e => e.target.style.display='none'} />
                        ) : (
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">{job.company?.[0]}</div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-white">{job.title}</h1>
                            <p className="text-indigo-400 text-lg font-medium mt-1">{job.company}</p>
                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                                {job.location && <span>📍 {job.location}</span>}
                                <span>💰 {formatSalary(job.salaryMin, job.salaryMax)}</span>
                                <span>📅 {new Date(job.postedDate).toLocaleDateString()}</span>
                                {job.source === 'LINKEDIN' && <span className="text-blue-400">🔗 LinkedIn</span>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Description */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                            <h2 className="text-xl font-bold text-white mb-4">Description</h2>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                        </div>
                        {job.requirements && (
                            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                                <h2 className="text-xl font-bold text-white mb-4">Requirements</h2>
                                <div className="flex flex-wrap gap-2">
                                    {job.requirements.split(',').map((s, i) => (
                                        <span key={i} className="bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-lg text-sm border border-indigo-500/20">{s.trim()}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Apply */}
                    <div>
                        {user?.role === 'SEEKER' ? (
                            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sticky top-24">
                                <h3 className="text-lg font-bold text-white mb-4">Apply Now</h3>
                                {msg && <div className={`px-4 py-3 rounded-lg text-sm mb-4 ${msg.includes('✅') ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>{msg}</div>}
                                <form onSubmit={handleApply} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Resume (PDF)*</label>
                                        <input type="file" accept=".pdf" onChange={e => setResume(e.target.files[0])}
                                            className="w-full text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:cursor-pointer" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Cover Letter</label>
                                        <textarea rows={4} value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
                                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
                                            placeholder="Why are you a great fit?" />
                                    </div>
                                    <button type="submit" disabled={applying} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
                                        {applying ? 'Applying...' : 'Submit Application'}
                                    </button>
                                </form>
                            </div>
                        ) : !user ? (
                            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 text-center">
                                <p className="text-gray-400 mb-4">Sign in to apply for this job</p>
                                <a href="/login" className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium transition">Login to Apply</a>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
