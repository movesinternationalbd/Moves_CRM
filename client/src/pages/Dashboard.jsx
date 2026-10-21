import { useEffect, useState } from 'react';
import api from '../api.jsx';
import { BarChart3 } from 'lucide-react';

const statCards = [
  { label: 'Leads This Month', value: '--', color: 'bg-blue-500' },
  { label: 'Total Students', value: '--', color: 'bg-green-500' },
  { label: 'Revenue (Month)', value: '--', color: 'bg-emerald-500' },
  { label: 'Expenses (Month)', value: '--', color: 'bg-rose-500' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(statCards);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats').then((r) => {
      const s = r.data.stats;
      setStats([
        { label: 'Leads This Month', value: s.leads_month, color: 'bg-blue-500' },
        { label: 'Total Students', value: s.students_total, color: 'bg-green-500' },
        { label: 'Revenue (Month)', value: `$${s.revenue_month}`, color: 'bg-emerald-500' },
        { label: 'Expenses (Month)', value: `$${s.expenses_month}`, color: 'bg-rose-500' },
      ]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Overview of your CRM operations</p>
        </div>
        <BarChart3 className="w-8 h-8 text-blue-600" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{card.label}</p>
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center text-white`}><BarChart3 size={16} /></div>
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <p className="text-gray-500 text-sm">Connect activity feed to view recent CRM events.</p>
      </div>
    </div>
  );
}
