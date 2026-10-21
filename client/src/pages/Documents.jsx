import { useState, useEffect } from 'react';
import api from '../api.jsx';
import { Search, Plus, Trash2, FileText, LayoutDashboard } from 'lucide-react';

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', file_path: '', category: '', documentable_type: '', documentable_id: '' });
  const [open, setOpen] = useState(false);

  useEffect(() => { fetchDocs(); }, []);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/documents');
      setDocs(data.documents);
    } catch (e) {} finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/documents', form);
      setOpen(false);
      setForm({ title: '', file_path: '', category: '', documentable_type: '', documentable_id: '' });
      fetchDocs();
    } catch (err) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    await api.delete(`/documents/${id}`);
    fetchDocs();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Document Management</h1>
          <p className="text-gray-500">Secure file storage and organization</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"><Plus size={18} /> Add Document</button>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-gray-50 text-left text-gray-500"><th className="p-3 border-b">Title</th><th className="p-3 border-b">Category</th><th className="p-3 border-b">File</th><th className="p-3 border-b">Uploaded</th><th className="p-3 border-b">Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="5" className="p-4 text-center text-gray-500">Loading...</td></tr> : docs.length === 0 ? <tr><td colSpan="5" className="p-4 text-center text-gray-500">No documents found</td></tr> : docs.map(d => (
                <tr key={d._id} className="border-b hover:bg-gray-50 group">
                  <td className="p-3 font-medium">{d.title}</td><td className="p-3 text-gray-600">{d.category || '—'}</td><td className="p-3 text-gray-600 text-xs truncate max-w-[150px]">{d.file_path || '—'}</td><td className="p-3">{d.created_at ? new Date(d.created_at).toLocaleDateString() : '—'}</td>
                  <td className="p-3"><button onClick={() => handleDelete(d._id)} className="text-red-500 hover:text-red-700" title="Delete"><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 ${open ? 'flex' : 'hidden'} items-center justify-center bg-black/40`}>
        <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl border border-gray-200">
          <h2 className="text-lg font-bold mb-4">Add Document</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Title</label><input required value={form.title} onChange={e => setForm({...form, title:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div className="grid grid-cols-2 gap-4"><div><label className="block text-xs font-medium text-gray-500 mb-1">Category</label><input value={form.category} onChange={e => setForm({...form, category:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" /></div><div><label className="block text-xs font-medium text-gray-500 mb-1">File Path</label><input value={form.file_path} onChange={e => setForm({...form, file_path:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="/uploads/doc.pdf" /></div></div>
            <div className="grid grid-cols-2 gap-4"><div><label className="block text-xs font-medium text-gray-500 mb-1">Related Type</label><input value={form.documentable_type} onChange={e => setForm({...form, documentable_type:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Lead" /></div><div><label className="block text-xs font-medium text-gray-500 mb-1">Related ID</label><input value={form.documentable_id} onChange={e => setForm({...form, documentable_id:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" /></div></div>
            <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save Document</button></div>
          </form>
        </div>
      </div>
    </div>
  );
}
