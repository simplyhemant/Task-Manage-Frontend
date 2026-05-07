import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Users, FolderKanban, CheckSquare, AlertCircle, TrendingUp,
  Activity, Clock, Shield, ArrowUpRight, ArrowDownRight,
  Star, Zap, Database, BarChart2, Loader
} from 'lucide-react';
import { Card, Badge, Avatar, cn } from '../components/UI';
import { dashboardService } from '../services/dashboardService';
import { userService } from '../services/userService';
import { projectService } from '../services/projectService';

const StatCard = ({ label, value, icon: Icon, color, trend, trendUp, subtitle }) => {
  const colorMap = {
    indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-200',
    emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-200',
    amber: 'from-amber-500 to-amber-600 shadow-amber-200',
    red: 'from-red-500 to-red-600 shadow-red-200',
    purple: 'from-purple-500 to-purple-600 shadow-purple-200',
    cyan: 'from-cyan-500 to-cyan-600 shadow-cyan-200',
  };
  const bgMap = {
    indigo: 'bg-indigo-50 border-indigo-100',
    emerald: 'bg-emerald-50 border-emerald-100',
    amber: 'bg-amber-50 border-amber-100',
    red: 'bg-red-50 border-red-100',
    purple: 'bg-purple-50 border-purple-100',
    cyan: 'bg-cyan-50 border-cyan-100',
  };
  return (
    <div className={cn("rounded-2xl border p-5 relative overflow-hidden", bgMap[color] || bgMap.indigo)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-slate-900 tabular-nums">{value ?? <span className="text-slate-300">—</span>}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={cn("w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg", colorMap[color])}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-4 flex items-center gap-1.5">
          {trendUp ? (
            <ArrowUpRight size={14} className="text-emerald-500" />
          ) : (
            <ArrowDownRight size={14} className="text-red-400" />
          )}
          <span className={cn("text-xs font-bold", trendUp ? "text-emerald-600" : "text-red-500")}>{trend}%</span>
          <span className="text-xs text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  );
};

export const AdminDashboard = ({ stats, recentTasks, deadlines, users, projects }) => {
  const taskDistribution = [
    { name: 'Todo', value: stats?.todoTasks || 0, color: '#94A3B8' },
    { name: 'In Progress', value: stats?.inProgressTasks || 0, color: '#6366F1' },
    { name: 'Done', value: stats?.completedTasks || 0, color: '#10B981' },
  ];

  const weekData = [
    { day: 'Mon', tasks: 12, projects: 2 },
    { day: 'Tue', tasks: 19, projects: 3 },
    { day: 'Wed', tasks: 8, projects: 1 },
    { day: 'Thu', tasks: 25, projects: 4 },
    { day: 'Fri', tasks: 16, projects: 2 },
    { day: 'Sat', tasks: 5, projects: 1 },
    { day: 'Sun', tasks: 3, projects: 0 },
  ];

  const COLORS = ['#94A3B8', '#6366F1', '#10B981'];

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield size={18} className="text-indigo-300" />
              <span className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Admin Control Panel</span>
            </div>
            <h2 className="text-3xl font-bold mb-1">System Overview</h2>
            <p className="text-indigo-200 text-sm">Global platform metrics • Real-time monitoring</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
              <p className="text-indigo-200 text-xs mt-1">Total Users</p>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold">{stats?.totalProjects || 0}</p>
              <p className="text-indigo-200 text-xs mt-1">Projects</p>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold">{stats?.totalTasks || 0}</p>
              <p className="text-indigo-200 text-xs mt-1">Tasks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats?.totalUsers} icon={Users} color="indigo" trend={12} trendUp />
        <StatCard label="Active Projects" value={stats?.activeProjects} icon={FolderKanban} color="purple" trend={8} trendUp />
        <StatCard label="Tasks Completed" value={stats?.completedTasks} icon={CheckSquare} color="emerald" trend={23} trendUp />
        <StatCard label="High Priority" value={stats?.highPriorityTasks} icon={AlertCircle} color="red" trend={5} trendUp={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900">Weekly Activity</h3>
              <p className="text-xs text-slate-500 mt-0.5">Tasks completed this week</p>
            </div>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">This Week</span>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekData}>
                <defs>
                  <linearGradient id="taskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="tasks" stroke="#6366F1" strokeWidth={2.5} fill="url(#taskGrad)" dot={{ fill: '#6366F1', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Distribution Pie */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="mb-4">
            <h3 className="font-bold text-slate-900">Task Distribution</h3>
            <p className="text-xs text-slate-500 mt-0.5">By current status</p>
          </div>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={taskDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                  paddingAngle={3} dataKey="value">
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {taskDistribution.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-600">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Users size={16} className="text-indigo-500" /> Recent Users</h3>
            <span className="text-xs text-slate-400">{users?.length || 0} total</span>
          </div>
          <div className="divide-y divide-slate-50">
            {(users || []).slice(0, 5).map(u => (
              <div key={u.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{u.name}</p>
                  <p className="text-xs text-slate-400 truncate">{u.email}</p>
                </div>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full",
                  u.role === 'ADMIN' ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"
                )}>{u.role}</span>
              </div>
            ))}
            {(!users || users.length === 0) && (
              <div className="p-8 text-center text-slate-400 text-sm">No users yet</div>
            )}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Activity size={16} className="text-emerald-500" /> Recent Activity</h3>
            <span className="text-xs text-slate-400">Last 10</span>
          </div>
          <div className="divide-y divide-slate-50">
            {(recentTasks || []).slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className={cn("w-2 h-2 rounded-full shrink-0",
                  task.status === 'DONE' ? "bg-emerald-500" : task.status === 'IN_PROGRESS' ? "bg-indigo-500" : "bg-slate-300")} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{task.title}</p>
                  <p className="text-xs text-slate-400">{task.projectName}</p>
                </div>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",
                  task.priority === 'HIGH' ? "bg-red-100 text-red-700" : task.priority === 'MEDIUM' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                )}>{task.priority}</span>
              </div>
            ))}
            {(!recentTasks || recentTasks.length === 0) && (
              <div className="p-8 text-center text-slate-400 text-sm">No recent activity</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const UserDashboard = ({ stats, recentTasks, deadlines, user }) => {
  const completionRate = stats?.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  const progressData = [
    { name: 'Todo', count: stats?.todoTasks || 0, color: 'bg-slate-300', textColor: 'text-slate-600' },
    { name: 'In Progress', count: stats?.inProgressTasks || 0, color: 'bg-indigo-500', textColor: 'text-indigo-600' },
    { name: 'Done', count: stats?.completedTasks || 0, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-8">
      {/* User Welcome Header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-lg shadow-indigo-200">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-500 font-medium">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},</p>
          <h2 className="text-2xl font-bold text-slate-900">{user?.name} 👋</h2>
          <p className="text-sm text-slate-500 mt-0.5">Here's what's on your plate today.</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-xs text-slate-400 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <p className="text-sm font-semibold text-indigo-600 mt-1">{completionRate}% tasks completed</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Projects" value={stats?.totalProjects} icon={FolderKanban} color="indigo" />
        <StatCard label="Active Tasks" value={(stats?.todoTasks || 0) + (stats?.inProgressTasks || 0)} icon={Zap} color="amber" />
        <StatCard label="Completed" value={stats?.completedTasks} icon={CheckSquare} color="emerald" trend={8} trendUp />
        <StatCard label="High Priority" value={stats?.highPriorityTasks} icon={AlertCircle} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completion Progress */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-1">Your Progress</h3>
          <p className="text-xs text-slate-500 mb-6">Task completion overview</p>

          {/* Circular Progress */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="48" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                <circle cx="60" cy="60" r="48" fill="none" stroke="#6366F1" strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 48}`}
                  strokeDashoffset={`${2 * Math.PI * 48 * (1 - completionRate / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">{completionRate}%</span>
                <span className="text-xs text-slate-400">done</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {progressData.map(item => (
              <div key={item.name} className="flex items-center gap-3">
                <div className={cn("w-3 h-3 rounded-full shrink-0", item.color)} />
                <span className="text-xs text-slate-600 flex-1">{item.name}</span>
                <span className={cn("text-xs font-bold", item.textColor)}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Clock size={16} className="text-amber-500" /> Upcoming Deadlines</h3>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">{(deadlines || []).length} tasks</span>
          </div>
          <div className="divide-y divide-slate-50">
            {(deadlines || []).length === 0 ? (
              <div className="p-10 text-center">
                <CheckSquare size={32} className="mx-auto text-emerald-300 mb-3" />
                <p className="text-slate-500 text-sm font-medium">All caught up! 🎉</p>
                <p className="text-slate-400 text-xs mt-1">No upcoming deadlines this week</p>
              </div>
            ) : (deadlines || []).slice(0, 6).map(task => {
              const daysLeft = task.dueDate
                ? Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
                : null;
              return (
                <div key={task.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold",
                    daysLeft <= 1 ? "bg-red-100 text-red-700" : daysLeft <= 3 ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
                  )}>
                    {daysLeft !== null ? `${daysLeft}d` : '—'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{task.title}</p>
                    <p className="text-xs text-slate-400">{task.projectName}</p>
                  </div>
                  <span className={cn("text-[10px] font-bold px-2 py-1 rounded-lg",
                    task.priority === 'HIGH' ? "bg-red-100 text-red-700" : task.priority === 'MEDIUM' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                  )}>{task.priority}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* My Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 flex items-center gap-2"><Activity size={16} className="text-indigo-500" /> My Recent Tasks</h3>
          <span className="text-xs text-slate-400">Latest updates</span>
        </div>
        {(recentTasks || []).length === 0 ? (
          <div className="p-10 text-center">
            <FolderKanban size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 text-sm">No tasks yet. Join a project to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
                  <th className="px-5 py-3 text-left">Task</th>
                  <th className="px-5 py-3 text-left">Project</th>
                  <th className="px-5 py-3 text-left">Priority</th>
                  <th className="px-5 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(recentTasks || []).map(task => (
                  <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-900">{task.title}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">{task.projectName}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",
                        task.priority === 'HIGH' ? "bg-red-100 text-red-700" : task.priority === 'MEDIUM' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                      )}>{task.priority}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",
                        task.status === 'DONE' ? "bg-emerald-100 text-emerald-700" : task.status === 'IN_PROGRESS' ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"
                      )}>{task.status?.replace('_', ' ')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Dashboard Wrapper ─────────────────────────────────────────────────
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tasks = [
      dashboardService.getStats(),
      dashboardService.getRecentTasks(),
      dashboardService.getUpcomingDeadlines(),
    ];
    if (isAdmin) tasks.push(userService.getAll());

    Promise.all(tasks)
      .then(([s, t, d, u]) => {
        setStats(s);
        setRecentTasks(t);
        setDeadlines(d);
        if (u) setUsers(u);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <Loader className="animate-spin text-indigo-600" size={32} />
        <p className="text-slate-500 text-sm">Loading dashboard...</p>
      </div>
    </div>
  );

  if (isAdmin) {
    return <AdminDashboard stats={stats} recentTasks={recentTasks} deadlines={deadlines} users={users} />;
  }

  return <UserDashboard stats={stats} recentTasks={recentTasks} deadlines={deadlines} user={user} />;
};
