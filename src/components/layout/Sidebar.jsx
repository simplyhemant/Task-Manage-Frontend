import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users,
  Settings, LogOut, Shield, ChevronLeft, ChevronRight, Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn, Avatar, Badge } from '../UI';

const SidebarItem = ({ icon: Icon, label, to, badge, collapsed, adminOnly }) => (
  <NavLink
    to={to}
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative",
      isActive
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
        : "text-slate-400 hover:bg-white/5 hover:text-white"
    )}
  >
    <Icon size={19} className="shrink-0" />
    {!collapsed && (
      <>
        <span className="text-sm font-medium flex-1 truncate">{label}</span>
        {badge && (
          <span className="text-[9px] font-black px-1.5 py-0.5 bg-indigo-500/30 text-indigo-300 rounded-md tracking-wider">
            {badge}
          </span>
        )}
      </>
    )}
    {collapsed && (
      <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 border border-slate-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
        {label}
        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 border-l border-b border-slate-700 rotate-45" />
      </div>
    )}
  </NavLink>
);

const SectionLabel = ({ label, collapsed }) =>
  !collapsed ? (
    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-3 pt-5 pb-1">{label}</p>
  ) : <div className="border-t border-slate-800 my-3 mx-2" />;

export const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 text-white flex flex-col transition-all duration-300",
        "bg-[#0F1117] border-r border-white/5",
        collapsed ? "w-20" : "w-[240px]",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className={cn("p-5 flex items-center gap-3 border-b border-white/5", collapsed && "justify-center")}>
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/30">
            <svg className="w-5 h-5 text-white fill-white" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          {!collapsed && (
            <div>
              <span className="text-base font-bold tracking-tight">TaskFlow</span>
              {isAdmin && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Shield size={10} className="text-indigo-400" />
                  <span className="text-[9px] font-bold text-indigo-400 tracking-wider">ADMIN PANEL</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
          <SectionLabel label="Main" collapsed={collapsed} />
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" collapsed={collapsed} />
          <SidebarItem icon={FolderKanban} label="Projects" to="/projects" collapsed={collapsed} />
          <SidebarItem icon={CheckSquare} label="My Tasks" to="/tasks" collapsed={collapsed} />

          {isAdmin && (
            <>
              <SectionLabel label="Admin" collapsed={collapsed} />
              <SidebarItem icon={Users} label="Team" to="/team" badge="ADMIN" collapsed={collapsed} adminOnly />
              <SidebarItem icon={Activity} label="All Tasks" to="/tasks" collapsed={collapsed} />
            </>
          )}

          <SectionLabel label="Account" collapsed={collapsed} />
          <SidebarItem icon={Settings} label="Settings" to="/settings" collapsed={collapsed} />
        </nav>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-white/5">
          <div className={cn("flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors", collapsed && "justify-center")}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                </div>
                <button onClick={logout} className="text-slate-500 hover:text-white transition-colors p-1" title="Logout">
                  <LogOut size={16} />
                </button>
              </>
            )}
          </div>

          {/* Role Badge */}
          {!collapsed && (
            <div className="mt-2 flex justify-center">
              <span className={cn(
                "text-[9px] font-black px-3 py-1 rounded-full tracking-widest flex items-center gap-1",
                isAdmin ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-slate-800 text-slate-500"
              )}>
                {isAdmin && <Shield size={8} />}
                {user?.role}
              </span>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full items-center justify-center text-slate-400 hover:text-white transition-colors shadow-lg"
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </aside>
    </>
  );
};
