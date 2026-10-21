import { useState, useEffect } from 'react';
import api from '../api.jsx';
import { Search, Plus, Trash2, LayoutDashboard } from 'lucide-react';

export default function Countries() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', code: '' });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/countries');
      setItems(data.countries);
    } catch (e) {} finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/countries/${editingId}`, form);
      else await api.post('/countries', form);
      setOpen(false); setEditingId(null); setForm({ name: '', code: '' });
      fetchItems();
    } catch (err) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this country?')) return;
    await api.delete(`/countries/${id}`);
    fetchItems();
  };

  const handleEdit = (c) => { setEditingId(c._id); setForm({ name: c.name, code: c.code }); setOpen(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Countries</h1>
          <p className="text-gray-500">Manage destination countries</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm({ name: '', code: '' }); setOpen(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"><Plus size={18} /> Add Country</button>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-gray-50 text-left text-gray-500"><th className="p-3 border-b">Name</th><th className="p-3 border-b">Code</th><th className="p-3 border-b">Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="3" className="p-4 text-center text-gray-500">Loading...</td></tr> : items.length === 0 ? <tr><td colSpan="3" className="p-4 text-center text-gray-500">No countries found</td></tr> : items.map(c => (
                <tr key={c._id} className="border-b hover:bg-gray-50 group">
                  <td className="p-3">{c.name}</td><td className="p-3 text-gray-600 text-uppercase text-xs">{c.code}</td>
                  <td className="p-3"><button onClick={() => handleEdit(c)} className="text-blue-600 hover:text-blue-700 mr-2" title="Edit"><LayoutDashboard size={16} /></button><button onClick={() => handleDelete(c._id)} className="text-red-500 hover:text-red-700" title="Delete"><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 ${open ? 'flex' : 'hidden'} items-center justify-center bg-black/40`}>
        <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl border border-gray-200">
          <h2 className="text-lg font-bold mb-4">{editingId ? 'Edit' : 'Add'} Country</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Country Name</label><input required value={form.name} onChange={e => setForm({...form, name:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Code (e.g. BD)</label><input required value={form.code} onChange={e => setForm({...form, code:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save</button></div>
          </form>
        </div>
      </div>
    </div>
  );
}
