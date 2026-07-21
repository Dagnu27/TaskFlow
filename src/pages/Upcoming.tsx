import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Grid, 
  List as ListIcon,
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudLightning,
  Sparkles,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';
import { PriorityBadge } from '../components/Badges';

interface UpcomingProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onToggleStar: (id: string) => void;
  onCardClick: (id: string) => void;
  searchQuery: string;
}

interface DayColumn {
  name: string;
  dateStr: string; // YYYY-MM-DD
  displayDate: string; // "Jul 20"
  weatherIcon: React.ComponentType<any>;
  temp: string;
}

export default function Upcoming({ 
  tasks, 
  onToggleComplete, 
  onToggleStar,
  onCardClick,
  searchQuery 
}: UpcomingProps) {
  const [viewType, setViewType] = useState<'COLUMN' | 'LIST'>('COLUMN');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0 = current week, 1 = next week, etc.

  // Calendar dates mapping for the current business week (July 20 to July 24, 2026 as base)
  const columns: DayColumn[] = useMemo(() => {
    const baseDates = [
      { name: 'Monday', offsetDays: 0, weatherIcon: Sun, temp: '74°F' },
      { name: 'Tuesday', offsetDays: 1, weatherIcon: CloudSun, temp: '70°F' },
      { name: 'Wednesday', offsetDays: 2, weatherIcon: Cloud, temp: '66°F' },
      { name: 'Thursday', offsetDays: 3, weatherIcon: CloudRain, temp: '61°F' },
      { name: 'Friday', offsetDays: 4, weatherIcon: Sun, temp: '72°F' }
    ];

    return baseDates.map((d) => {
      // Calculate date
      const date = new Date('2026-07-20');
      date.setDate(date.getDate() + d.offsetDays + (currentWeekOffset * 7));
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      return {
        name: d.name,
        dateStr,
        displayDate,
        weatherIcon: d.weatherIcon,
        temp: d.temp
      };
    });
  }, [currentWeekOffset]);

  // Dynamic Date range text: e.g. "Jul 20 – Jul 24, 2026"
  const dateRangeLabel = useMemo(() => {
    if (columns.length === 0) return '';
    return `${columns[0].displayDate} – ${columns[columns.length - 1].displayDate}, 2026`;
  }, [columns]);

  // Tasks filtered for search
  const activeTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = !searchQuery.trim() || 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [tasks, searchQuery]);

  return (
    <div id="upcoming-page-wrapper" className="flex-1 w-full p-4 md:p-8 space-y-6">
      
      {/* Page Header with Timeline toggles */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-left">
        <div>
          <p className="text-xs font-mono text-violet-600 font-bold uppercase tracking-widest">Sprint Scheduler</p>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 mt-1">Upcoming Milestones</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Map resources and track sprint progress across multi-day timelines.</p>
        </div>

        {/* Column | List Segment Toggle Switch */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-center">
          <button
            onClick={() => setViewType('COLUMN')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none select-none cursor-pointer ${
              viewType === 'COLUMN' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
            id="timeline-column-toggle"
          >
            <Grid size={13} />
            Columns
          </button>
          
          <button
            onClick={() => setViewType('LIST')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none select-none cursor-pointer ${
              viewType === 'LIST' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
            id="timeline-list-toggle"
          >
            <ListIcon size={13} />
            List View
          </button>
        </div>
      </div>

      {/* Date Range Selector and Week Navigation */}
      <div className="flex items-center justify-between bg-white px-5 py-4 rounded-xl border border-slate-100 shadow-sm text-slate-700">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-violet-600 shrink-0" />
          <span className="font-display font-bold text-sm md:text-base">
            {dateRangeLabel}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentWeekOffset(prev => prev - 1)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none"
            title="Previous Week"
            id="prev-week-btn"
          >
            <ChevronLeft size={16} />
          </button>
          
          <button
            onClick={() => setCurrentWeekOffset(0)}
            className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold transition-colors focus:outline-none"
            title="Reset to current week"
            id="current-week-reset-btn"
          >
            Current Week
          </button>

          <button
            onClick={() => setCurrentWeekOffset(prev => prev + 1)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none"
            title="Next Week"
            id="next-week-btn"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Dynamic View Panel */}
      <AnimatePresence mode="wait">
        {viewType === 'COLUMN' ? (
          
          // COLUMN VIEW: HORIZONTALLY SWIPEABLE COLUMNS
          <motion.div
            key="column-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="flex overflow-x-auto snap-x gap-4 pb-4 md:grid md:grid-cols-5 md:overflow-x-visible md:gap-4 lg:gap-5 select-none"
            id="upcoming-columns-deck"
          >
            {columns.map((col) => {
              const dayTasks = activeTasks.filter(t => t.dueDate === col.dateStr);
              const WeatherIcon = col.weatherIcon;

              return (
                <div 
                  key={col.dateStr} 
                  className="min-w-[240px] flex-1 snap-center bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col p-4 text-left transition-all hover:border-violet-100 group/col"
                >
                  {/* Column Header: Day, Date, Weather */}
                  <div className="flex items-start justify-between border-b border-slate-50 pb-3 mb-3 shrink-0">
                    <div>
                      <h4 className="font-display font-bold text-slate-800 text-sm leading-tight group-hover/col:text-violet-600 transition-colors">
                        {col.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{col.displayDate}</p>
                    </div>

                    {/* Weather card */}
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold bg-slate-50 px-2 py-0.5 rounded-lg">
                      <WeatherIcon size={12} className="text-orange-400" />
                      <span>{col.temp}</span>
                    </div>
                  </div>

                  {/* Column stacked items */}
                  <div className="flex-1 space-y-2.5 min-h-[220px]" id={`col-stack-${col.dateStr}`}>
                    {dayTasks.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-300 text-[11px] font-medium border border-dashed border-slate-150 rounded-xl">
                        No scheduled items
                      </div>
                    ) : (
                      dayTasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => onCardClick && onCardClick(task.id)}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
                            task.completed 
                              ? 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-60' 
                              : task.priority === 'HIGH'
                                ? 'bg-rose-50/30 border-rose-100 hover:border-rose-200'
                                : task.priority === 'MEDIUM'
                                  ? 'bg-amber-50/30 border-amber-100 hover:border-amber-200'
                                  : 'bg-emerald-50/30 border-emerald-100 hover:border-emerald-200'
                          }`}
                          title="Click to view details"
                        >
                          <div className="flex items-center justify-between gap-1.5 mb-1.5">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              {task.category}
                            </span>
                            <PriorityBadge priority={task.priority} />
                          </div>

                          <p className={`text-xs font-semibold leading-tight line-clamp-2 ${
                            task.completed ? 'line-through' : 'text-slate-800'
                          }`}>
                            {task.title}
                          </p>
                          
                          {task.dueTime && (
                            <p className="text-[9px] text-slate-400 font-mono mt-1 flex items-center gap-0.5">
                              <span>⏱️</span> {task.dueTime}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          
          // LIST VIEW: CHRONOLOGICAL STACKS
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 max-w-4xl mx-auto text-left"
            id="upcoming-list-deck"
          >
            {columns.map((col) => {
              const dayTasks = activeTasks.filter(t => t.dueDate === col.dateStr);

              return (
                <div key={col.dateStr} className="space-y-2.5">
                  <h4 className="text-xs font-bold font-display uppercase tracking-widest text-slate-400 flex items-center gap-1 border-b border-slate-100 pb-1.5">
                    <span>📅</span> {col.name}, {col.displayDate}
                    <span className="ml-auto font-mono text-[10px] text-slate-400">({dayTasks.length} tasks)</span>
                  </h4>

                  <div className="space-y-2">
                    {dayTasks.length === 0 ? (
                      <p className="p-4 bg-slate-50/40 rounded-xl border border-slate-100 text-xs text-slate-400 text-center select-none">
                        Free calendar. No activities scheduled.
                      </p>
                    ) : (
                      dayTasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => onCardClick && onCardClick(task.id)}
                          className="bg-white p-4 rounded-xl border border-slate-100/80 shadow-sm flex items-center justify-between gap-4 cursor-pointer hover:border-slate-200 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); onToggleComplete(task.id); }}
                              className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center hover:border-violet-500 shrink-0 cursor-pointer"
                            >
                              {task.completed && <div className="w-2 h-2 rounded bg-violet-600" />}
                            </button>
                            <div>
                              <p className={`text-xs md:text-sm font-semibold text-slate-800 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                                {task.title}
                              </p>
                              <span className="text-[10px] text-violet-600 font-bold bg-violet-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                                {task.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <PriorityBadge priority={task.priority} />
                            {task.dueTime && <span className="text-[10px] font-mono text-slate-400">{task.dueTime}</span>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
