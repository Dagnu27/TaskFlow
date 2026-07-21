export interface Assignee {
  name: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  dueDate: string; // YYYY-MM-DD format
  dueTime?: string; // e.g., "11:00 AM"
  completed: boolean;
  completedAt?: string;
  starred: boolean;
  assignees: Assignee[];
  createdAt: string;
}

export interface SyncMeeting {
  id: string;
  title: string;
  time: string;
  type: string;
  attendees: Assignee[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  verified: boolean;
  securityStrength: number;
}

export interface InboxMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  title: string;
  message: string;
  time: string;
  isUnread: boolean;
  accentDot: boolean;
  taskIdRelated?: string; // Optional related task
}
