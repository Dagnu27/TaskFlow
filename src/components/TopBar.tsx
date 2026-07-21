import React, { useState } from 'react';
import { Search, Bell, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, InboxMessage } from '../types';

interface TopBarProps {
  profile: UserProfile;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  inbox: InboxMessage[];
  onMarkAllAsRead: () => void;
  id?: string;
}

export default function TopBar({ profile, searchQuery, onSearchChange, inbox, onMarkAllAsRead, id = "topbar" }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = inbox.filter(m => m.isUnread).length;

  return (
    <div
      id={id}
      className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 md:px-8 bg-white/80 backdrop-blur-md border-b border-slate-100"
    >
      {/* Search Input Area */}
      <div className="flex-1 max-w-md relative mr-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks, categories, or priorities..."
          className="w-full pl-10 pr-12 py-2 text-sm bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-slate-400"
          id="global-search-input"
        />

        {/* Shortcut tag, collapses on small mobile screen */}
        <span className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-slate-400 bg-white border border-slate-200/60 select-none">
          ⌘K
        </span>
      </div>

      {/* Right Controls: Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell Dropdown Container */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all relative focus:outline-none"
            id="notification-bell-btn"
          >
            <Bell size={20} className={unreadCount > 0 ? "animate-swing" : ""} />
            
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Style rule for bell animation */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes swing {
              0% { transform: rotate(0); }
              15% { transform: rotate(10deg); }
              30% { transform: rotate(-10deg); }
              45% { transform: rotate(5deg); }
              60% { transform: rotate(-5deg); }
              75% { transform: rotate(2deg); }
              100% { transform: rotate(0); }
            }
            .animate-swing {
              animation: swing 1s ease infinite;
              transform-origin: top center;
            }
          `}} />

          {/* Notifications Dropdown Card */}
          <AnimatePresence>
            {showNotifications && (
              <>
                {/* Overlay to catch clicks outside dropdown */}
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                  id="notifications-dropdown-panel"
                >
                  <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                    <h4 className="font-display font-semibold text-xs text-slate-800 uppercase tracking-wider">
                      Inbox Activity ({unreadCount})
                    </h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => {
                          onMarkAllAsRead();
                          setShowNotifications(false);
                        }}
                        className="text-[10px] font-bold text-violet-600 hover:text-violet-700 uppercase tracking-wider focus:outline-none"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[280px] overflow-y-auto divide-y divide-slate-50">
                    {inbox.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        No activity logs in your inbox
                      </div>
                    ) : (
                      inbox.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-4 text-left transition-colors hover:bg-slate-50 ${
                            msg.isUnread ? 'bg-violet-50/10' : ''
                          }`}
                        >
                          <div className="flex gap-2.5">
                            <img
                              src={msg.senderAvatar}
                              alt={msg.senderName}
                              className="w-7 h-7 rounded-full object-cover mt-0.5 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                                <span>{msg.senderName}</span>
                                <span className="text-[10px] font-normal text-slate-400">{msg.time}</span>
                              </p>
                              <p className="text-[11px] font-medium text-slate-700 truncate mt-0.5">{msg.title}</p>
                              <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{msg.message}</p>
                            </div>
                            {msg.isUnread && (
                              <div className="w-1.5 h-1.5 bg-violet-600 rounded-full mt-2 shrink-0" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Avatar with hover ring glow */}
        <div className="flex items-center gap-2" id="user-profile-anchor">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 opacity-0 group-hover:opacity-80 transition-opacity duration-300 blur-[2px]" />
            <img
              src={profile.avatar}
              alt={profile.name}
              className="relative w-8 h-8 rounded-full object-cover border border-slate-200/80 cursor-pointer"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden md:flex flex-col text-left leading-none">
            <span className="text-xs font-semibold text-slate-800">{profile.name}</span>
            <span className="text-[9px] font-mono text-emerald-500 uppercase font-bold tracking-wider flex items-center gap-0.5">
              <span className="w-1 h-1 rounded-full bg-emerald-500" />
              Verified Account
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
