import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axiosInstance from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [minSalary, setMinSalary] = useState('');
    const { user } = useAuth();

    useEffect(() => { fetchJobs(); }, []);

    const fetchJobs = async (t, l, s) => {
        setLoading(true);
        try {
            let q = '/jobs?';
            if (t) q += `title=${encodeURIComponent(t)}&`;
            if (l) q += `location=${encodeURIComponent(l)}&`;
            if (s) q += `minSalary=${encodeURIComponent(s)}&`;
            const res = await axiosInstance.get(q);
            setJobs(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSearch = (e) => { e.preventDefault(); fetchJobs(title, location, minSalary); };

    const formatSalary = (min, max) => {
        if (!min && !max) return 'Salary not specified';
        const fmt = (v) => '$' + Number(v).toLocaleString();
        if (min && max) return `${fmt(min)} - ${fmt(max)}`;
        if (min) return `From ${fmt(min)}`;
        return `Up to ${fmt(max)}`;
    };

    return (
        <div className="min-h-screen bg-gray-950">
            <Helmet>
                <title>JobConnect – Find Your Dream Job | Job Portal</title>
                <meta name="description" content="Browse curated job listings from top companies worldwide. Search by title, location, and salary on JobConnect." />
            </Helmet>
            {/* Hero */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent" />
                <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
                    <h1 className="text-5xl font-bold text-white mb-4">Find Your <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Dream Job</span></h1>
                    <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Browse curated job listings from top companies worldwide</p>

                    <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input type="text" placeholder="Job title or company..." value={title} onChange={e => setTitle(e.target.value)}
                            className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
                        <input type="text" placeholder="Location..." value={location} onChange={e => setLocation(e.target.value)}
                            className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
                        <input type="number" placeholder="Min salary..." value={minSalary} onChange={e => setMinSalary(e.target.value)}
                            className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500" />
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition">Search</button>
                    </form>
                </div>
            </div>

            {/* Job Listings */}
            <div className="max-w-7xl mx-auto px-6 pb-20">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">{jobs.length} Jobs Found</h2>
                </div>

                {loading ? (
                    <div className="text-center text-gray-400 py-20">Loading jobs...</div>
                ) : jobs.length === 0 ? (
                    <div className="text-center text-gray-500 py-20 bg-gray-900/30 rounded-2xl border border-gray-800">No jobs found. Try different filters.</div>
                ) : (
                    <div className="grid gap-4">
                        {jobs.map(job => (
                            <Link to={`/jobs/${job.id}`} key={job.id} className="group bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    {job.logo ? (
                                        <img src={job.logo} alt={job.company} className="w-14 h-14 rounded-xl bg-gray-800 object-cover" onError={e => e.target.style.display='none'} />
                                    ) : (
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">{job.company?.[0]}</div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition">{job.title}</h3>
                                        <p className="text-indigo-400 font-medium">{job.company}</p>
                                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-400">
                                            {job.location && <span>📍 {job.location}</span>}
                                            <span>💰 {formatSalary(job.salaryMin, job.salaryMax)}</span>
                                            {job.source === 'LINKEDIN' && <span className="text-blue-400">🔗 LinkedIn</span>}
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1 shrink-0">{new Date(job.postedDate).toLocaleDateString()}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
