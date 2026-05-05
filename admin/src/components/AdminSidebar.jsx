import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Mail, 
  Star, 
  MessageSquare, 
  Settings,
  LogOut,
  Glasses
} from 'lucide-react';

const AdminSidebar = ({ setToken }) => {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/admin/contacts`, {
        headers: { token }
      });
      if (res.data.success) {
        setUnreadCount(res.data.contacts.filter(c => !c.isRead).length);
      }
    } catch (e) {}
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/leads', icon: Mail, label: 'Lead Emails' },
    { path: '/newsletter', icon: Mail, label: 'Newsletter' },
    { path: '/reviews', icon: Star, label: 'Reviews' },
    { path: '/contacts', icon: MessageSquare, label: 'Contact Messages', badge: unreadCount },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0F172A] text-white flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
            <Glasses size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg">Sapphire Optics</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
              {item.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-4 p-3 bg-slate-800 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="font-bold">A</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Admin User</p>
            <p className="text-xs text-slate-400">Super Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-red-600 hover:text-white transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
