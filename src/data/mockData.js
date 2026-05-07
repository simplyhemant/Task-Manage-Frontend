export const USERS = [
  { id: 1, name: 'Alex Rivera', email: 'alex@taskflow.com', role: 'ADMIN', status: 'Active', joinedDate: '2023-01-15', avatar: 'AR' },
  { id: 2, name: 'Sarah Lopez', email: 'sarah@taskflow.com', role: 'USER', status: 'Active', joinedDate: '2023-03-20', avatar: 'SL' },
  { id: 3, name: 'Michael Chen', email: 'michael@taskflow.com', role: 'USER', status: 'Active', joinedDate: '2023-05-10', avatar: 'MC' },
  { id: 4, name: 'Emma Wilson', email: 'emma@taskflow.com', role: 'USER', status: 'Inactive', joinedDate: '2023-06-05', avatar: 'EW' },
  { id: 5, name: 'David Kim', email: 'david@taskflow.com', role: 'USER', status: 'Active', joinedDate: '2023-08-12', avatar: 'DK' },
];

export const PROJECTS = [
  { 
    id: 1, 
    name: 'Mobile App Redesign', 
    description: 'Complete overhaul of the mobile application user interface and experience.',
    status: 'In Progress',
    progress: 65,
    owner: USERS[0],
    members: [USERS[0], USERS[1], USERS[2]],
    startDate: '2023-10-01',
    endDate: '2024-01-15',
    taskCount: 24,
    completedTasks: 16
  },
  { 
    id: 2, 
    name: 'API Integration', 
    description: 'Integrating third-party payment gateways and CRM systems.',
    status: 'On Track',
    progress: 40,
    owner: USERS[1],
    members: [USERS[1], USERS[3]],
    startDate: '2023-11-10',
    endDate: '2024-02-28',
    taskCount: 12,
    completedTasks: 5
  },
  { 
    id: 3, 
    name: 'Brand Identity', 
    description: 'Developing new brand guidelines, logos, and marketing assets.',
    status: 'Completed',
    progress: 100,
    owner: USERS[0],
    members: [USERS[0], USERS[2], USERS[4]],
    startDate: '2023-08-01',
    endDate: '2023-10-15',
    taskCount: 18,
    completedTasks: 18
  },
  { 
    id: 4, 
    name: 'Infrastructure Audit', 
    description: 'Security and performance audit of the cloud infrastructure.',
    status: 'Planned',
    progress: 0,
    owner: USERS[2],
    members: [USERS[2], USERS[0]],
    startDate: '2024-01-05',
    endDate: '2024-03-10',
    taskCount: 8,
    completedTasks: 0
  }
];

export const TASKS = [
  { 
    id: 1, 
    title: 'Design System Audit', 
    project: PROJECTS[0], 
    priority: 'High', 
    status: 'In Progress', 
    dueDate: '2023-10-24', 
    assignee: USERS[0],
    description: 'Review the current design system components for consistency and accessibility.'
  },
  { 
    id: 2, 
    title: 'API Authentication Flow', 
    project: PROJECTS[1], 
    priority: 'Medium', 
    status: 'Todo', 
    dueDate: '2023-10-26', 
    assignee: USERS[1],
    description: 'Implement OAuth2 authentication flow for the new API endpoints.'
  },
  { 
    id: 3, 
    title: 'Draft Q4 Strategy', 
    project: PROJECTS[2], 
    priority: 'Low', 
    status: 'Done', 
    dueDate: '2023-10-20', 
    assignee: USERS[2],
    description: 'Summarize performance metrics from Q3 and outline key objectives for Q4.'
  },
  { 
    id: 4, 
    title: 'User Feedback Analysis', 
    project: PROJECTS[0], 
    priority: 'Medium', 
    status: 'Todo', 
    dueDate: '2023-10-28', 
    assignee: USERS[0],
    description: 'Synthesize notes from the last 10 user interview sessions.'
  },
  { 
    id: 5, 
    title: 'Database Migration', 
    project: PROJECTS[1], 
    priority: 'High', 
    status: 'In Progress', 
    dueDate: '2023-10-25', 
    assignee: USERS[3],
    description: 'Migrating legacy customer data to the new distributed storage system.'
  },
  { 
    id: 6, 
    title: 'Social Media Graphics', 
    project: PROJECTS[2], 
    priority: 'Low', 
    status: 'Todo', 
    dueDate: '2023-10-30', 
    assignee: USERS[4],
    description: 'Create a set of 5 templates for the upcoming project announcement.'
  },
  { 
    id: 7, 
    title: 'Security Protocol Review', 
    project: PROJECTS[3], 
    priority: 'High', 
    status: 'Todo', 
    dueDate: '2023-10-22', 
    assignee: USERS[0],
    description: 'Review the firewall rules and access control lists.'
  },
  { 
    id: 8, 
    title: 'Onboarding Docs', 
    project: PROJECTS[0], 
    priority: 'Medium', 
    status: 'Done', 
    dueDate: '2023-10-21', 
    assignee: USERS[1],
    description: 'Update the developer onboarding guide with the new project structure.'
  }
];
