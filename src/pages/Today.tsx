import React, { useMemo } from 'react';
import { Sun, Coffee, Sunrise, Sunset, Plus, Calendar, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';
import ProgressRing from '../components/ProgressRing';
import TaskCard from '../components/TaskCard';

interface TodayProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onToggleStar: (id: string) => void;
  onCardClick: (id: string) => void;
  onOpenAddTask: () => void;
  searchQuery: string;
}

export default function Today({ 
  tasks, 
  onToggleComplete, 
  onToggleStar, 
  onCardClick,
  onOpenAddTask,
  searchQuery 
}: TodayProps) {
  
  // Format current date display: "Monday, July 20, 2026"
  const formattedDate = useMemo(() => {
    return new Date('2026-07-20').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  // Filter today's tasks (due on 2026-07-20)
  const todayTasks = useMemo(() => {
    return tasks.filter(task => {
      const isToday = task.dueDate === '2026-07-20';
      const matchesSearch = !searchQuery.trim() ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase());
      return isToday && matchesSearch;
    });
  }, [tasks, searchQuery]);

  // Calculate dynamic completion rate
  const completionPercentage = useMemo(() => {
    const total = todayTasks.length;
    if (total === 0) return 75; // spec placeholder default
    const completed = todayTasks.filter(t => t.completed).length;
    return Math.round((completed / total) * 100);
  }, [todayTasks]);

  // Segment tasks by morning, afternoon, evening
  const morningTasks = useMemo(() => {
    return todayTasks.filter(t => {
      if (!t.dueTime) return false;
      return t.dueTime.toLowerCase().includes('am') || t.dueTime.startsWith('10:') || t.dueTime.startsWith('11:');
    });
  }, [todayTasks]);

  const afternoonTasks = useMemo(() => {
    return todayTasks.filter(t => {
      if (!t.dueTime) return true; // default placement
      const timeLower = t.dueTime.toLowerCase();
      return timeLower.includes('pm') && !timeLower.startsWith('05:') && !timeLower.startsWith('5:') && !timeLower.startsWith('06:') && !timeLower.startsWith('6:') && !timeLower.startsWith('07:') && !timeLower.startsWith('7:');
    });
  }, [todayTasks]);

  const eveningTasks = useMemo(() => {
    return todayTasks.filter(t => {
      if (!t.dueTime) return false;
      const timeLower = t.dueTime.toLowerCase();
      return timeLower.includes('pm') && (timeLower.startsWith('05:') || timeLower.startsWith('5:') || timeLower.startsWith('06:') || timeLower.startsWith('6:') || timeLower.startsWith('07:') || timeLower.startsWith('7:') || timeLower.startsWith('08:') || timeLower.startsWith('8:'));
    });
  }, [todayTasks]);

  // Daily focus task banner: first active high priority task
  const focusTask = useMemo(() => {
    return todayTasks.find(t => t.priority === 'HIGH' && !t.completed) || todayTasks[0];
  }, [todayTasks]);

  return (
    <div id="today-page-wrapper" className="flex-1 w-full p-4 md:p-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-left">
        <div>
          <p className="text-xs font-mono text-violet-600 font-bold uppercase tracking-widest flex items-center gap-1">
            <Sun size={12} className="text-amber-500 fill-amber-300" />
            Workspace Journal
          </p>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 mt-1">Today's Agenda</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">{formattedDate}</p>
        </div>

        {/* Dynamic completion progress ring */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-semibold text-slate-700 block">Daily Progress</span>
            <span className="text-[10px] text-slate-400 block">
              {todayTasks.filter(t => t.completed).length} of {todayTasks.length} tasks completed
            </span>
          </div>
          <ProgressRing percentage={completionPercentage} size={56} strokeWidth={5} id="today-completion-ring" />
        </div>
      </div>

      {/* Daily Focus highlighted banner card */}
      {focusTask && (
        <div 
          onClick={() => onCardClick && onCardClick(focusTask.id)}
          className="relative p-6 rounded-2xl bg-gradient-to-r from-violet-50 via-[#fff5f0] to-orange-50 border border-violet-100 shadow-sm text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:border-violet-200 transition-all"
          id="today-daily-focus-banner"
        >
          <div className="space-y-1.5 flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-violet-700 bg-violet-100/60 uppercase tracking-widest">
              ⚡️ Key Focus Goal
            </span>
            <h2 className="font-display font-bold text-lg text-slate-900 truncate">
              {focusTask.title}
            </h2>
            <p className="text-slate-500 text-xs md:text-sm">
              {focusTask.description || "Mark this milestone completed in your schedule layout below when ready."}
            </p>
          </div>
          
          <button
            onClick={(e) => { e.stopPropagation(); onToggleComplete(focusTask.id); }}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-500 text-white text-xs font-bold rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all select-none focus:outline-none shrink-0 cursor-pointer"
            id={`complete-focus-task-btn-${focusTask.id}`}
          >
            {focusTask.completed ? 'Reopen Focus Task' : 'Complete Focus Goal'}
          </button>
        </div>
      )}

      {/* Schedule Segments Layout: Morning, Afternoon, Evening */}
      <div className="space-y-8 max-w-4xl mx-auto text-left">
        
        {/* 1. Morning section */}
        <div className="space-y-3" id="morning-tasks-segment">
          <h3 className="text-sm font-bold font-display uppercase tracking-widest text-slate-400 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sunrise size={16} className="text-amber-500" /> Morning Block (08:00 AM - 12:00 PM)
            <span className="ml-auto text-xs font-semibold text-slate-400 font-mono">({morningTasks.length})</span>
          </h3>
          <div className="space-y-2.5">
            <AnimatePresence mode="popLayout">
              {morningTasks.length === 0 ? (
                <div className="p-5 text-center text-slate-400 text-xs bg-slate-50/50 border border-dashed border-slate-200 rounded-xl select-none">
                  No tasks scheduled for the morning bloc.
                </div>
              ) : (
                morningTasks.map((task) => (
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

        {/* 2. Afternoon section */}
        <div className="space-y-3" id="afternoon-tasks-segment">
          <h3 className="text-sm font-bold font-display uppercase tracking-widest text-slate-400 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Coffee size={16} className="text-violet-500" /> Afternoon Block (12:00 PM - 05:00 PM)
            <span className="ml-auto text-xs font-semibold text-slate-400 font-mono">({afternoonTasks.length})</span>
          </h3>
          <div className="space-y-2.5">
            <AnimatePresence mode="popLayout">
              {afternoonTasks.length === 0 ? (
                <div className="p-5 text-center text-slate-400 text-xs bg-slate-50/50 border border-dashed border-slate-200 rounded-xl select-none">
                  No tasks scheduled for the afternoon bloc.
                </div>
              ) : (
                afternoonTasks.map((task) => (
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

        {/* 3. Evening section */}
        <div className="space-y-3" id="evening-tasks-segment">
          <h3 className="text-sm font-bold font-display uppercase tracking-widest text-slate-400 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sunset size={16} className="text-orange-500" /> Evening Block (05:00 PM onwards)
            <span className="ml-auto text-xs font-semibold text-slate-400 font-mono">({eveningTasks.length})</span>
          </h3>
          <div className="space-y-2.5">
            <AnimatePresence mode="popLayout">
              {eveningTasks.length === 0 ? (
                <div className="p-5 text-center text-slate-400 text-xs bg-slate-50/50 border border-dashed border-slate-200 rounded-xl select-none">
                  No tasks scheduled for the evening bloc.
                </div>
              ) : (
                eveningTasks.map((task) => (
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

      {/* Floating Add Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onOpenAddTask}
        className="fixed bottom-6 right-6 z-30 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 shadow-xl text-white cursor-pointer focus:outline-none"
        title="Quick add task"
        id="today-quick-add-btn"
      >
        <Plus size={24} strokeWidth={3} />
      </motion.button>

    </div>
  );
}
