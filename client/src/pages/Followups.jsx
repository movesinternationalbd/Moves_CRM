import { useState, useEffect } from 'react';
import api from '../api.jsx';
import { Search, Plus, Trash2, LayoutDashboard, Clock } from 'lucide-react';

const followupStatuses = ['pending', 'completed', 'cancelled'];

export default function Followups() {
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ lead: '', followup_date: '', notes: '', status: 'pending' });
  const [open, setOpen] = useState(false);
  const [leadFilter, setLeadFilter] = useState('');

  useEffect(() => { fetchFollowups(); }, [leadFilter]);

  const fetchFollowups = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/followups', { params: { lead: leadFilter || undefined } });
      setFollowups(data.followups);
    } catch (e) {} finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/followups', form);
      setOpen(false);
      setForm({ lead: '', followup_date: '', notes: '', status: 'pending' });
      fetchFollowups();
    } catch (e) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this follow-up?')) return;
    await api.delete(`/followups/${id}`);
    fetchFollowups();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Follow-up System</h1>
          <p className="text-gray-500">Schedule and track lead follow-ups</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"><Plus size={18} /> Add Follow-up</button>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex gap-4 mb-4">
          <input
            placeholder="Filter by lead name"
            value={leadFilter}
            onChange={e => setLeadFilter(e.target.value)}
            className="w-64 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="p-3 border-b">Lead</th>
                <th className="p-3 border-b">Follow-up Date</th>
                <th className="p-3 border-b">Notes</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">Loading...</td></tr>
              ) : followups.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">No follow-ups found</td></tr>
              ) : (
                followups.map(f => (
                  <tr key={f._id} className="border-b hover:bg-gray-50 group">
                    <td className="p-3">{f.lead?.student_name || '—'}</td>
                    <td className="p-3">{f.followup_date ? new Date(f.followup_date).toLocaleDateString() : '—'}</td>
                    <td className="p-3 text-gray-600 truncate max-w-[200px]">{f.notes}</td>
                    <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${f.status === 'completed' ? 'bg-green-100 text-green-700' : f.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>{f.status}</span></td>
                    <td className="p-3"><button onClick={() => handleDelete(f._id)} className="text-red-500 hover:text-red-700" title="Delete"><Trash2 size={16} /></button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 ${open ? 'flex' : 'hidden'} items-center justify-center bg-black/40`}>
        <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl border border-gray-200">
          <h2 className="text-lg font-bold mb-4">Schedule Follow-up</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Lead ID</label>
              <input required value={form.lead} onChange={e => setForm({...form, lead:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 66b7..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                <input type="date" required value={form.followup_date} onChange={e => setForm({...form, followup_date:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none">
                  {followupStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
              <textarea required value={form.notes} onChange={e => setForm({...form, notes:e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save Follow-up</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
