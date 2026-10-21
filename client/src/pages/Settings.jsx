import { useState, useEffect } from 'react';
import api from '../api.jsx';
import { Search, Plus, Trash2, LayoutDashboard, Users } from 'lucide-react';

const roles = ['super_admin', 'admin', 'call_center', 'counsellor', 'accounts'];

export default function Settings() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'counsellor', phone: '' });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data.users);
    } catch (e) {} finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, form);
        setEditingId(null);
      } else {
        await api.post('/auth/register', form);
      }
      setOpen(false);
      setForm({ name: '', email: '', password: '', role: 'counsellor', phone: '' });
      fetchUsers();
    } catch (err) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  const handleEdit = (u) => {
    setEditingId(u._id);
    setForm({ name: u.name, email: u.email, role: u.role, phone: u.phone || '', password: '' });
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Settings</h1>
          <p className="text-gray-500">Manage team members and roles</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm({ name: '', email: '', password: '', role: 'counsellor', phone: '' }); setOpen(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"><Plus size={18} /> Add User</button>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-gray-50 text-left text-gray-500"><th className="p-3 border-b">Name</th><th className="p-3 border-b">Email</th><th className="p-3 border-b">Role</th><th className="p-3 border-b">Phone</th><th className="p-3 border-b">Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="5" className="p-4 text-center text-gray-500">Loading...</td></tr> : users.length === 0 ? <tr><td colSpan="5" className="p-4 text-center text-gray-500">No users found</td></tr> : users.map(u => (
                <tr key={u._id} className="border-b hover:bg-gray-50 group">
                  <td className="p-3 font-medium">{u.name}</td><td className="p-3 text-gray-600">{u.email}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : u.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{u.role.replace(/_/g,' ')}</span></td>
                  <td className="p-3 text-gray-600">{u.phone || '—'}</td>
                  <td className="p-3"><button onClick={() => handleEdit(u)} className="text-blue-600 hover:text-blue-700 mr-2" title="Edit"><LayoutDashboard size={16} /></button>{u.role !== 'super_admin' && <button onClick={() => handleDelete(u._id)} className="text-red-500 hover:text-red-700" title="Delete"><Trash2 size={16} /></button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 ${open ? 'flex' : 'hidden'} items-center justify-center bg-black/40`}>
        <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl border border-gray-200">
          <h2 className="text-lg font-bold mb-4">{editingId ? 'Edit' : 'Add'} User</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Name</label><input required value={form.name} onChange={e => setForm({...form, name:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div className="grid grid-cols-2 gap-4"><div><label className="block text-xs font-medium text-gray-500 mb-1">Email</label><input required type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" /></div><div><label className="block text-xs font-medium text-gray-500 mb-1">Phone</label><input value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" /></div></div>
            {!editingId && <div><label className="block text-xs font-medium text-gray-500 mb-1">Password</label><input required type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" /></div>}
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Role</label><select value={form.role} onChange={e => setForm({...form, role:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none">{roles.map(r => <option key={r} value={r}>{r.replace(/_/g,' ')}</option>)}</select></div>
            <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save User</button></div>
          </form>
        </div>
      </div>
    </div>
  );
}
