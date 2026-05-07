import React from 'react';
import { Bell, Search, Menu, ChevronRight } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { Avatar, cn } from '../UI';
import { useAuth } from '../../context/AuthContext';

export const Topbar = ({ onMenuClick, title }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Breadcrumb logic
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
        >
          <Menu size={20} />
        </button>
        
        <div>
          <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          {pathnames.length > 1 && (
            <div className="flex items-center text-xs text-slate-400 mt-0.5">
              {pathnames.map((value, index) => {
                const last = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const label = value.charAt(0).toUpperCase() + value.slice(1);

                return last ? (
                  <span key={to}>{label}</span>
                ) : (
                  <React.Fragment key={to}>
                    <Link to={to} className="hover:text-primary transition-colors">{label}</Link>
                    <ChevronRight size={12} className="mx-1" />
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-64 group focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full placeholder:text-slate-400"
          />
        </div>

        {/* Notifications */}
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">3</span>
        </button>

        {/* User Dropdown */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-slate-900 leading-none">{user.name}</p>
            <p className="text-xs text-slate-500 mt-1">{user.role}</p>
          </div>
          <Avatar name={user.name} />
        </div>
      </div>
    </header>
  );
};
