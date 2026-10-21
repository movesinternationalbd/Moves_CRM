import { useState, useEffect } from 'react';
import api from '../api.jsx';
import { Search, Plus, Trash2, LayoutDashboard, Building2 } from 'lucide-react';

export default function Universities() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', country: '', commission: '' });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/universities');
      setItems(data.universities);
    } catch (e) {} finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/universities/${editingId}`, form);
      else await api.post('/universities', form);
      setOpen(false); setEditingId(null); setForm({ name: '', country: '', commission: '' });
      fetchItems();
    } catch (err) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this university?')) return;
    await api.delete(`/universities/${id}`);
    fetchItems();
  };

  const handleEdit = (u) => { setEditingId(u._id); setForm({ name: u.name, country: u.country, commission: u.commission ?? '' }); setOpen(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Universities</h1>
          <p className="text-gray-500">Manage university and college partners</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm({ name: '', country: '', commission: '' }); setOpen(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"><Plus size={18} /> Add University</button>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-gray-50 text-left text-gray-500"><th className="p-3 border-b">Name</th><th className="p-3 border-b">Country</th><th className="p-3 border-b">Commission</th><th className="p-3 border-b">Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="4" className="p-4 text-center text-gray-500">Loading...</td></tr> : items.length === 0 ? <tr><td colSpan="4" className="p-4 text-center text-gray-500">No universities found</td></tr> : items.map(u => (
                <tr key={u._id} className="border-b hover:bg-gray-50 group">
                  <td className="p-3">{u.name}</td><td className="p-3 text-gray-600">{u.country?.name || '—'}</td><td className="p-3 text-gray-600">${u.commission ?? 0}</td>
                  <td className="p-3"><button onClick={() => handleEdit(u)} className="text-blue-600 hover:text-blue-700 mr-2" title="Edit"><LayoutDashboard size={16} /></button><button onClick={() => handleDelete(u._id)} className="text-red-500 hover:text-red-700" title="Delete"><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 ${open ? 'flex' : 'hidden'} items-center justify-center bg-black/40`}>
        <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl border border-gray-200">
          <h2 className="text-lg font-bold mb-4">{editingId ? 'Edit' : 'Add'} University</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-xs font-medium text-gray-500 mb-1">University Name</label><input required value={form.name} onChange={e => setForm({...form, name:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Country ID</label><input required value={form.country} onChange={e => setForm({...form, country:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 66b7..." /></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Commission</label><input type="number" value={form.commission} onChange={e => setForm({...form, commission:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save</button></div>
          </form>
        </div>
      </div>
    </div>
  );
}
