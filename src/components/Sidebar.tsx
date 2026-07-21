import React, { useState } from 'react';
import { 
  CheckSquare, 
  LayoutDashboard, 
  Inbox, 
  Sun, 
  Calendar, 
  Star, 
  CheckCircle, 
  Settings, 
  HelpCircle, 
  Plus, 
  Menu, 
  X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
  onOpenAddTask: () => void;
  unreadInboxCount: number;
  starredTasksCount: number;
  todayTasksCount: number;
  id?: string;
}

export default function Sidebar({ 
  activeRoute, 
  onNavigate, 
  onOpenAddTask, 
  unreadInboxCount,
  starredTasksCount,
  todayTasksCount,
  id = "sidebar" 
}: SidebarProps) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const mainNavItems = [
    { name: 'Overview', path: '/overview', icon: LayoutDashboard },
    { name: 'Inbox', path: '/inbox', icon: Inbox, badge: unreadInboxCount },
    { name: 'Today', path: '/today', icon: Sun, badge: todayTasksCount },
    { name: 'Upcoming', path: '/upcoming', icon: Calendar },
    { name: 'Favorites', path: '/favorites', icon: Star, badge: starredTasksCount },
    { name: 'Completed', path: '/completed', icon: CheckCircle },
  ];

  const secondaryNavItems = [
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Help Center', path: '/help', icon: HelpCircle },
  ];

  // Helper to render nav link items
  const renderNavLinks = (items: typeof mainNavItems, isMobile = false) => {
    return items.map((item) => {
      const Icon = item.icon;
      const isActive = activeRoute === item.path;
      
      return (
        <button
          key={item.name}
          onClick={() => {
            onNavigate(item.path);
            if (isMobile) setIsOpenMobile(false);
          }}
          className={`group flex items-center justify-between w-full px-4 py-3 rounded-r-lg text-sm font-semibold transition-all duration-200 outline-none relative select-none cursor-pointer ${
            isActive 
              ? 'bg-[#1a1a1f] border-l-4 border-[#F97316] text-white pl-3' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/20 pl-4'
          }`}
          id={`sidebar-nav-item-${item.name.toLowerCase()}${isMobile ? '-mobile' : ''}`}
        >
          <div className="flex items-center gap-3 transition-transform duration-200 group-hover:translate-x-1">
            <Icon 
              size={18} 
              className={`transition-colors duration-200 ${
                isActive ? 'text-[#F97316]' : 'text-slate-400 group-hover:text-white'
              }`} 
            />
            <span>{item.name}</span>
          </div>

          {/* Badge Count */}
          {item.badge !== undefined && item.badge > 0 && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isActive 
                ? 'bg-[#EC4899] text-white' 
                : 'bg-slate-800 text-slate-300'
            }`}>
              {item.badge}
            </span>
          )}
        </button>
      );
    });
  };

  return (
    <>
      {/* 1. Mobile Top Header Bar (Fixed / visible only below desktop size lg:hidden) */}
      <div className="flex lg:hidden items-center justify-between w-full h-16 px-5 bg-[#111114] text-white fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 shadow-md">
        <div className="flex items-center gap-2 select-none" onClick={() => onNavigate('/')}>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 via-pink-500 to-orange-500 shadow-lg">
            <CheckSquare className="text-white shrink-0" size={16} strokeWidth={3} />
          </div>
          <div>
            <h1 className="font-display font-bold text-sm tracking-tight leading-none text-white">TaskFlow</h1>
            <p className="text-[7px] font-display font-extrabold text-orange-400/80 uppercase tracking-[0.12em] mt-0.5">PRODUCTIVITY PLATFORM</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile "+" Add Task shortcut button */}
          <button
            onClick={onOpenAddTask}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 shadow-md text-white hover:scale-105 active:scale-95 transition-transform"
            title="Quick add task"
            id="mobile-quick-add-btn"
          >
            <Plus size={16} strokeWidth={3} />
          </button>

          {/* Hamburger toggle */}
          <button
            onClick={() => setIsOpenMobile(!isOpenMobile)}
            className="p-2 text-slate-300 hover:text-white focus:outline-none focus:ring-1 focus:ring-slate-700 rounded-lg"
            id="mobile-hamburger-btn"
          >
            {isOpenMobile ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 2. Desktop Sidebar (always visible on desktop, lg:flex, hidden on mobile/tablet) */}
      <aside
        id={id}
        className="hidden lg:flex flex-col w-[260px] bg-[#111114] text-slate-300 shrink-0 h-screen sticky top-0"
      >
        {/* Brand Logo & Header */}
        <div className="p-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C3AED] via-[#EC4899] to-[#F97316] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">TaskFlow</span>
          </div>
          <div className="text-[9px] text-gray-500 font-bold tracking-[0.2em] uppercase ml-11">Productivity Platform</div>
        </div>

        {/* Navigation Content Area */}
        <div className="flex-1 overflow-y-auto px-4 mt-4 space-y-7">
          {/* Main items */}
          <div className="space-y-1">
            {renderNavLinks(mainNavItems)}
          </div>

          {/* Add Task Button */}
          <div className="px-6 py-6">
            <button
              onClick={onOpenAddTask}
              className="w-full py-4 bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#F97316] rounded-xl text-white font-bold text-sm shadow-xl shadow-purple-900/40 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
              id="sidebar-add-task-btn"
            >
              + Add Task
            </button>
          </div>
        </div>

        {/* Bottom items (Settings, Help Center) */}
        <div className="p-4 border-t border-slate-800/40 bg-[#0c0c0e]/60 space-y-1">
          {renderNavLinks(secondaryNavItems)}
        </div>
      </aside>

      {/* 3. Mobile Slide-out Drawer Panel */}
      <AnimatePresence>
        {isOpenMobile && (
          <div id="mobile-drawer-overlay" className="fixed inset-0 z-40 lg:hidden">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpenMobile(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Slide-out Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 bottom-0 left-0 w-72 bg-[#111114] text-slate-300 flex flex-col shadow-2xl border-r border-slate-800/40"
            >
              {/* Drawer Brand Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/40">
                <div className="flex items-center gap-2 select-none">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 via-pink-500 to-orange-500">
                    <CheckSquare className="text-white" size={16} strokeWidth={3} />
                  </div>
                  <div>
                    <h1 className="font-display font-bold text-sm text-white">TaskFlow</h1>
                    <p className="text-[7px] font-display font-extrabold text-orange-400/80 uppercase tracking-[0.12em] mt-0.5">PRODUCTIVITY PLATFORM</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpenMobile(false)}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg focus:outline-none"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                <div className="space-y-1">
                  <p className="px-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-2">
                    Workspace
                  </p>
                  {renderNavLinks(mainNavItems, true)}
                </div>

                <div className="border-t border-slate-800/40" />

                <div className="px-2">
                  <button
                    onClick={() => {
                      setIsOpenMobile(false);
                      onOpenAddTask();
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-display font-bold text-xs text-white bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 hover:brightness-110 active:scale-95 transition-all shadow-md focus:outline-none"
                  >
                    <Plus size={14} className="stroke-[3]" />
                    ADD NEW TASK
                  </button>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-800/40 bg-[#0c0c0e]/60 space-y-1">
                {renderNavLinks(secondaryNavItems, true)}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
