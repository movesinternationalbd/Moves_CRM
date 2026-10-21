import { useState, useEffect } from 'react';
import api from '../api.jsx';
import { Search, Plus, Trash2, LayoutDashboard, Clock } from 'lucide-react';

const visaStatuses = ['not_applied', 'applied', 'granted', 'rejected'];
const appStatuses = ['draft', 'submitted', 'accepted', 'rejected'];

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ student_name: '', phone: '', email: '', passport_no: '', course: '', intake: '', university: '', visa_status: 'not_applied', application_status: 'draft' });
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchStudents(); }, [search]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/students', { params: { search: search || undefined } });
      setStudents(data.students);
    } catch (e) {} finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/students', form);
      setOpen(false);
      setForm({ student_name: '', phone: '', email: '', passport_no: '', course: '', intake: '', university: '', visa_status: 'not_applied', application_status: 'draft' });
      fetchStudents();
    } catch (e) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    await api.delete(`/students/${id}`);
    fetchStudents();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Student Management</h1>
          <p className="text-gray-500">Manage enrolled students and applications</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"><Plus size={18} /> Add Student</button>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search by name, phone or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Phone</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Course</th>
                <th className="p-3 border-b">University</th>
                <th className="p-3 border-b">Visa</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="p-4 text-center text-gray-500">Loading...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan="7" className="p-4 text-center text-gray-500">No students found</td></tr>
              ) : (
                students.map(s => (
                  <tr key={s._id} className="border-b hover:bg-gray-50 group">
                    <td className="p-3 font-medium">{s.student_name}</td>
                    <td className="p-3">{s.phone}</td>
                    <td className="p-3 text-gray-600">{s.email || '—'}</td>
                    <td className="p-3">{s.course || '—'}</td>
                    <td className="p-3 text-gray-600">{s.university?.name || '—'}</td>
                    <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${visaColor(s.visa_status)}`}>{s.visa_status.replace(/_/g, ' ')}</span></td>
                    <td className="p-3"><button onClick={() => handleDelete(s._id)} className="text-red-500 hover:text-red-700" title="Delete"><Trash2 size={16} /></button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 ${open ? 'flex' : 'hidden'} items-center justify-center bg-black/40`}>
        <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl border border-gray-200">
          <h2 className="text-lg font-bold mb-4">Add Student</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                <input required value={form.student_name} onChange={e => setForm({...form, student_name:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                <input required value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Passport No.</label>
                <input value={form.passport_no} onChange={e => setForm({...form, passport_no:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Course</label>
                <input value={form.course} onChange={e => setForm({...form, course:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Intake</label>
                <input value={form.intake} onChange={e => setForm({...form, intake:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">University</label>
                <input value={form.university} onChange={e => setForm({...form, university:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Visa Status</label>
                <select value={form.visa_status} onChange={e => setForm({...form, visa_status:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none">
                  {visaStatuses.map(v => <option key={v} value={v}>{v.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Application Status</label>
              <select value={form.application_status} onChange={e => setForm({...form, application_status:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none">
                {appStatuses.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save Student</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const visaColor = (v) => ({ not_applied: 'bg-gray-100 text-gray-700', applied: 'bg-blue-100 text-blue-700', granted: 'bg-green-100 text-green-700', rejected: 'bg-rose-100 text-rose-700' }[v] || 'bg-gray-100 text-gray-700');
