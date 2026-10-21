import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api.jsx';
import { Mail, Lock, ArrowRight, LayoutDashboard, Users } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: 'admin@movescrm.com', password: 'password' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-blue-600 p-2 rounded-lg text-white"><LayoutDashboard size={22} /></div>
          <span className="font-bold text-xl tracking-tight">Moves CRM</span>
        </div>
        <h2 className="text-gray-900 font-semibold mb-2">Welcome back</h2>
        <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>
        {error && <div className="mb-4 p-3 rounded bg-red-50 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white font-medium rounded-md disabled:opacity-60 hover:bg-blue-700 transition"
          >
            {loading ? <span className="flex items-center gap-2"><ArrowRight className="w-4 h-4" size={18} /> Signing in...</span> : <span className="flex items-center gap-2"><ArrowRight size={18} /> Sign in</span>}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Demo: admin@movescrm.com / password
        </p>
      </div>
    </div>
  );
}
