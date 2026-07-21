import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Task, SyncMeeting, UserProfile, InboxMessage } from './types';
import { 
  getStoredTasks, 
  saveStoredTasks, 
  getStoredInbox, 
  saveStoredInbox, 
  getStoredProfile, 
  saveStoredProfile,
  INITIAL_MEETINGS
} from './data';

// Navigation Components
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import TaskModal from './components/TaskModal';
import TaskDetailModal from './components/TaskDetailModal';

// Pages
import Landing from './pages/Landing';
import Overview from './pages/Overview';
import Inbox from './pages/Inbox';
import Today from './pages/Today';
import Upcoming from './pages/Upcoming';
import Favorites from './pages/Favorites';
import Completed from './pages/Completed';
import Settings from './pages/Settings';
import HelpCenter from './pages/HelpCenter';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Load state from custom persist synchronizer
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inbox, setInbox] = useState<InboxMessage[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [meetings] = useState<SyncMeeting[]>(INITIAL_MEETINGS);
  
  // Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Load items on mount
  useEffect(() => {
    setTasks(getStoredTasks());
    setInbox(getStoredInbox());
    setProfile(getStoredProfile());
  }, []);

  // Sync state actions
  const handleToggleComplete = (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const completedState = !t.completed;
        return {
          ...t,
          completed: completedState,
          completedAt: completedState ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });
    setTasks(updated);
    saveStoredTasks(updated);
  };

  const handleToggleStar = (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        return { ...t, starred: !t.starred };
      }
      return t;
    });
    setTasks(updated);
    saveStoredTasks(updated);
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    saveStoredTasks(updated);
  };

  const handleToggleRead = (id: string) => {
    const updated = inbox.map((m) => {
      if (m.id === id) {
        return { ...m, isUnread: !m.isUnread, accentDot: false };
      }
      return m;
    });
    setInbox(updated);
    saveStoredInbox(updated);
  };

  const handleDeleteMessage = (id: string) => {
    const updated = inbox.filter((m) => m.id !== id);
    setInbox(updated);
    saveStoredInbox(updated);
  };

  const handleMarkAllAsRead = () => {
    const updated = inbox.map((m) => ({ ...m, isUnread: false, accentDot: false }));
    setInbox(updated);
    saveStoredInbox(updated);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    saveStoredProfile(updatedProfile);
  };

  const handleCardClick = (id: string) => {
    const t = tasks.find(task => task.id === id);
    if (t) {
      setEditingTask(t);
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const updated = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    setTasks(updated);
    saveStoredTasks(updated);
    if (editingTask && editingTask.id === updatedTask.id) {
      setEditingTask(updatedTask);
    }
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    saveStoredTasks(updated);
  };

  const handleConvertMessageToTask = (title: string, message: string) => {
    handleAddTask({
      title,
      description: message,
      priority: 'MEDIUM',
      category: 'Inbound',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '12:00 PM',
      completed: false,
      starred: false,
      assignees: []
    });
  };

  // Helper counters for sidebar
  const unreadInboxCount = inbox.filter((m) => m.isUnread).length;
  const starredTasksCount = tasks.filter((t) => t.starred && !t.completed).length;
  const todayTasksCount = tasks.filter(
    (t) => t.dueDate === '2026-07-20' && !t.completed
  ).length;

  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f4f3f8]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Initializing TaskFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="app-root-shell" className="flex flex-col lg:flex-row min-h-screen bg-[#f4f3f8] text-slate-800">
      
      {/* Responsive Sidebar Panel */}
      <Sidebar
        activeRoute={location.pathname}
        onNavigate={(path) => navigate(path)}
        onOpenAddTask={() => setIsAddTaskOpen(true)}
        unreadInboxCount={unreadInboxCount}
        starredTasksCount={starredTasksCount}
        todayTasksCount={todayTasksCount}
      />

      {/* Main Container Layout */}
      <div className="flex-1 flex flex-col min-w-0 pt-16 lg:pt-0">
        
        {/* Sticky Header TopBar */}
        <TopBar
          profile={profile}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          inbox={inbox}
          onMarkAllAsRead={handleMarkAllAsRead}
        />

        {/* Dynamic Route Pages with transitions */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="h-full flex flex-col"
            >
              <Routes location={location}>
                <Route
                  path="/overview"
                  element={
                    <Overview
                      tasks={tasks}
                      meetings={meetings}
                      onToggleComplete={handleToggleComplete}
                      onToggleStar={handleToggleStar}
                      onCardClick={handleCardClick}
                      onOpenAddTask={() => setIsAddTaskOpen(true)}
                      searchQuery={searchQuery}
                    />
                  }
                />
                <Route
                  path="/inbox"
                  element={
                    <Inbox
                      inbox={inbox}
                      onToggleRead={handleToggleRead}
                      onDeleteMessage={handleDeleteMessage}
                      onMarkAllAsRead={handleMarkAllAsRead}
                      onInspectTask={handleCardClick}
                      onConvertMessageToTask={handleConvertMessageToTask}
                      searchQuery={searchQuery}
                    />
                  }
                />
                <Route
                  path="/today"
                  element={
                    <Today
                      tasks={tasks}
                      onToggleComplete={handleToggleComplete}
                      onToggleStar={handleToggleStar}
                      onCardClick={handleCardClick}
                      onOpenAddTask={() => setIsAddTaskOpen(true)}
                      searchQuery={searchQuery}
                    />
                  }
                />
                <Route
                  path="/upcoming"
                  element={
                    <Upcoming
                      tasks={tasks}
                      onToggleComplete={handleToggleComplete}
                      onToggleStar={handleToggleStar}
                      onCardClick={handleCardClick}
                      searchQuery={searchQuery}
                    />
                  }
                />
                <Route
                  path="/favorites"
                  element={
                    <Favorites
                      tasks={tasks}
                      onToggleComplete={handleToggleComplete}
                      onToggleStar={handleToggleStar}
                      onCardClick={handleCardClick}
                      onOpenAddTask={() => setIsAddTaskOpen(true)}
                      searchQuery={searchQuery}
                    />
                  }
                />
                <Route
                  path="/completed"
                  element={
                    <Completed
                      tasks={tasks}
                      onToggleComplete={handleToggleComplete}
                      onToggleStar={handleToggleStar}
                      onCardClick={handleCardClick}
                      searchQuery={searchQuery}
                    />
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <Settings
                      profile={profile}
                      onUpdateProfile={handleUpdateProfile}
                    />
                  }
                />
                <Route path="/help" element={<HelpCenter />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Interactive Add Task Modal Trigger */}
      <TaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAddTask={handleAddTask}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onToggleComplete={handleToggleComplete}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
