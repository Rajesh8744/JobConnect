import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        try { const res = await axiosInstance.get('/admin/users'); setUsers(res.data); } catch (err) { console.error(err); }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        try { await axiosInstance.delete(`/admin/users/${id}`); loadUsers(); } catch (err) { alert(err.response?.data?.message || 'Error'); }
    };

    const roleColors = { ADMIN: 'bg-purple-500/10 text-purple-400 border-purple-500/30', SEEKER: 'bg-green-500/10 text-green-400 border-green-500/30' };

    return (
        <div className="min-h-screen bg-gray-950 py-10 px-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Manage Users</h1>
                <p className="text-gray-400 mb-8">{users.length} registered users</p>

                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-800">
                                <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Name</th>
                                <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Email</th>
                                <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Role</th>
                                <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition">
                                    <td className="px-6 py-4 text-white font-medium">{u.fullName}</td>
                                    <td className="px-6 py-4 text-gray-400">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${roleColors[u.role] || ''}`}>{u.role}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {u.email !== 'admin@jobconnect.com' && (
                                            <button onClick={() => deleteUser(u.id)} className="text-red-400 hover:text-red-300 text-sm font-medium transition">Delete</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
