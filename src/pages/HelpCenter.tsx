import React, { useState } from 'react';
import { 
  Rocket, 
  Keyboard, 
  CreditCard, 
  Smartphone, 
  Wrench, 
  Search, 
  Mail, 
  HelpCircle, 
  ChevronRight,
  MessageSquare,
  Sparkles,
  LifeBuoy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function HelpCenter() {
  const [searchVal, setSearchVal] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  const categories = [
    { 
      title: 'Getting Started 🚀', 
      desc: 'Set up your TaskFlow account, invite colleagues, and configure primary pipelines.', 
      icon: Rocket, 
      color: 'bg-violet-50 text-violet-600 border-violet-100 hover:border-violet-300' 
    },
    { 
      title: 'Keyboard Shortcuts ⌨️', 
      desc: 'Work faster with hotkeys for quick-add (⌘K), checking, starring, and toggling panels.', 
      icon: Keyboard, 
      color: 'bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-300' 
    },
    { 
      title: 'Account & Billing 💳', 
      desc: 'Manage verification badges, subscription tiers, professional invoicing, and receipts.', 
      icon: CreditCard, 
      color: 'bg-rose-50 text-rose-600 border-rose-100 hover:border-rose-300' 
    },
    { 
      title: 'Services & Media 📱', 
      desc: 'Synchronize calendars, Slack hooks, webhook triggers, and mobile native push sheets.', 
      icon: Smartphone, 
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-300' 
    },
    { 
      title: 'Troubleshooting 🔧', 
      desc: 'Resolve caching anomalies, cookie redirect errors, database timeouts, or offline syncing.', 
      icon: Wrench, 
      color: 'bg-orange-50 text-orange-600 border-orange-100 hover:border-orange-300' 
    },
  ];

  const handleSearchHelp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    triggerToast(`Searching help database for: "${searchVal}"...`);
  };

  return (
    <div id="help-center-page-wrapper" className="flex-1 w-full p-4 md:p-8 space-y-8">
      
      {/* Centered Large Search Header */}
      <div 
        className="relative bg-white py-12 px-6 rounded-2xl shadow-sm border border-slate-100 text-center max-w-4xl mx-auto flex flex-col items-center justify-center overflow-hidden"
        id="help-hero-banner"
      >
        {/* Soft layout background shapes */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-violet-100/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-100/30 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-xl text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-violet-700 bg-violet-100/50 uppercase tracking-widest">
            <LifeBuoy size={12} /> TaskFlow Concierge Help Desk
          </span>
          
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-slate-900 tracking-tight leading-none">
            How can we help you?
          </h1>
          
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
            Search our comprehensive documentation, keyboard shortcodes index, and api service configurations.
          </p>

          {/* Form container */}
          <form onSubmit={handleSearchHelp} className="flex gap-2 w-full mt-6" id="help-search-form">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search troubleshooting codes, shortcuts, or setup guides..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-slate-400"
              />
            </div>
            
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 hover:brightness-110 active:scale-95 shadow transition-all focus:outline-none shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Grid of Category cards */}
      <div className="max-w-4xl mx-auto space-y-4 text-left">
        <h2 className="text-xs font-bold font-display uppercase tracking-widest text-slate-400 mb-2 pl-1 select-none">
          Explore documentation by module
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="help-categories-grid">
          {categories.map((cat, idx) => {
            const CatIcon = cat.icon;
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-violet-100 transition-all text-left flex flex-col justify-between"
                onClick={() => triggerToast(`Directing to guide details for "${cat.title}"...`)}
              >
                <div>
                  {/* Icon illustration container */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border shrink-0 ${cat.color}`}>
                    <CatIcon size={18} className="transition-transform group-hover:scale-110" />
                  </div>

                  <h3 className="font-display font-bold text-sm text-slate-800 leading-tight">
                    {cat.title}
                  </h3>
                  
                  <p className="text-slate-400 text-xs leading-relaxed mt-2">
                    {cat.desc}
                  </p>
                </div>

                <div className="flex items-center text-[10px] font-bold text-violet-600 mt-4 tracking-wider uppercase gap-0.5">
                  Learn more <ChevronRight size={12} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Contact Support section */}
      <div 
        className="max-w-4xl mx-auto bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-left"
        id="help-contact-support-banner"
      >
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">
            <MessageSquare size={18} />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-slate-800 leading-tight">Still have questions?</h4>
            <p className="text-slate-400 text-xs mt-1 leading-normal max-w-lg">
              Can't locate the setup sequence or troubleshooting guides you need? Reach out to our customer operations desk directly.
            </p>
          </div>
        </div>

        <button
          onClick={() => triggerToast("Connecting to customer support messaging portal...")}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 hover:brightness-110 active:scale-95 shadow transition-all focus:outline-none shrink-0 cursor-pointer"
        >
          Contact Support
        </button>
      </div>

      {/* Floating toast message */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white shadow-2xl flex items-center gap-3 border border-slate-800 max-w-sm text-left"
            id="help-toast"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
              <Check size={12} className="stroke-[3]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-300 font-display">Help Center Notification</p>
              <p className="text-[11px] text-slate-200 mt-0.5">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
