import React from 'react';
import { Drawer, Input, Button, cn } from '../UI';
import { USERS } from '../../data/mockData';

export const ProjectModal = ({ isOpen, onClose, project }) => {
  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title={project ? 'Edit Project' : 'Create New Project'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => {}}>Save Project</Button>
        </>
      }
    >
      <div className="space-y-6">
        <Input label="Project Name*" placeholder="e.g. Mobile App Redesign" required />
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Description</label>
          <textarea 
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400 min-h-[100px] text-sm"
            placeholder="What is this project about?"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</label>
          <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary outline-none text-sm bg-white">
            <option>Planned</option>
            <option>In Progress</option>
            <option>On Track</option>
            <option>Completed</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Start Date*" type="date" required />
          <Input label="End Date" type="date" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Project Owner</label>
          <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary outline-none text-sm bg-white">
            {USERS.map(u => <option key={u.id}>{u.name}</option>)}
          </select>
        </div>
      </div>
    </Drawer>
  );
};
