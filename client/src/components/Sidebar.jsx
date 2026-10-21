import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogOut, LayoutDashboard, Users, FileText, CreditCard, BarChart3, Settings as SettingsIcon } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Leads', to: '/leads', icon: FileText },
  { name: 'Students', to: '/students', icon: Users },
  { name: 'Follow-ups', to: '/followups', icon: LayoutDashboard },
  { name: 'Finance', to: '/finance', icon: CreditCard },
  { name: 'PTE Academy', to: '/pte', icon: BarChart3 },
  { name: 'Countries', to: '/countries', icon: LayoutDashboard },
  { name: 'Universities', to: '/universities', icon: LayoutDashboard },
  { name: 'Documents', to: '/documents', icon: FileText },
  { name: 'Notifications', to: '/notifications', icon: LayoutDashboard },
  { name: 'Settings', to: '/settings', icon: SettingsIcon },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg text-white"><BarChart3 size={20} /></div>
        <span className="font-bold text-lg tracking-tight">Moves CRM</span>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.to}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition hover:bg-gray-100 hover:text-blue-600"
            onClick={() => navigate(item.to)}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="px-4 py-2 text-xs text-gray-500 capitalize">{user?.name}</div>
        <div className="px-4 py-1 text-[10px] font-medium text-gray-400 uppercase">{user?.role}</div>
        <button
          onClick={logout}
          className="w-full py-2 px-4 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut className="w-4 h-4 mr-2" /> Sign out
        </button>
      </div>
    </aside>
  );
}
