import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Bell, Menu, Search, UserCircle } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <div className="bg-blue-600 p-1.5 rounded text-white"><Menu size={18} /></div>
        <span className="font-bold text-lg">Moves CRM</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search..." className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <button className="p-2 text-gray-500 hover:text-gray-700"><Bell size={20} /></button>
        <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium">{user?.name}</div>
            <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
          </div>
          <UserCircle className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full" />
        </div>
      </div>
    </header>
  );
}
