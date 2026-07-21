import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  ArrowUpDown, 
  Plus, 
  Sparkles, 
  Video, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  ArrowRight,
  ChevronDown,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, SyncMeeting } from '../types';
import ProgressRing from '../components/ProgressRing';
import TaskCard from '../components/TaskCard';

interface OverviewProps {
  tasks: Task[];
  meetings: SyncMeeting[];
  onToggleComplete: (id: string) => void;
  onToggleStar: (id: string) => void;
  onCardClick: (id: string) => void;
  onOpenAddTask: () => void;
  searchQuery: string;
}

export default function Overview({ 
  tasks, 
  meetings, 
  onToggleComplete, 
  onToggleStar, 
  onCardClick,
  onOpenAddTask,
  searchQuery 
}: OverviewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'NONE' | 'HIGH_LOW' | 'LOW_HIGH'>('NONE');
  
  // State toggles for dropdown selectors
  const [showCatMenu, setShowCatMenu] = useState(false);
  const [showPriMenu, setShowPriMenu] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Dynamic calculations for Project Progress
  const launchTasks = useMemo(() => tasks.filter(t => t.category === 'Product Launch'), [tasks]);
  const completedLaunchTasksCount = useMemo(() => launchTasks.filter(t => t.completed).length, [launchTasks]);
  const launchProgressPercentage = useMemo(() => {
    if (launchTasks.length === 0) return 65; // fall back to spec default
    return Math.round((completedLaunchTasksCount / launchTasks.length) * 100);
  }, [launchTasks, completedLaunchTasksCount]);

  // Daily focus goal progress calculation (all tasks due today July 20, 2026)
  const todayTasks = useMemo(() => tasks.filter(t => t.dueDate === '2026-07-20'), [tasks]);
  const completedTodayTasksCount = useMemo(() => todayTasks.filter(t => t.completed).length, [todayTasks]);
  const todayProgressPercentage = useMemo(() => {
    if (todayTasks.length === 0) return 75; // fall back to default
    return Math.round((completedTodayTasksCount / todayTasks.length) * 100);
  }, [todayTasks, completedTodayTasksCount]);

  // Find primary focus highlighted task: high priority, uncompleted, starred, or just the first high priority
  const primaryTask = useMemo(() => {
    const highUncompleted = tasks.find(t => t.priority === 'HIGH' && !t.completed);
    if (highUncompleted) return highUncompleted;
    return tasks.find(t => t.priority === 'HIGH') || tasks[0];
  }, [tasks]);

  // Filter & Sort core task list
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 1. Category Filter
      const matchesCat = selectedCategory === 'All' || task.category === selectedCategory;
      // 2. Priority Filter
      const matchesPri = priorityFilter === 'All' || task.priority === priorityFilter;
      // 3. Search query filter (matches title or category or description)
      const matchesSearch = !searchQuery.trim() || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description || '').toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesPri && matchesSearch && !task.completed; // only show uncompleted in main list
    }).sort((a, b) => {
      if (sortBy === 'HIGH_LOW') {
        const score = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return score[b.priority] - score[a.priority];
      }
      if (sortBy === 'LOW_HIGH') {
        const score = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return score[a.priority] - score[b.priority];
      }
      return 0; // retain default order
    });
  }, [tasks, selectedCategory, priorityFilter, sortBy, searchQuery]);

  // Categories present in tasks for filter list
  const categories = useMemo(() => {
    const list = new Set(tasks.map(t => t.category));
    return ['All', ...Array.from(list)];
  }, [tasks]);

  return (
    <div id="overview-page-wrapper" className="flex-1 w-full p-4 md:p-8 space-y-6">
      
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="text-left">
          <p className="text-xs font-mono text-violet-600 font-bold uppercase tracking-widest">Active Workspace</p>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 mt-1">Product Launch Project</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Coordination deck, QA pipelines, and deployment milestones.</p>
        </div>
        
        {/* Progress Ring with context */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-semibold text-slate-700 block">Launch Milestones</span>
            <span className="text-[10px] text-slate-400 block">{completedLaunchTasksCount} of {launchTasks.length} objectives complete</span>
          </div>
          <ProgressRing percentage={launchProgressPercentage} size={56} strokeWidth={5} id="launch-progress-ring" />
        </div>
      </div>

      {/* Grid: Main Column (70%) & Right Sidebar (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Tasks Board */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 2. Controls Row (Filter, Sort dropdowns) */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-400 mr-1">Controls:</span>
              
              {/* Category filter pill dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setShowCatMenu(!showCatMenu); setShowPriMenu(false); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-800 hover:border-slate-300 transition-all focus:outline-none"
                  id="filter-category-pill"
                >
                  <Filter size={12} className="text-slate-400" />
                  Category: <span className="text-violet-600 font-semibold">{selectedCategory}</span>
                  <ChevronDown size={12} className="text-slate-400" />
                </button>
                
                <AnimatePresence>
                  {showCatMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowCatMenu(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 z-20"
                      >
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setShowCatMenu(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-xs transition-colors hover:bg-slate-50 ${
                              selectedCategory === cat ? 'text-violet-600 font-semibold bg-violet-50/50' : 'text-slate-600'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Priority filter pill */}
              <div className="relative">
                <button
                  onClick={() => { setShowPriMenu(!showPriMenu); setShowCatMenu(false); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-800 hover:border-slate-300 transition-all focus:outline-none"
                  id="filter-priority-pill"
                >
                  <ArrowUpDown size={12} className="text-slate-400" />
                  Priority: <span className="text-violet-600 font-semibold">{priorityFilter}</span>
                  <ChevronDown size={12} className="text-slate-400" />
                </button>

                <AnimatePresence>
                  {showPriMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowPriMenu(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute left-0 mt-1.5 w-40 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 z-20"
                      >
                        {['All', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
                          <button
                            key={p}
                            onClick={() => {
                              setPriorityFilter(p);
                              setShowPriMenu(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-xs transition-colors hover:bg-slate-50 ${
                              priorityFilter === p ? 'text-violet-600 font-semibold bg-violet-50/50' : 'text-slate-600'
                            }`}
                          >
                            {p === 'All' ? 'All Priorities' : p}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Quick toggle sorting */}
            <button
              onClick={() => {
                setSortBy(prev => {
                  if (prev === 'NONE') return 'HIGH_LOW';
                  if (prev === 'HIGH_LOW') return 'LOW_HIGH';
                  return 'NONE';
                });
              }}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-xs font-medium text-slate-600 transition-all flex items-center gap-1 focus:outline-none select-none cursor-pointer"
              id="sort-priority-toggle"
            >
              <ArrowUpDown size={12} />
              Sort Priority: {sortBy === 'NONE' ? 'Default' : sortBy === 'HIGH_LOW' ? 'High → Low' : 'Low → High'}
            </button>
          </div>

          {/* 3. Primary Highlighted Task Row */}
          {primaryTask && (
            <div 
              onClick={() => onCardClick && onCardClick(primaryTask.id)}
              className="relative p-6 rounded-2xl bg-[#fff5f0] border border-orange-100 hover:border-orange-200 hover:shadow-md transition-all group overflow-hidden cursor-pointer"
              id="primary-focus-banner-card"
            >
              {/* Light glow pattern */}
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-orange-100/40 to-transparent pointer-events-none" />
              
              <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap relative z-10">
                <div className="text-left">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold text-orange-600 bg-orange-100/60 uppercase tracking-widest mb-3">
                    ⭐️ PRIMARY FOCUS GOAL
                  </span>
                  
                  <h2 className="font-display font-bold text-lg text-slate-900 leading-tight">
                    {primaryTask.title}
                  </h2>
                  <p className="text-slate-500 text-xs md:text-sm mt-1.5 max-w-xl">
                    {primaryTask.description || "No description provided. Click checkbox in the task deck below to complete."}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-4 text-xs text-slate-500">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-rose-100 text-rose-700 border border-rose-200">
                      HIGH PRIORITY
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                      {primaryTask.category}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Calendar size={12} />
                      Due today: {primaryTask.dueTime || '11:00 AM'}
                    </span>
                  </div>
                </div>

                {/* Overlapping team assignees */}
                {primaryTask.assignees && primaryTask.assignees.length > 0 && (
                  <div className="flex flex-col items-end shrink-0 gap-1.5 self-end sm:self-start">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">Delegates</p>
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {primaryTask.assignees.map((a, idx) => (
                        <img
                          key={idx}
                          src={a.avatar}
                          alt={a.name}
                          title={a.name}
                          className="w-7 h-7 rounded-full border-2 border-white object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. Today's Tasks List Below */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-slate-800 flex items-center gap-2">
                Today's Backlog
                <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-bold">
                  {filteredTasks.length} Tasks
                </span>
              </h3>
              <button
                onClick={onOpenAddTask}
                className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1"
                id="add-task-text-trigger"
              >
                <Plus size={14} className="stroke-[3]" /> Add Task
              </button>
            </div>

            {/* List Containers with transitions */}
            <div className="space-y-2.5 min-h-[120px]" id="today-tasks-container-list">
              <AnimatePresence mode="popLayout">
                {filteredTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-10 border border-dashed border-slate-200 rounded-2xl bg-white text-center text-slate-400 flex flex-col items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={32} className="text-emerald-500 stroke-[1.5]" />
                    <div>
                      <p className="font-semibold text-xs text-slate-700">All caught up!</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">No tasks match your selected filters in active backlog.</p>
                    </div>
                  </motion.div>
                ) : (
                  filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={onToggleComplete}
                      onToggleStar={onToggleStar}
                      onCardClick={onCardClick}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column: Widgets Board */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* A. Daily Focus Goal Widget */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-left" id="daily-focus-goal-widget">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display font-bold text-sm text-slate-800">Daily Focus Goal</h4>
              <TrendingUp size={16} className="text-orange-500" />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Unlock a productivity multiplier by finishing all priority items scheduled for today.
            </p>

            {/* Dynamic visual indicator */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">Completion rate</span>
                <span className="text-violet-600 font-bold">{todayProgressPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${todayProgressPercentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded-xl bg-violet-50/40 text-left text-[11px] text-violet-700 font-medium">
              🎉 {todayProgressPercentage >= 100 
                ? "Perfect streak achieved! You have cleaned today's focus queue!" 
                : `${completedTodayTasksCount} of ${todayTasks.length} items verified. Keep pushing!`}
            </div>
          </div>

          {/* B. Upcoming Syncs Widget */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-left" id="upcoming-syncs-widget">
            <h4 className="font-display font-bold text-sm text-slate-800 mb-4">Upcoming Team Syncs</h4>
            
            <div className="space-y-3.5">
              {meetings.map((meet) => (
                <div key={meet.id} className="group/sync flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5">
                    {/* Call Icon block */}
                    <div className="w-8 h-8 rounded-xl bg-orange-50 group-hover/sync:bg-orange-100 flex items-center justify-center text-orange-500 shrink-0 transition-colors">
                      <Video size={14} />
                    </div>
                    
                    <div className="text-left min-w-0">
                      <p className="text-xs font-bold text-slate-800 leading-none group-hover/sync:text-violet-600 transition-colors truncate">
                        {meet.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                        <span>{meet.time}</span>
                        <span>•</span>
                        <span>{meet.type}</span>
                      </p>
                    </div>
                  </div>

                  {/* Intersecting avatar bubble */}
                  <div className="flex -space-x-1 hover:space-x-0.5 transition-all shrink-0 select-none">
                    {meet.attendees.slice(0, 3).map((att, idx) => (
                      <img
                        key={idx}
                        src={att.avatar}
                        alt={att.name}
                        title={att.name}
                        className="w-5 h-5 rounded-full border-2 border-white object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="w-full mt-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-xl border border-slate-200/40 transition-colors focus:outline-none flex items-center justify-center gap-1 cursor-pointer"
              onClick={() => triggerToast("Redirecting to team video console...")}
            >
              Open Video Console
            </button>
          </div>

          {/* C. Promo Banner Card */}
          <div 
            className="p-5 rounded-2xl text-white text-left relative overflow-hidden bg-gradient-to-br from-violet-700 via-pink-600 to-orange-500 shadow-md hover:shadow-lg transition-all cursor-pointer"
            id="ai-assisted-promo-card"
            onClick={() => triggerToast("TaskAI Agent will be deployed in your next project sprint!")}
          >
            {/* Ambient pattern */}
            <div className="absolute right-0 bottom-0 top-0 w-24 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={14} className="text-amber-300" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-amber-200">AI PROACTIVE AGENT</span>
            </div>
            
            <h4 className="font-display font-bold text-sm leading-tight text-white max-w-xs">
              Automate your workflow with AI-Assisted Tasks
            </h4>
            
            <p className="text-[11px] text-white/80 leading-relaxed mt-1.5">
              Let our Antigravity agent organize, pre-schedule, and delegate high-priority sprints.
            </p>
            
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-200 hover:text-white mt-4 transition-colors">
              Explore TaskAI <ArrowRight size={12} />
            </span>
          </div>

        </div>
      </div>

      {/* Floating Action Button (FAB) Bottom Right */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onOpenAddTask}
        className="fixed bottom-6 right-6 z-30 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 shadow-xl text-white cursor-pointer focus:outline-none"
        title="Add New Task"
        id="floating-action-button-add"
      >
        <Plus size={24} strokeWidth={3} />
      </motion.button>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-6 z-50 p-4 rounded-xl bg-slate-900 text-white shadow-2xl flex items-center gap-3 border border-slate-800 max-w-sm text-left"
            id="overview-toast"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
              <Check size={12} className="stroke-[3]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-300 font-display">System Notification</p>
              <p className="text-[11px] text-slate-200 mt-0.5">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
