import { useState, useEffect } from 'react';
import api from '../api.jsx';
import { Search, Plus, Trash2, BarChart3, Building2, School } from 'lucide-react';

export default function PTE() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ batch_name: '', teacher: '', start_date: '', end_date: '', students: '' });
  const [open, setOpen] = useState(false);

  useEffect(() => { fetchBatches(); }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/pte');
      setBatches(data.batches);
    } catch (e) {} finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/pte', form);
      setOpen(false);
      setForm({ batch_name: '', teacher: '', start_date: '', end_date: '', students: '' });
      fetchBatches();
    } catch (err) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this batch?')) return;
    await api.delete(`/pte/${id}`);
    fetchBatches();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">PTE Academy</h1>
          <p className="text-gray-500">Manage PTE language batches and attendance</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"><Plus size={18} /> Add Batch</button>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="p-3 border-b">Batch Name</th>
                <th className="p-3 border-b">Teacher</th>
                <th className="p-3 border-b">Start Date</th>
                <th className="p-3 border-b">End Date</th>
                <th className="p-3 border-b">Students</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-4 text-center text-gray-500">Loading...</td></tr>
              ) : batches.length === 0 ? (
                <tr><td colSpan="6" className="p-4 text-center text-gray-500">No batches found</td></tr>
              ) : (
                batches.map(b => (
                  <tr key={b._id} className="border-b hover:bg-gray-50 group">
                    <td className="p-3 font-medium">{b.batch_name}</td>
                    <td className="p-3 text-gray-600">{b.teacher || '—'}</td>
                    <td className="p-3">{b.start_date ? new Date(b.start_date).toLocaleDateString() : '—'}</td>
                    <td className="p-3">{b.end_date ? new Date(b.end_date).toLocaleDateString() : '—'}</td>
                    <td className="p-3">{b.students?.length || 0}</td>
                    <td className="p-3"><button onClick={() => handleDelete(b._id)} className="text-red-500 hover:text-red-700" title="Delete"><Trash2 size={16} /></button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 ${open ? 'flex' : 'hidden'} items-center justify-center bg-black/40`}>
        <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl border border-gray-200">
          <h2 className="text-lg font-bold mb-4">Add PTE Batch</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Batch Name</label>
              <input required value={form.batch_name} onChange={e => setForm({...form, batch_name:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Teacher</label>
                <input value={form.teacher} onChange={e => setForm({...form, teacher:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                <input type="date" required value={form.start_date} onChange={e => setForm({...form, start_date:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
              <input type="date" value={form.end_date} onChange={e => setForm({...form, end_date:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Student IDs (comma separated)</label>
              <input value={form.students} onChange={e => setForm({...form, students:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 66b7..., 66b8..." />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save Batch</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
