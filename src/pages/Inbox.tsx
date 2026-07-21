import React, { useState } from 'react';
import { Mail, Check, MessageSquare, AlertCircle, Trash2, CheckCircle2, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InboxMessage } from '../types';

interface InboxProps {
  inbox: InboxMessage[];
  onToggleRead: (id: string) => void;
  onDeleteMessage: (id: string) => void;
  onMarkAllAsRead: () => void;
  onInspectTask: (id: string) => void;
  onConvertMessageToTask: (title: string, message: string) => void;
  searchQuery: string;
}

export default function Inbox({ 
  inbox, 
  onToggleRead, 
  onDeleteMessage, 
  onMarkAllAsRead,
  onInspectTask,
  onConvertMessageToTask,
  searchQuery 
}: InboxProps) {
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Filter messages based on search query
  const filteredInbox = inbox.filter(msg => {
    if (!searchQuery.trim()) return true;
    return msg.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           msg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           msg.message.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const unreadCount = inbox.filter(m => m.isUnread).length;

  return (
    <div id="inbox-page-wrapper" className="flex-1 w-full p-4 md:p-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-left">
        <div>
          <p className="text-xs font-mono text-violet-600 font-bold uppercase tracking-widest">Notification Desk</p>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 mt-1">Inbox Messages</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Incoming review notes, pipeline changes, and automated system reports.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-500 hover:brightness-110 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer focus:outline-none shrink-0"
            id="inbox-mark-all-read-btn"
          >
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      {/* Main Inbox Deck */}
      <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm overflow-hidden text-left max-w-4xl mx-auto">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            All Feeds ({filteredInbox.length})
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Swipe message or click row to inspect
          </span>
        </div>

        <div className="divide-y divide-slate-100" id="inbox-messages-list">
          <AnimatePresence mode="popLayout">
            {filteredInbox.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="font-semibold text-xs text-slate-700">Inbox is empty</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">No notifications match your active workspace search query.</p>
                </div>
              </motion.div>
            ) : (
              filteredInbox.map((msg) => {
                const isSelected = activeMessageId === msg.id;
                
                return (
                  <motion.div
                    key={msg.id}
                    layoutId={`inbox-${msg.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`transition-all duration-200 cursor-pointer ${
                      msg.isUnread ? 'bg-violet-50/10' : 'bg-white'
                    } ${isSelected ? 'bg-slate-50/50' : ''}`}
                    onClick={() => {
                      onToggleRead(msg.id);
                      setActiveMessageId(isSelected ? null : msg.id);
                    }}
                    id={`inbox-msg-row-${msg.id}`}
                  >
                    {/* Collapsed message view */}
                    <div className="p-5 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5 min-w-0 flex-1">
                        
                        {/* Profile photo with unread dot indicator */}
                        <div className="relative shrink-0 select-none">
                          <img
                            src={msg.senderAvatar}
                            alt={msg.senderName}
                            className="w-10 h-10 rounded-full object-cover border border-slate-100"
                            referrerPolicy="no-referrer"
                          />
                          {msg.accentDot && (
                            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-tr from-violet-600 to-pink-500 rounded-full ring-2 ring-white" />
                          )}
                        </div>

                        {/* Content text preview */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <h3 className={`text-xs md:text-sm text-slate-800 truncate ${msg.isUnread ? 'font-bold' : 'font-medium'}`}>
                              {msg.senderName}
                            </h3>
                            <span className="text-[10px] font-mono text-slate-400 shrink-0">{msg.time}</span>
                          </div>
                          
                          <p className={`text-xs md:text-sm mt-0.5 truncate ${msg.isUnread ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                            {msg.title}
                          </p>
                          <p className="text-slate-400 text-xs truncate mt-1">
                            {msg.message}
                          </p>
                        </div>
                      </div>

                      {/* Right Action buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleRead(msg.id);
                          }}
                          className={`p-1.5 rounded-lg transition-colors focus:outline-none ${
                            msg.isUnread ? 'text-violet-600 hover:bg-violet-50' : 'text-slate-300 hover:text-slate-500'
                          }`}
                          title={msg.isUnread ? 'Mark as read' : 'Mark as unread'}
                          id={`toggle-read-msg-${msg.id}`}
                        >
                          <Check size={14} className={msg.isUnread ? 'stroke-[3]' : ''} />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteMessage(msg.id);
                          }}
                          className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none"
                          title="Delete message"
                          id={`delete-msg-${msg.id}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Expandable full body inspector view */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden bg-slate-50/50 border-t border-slate-100"
                        >
                          <div className="p-5 pl-18 text-left space-y-3.5">
                            <div className="text-xs text-slate-600 bg-white p-4 rounded-xl border border-slate-200/60 leading-relaxed max-w-2xl">
                              {msg.message}
                            </div>
                                                        {/* Actions on notification */}
                            <div className="flex items-center gap-3">
                              {msg.taskIdRelated ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onInspectTask(msg.taskIdRelated!);
                                    triggerToast(`Opened task detail view for task #${msg.taskIdRelated}`);
                                  }}
                                  className="px-3 py-1.5 bg-violet-100 hover:bg-violet-200 text-violet-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors focus:outline-none cursor-pointer"
                                >
                                  <Bookmark size={12} /> Inspect Associated Task
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onConvertMessageToTask(msg.title, msg.message);
                                    triggerToast("Converted message log to an active system task card!");
                                  }}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors focus:outline-none cursor-pointer"
                                >
                                  <CheckCircle2 size={12} /> Convert to Active Task
                                </button>
                              )}
                              
                              <span className="text-[10px] text-slate-400 font-mono">
                                Sent via Slack Integrations Engine
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating toast message */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white shadow-2xl flex items-center gap-3 border border-slate-800 max-w-sm text-left"
            id="inbox-toast"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
              <Check size={12} className="stroke-[3]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-300 font-display">Inbox Alert System</p>
              <p className="text-[11px] text-slate-200 mt-0.5">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
