import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Palette, 
  Link2, 
  ShieldCheck, 
  Upload, 
  Check, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface SettingsProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  id?: string;
}

type TabType = 'general' | 'profile' | 'notifications' | 'appearance' | 'integrations';

export default function Settings({ profile, onUpdateProfile, id = "settings-page" }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  
  // Local Form state initialized from global profile
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [verified, setVerified] = useState(profile.verified);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Sub-tabs list
  const tabs = [
    { id: 'general', name: 'General', icon: Sparkles },
    { id: 'profile', name: 'Profile Account', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'integrations', name: 'Integrations', icon: Link2 },
  ] as const;

  // Simulate file upload
  const handleUploadAvatar = () => {
    // Alternate between professional portraits to simulate upload
    const randomPortraits = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', // Alex
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', // Elena
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', // Marcus
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'  // Sarah
    ];
    const currentIndex = randomPortraits.indexOf(avatar);
    const nextIndex = (currentIndex + 1) % randomPortraits.length;
    setAvatar(randomPortraits[nextIndex]);

    // Small confirmation toast
    setToastMessage('Avatar picture updated! Click Save Changes to apply.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      email,
      avatar,
      verified,
      securityStrength: profile.securityStrength
    });

    // Save changes success toast
    setToastMessage('Changes saved successfully! Your profile is synchronized.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div id={id} className="flex-1 w-full p-4 md:p-8 space-y-6 relative min-h-[calc(100vh-4rem)]">
      
      {/* 1. Success Toast Notification (Auto-Dismiss) */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white shadow-2xl flex items-center gap-3 border border-slate-800 max-w-sm text-left"
            id="success-toast-message"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
              <Check size={14} className="stroke-[3]" />
            </div>
            <div>
              <p className="text-xs font-bold font-display">System Confirmation</p>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-left">
        <div>
          <p className="text-xs font-mono text-violet-600 font-bold uppercase tracking-widest">Configuration Panel</p>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 mt-1">Platform Settings</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Manage profile parameters, security, notifications, and active modules.</p>
        </div>
      </div>

      {/* Sub Navigation Tabs Row */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-6 select-none" id="settings-sub-navigation">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-1.5 border-b-2 font-display text-xs md:text-sm font-semibold transition-all shrink-0 focus:outline-none relative cursor-pointer ${
                isActive 
                  ? 'border-violet-600 text-violet-700 font-bold' 
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
              id={`settings-tab-btn-${tab.id}`}
            >
              <TabIcon size={14} />
              {tab.name}
              {isActive && (
                <motion.div
                  layoutId="activeSubTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Grid: Forms area & Security card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left main card with form */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-left">
            <h3 className="font-display font-bold text-base text-slate-800 border-b border-slate-100 pb-3 mb-5 uppercase tracking-wider">
              {activeTab === 'profile' ? 'Profile Details' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} configuration`}
            </h3>

            {activeTab === 'profile' ? (
              <form onSubmit={handleSave} className="space-y-6">
                
                {/* Simulated Avatar photo editor */}
                <div className="flex items-center gap-5 pb-2" id="profile-picture-upload-section">
                  <div className="relative">
                    <img
                      src={avatar}
                      alt={name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-violet-500/10"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={handleUploadAvatar}
                      className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-pink-500 hover:brightness-110 shadow transition-all focus:outline-none cursor-pointer"
                    >
                      <Upload size={12} /> Upload New Photo
                    </button>
                    <p className="text-[10px] text-slate-400">JPG or PNG. Max dimension 800px square.</p>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-slate-800"
                    />
                  </div>
                </div>

                {/* Verified Toggle Switch Row */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-left space-y-0.5">
                    <p className="text-xs font-bold text-slate-700">Verified Professional Tag</p>
                    <p className="text-[11px] text-slate-400">Add a verified indicator bubble in headers and team sync directory sheets.</p>
                  </div>

                  {/* Switch container */}
                  <button
                    type="button"
                    onClick={() => setVerified(!verified)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      verified ? 'bg-violet-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        verified ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Password trigger */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setToastMessage("Please contact the security desk to issue credential or password token updates.");
                      setShowToast(true);
                      setTimeout(() => setShowToast(false), 3000);
                    }}
                    className="flex items-center gap-1 px-4 py-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold rounded-xl transition-all focus:outline-none cursor-pointer"
                  >
                    <Lock size={12} /> Change Credentials Password
                  </button>
                </div>

              </form>
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} panel details are locked in review by workspace supervisors.
              </div>
            )}
          </div>
        </div>

        {/* Right sub card with Security Strength Progress Bar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-left" id="settings-security-strength-card">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display font-bold text-sm text-slate-800">Security Strength</h4>
              <ShieldCheck size={18} className="text-violet-600" />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Your overall credentials index is calculated based on password entropy, verification status, and active OAuth integrations.
            </p>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-emerald-500 uppercase tracking-wider">85% STRONG</span>
                <span className="text-slate-400">Excellent</span>
              </div>
              
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 rounded-full w-[85%]" />
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-orange-50 text-[11px] text-orange-700 font-medium leading-relaxed flex gap-2">
              <AlertCircle size={14} className="shrink-0 text-orange-500 mt-0.5" />
              <span>Enable Two-Factor Authentication (2FA) inside integrations to achieve a 100% security rating.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Floating / Sticky Save Changes gradient button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 hover:brightness-110 active:scale-95 shadow-xl hover:shadow-2xl hover:scale-102 transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none"
          id="sticky-save-changes-btn"
        >
          <Check size={14} className="stroke-[3]" />
          SAVE CHANGES
        </button>
      </div>

    </div>
  );
}
