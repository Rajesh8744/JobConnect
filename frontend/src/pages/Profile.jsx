import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({});
    const [msg, setMsg] = useState('');

    useEffect(() => {
        axiosInstance.get('/profile/me').then(res => { setProfile(res.data); setForm(res.data); }).catch(console.error);
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put('/profile/me', form);
            setMsg('✅ Profile saved');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { setMsg('Failed to save'); }
    };

    const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    if (!profile) return <div className="text-center text-gray-400 py-20 min-h-screen bg-gray-950">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-950 py-10 px-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                <p className="text-gray-400 mb-8">Keep your profile up to date to stand out</p>

                <form onSubmit={handleSave} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 space-y-6">
                    {msg && <div className={`px-4 py-3 rounded-lg text-sm ${msg.includes('✅') ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>{msg}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                            <input type="text" value={form.fullName || ''} onChange={e => update('fullName', e.target.value)}
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Email</label>
                            <input type="email" value={form.email || ''} disabled
                                className="w-full bg-gray-800/30 border border-gray-700 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Bio</label>
                        <textarea rows={3} value={form.bio || ''} onChange={e => update('bio', e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition resize-none"
                            placeholder="Tell recruiters about yourself..." />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Skills (comma separated)</label>
                        <input type="text" value={form.skills || ''} onChange={e => update('skills', e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                            placeholder="React, Java, Python..." />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Experience</label>
                        <textarea rows={3} value={form.experience || ''} onChange={e => update('experience', e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition resize-none"
                            placeholder="Your work experience..." />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Education</label>
                        <textarea rows={3} value={form.education || ''} onChange={e => update('education', e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition resize-none"
                            placeholder="Your educational background..." />
                    </div>

                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-xl transition">
                        Save Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
