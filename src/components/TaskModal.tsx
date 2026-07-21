import React, { useState } from 'react';
import { X, Calendar, Clock, Tag, Flag, Users, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';
import { USERS } from '../data';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  id?: string;
}

export default function TaskModal({ isOpen, onClose, onAddTask, id = "task-modal" }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [category, setCategory] = useState('Marketing');
  const [dueDate, setDueDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [dueTime, setDueTime] = useState('10:00 AM');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(['sarah']); // Sarah selected by default
  const [titleError, setTitleError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError('Task title is required.');
      return;
    }
    setTitleError('');

    // Map selected usernames to active user objects
    const assigneesList = selectedAssignees.map(key => USERS[key as keyof typeof USERS]).filter(Boolean);

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate,
      dueTime,
      completed: false,
      starred: false,
      assignees: assigneesList
    });

    // Reset state
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setCategory('Marketing');
    setSelectedAssignees(['sarah']);
    setTitleError('');
    onClose();
  };

  const toggleAssignee = (key: string) => {
    setSelectedAssignees(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
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
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 z-10"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="font-display font-bold text-lg text-slate-800">Add New Task</h2>
                <p className="text-xs text-slate-400">Schedule activities and delegate to team members</p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} noValidate className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Task Title */}
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
                  placeholder="e.g., Integrate analytics SDK"
                  className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none transition-all placeholder:text-slate-400 ${
                    titleError 
                      ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-500/10' 
                      : 'border-slate-200 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500'
                  }`}
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
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe key acceptance criteria or objectives..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-slate-400 resize-none"
                />
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

              {/* Dual Column: Due Date & Due Time */}
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
                    placeholder="e.g., 04:30 PM"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Assignees Selection with portraits */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Users size={12} /> Assign Team Members
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(USERS).map(([key, user]) => {
                    const isSelected = selectedAssignees.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleAssignee(key)}
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

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 hover:brightness-110 active:scale-95 shadow-md hover:shadow-lg transition-all"
                >
                  Create Task
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
