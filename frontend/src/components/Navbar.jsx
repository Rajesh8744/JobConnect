import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <nav className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    JobConnect
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/" className="text-gray-300 hover:text-white transition text-sm font-medium">Jobs</Link>

                    {!user ? (
                        <>
                            <Link to="/login" className="text-gray-300 hover:text-white transition text-sm font-medium">Login</Link>
                            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition">Sign Up</Link>
                        </>
                    ) : (
                        <>
                            {user.role === 'ADMIN' && (
                                <>
                                    <Link to="/admin" className="text-gray-300 hover:text-white transition text-sm font-medium">Dashboard</Link>
                                    <Link to="/admin/jobs" className="text-gray-300 hover:text-white transition text-sm font-medium">Manage Jobs</Link>
                                    <Link to="/admin/users" className="text-gray-300 hover:text-white transition text-sm font-medium">Users</Link>
                                    <Link to="/admin/linkedin" className="text-gray-300 hover:text-white transition text-sm font-medium">LinkedIn</Link>
                                </>
                            )}
                            {user.role === 'SEEKER' && (
                                <>
                                    <Link to="/dashboard" className="text-gray-300 hover:text-white transition text-sm font-medium">My Apps</Link>
                                    <Link to="/profile" className="text-gray-300 hover:text-white transition text-sm font-medium">Profile</Link>
                                </>
                            )}
                            {user.role === 'RECRUITER' && (
                                <>
                                    <Link to="/recruiter" className="text-gray-300 hover:text-white transition text-sm font-medium">Dashboard</Link>
                                    <Link to="/recruiter/post-job" className="text-gray-300 hover:text-white transition text-sm font-medium">Post Job</Link>
                                    <Link to="/recruiter/my-jobs" className="text-gray-300 hover:text-white transition text-sm font-medium">My Jobs</Link>
                                    <Link to="/recruiter/applications" className="text-gray-300 hover:text-white transition text-sm font-medium">Apps</Link>
                                </>
                            )}
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
                                <span className="text-gray-400 text-sm">{user.fullName}</span>
                                <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm font-medium transition">Logout</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
