import React, { useState } from 'react';
import axiosInstance from '../api/axiosConfig';

const LinkedInImport = () => {
    const [keywords, setKeywords] = useState('');
    const [location, setLocation] = useState('');
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imported, setImported] = useState(new Set());

    const fetchFeed = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/admin/linkedin-feed?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(location)}`);
            setFeed(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const importJob = async (job, index) => {
        try {
            await axiosInstance.post('/admin/jobs/linkedin-import', job);
            setImported(prev => new Set([...prev, index]));
        } catch (err) { console.error(err); }
    };

    const importAll = async () => {
        for (let i = 0; i < feed.length; i++) {
            if (!imported.has(i)) await importJob(feed[i], i);
        }
    };

    const formatSalary = (min, max) => {
        const fmt = (v) => '$' + Number(v).toLocaleString();
        if (min && max) return `${fmt(min)} - ${fmt(max)}`;
        return '';
    };

    return (
        <div className="min-h-screen bg-gray-950 py-10 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">LinkedIn Job Import</h1>
                <p className="text-gray-400 mb-8">Fetch and import curated job listings from LinkedIn</p>

                {/* Search */}
                <form onSubmit={fetchFeed} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Keywords</label>
                            <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)}
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                                placeholder="Java, React, Python..." />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Location</label>
                            <input type="text" value={location} onChange={e => setLocation(e.target.value)}
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                                placeholder="San Francisco, Remote..." />
                        </div>
                        <div className="flex items-end gap-3">
                            <button type="submit" disabled={loading}
                                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition flex-1">
                                {loading ? 'Fetching...' : '🔍 Fetch Jobs'}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Results */}
                {feed.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-white font-semibold">{feed.length} jobs found on LinkedIn</p>
                            <button onClick={importAll} className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-xl text-sm font-medium transition">
                                Import All ({feed.length - imported.size} remaining)
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {feed.map((job, i) => (
                                <div key={i} className={`bg-gray-900/50 border rounded-2xl p-6 transition ${imported.has(i) ? 'border-green-500/30 opacity-60' : 'border-gray-800'}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            {job.logo ? (
                                                <img src={job.logo} alt="" className="w-12 h-12 rounded-xl bg-gray-800 object-cover" onError={e => e.target.style.display='none'} />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold">{job.company?.[0]}</div>
                                            )}
                                            <div>
                                                <h3 className="text-white font-semibold text-lg">{job.title}</h3>
                                                <p className="text-blue-400 font-medium">{job.company}</p>
                                                <div className="flex gap-3 mt-1 text-sm text-gray-400">
                                                    <span>📍 {job.location}</span>
                                                    {job.salaryMin && <span>💰 {formatSalary(job.salaryMin, job.salaryMax)}</span>}
                                                </div>
                                                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{job.description}</p>
                                                {job.requirements && (
                                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                                        {job.requirements.split(',').map((s, idx) => (
                                                            <span key={idx} className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-xs border border-blue-500/20">{s.trim()}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="shrink-0 ml-4">
                                            {imported.has(i) ? (
                                                <span className="text-green-400 text-sm font-medium">✅ Imported</span>
                                            ) : (
                                                <button onClick={() => importJob(job, i)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
                                                    Import
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {feed.length === 0 && !loading && (
                    <div className="text-center py-20 bg-gray-900/30 rounded-2xl border border-gray-800">
                        <p className="text-gray-500 text-lg mb-2">No jobs fetched yet</p>
                        <p className="text-gray-600 text-sm">Use the search above to fetch LinkedIn job listings</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LinkedInImport;
