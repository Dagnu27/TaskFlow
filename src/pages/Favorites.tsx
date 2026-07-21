import React, { useMemo } from 'react';
import { Star, Bookmark, Sparkles, CheckSquare, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';
import TaskCard from '../components/TaskCard';

interface FavoritesProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onToggleStar: (id: string) => void;
  onCardClick: (id: string) => void;
  onOpenAddTask: () => void;
  searchQuery: string;
}

export default function Favorites({ 
  tasks, 
  onToggleComplete, 
  onToggleStar, 
  onCardClick,
  onOpenAddTask,
  searchQuery 
}: FavoritesProps) {

  // Filter tasks to only include starred/favorites, and filter by search query
  const favoriteTasks = useMemo(() => {
    return tasks.filter(task => {
      const isStarred = task.starred;
      const matchesSearch = !searchQuery.trim() ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase());
      return isStarred && matchesSearch;
    });
  }, [tasks, searchQuery]);

  return (
    <div id="favorites-page-wrapper" className="flex-1 w-full p-4 md:p-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-left">
        <div>
          <p className="text-xs font-mono text-violet-600 font-bold uppercase tracking-widest flex items-center gap-1">
            <Star size={12} className="text-amber-500 fill-amber-300" />
            Workspace Shortcuts
          </p>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 mt-1">Favorites & Starred</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Pinned activities, focus objectives, and high-priority reference tasks.
          </p>
        </div>

        {favoriteTasks.length > 0 && (
          <span className="px-3.5 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl border border-amber-100 flex items-center gap-1">
            ★ {favoriteTasks.length} STARRED ITEMS
          </span>
        )}
      </div>

      {/* Grid: Main Column (75%) & Information Card (25%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main List Column */}
        <div className="lg:col-span-8 space-y-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-slate-500 uppercase tracking-widest">
              Pinned Queue ({favoriteTasks.length})
            </h3>
          </div>

          <div className="space-y-3 min-h-[220px]" id="favorites-tasks-container-list">
            <AnimatePresence mode="popLayout">
              {favoriteTasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-12 border border-dashed border-slate-200 rounded-2xl bg-white text-center text-slate-400 flex flex-col items-center justify-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-amber-500">
                    <Star size={22} className="fill-amber-400 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-slate-700">No favorite tasks yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs mx-auto">
                      Star tasks across Overview, Today, or Upcoming sections to pin them to this priority workspace dashboard!
                    </p>
                  </div>
                </motion.div>
              ) : (
                favoriteTasks.map((task) => (
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

        {/* Informative Side Panel Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-left" id="favorites-insight-card">
            <div className="flex items-center gap-1.5 mb-3 text-violet-600 font-bold">
              <Sparkles size={16} />
              <h4 className="font-display text-sm">Priority Focus Index</h4>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              TaskFlow bookmarks help you segment crucial sprints. Items pinned on this dashboard bypass active date schedules to remain visible until marked complete.
            </p>

            <div className="border-t border-slate-100 my-4" />

            <div className="space-y-3">
              <div className="flex gap-2.5 items-start text-xs text-slate-600">
                <CheckSquare size={14} className="text-violet-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Avoid backlog noise</strong>: Reserve stars for items requiring direct review or delegation this week.
                </span>
              </div>
              <div className="flex gap-2.5 items-start text-xs text-slate-600">
                <Bookmark size={14} className="text-violet-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Global access</strong>: Starred items synchronize live to your top bar and mobile slide-out drawer panels.
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
