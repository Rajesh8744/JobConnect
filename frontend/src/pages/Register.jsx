import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            await register(fullName, email, password);
            setSuccess('Account created! Redirecting...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Create Account</h1>
                    <p className="text-gray-400 mt-2">Join JobConnect as a Job Seeker</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-8 space-y-5">
                    {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}
                    {success && <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm">{success}</div>}

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                            placeholder="John Doe" />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                            placeholder="you@example.com" />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                            placeholder="Min. 6 characters" />
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition">Create Account</button>

                    <p className="text-center text-gray-400 text-sm">
                        Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
