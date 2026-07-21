import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Tag, Flag, Users, Trash2, Check, AlertTriangle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, Assignee } from '../types';
import { USERS } from '../data';

interface TaskDetailModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onUpdateTask: (updated: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  id?: string;
}

export default function TaskDetailModal({
  isOpen,
  task,
  onClose,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete,
  id = "task-detail-modal"
}: TaskDetailModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  // Validation states
  const [titleError, setTitleError] = useState('');
  
  // UX Interaction states
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync state with selected task
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setCategory(task.category);
      setDueDate(task.dueDate);
      setDueTime(task.dueTime || '');
      setCompleted(task.completed);
      
      // Determine selected assignees keys
      const keys = Object.entries(USERS)
        .filter(([_, user]) => task.assignees.some(a => a.name === user.name))
        .map(([key]) => key);
      setSelectedAssignees(keys);
      
      // Reset interaction states
      setTitleError('');
      setIsSaving(false);
      setShowDeleteConfirm(false);
    }
  }, [task]);

  if (!task) return null;

  const handleToggleAssignee = (key: string) => {
    setSelectedAssignees(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleToggleCompleted = () => {
    setCompleted(!completed);
  };

  const handleDelete = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    
    setIsSaving(true);
    setTimeout(() => {
      onDeleteTask(task.id);
      setIsSaving(false);
      onClose();
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Custom validation
    if (!title.trim()) {
      setTitleError('Task title is required.');
      return;
    }
    setTitleError('');

    setIsSaving(true);
    
    // Simulate high speed saving process
    setTimeout(() => {
      const updatedAssigneesList = selectedAssignees
        .map(key => USERS[key as keyof typeof USERS])
        .filter(Boolean);

      const updatedTask: Task = {
        ...task,
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        dueDate,
        dueTime: dueTime.trim(),
        completed,
        completedAt: completed ? (task.completedAt || new Date().toISOString()) : undefined,
        assignees: updatedAssigneesList,
      };

      onUpdateTask(updatedTask);
      setIsSaving(false);
      onClose();
    }, 500);
  };

  const categories = ['Product Launch', 'Marketing', 'Security', 'Engineering', 'QA', 'Design', 'Culture'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div id={id} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 z-10 text-left"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center text-violet-600">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base text-slate-800">Task Information Desk</h2>
                  <p className="text-[11px] text-slate-400">Review, update deliverables, or modify team delegation</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Task Title with Error Boundary */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (e.target.value.trim()) setTitleError('');
                  }}
                  className={`w-full px-3.5 py-2 border rounded-xl text-sm focus:outline-none transition-all placeholder:text-slate-400 ${
                    titleError 
                      ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-500/10' 
                      : 'border-slate-200 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500'
                  }`}
                  placeholder="Task title is required"
                />
                {titleError && (
                  <p className="text-rose-500 text-[11px] font-semibold mt-1.5 flex items-center gap-1">
                    <AlertTriangle size={11} /> {titleError}
                  </p>
                )}
              </div>

              {/* Task Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Task Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe deliverables and acceptance criteria..."
                  rows={3}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* Status Toggle switch */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-700">Completion Status</p>
                  <p className="text-[11px] text-slate-400">Mark task as complete or return to the active sprints</p>
                </div>
                
                <button
                  type="button"
                  onClick={handleToggleCompleted}
                  className={`relative inline-flex h-6.5 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    completed ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      completed ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Dual Column: Category & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Tag size={12} /> Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Flag size={12} /> Priority
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['LOW', 'MEDIUM', 'HIGH'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                          priority === p
                            ? p === 'HIGH'
                              ? 'bg-rose-50 border-rose-200 text-rose-600 ring-2 ring-rose-500/10'
                              : p === 'MEDIUM'
                              ? 'bg-amber-50 border-amber-200 text-amber-600 ring-2 ring-amber-500/10'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-600 ring-2 ring-emerald-500/10'
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dual Column: Due Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Calendar size={12} /> Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Clock size={12} /> Due Time
                  </label>
                  <input
                    type="text"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    placeholder="e.g., 10:00 AM"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Team Assignees Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Users size={12} /> Team Members Delegated
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(USERS).map(([key, user]) => {
                    const isSelected = selectedAssignees.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleToggleAssignee(key)}
                        className={`flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-violet-50/50 border-violet-200 text-violet-700 ring-1 ring-violet-500/10'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs font-medium truncate">{user.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer Buttons Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-slate-100">
                
                {/* Trash Delete section with confirm lock safety */}
                <div>
                  {showDeleteConfirm ? (
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={handleDelete}
                      className="w-full sm:w-auto px-4 py-2 border border-rose-200 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <AlertTriangle size={13} /> Confirm Delete?
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full sm:w-auto px-4 py-2 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                    >
                      <Trash2 size={13} /> Delete Task
                    </button>
                  )}
                </div>

                {/* Cancel & Save triggers */}
                <div className="flex items-center justify-end gap-3.5">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={onClose}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 hover:brightness-110 active:scale-95 shadow-md hover:shadow-lg transition-all flex items-center gap-1 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={14} className="stroke-[3]" />
                        Update Task
                      </>
                    )}
                  </button>
                </div>

              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
