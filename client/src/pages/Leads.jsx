import { useState, useEffect } from 'react';
import api from '../api.jsx';
import { Search, Plus, Trash2, Edit, Filter, Phone, Mail, MapPin } from 'lucide-react';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ student_name: '', phone: '', whatsapp: '', email: '', country: '', lead_status: 'new', notes: '' });
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchLeads(); }, [search, statusFilter]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/leads', { params: { search, status: statusFilter || undefined } });
      setLeads(data.leads);
    } catch (e) {} finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leads', form);
      setOpen(false);
      setForm({ student_name: '', phone: '', whatsapp: '', email: '', country: '', lead_status: 'new', notes: '' });
      fetchLeads();
    } catch (e) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    await api.delete(`/leads/${id}`);
    fetchLeads();
  };

  const statuses = ['new', 'contacted', 'qualified', 'proposal_sent', 'application_submitted', 'visa_applied', 'visa_granted', 'enrolled', 'lost'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lead Management</h1>
          <p className="text-gray-500">Track and manage prospective students</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"><Plus size={18} /> Add Lead</button>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search by name, phone or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Status</option>
            {statuses.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="p-3 border-b">Lead ID</th>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Phone</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-4 text-center text-gray-500">Loading...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan="6" className="p-4 text-center text-gray-500">No leads found</td></tr>
              ) : (
                leads.map(l => (
                  <tr key={l._id} className="border-b hover:bg-gray-50 group">
                    <td className="p-3 font-mono text-xs text-gray-400">{l.lead_id}</td>
                    <td className="p-3 font-medium">{l.student_name}</td>
                    <td className="p-3"><Phone size={16} className="mr-1 inline text-gray-400" /> {l.phone}</td>
                    <td className="p-3 text-gray-600">{l.email || '—'}</td>
                    <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(l.lead_status)}`}>{l.lead_status.replace(/_/g, ' ')}</span></td>
                    <td className="p-3">
                      <button onClick={() => handleDelete(l._id)} className="text-red-500 hover:text-red-700" title="Delete"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 ${open ? 'flex' : 'hidden'} items-center justify-center bg-black/40`}>
        <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl border border-gray-200">
          <h2 className="text-lg font-bold mb-4">Add Lead</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Student Name</label>
                <input required value={form.student_name} onChange={e => setForm({...form, student_name:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                <input required value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">WhatsApp</label>
                <input value={form.whatsapp} onChange={e => setForm({...form, whatsapp:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Country</label>
                <input value={form.country} onChange={e => setForm({...form, country:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <select value={form.lead_status} onChange={e => setForm({...form, lead_status:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none">
                  {statuses.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
              <textarea value={form.notes} onChange={e => setForm({...form, notes:e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save Lead</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const statusColor = (s) => {
  const map = { new: 'bg-gray-100 text-gray-700', contacted: 'bg-blue-100 text-blue-700', qualified: 'bg-purple-100 text-purple-700', proposal_sent: 'bg-yellow-100 text-yellow-700', application_submitted: 'bg-indigo-100 text-indigo-700', visa_applied: 'bg-orange-100 text-orange-700', visa_granted: 'bg-emerald-100 text-emerald-700', enrolled: 'bg-green-100 text-green-700', lost: 'bg-rose-100 text-rose-700' };
  return map[s] || 'bg-gray-100 text-gray-700';
};
