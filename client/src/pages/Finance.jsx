import { useState, useEffect } from 'react';
import api from '../api.jsx';
import { Search, Plus, Trash2, CreditCard, Wallet, BarChart3 } from 'lucide-react';

const paymentTypes = ['tuition', 'visa_fee', 'processing', 'other'];
const paymentStatuses = ['pending', 'completed', 'failed', 'refunded'];

export default function Finance() {
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('payments');
  const [form, setForm] = useState({ student: '', amount: '', payment_date: '', payment_type: 'tuition', method: '', reference: '', status: 'pending' });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/payments'), api.get('/expenses')]).then(([p, e]) => {
      setPayments(p.data.payments);
      setExpenses(e.data.expenses);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/payments', form);
      setOpen(false);
      setForm({ student: '', amount: '', payment_date: '', payment_type: 'tuition', method: '', reference: '', status: 'pending' });
      const { data } = await api.get('/payments');
      setPayments(data.payments);
    } catch (err) {}
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Delete this record?')) return;
    await api.delete(`/${type === 'payment' ? 'payments' : 'expenses'}/${id}`);
    if (type === 'payment') {
      const { data } = await api.get('/payments');
      setPayments(data.payments);
    } else {
      const { data } = await api.get('/expenses');
      setExpenses(data.expenses);
    }
  };

  const revenue = payments.reduce((acc, p) => p.status === 'completed' ? acc + Number(p.amount) : acc, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + Number(e.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Finance</h1>
          <p className="text-gray-500">Track income and expenses</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-blue-50"><div className="text-xs text-blue-600 font-medium mb-1">Revenue</div><div className="text-2xl font-bold">${revenue}</div></div>
          <div className="p-4 rounded-xl bg-rose-50"><div className="text-xs text-rose-600 font-medium mb-1">Expenses</div><div className="text-2xl font-bold">${totalExpenses}</div></div>
          <div className="p-4 rounded-xl bg-green-50"><div className="text-xs text-green-600 font-medium mb-1">Net Profit</div><div className="text-2xl font-bold">${revenue - totalExpenses}</div></div>
        </div>
        <div className="flex gap-2 border-b border-gray-200 mb-4">
          <button onClick={() => setTab('payments')} className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === 'payments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Payments</button>
          <button onClick={() => setTab('expenses')} className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === 'expenses' ? 'border-rose-600 text-rose-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Expenses</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="p-3 border-b">Student</th>
                <th className="p-3 border-b">Amount</th>
                <th className="p-3 border-b">Date</th>
                <th className="p-3 border-b">Type/Category</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-4 text-center text-gray-500">Loading...</td></tr>
              ) : (tab === 'payments' ? payments : expenses).length === 0 ? (
                <tr><td colSpan="6" className="p-4 text-center text-gray-500">No records found</td></tr>
              ) : (
                (tab === 'payments' ? payments : expenses).map(item => (
                  <tr key={item._id} className="border-b hover:bg-gray-50 group">
                    <td className="p-3">{item.student?.student_name || '—'}</td>
                    <td className="p-3 font-medium">${item.amount}</td>
                    <td className="p-3 text-gray-600">{item.payment_date || item.expense_date ? new Date(item.payment_date || item.expense_date).toLocaleDateString() : '—'}</td>
                    <td className="p-3">{tab === 'payment' ? item.payment_type : item.category}</td>
                    <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'completed' ? 'bg-green-100 text-green-700' : item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-rose-100 text-rose-700'}`}>{item.status}</span></td>
                    <td className="p-3"><button onClick={() => handleDelete(item._id, tab)} className="text-red-500 hover:text-red-700" title="Delete"><Trash2 size={16} /></button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 ${open ? 'flex' : 'hidden'} items-center justify-center bg-black/40`}>
        <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl border border-gray-200">
          <h2 className="text-lg font-bold mb-4">Record Payment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Student ID</label>
              <input required value={form.student} onChange={e => setForm({...form, student:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 66b7..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Amount</label>
                <input required type="number" value={form.amount} onChange={e => setForm({...form, amount:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                <input type="date" required value={form.payment_date} onChange={e => setForm({...form, payment_date:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                <select value={form.payment_type} onChange={e => setForm({...form, payment_type:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none">
                  {paymentTypes.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none">
                  {paymentStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Method</label>
              <input value={form.method} onChange={e => setForm({...form, method:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Bank Transfer" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Reference</label>
              <input value={form.reference} onChange={e => setForm({...form, reference:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Record Payment</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
