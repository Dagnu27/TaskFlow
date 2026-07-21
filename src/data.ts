import { Task, SyncMeeting, UserProfile, InboxMessage } from './types';

// Premium real Unsplash avatar images for a professional look
export const USERS = {
  sarah: { name: 'Sarah Connors', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' },
  alex: { name: 'Alex Rivers', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
  elena: { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' },
  marcus: { name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
  david: { name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80' }
};

// Current reference date: July 20, 2026 (Monday)
export const INITIAL_TASKS: Task[] = [
  // Overview / Today's Key High Highlighted Task
  {
    id: 't-1',
    title: 'Cross-platform Mobile Beta launch',
    description: 'Coordinate with QA and final signoff on mobile build 1.4.2 before deploying to TestFlight and Google Play Beta.',
    priority: 'HIGH',
    category: 'Product Launch',
    dueDate: '2026-07-20',
    dueTime: '11:00 AM',
    completed: false,
    starred: true,
    assignees: [USERS.sarah, USERS.alex, USERS.marcus],
    createdAt: '2026-07-18T10:00:00Z'
  },
  // Today's regular tasks (Morning / Afternoon / Evening)
  {
    id: 't-2',
    title: 'Review landing page copy & design edits',
    description: 'Provide feedback on the latest marketing site typography hierarchy and color contrast ratios.',
    priority: 'MEDIUM',
    category: 'Marketing',
    dueDate: '2026-07-20',
    dueTime: '09:30 AM', // Morning
    completed: false,
    starred: false,
    assignees: [USERS.alex, USERS.sarah],
    createdAt: '2026-07-19T08:00:00Z'
  },
  {
    id: 't-3',
    title: 'Sync with security team on OAuth updates',
    description: 'Ensure redirect URIs and cookie configurations comply with OAuth security policies.',
    priority: 'HIGH',
    category: 'Security',
    dueDate: '2026-07-20',
    dueTime: '02:00 PM', // Afternoon
    completed: false,
    starred: true,
    assignees: [USERS.marcus, USERS.david],
    createdAt: '2026-07-19T14:30:00Z'
  },
  {
    id: 't-4',
    title: 'Conduct weekly database sanity checks',
    description: 'Verify storage capacity, review backup logs, and optimize indexes on the cluster.',
    priority: 'LOW',
    category: 'Engineering',
    dueDate: '2026-07-20',
    dueTime: '05:30 PM', // Evening
    completed: false,
    starred: false,
    assignees: [USERS.marcus],
    createdAt: '2026-07-19T17:00:00Z'
  },
  {
    id: 't-5',
    title: 'Prep slides for quarterly product review',
    description: 'Collect Q2 metrics and summarize goals for the Q3 roadmap.',
    priority: 'MEDIUM',
    category: 'Product Launch',
    dueDate: '2026-07-20',
    dueTime: '04:00 PM', // Afternoon
    completed: true,
    completedAt: '2026-07-20T15:00:00Z',
    starred: false,
    assignees: [USERS.sarah],
    createdAt: '2026-07-18T09:00:00Z'
  },

  // Upcoming Tasks (Next 7 Days)
  // July 21 (Tuesday)
  {
    id: 't-6',
    title: 'Refactor state management in dashboard',
    description: 'Improve list responsiveness and eliminate unnecessary re-renders in the sidebar.',
    priority: 'MEDIUM',
    category: 'Engineering',
    dueDate: '2026-07-21',
    dueTime: '10:00 AM',
    completed: false,
    starred: true,
    assignees: [USERS.david, USERS.alex],
    createdAt: '2026-07-19T09:00:00Z'
  },
  {
    id: 't-7',
    title: 'Write release notes for v1.5.0',
    description: 'Outline the new features, performance gains, and bug fixes for the public release.',
    priority: 'LOW',
    category: 'Product Launch',
    dueDate: '2026-07-21',
    dueTime: '03:00 PM',
    completed: false,
    starred: false,
    assignees: [USERS.sarah, USERS.elena],
    createdAt: '2026-07-20T08:00:00Z'
  },
  // July 22 (Wednesday)
  {
    id: 't-8',
    title: 'Finalize QA automation suite integration',
    description: 'Run regression test suites and configure continuous integration hooks.',
    priority: 'HIGH',
    category: 'QA',
    dueDate: '2026-07-22',
    dueTime: '11:30 AM',
    completed: false,
    starred: false,
    assignees: [USERS.elena],
    createdAt: '2026-07-19T10:00:00Z'
  },
  // July 23 (Thursday)
  {
    id: 't-9',
    title: 'Design systems sync on dark mode palette',
    description: 'Select final colors for borders, cards, and interactive focus states.',
    priority: 'LOW',
    category: 'Design',
    dueDate: '2026-07-23',
    dueTime: '02:00 PM',
    completed: false,
    starred: false,
    assignees: [USERS.alex, USERS.sarah],
    createdAt: '2026-07-20T11:00:00Z'
  },
  // July 24 (Friday)
  {
    id: 't-10',
    title: 'Weekly wrap-up meeting & celebration',
    description: 'Celebrate the beta launch, share metrics, and distribute pizza credits.',
    priority: 'MEDIUM',
    category: 'Culture',
    dueDate: '2026-07-24',
    dueTime: '04:30 PM',
    completed: false,
    starred: true,
    assignees: [USERS.sarah, USERS.alex, USERS.elena, USERS.marcus, USERS.david],
    createdAt: '2026-07-20T12:00:00Z'
  },

  // Completed items in history
  {
    id: 't-11',
    title: 'Configure production SSL certificates',
    priority: 'HIGH',
    category: 'Security',
    dueDate: '2026-07-19',
    dueTime: '11:00 AM',
    completed: true,
    completedAt: '2026-07-19T10:30:00Z',
    starred: false,
    assignees: [USERS.marcus],
    createdAt: '2026-07-18T09:00:00Z'
  },
  {
    id: 't-12',
    title: 'Review user feedback on onboarding flow',
    priority: 'LOW',
    category: 'Product Launch',
    dueDate: '2026-07-18',
    dueTime: '03:00 PM',
    completed: true,
    completedAt: '2026-07-18T16:00:00Z',
    starred: true,
    assignees: [USERS.sarah, USERS.alex],
    createdAt: '2026-07-17T11:00:00Z'
  }
];

export const INITIAL_MEETINGS: SyncMeeting[] = [
  {
    id: 'm-1',
    title: 'Daily Standup Sync',
    time: '10:00 AM',
    type: 'Google Meet',
    attendees: [USERS.sarah, USERS.alex, USERS.elena, USERS.marcus]
  },
  {
    id: 'm-2',
    title: 'Product Strategy Sync',
    time: '01:00 PM',
    type: 'Design Review',
    attendees: [USERS.sarah, USERS.alex, USERS.david]
  },
  {
    id: 'm-3',
    title: 'Beta Retrospective',
    time: '04:00 PM',
    type: 'Feedback',
    attendees: [USERS.sarah, USERS.marcus, USERS.elena]
  }
];



export const INITIAL_INBOX: InboxMessage[] = [
  {
    id: 'msg-1',
    senderName: 'Sarah Connors',
    senderAvatar: USERS.sarah.avatar,
    title: 'Updated the Beta Launch guidelines',
    message: 'Hey team, I updated the roadmap document for the cross-platform mobile beta launch. Please make sure the TestFlight build is uploaded by 11:00 AM.',
    time: '10 mins ago',
    isUnread: true,
    accentDot: true,
    taskIdRelated: 't-1'
  },
  {
    id: 'msg-2',
    senderName: 'Marcus Chen',
    senderAvatar: USERS.marcus.avatar,
    title: 'Database indexing completed successfully',
    message: 'Finished sanity checks on DB clusters. Read queries are running 35% faster. Let me know if you experience any connection delays.',
    time: '45 mins ago',
    isUnread: true,
    accentDot: true,
    taskIdRelated: 't-4'
  },
  {
    id: 'msg-3',
    senderName: 'Elena Rostova',
    senderAvatar: USERS.elena.avatar,
    title: 'Found minor layout bug on mobile Safari',
    message: 'The sidebar toggle is clipping slightly on iPhone 14 Pro Max in landscape. Let’s clean it up before the final release tomorrow.',
    time: '2 hours ago',
    isUnread: false,
    accentDot: false
  },
  {
    id: 'msg-4',
    senderName: 'Alex Rivers',
    senderAvatar: USERS.alex.avatar,
    title: 'Design tokens ready for inspect',
    message: 'The Tailwind CSS config values are locked. Let me know if we need another peach accent color for secondary toggles.',
    time: 'Yesterday',
    isUnread: false,
    accentDot: false
  }
];

export const INITIAL_PROFILE: UserProfile = {
  name: 'Natanim',
  email: 'natanim0606@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', // Default Sarah, or can change
  verified: true,
  securityStrength: 85
};

// Functions to load and save to localStorage for true persistent features
export const getStoredTasks = (): Task[] => {
  try {
    const data = localStorage.getItem('taskflow_tasks');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load tasks', e);
  }
  return INITIAL_TASKS;
};

export const saveStoredTasks = (tasks: Task[]) => {
  try {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks', e);
  }
};

export const getStoredInbox = (): InboxMessage[] => {
  try {
    const data = localStorage.getItem('taskflow_inbox');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load inbox', e);
  }
  return INITIAL_INBOX;
};

export const saveStoredInbox = (inbox: InboxMessage[]) => {
  try {
    localStorage.setItem('taskflow_inbox', JSON.stringify(inbox));
  } catch (e) {
    console.error('Failed to save inbox', e);
  }
};

export const getStoredProfile = (): UserProfile => {
  try {
    const data = localStorage.getItem('taskflow_profile');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load profile', e);
  }
  return INITIAL_PROFILE;
};

export const saveStoredProfile = (profile: UserProfile) => {
  try {
    localStorage.setItem('taskflow_profile', JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
};
