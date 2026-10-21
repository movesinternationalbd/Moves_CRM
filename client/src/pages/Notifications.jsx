import { useState, useEffect } from 'react';
import api from '../api.jsx';
import { Search, Plus, Trash2, Bell, LayoutDashboard } from 'lucide-react';

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', message: '', type: 'info' });
  const [open, setOpen] = useState(false);

  useEffect(() => { fetchNotifs(); }, []);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications');
      setNotifs(data.notifications);
    } catch (e) {} finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notifications', form);
      setOpen(false);
      setForm({ title: '', message: '', type: 'info' });
      fetchNotifs();
    } catch (err) {}
  };

  const handleRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    fetchNotifs();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    await api.delete(`/notifications/${id}`);
    fetchNotifs();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-gray-500">System notifications and alerts</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"><Plus size={18} /> Add Notification</button>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="space-y-3">
          {loading ? <div className="p-4 text-center text-gray-500">Loading...</div> : notifs.length === 0 ? <div className="p-4 text-center text-gray-500">No notifications</div> : notifs.map(n => (
            <div key={n._id} className={`p-4 rounded-lg border border-gray-200 flex items-center justify-between ${n.isRead ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}>
              <div>
                <div className="font-medium">{n.title}</div>
                <div className="text-sm text-gray-600">{n.message}</div>
                <div className="text-xs text-gray-400 mt-1">{n.type} • {n.created_at ? new Date(n.created_at).toLocaleDateString() : '—'}</div>
              </div>
              <div className="flex items-center gap-2">
                {!n.isRead && <button onClick={() => handleRead(n._id)} className="text-xs text-blue-600 hover:underline">Mark read</button>}
                <button onClick={() => handleDelete(n._id)} className="text-xs text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`fixed inset-0 z-50 ${open ? 'flex' : 'hidden'} items-center justify-center bg-black/40`}>
        <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl border border-gray-200">
          <h2 className="text-lg font-bold mb-4">Add Notification</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Title</label><input required value={form.title} onChange={e => setForm({...form, title:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Message</label><textarea required value={form.message} onChange={e => setForm({...form, message:e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Type</label><select value={form.type} onChange={e => setForm({...form, type:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none">{['info','success','warning','error'].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save</button></div>
          </form>
        </div>
      </div>
    </div>
  );
}
