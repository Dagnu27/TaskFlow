import React, { useMemo } from 'react';
import { Trophy, CheckCircle2, Award, Calendar, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';
import TaskCard from '../components/TaskCard';

interface CompletedProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onToggleStar: (id: string) => void;
  onCardClick: (id: string) => void;
  searchQuery: string;
}

export default function Completed({ 
  tasks, 
  onToggleComplete, 
  onToggleStar,
  onCardClick,
  searchQuery 
}: CompletedProps) {

  // Filter completed tasks
  const completedTasks = useMemo(() => {
    return tasks.filter(task => {
      const isCompleted = task.completed;
      const matchesSearch = !searchQuery.trim() ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase());
      return isCompleted && matchesSearch;
    });
  }, [tasks, searchQuery]);

  // Group completed tasks by day: Today (Jul 20), Yesterday (Jul 19), Earlier
  const groupedTasks = useMemo(() => {
    const groups: { [key: string]: Task[] } = {
      'Today': [],
      'Yesterday': [],
      'Earlier': []
    };

    completedTasks.forEach(task => {
      // If task has completedAt we can check, or fallback to dueDate if completed
      const dateStr = task.completedAt ? task.completedAt.split('T')[0] : task.dueDate;
      
      if (dateStr === '2026-07-20') {
        groups['Today'].push(task);
      } else if (dateStr === '2026-07-19') {
        groups['Yesterday'].push(task);
      } else {
        groups['Earlier'].push(task);
      }
    });

    return groups;
  }, [completedTasks]);

  const weeklyCount = completedTasks.length;

  return (
    <div id="completed-page-wrapper" className="flex-1 w-full p-4 md:p-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-left">
        <div>
          <p className="text-xs font-mono text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-1">
            <CheckCircle2 size={12} />
            Archive Registry
          </p>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 mt-1">Completed History</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Audit log of resolved objectives, tasks, and team deliverables.</p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100">
          <Award size={14} />
          <span>{completedTasks.length} OBJECTIVES CLEARED</span>
        </div>
      </div>

      {/* Grid Layout: Tasks (70%) & Insights Card (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Grouped Completed Tasks */}
        <div className="lg:col-span-8 space-y-7 text-left">
          {completedTasks.length === 0 ? (
            <div className="p-12 border border-dashed border-slate-200 rounded-2xl bg-white text-center text-slate-400 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                <CheckCircle2 size={24} className="text-slate-300" />
              </div>
              <div>
                <p className="font-semibold text-xs text-slate-700">No completed tasks recorded</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Your resolved items history is empty. Time to complete some actions!</p>
              </div>
            </div>
          ) : (
            (Object.keys(groupedTasks) as string[]).map((groupName) => {
              const groupList = groupedTasks[groupName as keyof typeof groupedTasks];
              if (groupList.length === 0) return null;

              return (
                <div key={groupName} className="space-y-3" id={`completed-group-${groupName.toLowerCase()}`}>
                  <h3 className="text-xs font-bold font-display uppercase tracking-widest text-slate-400 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                    <Calendar size={12} className="text-slate-400" />
                    {groupName} Log
                    <span className="ml-auto font-mono text-[10px] text-slate-400 font-semibold">({groupList.length} items)</span>
                  </h3>

                  <div className="space-y-2.5">
                    <AnimatePresence mode="popLayout">
                      {groupList.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggleComplete={onToggleComplete}
                          onToggleStar={onToggleStar}
                          onCardClick={onCardClick}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Weekly Insights Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-left" id="completed-insights-widget">
            {/* Visual Trophy Illustration */}
            <div className="flex flex-col items-center justify-center text-center p-4 bg-gradient-to-br from-violet-50/50 via-[#fff5f0] to-orange-50 rounded-xl border border-slate-100 mb-4 select-none">
              <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 mb-3 shadow-sm animate-bounce">
                <Trophy size={28} className="stroke-[1.8]" />
              </div>
              <h4 className="font-display font-bold text-sm text-slate-800">Weekly Achievement</h4>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                "Outstanding execution! Your team is running 12% faster than last sprint cycle."
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <span className="text-xs font-medium text-slate-400">Total Cleared:</span>
                <span className="text-sm font-bold text-violet-600 font-mono">{weeklyCount} tasks</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <span className="text-xs font-medium text-slate-400">Weekly Efficiency:</span>
                <span className="text-sm font-bold text-emerald-500 font-mono">92%</span>
              </div>
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-medium text-slate-400">Streak:</span>
                <span className="text-sm font-bold text-orange-500 font-mono">5 Days</span>
              </div>
            </div>

            <div className="border-t border-slate-100 my-4" />

            <div className="p-3 bg-emerald-50 text-emerald-800 text-[11px] font-semibold rounded-xl flex items-start gap-1.5 leading-normal">
              <Sparkles size={14} className="shrink-0 text-emerald-600 mt-0.5" />
              <span>Great job! High-velocity completion boosts overall project clarity. Let’s clean the remaining queues!</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
