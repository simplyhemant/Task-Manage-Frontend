import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { cn } from '../UI';

export const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Map route to title
  const getTitle = () => {
    const path = location.pathname.split('/')[1];
    switch (path) {
      case 'dashboard': return 'Dashboard';
      case 'projects': return 'Projects';
      case 'tasks': return 'My Tasks';
      case 'team': return 'Team Management';
      case 'settings': return 'Settings';
      default: return 'TaskFlow';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      
      <div className={cn(
        "transition-all duration-300",
        collapsed ? "lg:ml-20" : "lg:ml-[240px]"
      )}>
        <Topbar 
          onMenuClick={() => setMobileOpen(true)} 
          title={getTitle()}
        />
        
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
