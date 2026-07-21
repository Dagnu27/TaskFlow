import React from 'react';
import { Calendar, Clock, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Task } from '../types';
import { PriorityBadge, StatusBadge } from './Badges';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onToggleStar?: (id: string) => void;
  onCardClick?: (id: string) => void;
  id?: string;
}

export default function TaskCard({ task, onToggleComplete, onToggleStar, onCardClick, id }: TaskCardProps) {
  const { id: taskId, title, description, priority, category, dueDate, dueTime, completed, starred, assignees } = task;

  // Format date helper: e.g. "July 20" or "Jul 20"
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <motion.div
      id={id || `task-card-${taskId}`}
      layoutId={`task-${taskId}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      whileHover={{ y: -2 }}
      onClick={() => onCardClick && onCardClick(taskId)}
      transition={{ duration: 0.2 }}
      className={`group relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-[20px] bg-white border border-slate-100 hover:border-slate-200 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer ${
        completed 
          ? 'opacity-70 bg-slate-50/50' 
          : priority === 'HIGH' 
            ? 'bg-gradient-to-r from-purple-50/40 to-orange-50/25 border-purple-100' 
            : ''
      }`}
    >
      {/* Accent left border glow for high priority or hovered items */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-[20px] transition-all duration-300 ${
        completed 
          ? 'bg-transparent' 
          : priority === 'HIGH' 
            ? 'bg-[#7C3AED] opacity-70' 
            : 'bg-transparent group-hover:bg-gradient-to-b group-hover:from-violet-500 group-hover:to-pink-500 group-hover:opacity-100'
      }`} />

      {/* Left section: Checkbox + Info */}
      <div className="flex items-start gap-4 flex-1 min-w-0 pl-1">
        {/* Custom Interactive Checkbox */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleComplete(taskId); }}
          className={`mt-0.5 shrink-0 relative flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-200 cursor-pointer ${
            completed 
              ? 'bg-[#EC4899] border-[#EC4899] text-white shadow-sm' 
              : 'border-slate-200 group-hover:border-[#EC4899] text-transparent hover:bg-slate-50'
          }`}
          id={`checkbox-btn-${taskId}`}
        >
          {completed ? (
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-3 h-3 text-white stroke-[4]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </motion.svg>
          ) : (
            <svg className="w-3 h-3 text-[#EC4899] opacity-0 group-hover:opacity-100 transition-opacity stroke-[4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
            </svg>
          )}
        </button>

        {/* Text Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-display font-bold text-slate-900 text-sm md:text-base leading-snug transition-all duration-300 ${
                completed ? 'line-through text-slate-400 font-medium' : 'text-slate-900'
              }`}
            >
              {title}
            </h3>
            
            {/* Star trigger */}
            {onToggleStar && (
              <button
                onClick={(e) => { e.stopPropagation(); onToggleStar(taskId); }}
                className="text-slate-300 hover:text-amber-400 transition-colors focus:outline-none"
                title={starred ? 'Unstar task' : 'Star task'}
                id={`star-btn-${taskId}`}
              >
                <Star
                  size={15}
                  className={`transition-transform duration-200 hover:scale-125 ${
                    starred ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                  }`}
                />
              </button>
            )}
          </div>

          {description && !completed && (
            <p className="mt-1 text-slate-400 text-xs md:text-sm line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
          
          {/* Metadata tags */}
          <div className="flex items-center gap-2 mt-2 flex-wrap text-xs text-slate-400">
            <span className="font-medium text-violet-600 bg-violet-50/50 px-2 py-0.5 rounded text-[11px]">
              {category}
            </span>
            
            {dueDate && (
              <span className="flex items-center gap-1">
                <Calendar size={12} className="shrink-0" />
                {formatDate(dueDate)}
              </span>
            )}
            
            {dueTime && (
              <span className="flex items-center gap-1">
                <Clock size={12} className="shrink-0" />
                {dueTime}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right section: Badges + Assignees */}
      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t border-slate-50 md:border-t-0 pl-1 md:pl-0">
        <div className="flex items-center gap-3">
          {completed ? (
            <StatusBadge id={`status-badge-${taskId}`} />
          ) : (
            <PriorityBadge priority={priority} id={`priority-badge-${taskId}`} />
          )}
        </div>

        {/* Stacked Avatar Group */}
        {assignees && assignees.length > 0 && (
          <div className="flex items-center select-none" id={`avatars-${taskId}`}>
            <div className="flex -space-x-2 overflow-hidden">
              {assignees.map((assignee, idx) => (
                <img
                  key={idx}
                  src={assignee.avatar}
                  alt={assignee.name}
                  title={assignee.name}
                  className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm hover:scale-110 hover:z-30 transition-transform cursor-pointer"
                  style={{ zIndex: assignees.length - idx }}
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
