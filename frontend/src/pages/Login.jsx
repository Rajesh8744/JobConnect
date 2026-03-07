import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userData = await login(email, password);
            navigate(userData.role === 'ADMIN' ? '/admin' : '/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Welcome Back</h1>
                    <p className="text-gray-400 mt-2">Sign in to your JobConnect account</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-8 space-y-5">
                    {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}
                    
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Email</label>
                        <input type="text" value={email} onChange={e => setEmail(e.target.value)} required
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                            placeholder="admin@jobconnect.com" />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                            placeholder="••••••••" />
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition">Sign In</button>

                    <p className="text-center text-gray-400 text-sm">
                        Don&apos;t have an account? <Link to="/register" className="text-indigo-400 hover:text-indigo-300">Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
