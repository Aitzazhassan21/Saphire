import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const AdminHeader = () => {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <Bell className="text-slate-600" size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <User className="text-white" size={20} />
          </div>
          <div className="hidden md:block">
            <p className="font-medium text-sm text-slate-900">Admin</p>
            <p className="text-xs text-slate-500">admin@sapphireoptics.co.uk</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
