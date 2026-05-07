import React from 'react';
import { Drawer, Input, Button, cn } from '../UI';
import { PROJECTS, USERS } from '../../data/mockData';

export const TaskModal = ({ isOpen, onClose, task }) => {
  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title={task ? 'Edit Task' : 'Create New Task'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => {}}>Save Task</Button>
        </>
      }
    >
      <div className="space-y-6">
        <Input label="Task Title*" placeholder="e.g. Design System Audit" required />
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Description (Optional)</label>
          <textarea 
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400 min-h-[100px] text-sm"
            placeholder="Enter details about this task..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</label>
            <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary outline-none text-sm bg-white">
              <option>Todo</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Priority</label>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {['Low', 'Medium', 'High'].map(p => (
                <button key={p} className={cn(
                  "flex-1 py-1 text-[10px] font-bold rounded-md transition-all",
                  p === 'Medium' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}>{p}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Due Date" type="date" />
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Assign to</label>
            <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary outline-none text-sm bg-white">
              <option>Unassigned</option>
              {USERS.map(u => <option key={u.id}>{u.name}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Project*</label>
            <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary outline-none text-sm bg-white">
              {PROJECTS.map(p => <option key={p.id}>{p.name}</option>)}
            </select>
          </div>
      </div>
    </Drawer>
  );
};
