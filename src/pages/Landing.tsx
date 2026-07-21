import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  motion, 
  AnimatePresence, 
  useInView,
  useReducedMotion 
} from 'motion/react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Star, 
  ChevronDown, 
  Users, 
  Layers, 
  Calendar, 
  Zap, 
  Clock, 
  Trophy, 
  X, 
  Menu,
  Check,
  Sparkles,
  ArrowRightLeft,
  Briefcase,
  Smartphone,
  Mail,
  Shield,
  MessageSquare
} from 'lucide-react';

// Animated Counter component that increments when scrolled into view
function AnimatedCounter({ value, suffix, duration = 1.5 }: { value: number; suffix: string; duration?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const totalSteps = 50;
      const stepTime = (duration * 1000) / totalSteps;
      const increment = Math.ceil(end / totalSteps);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="font-display font-black text-3xl md:text-5xl text-white tracking-tight block">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// 3D Tilt on Hover Card for Screenshots and Mockups
function TiltCard({
  children,
  className = "",
  accent = "primary"
}: {
  children: React.ReactNode;
  className?: string;
  accent?: 'primary' | 'secondary' | 'tertiary' | 'success';
}) {
  const shouldReduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  // Map accents to breathe class
  const breatheClass = {
    primary: 'breathe-primary border-transparent',
    secondary: 'breathe-secondary border-transparent',
    tertiary: 'breathe-tertiary border-transparent',
    success: 'breathe-success border-transparent',
  }[accent];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 12, y: -y * 12 }); // up to ~6 deg rotation
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative group bg-white rounded-[24px] border border-slate-200/60 p-5 md:p-6 text-left shadow-xl overflow-hidden cursor-pointer ${breatheClass} ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: hovered && !shouldReduceMotion
          ? `perspective(1200px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) translateY(-6px) scale(1.02)`
          : `perspective(1200px) rotateY(0deg) rotateX(0deg) translateY(0px) scale(1)`,
        transition: hovered ? 'transform 0.08s ease-out' : 'transform 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease'
      }}
    >
      {/* Sleek lighting sheen sweep */}
      <div className="absolute inset-0 pointer-events-none sheen-wrapper" />
      {children}
    </motion.div>
  );
}

// Premium Card Component with stagger viewport entrance, hover lifting and icon rotation
function PremiumCard({
  children,
  accent = 'primary',
  className = '',
  delay = 0,
  isPopular = false,
  onClick
}: {
  children: React.ReactNode;
  accent?: 'primary' | 'secondary' | 'tertiary' | 'success';
  className?: string;
  delay?: number;
  isPopular?: boolean;
  onClick?: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const breatheClass = {
    primary: 'breathe-primary border-transparent',
    secondary: 'breathe-secondary border-transparent',
    tertiary: 'breathe-tertiary border-transparent',
    success: 'breathe-success border-transparent',
  }[accent];

  const hoverBorderClass = {
    primary: 'hover:border-[#EC4899]/60',
    secondary: 'hover:border-[#06B6D4]/60',
    tertiary: 'hover:border-[#FBBF24]/60',
    success: 'hover:border-[#14B8A6]/60',
  }[accent];

  // Active / tap animation styles for mobile
  const tapStyle = shouldReduceMotion ? {} : { scale: 0.97 };

  // Entrance variants: fade-up + slight scale-in (from 0.96 -> 1)
  const variants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20, 
      scale: shouldReduceMotion ? 1 : 0.96 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        duration: 0.5, 
        delay, 
        ease: "easeOut" as const
      } 
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      whileTap={tapStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{ 
        transform: hovered && !shouldReduceMotion ? `translateY(-6px) scale(1.02)` : `translateY(0px) scale(1)`,
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease'
      }}
      className={`relative bg-white rounded-[24px] border border-slate-200/60 p-6 shadow-sm cursor-pointer select-none overflow-hidden group ${breatheClass} ${hoverBorderClass} ${
        isPopular ? 'ring-2 ring-[#7C3AED] ring-offset-2' : ''
      } ${className}`}
    >
      {/* Animated highlight ring overlay for popular pricing at rest */}
      {isPopular && (
        <div className="absolute inset-0 border border-violet-500/20 rounded-[22px] pointer-events-none animate-pulse" />
      )}
      {children}
    </motion.div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(1); // Default to center
  const [subscribed, setSubscribed] = useState(false);

  // Monitor scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Demo play state
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Footer collapsible groups for mobile
  const [expandedFooterGroup, setExpandedFooterGroup] = useState<string | null>(null);

  // FAQ Data
  const faqData = [
    {
      q: "What exactly is TaskFlow?",
      a: "TaskFlow is an all-in-one productivity platform designed for high-performance teams. It merges real-time task management, project milestones, team communication hubs, and analytics pipelines into a single high-velocity interface."
    },
    {
      q: "Can I invite external clients or teammates?",
      a: "Absolutely. With TaskFlow, you can invite unlimited collaborators, assign role-specific permissions, and configure private workspaces for different client projects or internal departments."
    },
    {
      q: "How does the offline state sync works?",
      a: "TaskFlow features custom local synchronization state-engines. When connection drops, you can continue checking tasks, adding files, and updating profiles. All changes are queued locally and automatically conflict-resolved when you are back online."
    },
    {
      q: "Is there an export option for our databases?",
      a: "Yes. You can export complete project sheets, task history, and team velocity logs in professional formats including JSON, CSV, or formatted PDF registries at any time."
    },
    {
      q: "Do you offer custom integrations with tools we use?",
      a: "Yes. TaskFlow connects natively with Google Workspace, Slack channels, GitHub triggers, and custom developer webhooks so you can trigger action cards based on external platform events."
    }
  ];

  // Partners Logo Wordmarks
  const partners = [
    { name: "Acme Corp", icon: Briefcase },
    { name: "Linear Systems", icon: Layers },
    { name: "Stripe Flow", icon: ArrowRightLeft },
    { name: "Vercel Labs", icon: Zap },
    { name: "Figma Pro", icon: Sparkles },
    { name: "Supabase DB", icon: Shield }
  ];

  // Testimonials Data
  const testimonials = [
    {
      name: "Elena Rostova",
      role: "VP of Product at Linear Systems",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      quote: "TaskFlow transformed how our design and engineering departments sync up. The Overview dashboard has become our single source of truth, increasing our sprint velocity by over 20%.",
      stars: 5
    },
    {
      name: "Marcus Aurelius",
      role: "Lead Architect at Vercel Labs",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      quote: "The interface is blisteringly fast. No lag, no bloated frameworks, just raw keyboard-shortcut-driven execution. It feels like it was engineered specifically for power users.",
      stars: 5
    },
    {
      name: "Sarah Jenkins",
      role: "Operations Director at Stripe Flow",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      quote: "We consolidated Jira, Notion, and Slack status updates into TaskFlow. It has simplified our toolchain enormously, saving us thousands in licensing fees while keeping projects on schedule.",
      stars: 5
    }
  ];

  // Features detailed sections with specified accent mappings
  const features = [
    {
      id: "plan",
      title: "Plan your day with laser focus",
      description: "Our adaptive 'Today' view keeps your active deliverables right in front of you. Cut down the noise, isolate your daily focus, and clear the queue with an integrated progress ring tracking your exact completion statistics in real-time.",
      bullets: [
        "Consolidated daily task timeline based on absolute urgency",
        "Interactive high-fidelity progress rings keeping targets visible",
        "Single-click priority stars to lock in high-impact actions"
      ],
      mockupType: "today",
      accent: "primary" as const, // purple -> pink -> orange
      badgeText: "DAILY FOCUS",
      badgeClass: "bg-purple-50 text-purple-600 border-purple-100/50"
    },
    {
      id: "deadline",
      title: "Never miss a critical deadline again",
      description: "Map your deliverables onto visual calendar timelines. The Upcoming columns separate tasks by clear dates so your department always knows what is due today, tomorrow, or in the next sprint cycle.",
      bullets: [
        "Fluid drag-and-drop columns with automatic reschedule rules",
        "Color-coded priority badges indicating relative risk levels",
        "Instant system notifications mapped to teammate calendars"
      ],
      mockupType: "upcoming",
      accent: "tertiary" as const, // rose -> amber
      badgeText: "TIMELINE SCHEDULER",
      badgeClass: "bg-rose-50 text-rose-600 border-rose-100/50"
    },
    {
      id: "collab",
      title: "Synchronized team collaboration",
      description: "Assign owners, share attachments, and discuss deliverables inside task cards. No secondary status threads or manual updates required — presence bubbles show exactly who is actively reviewing.",
      bullets: [
        "Real-time teammate presence indicators inside cards",
        "Collaborative shared comments and task activity logs",
        "Centralized document attachments for high-speed audits"
      ],
      mockupType: "collab",
      accent: "secondary" as const, // indigo -> cyan
      badgeText: "PRESENCE CO-SYNC",
      badgeClass: "bg-indigo-50 text-indigo-600 border-indigo-100/50"
    },
    {
      id: "analytics",
      title: "Audit performance. Elevate efficiency.",
      description: "Review complete logs of cleared objectives inside the Completed page. Get weekly insights automatically processed, measuring overall team velocity and historic completion trends.",
      bullets: [
        "Detailed archive logs of resolved actions and milestones",
        "Weekly velocity widgets tracking team sprint momentum",
        "Visual trophy milestones celebrating productivity streaks"
      ],
      mockupType: "analytics",
      accent: "success" as const, // emerald -> teal
      badgeText: "PERFORMANCE METRICS",
      badgeClass: "bg-emerald-50 text-emerald-600 border-emerald-100/50"
    }
  ];

  return (
    <div className="w-full bg-[#f4f3f8] text-slate-900 font-sans min-h-screen overflow-x-hidden selection:bg-purple-500 selection:text-white">
      
      {/* 1. Sticky Navigation Bar */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled 
            ? 'bg-[#111114]/90 backdrop-blur-md shadow-lg border-white/5 py-3' 
            : 'bg-transparent border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C3AED] via-[#EC4899] to-[#F97316] flex items-center justify-center shadow-md shadow-purple-500/10">
              <Check className="w-4.5 h-4.5 text-white stroke-[4.5]" />
            </div>
            <span className={`font-display font-extrabold text-xl tracking-tight ${scrolled ? 'text-white' : 'text-slate-900'}`}>TaskFlow</span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className={`hidden md:flex items-center gap-8 text-sm font-semibold ${scrolled ? 'text-slate-300' : 'text-slate-600'}`}>
            <a href="#product" className={`relative group transition-colors py-1 ${scrolled ? 'hover:text-white' : 'hover:text-slate-900'}`}>
              Product
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#F97316] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300" />
            </a>
            <a href="#features" className={`relative group transition-colors py-1 ${scrolled ? 'hover:text-white' : 'hover:text-slate-900'}`}>
              Features
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#F97316] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300" />
            </a>
            <a href="#pricing" className={`relative group transition-colors py-1 ${scrolled ? 'hover:text-white' : 'hover:text-slate-900'}`}>
              Pricing
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#F97316] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300" />
            </a>
            <a href="#reviews" className={`relative group transition-colors py-1 ${scrolled ? 'hover:text-white' : 'hover:text-slate-900'}`}>
              Reviews
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#F97316] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300" />
            </a>
            <a href="#faq" className={`relative group transition-colors py-1 ${scrolled ? 'hover:text-white' : 'hover:text-slate-900'}`}>
              FAQ
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#F97316] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300" />
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => navigate('/settings')} 
              className={`text-sm font-semibold transition-colors cursor-pointer ${scrolled ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Log In
            </button>
            <motion.button 
              onClick={() => navigate('/overview')} 
              whileHover={{ scale: 1.04, filter: 'brightness(1.1)', boxShadow: '0 8px 20px rgba(124,58,237,0.25)' }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#F97316] transition-all cursor-pointer shadow-md shadow-violet-500/10"
            >
              Get Started Free
            </motion.button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className={`md:hidden p-2 rounded-xl focus:outline-none transition-colors cursor-pointer ${
              scrolled ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[60px] z-40 bg-[#111114] shadow-2xl border-b border-white/5 p-6 flex flex-col gap-5 md:hidden"
          >
            <nav className="flex flex-col gap-4 text-sm font-semibold text-slate-300">
              <a href="#product" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-white transition-colors">Product</a>
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-white transition-colors">Features</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-white transition-colors">Pricing</a>
              <a href="#reviews" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-white transition-colors">Reviews</a>
              <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-white transition-colors">FAQ</a>
            </nav>
            <div className="h-px bg-white/5" />
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); navigate('/settings'); }} 
                className="w-full py-3 text-center text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
              >
                Log In
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); navigate('/overview'); }} 
                className="w-full py-3 text-center text-sm font-bold text-white bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#F97316] rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Get Started Free
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* 2. Hero Section */}
      <section id="product" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden px-6">
        {/* Animated Background Blurred Blobs: Combo of Purple & Pink */}
        <motion.div 
          animate={{ x: [0, 20, -10, 0], y: [0, -30, 20, 0], scale: [1, 1.08, 0.95, 1] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/10 w-96 h-96 bg-[#7C3AED]/12 rounded-full blur-3xl pointer-events-none" 
        />
        <motion.div 
          animate={{ x: [0, -25, 15, 0], y: [0, 20, -25, 0], scale: [1, 0.95, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/10 w-[450px] h-[450px] bg-[#EC4899]/10 rounded-full blur-3xl pointer-events-none" 
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-5 text-left space-y-6 z-10">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200/60 rounded-full text-[11px] font-bold text-slate-600 uppercase tracking-wider shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Version 2.4 Now Available</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display font-extrabold text-4xl md:text-5xl lg:text-[52px] leading-[1.08] text-slate-900 tracking-tight"
            >
              Organize your work.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#F97316]">
                Reclaim your time.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-500 text-base md:text-lg leading-relaxed max-w-lg"
            >
              TaskFlow is a premium productivity platform built for teams who want to execute faster. Synchronize deliverables, audit performance, and automate queues with absolute clarity.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <motion.button 
                onClick={() => navigate('/overview')}
                whileHover={{ scale: 1.04, filter: 'brightness(1.1)', boxShadow: '0 10px 25px rgba(124,58,237,0.3)' }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#F97316] transition-all cursor-pointer shadow-xl shadow-purple-500/20 text-center"
              >
                Start Free Trial
              </motion.button>
              <motion.button 
                onClick={() => setShowDemoModal(true)}
                whileHover={{ scale: 1.04, backgroundColor: '#f8fafc' }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-4 rounded-xl text-sm font-bold text-slate-700 bg-white active:scale-[0.98] transition-all cursor-pointer border border-slate-200 shadow-sm flex items-center justify-center gap-2"
              >
                <Play size={14} className="fill-slate-600 text-slate-600" />
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Social Trust Stack */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-3.5 pt-4 border-t border-slate-200/60 max-w-md"
            >
              <div className="flex -space-x-2.5">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="User" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="User" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" alt="User" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="User" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
              </div>
              <div>
                <div className="flex items-center text-amber-500">
                  <Star size={13} className="fill-current" />
                  <Star size={13} className="fill-current" />
                  <Star size={13} className="fill-current" />
                  <Star size={13} className="fill-current" />
                  <Star size={13} className="fill-current" />
                </div>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Loved by 10,000+ teams worldwide</p>
              </div>
            </motion.div>
          </div>

          {/* Right Hero Visual Column (3D Interactive Tilt Mockup Card) */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-[580px] h-[400px] md:h-[450px]">
              
              {/* Backlight glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[80%] bg-gradient-to-tr from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-[30px] blur-2xl z-0" />

              <TiltCard accent="primary" className="absolute inset-0 z-10 text-slate-900 border border-slate-200 bg-white">
                {/* Simulated Mockup TopBar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    <div className="h-4 w-px bg-slate-200 mx-1" />
                    <span className="text-[10px] font-mono font-bold text-slate-400">PROJECT / PRODUCT_LAUNCH</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 border" />
                    <div className="h-4 w-24 bg-slate-50 border rounded-lg" />
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-extrabold text-lg text-slate-900 leading-none">Today's Objectives</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">July 20 • Powering Sprint Velocity</p>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>75% COMPLETED</span>
                    </div>
                  </div>

                  {/* Task rows */}
                  <div className="space-y-2.5">
                    
                    {/* Task Row 1 */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 border border-emerald-500 flex items-center justify-center text-white">
                          <Check size={11} className="stroke-[4]" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 line-through">Technical documentation review</p>
                          <p className="text-[9px] text-slate-400">Team Lead • Documentation</p>
                        </div>
                      </div>
                      <span className="bg-[#EC4899] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">LOW</span>
                    </div>

                    {/* Task Row 2 */}
                    <div className="p-3.5 bg-gradient-to-r from-purple-50/50 to-orange-50/20 border border-purple-100 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Finalize Marketing Strategy Assets</p>
                          <p className="text-[9px] text-slate-400">Due Today, 5:00 PM</p>
                        </div>
                      </div>
                      <span className="bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">High Priority</span>
                    </div>

                    {/* Task Row 3 */}
                    <div className="p-3.5 bg-white border border-slate-200/60 rounded-xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Social Media Assets for Twitter</p>
                          <p className="text-[9px] text-slate-400">Design Team • Marketing</p>
                        </div>
                      </div>
                      <span className="bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">MEDIUM</span>
                    </div>

                  </div>
                </div>
              </TiltCard>

              {/* Floating Chip 1: ✓ Task Completed */}
              <motion.div 
                animate={{ y: [0, 8, 0], x: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                className="absolute bottom-6 -left-8 md:-left-12 bg-white px-4 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 z-20"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-800 leading-none">Task Completed</p>
                  <p className="text-[9px] text-slate-400 mt-1">Design System Sync</p>
                </div>
              </motion.div>

              {/* Floating Chip 2: 🔥 Streak / Done Today */}
              <motion.div 
                animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute top-12 -right-6 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-3 z-20"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#EC4899] to-[#F97316] flex items-center justify-center text-white shrink-0">
                  <Zap size={15} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white leading-none">🔥 75% done today</p>
                  <p className="text-[9px] text-slate-400 mt-1">3 days ahead of schedule</p>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </section>


      {/* 3. Logos/Social Proof Strip - Dark base for alternating rhythm */}
      <section className="bg-[#111114] py-12 border-y border-white/5 overflow-hidden px-6 select-none">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          <p className="text-[10px] font-bold font-display uppercase tracking-[0.2em] text-slate-500">
            Powering performance at industry-leading companies
          </p>

          {/* Desktop row of grayscale partner logos */}
          <div className="hidden md:flex flex-wrap items-center justify-center gap-12 lg:gap-18 opacity-40 grayscale hover:opacity-70 transition-opacity duration-300">
            {partners.map((p, idx) => {
              const IconComp = p.icon;
              return (
                <div key={idx} className="flex items-center gap-2 text-white">
                  <IconComp size={18} className="text-slate-400" />
                  <span className="font-display font-bold tracking-tight text-sm uppercase">{p.name}</span>
                </div>
              );
            })}
          </div>

          {/* Mobile horizontal scrolling marquee */}
          <div className="md:hidden w-full relative">
            <div className="flex gap-8 items-center justify-around whitespace-nowrap animate-marquee">
              {partners.concat(partners).map((p, idx) => {
                const IconComp = p.icon;
                return (
                  <div key={idx} className="inline-flex items-center gap-2 text-white opacity-40 grayscale shrink-0">
                    <IconComp size={16} />
                    <span className="font-display font-bold tracking-tight text-xs uppercase">{p.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>


      {/* 4. Feature Highlights */}
      <section id="features" className="py-20 md:py-32 space-y-24 md:space-y-36 px-6 max-w-7xl mx-auto">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3 select-none">
          <p className="text-xs font-mono font-bold text-purple-600 uppercase tracking-widest flex items-center justify-center gap-1">
            <Sparkles size={12} /> Adaptive Feature Modules
          </p>
          <h2 className="font-display font-black text-3xl md:text-4xl text-slate-900 tracking-tight">
            Designed for teams who love details
          </h2>
          <p className="text-slate-400 text-sm">
            Everything you need to ship projects on time, consolidated in a modular visual structure.
          </p>
        </div>

        {/* Feature blocks alternating */}
        {features.map((feature, index) => {
          const isEven = index % 2 === 0;
          return (
            <div 
              key={feature.id} 
              className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left ${
                isEven ? '' : 'lg:flex-row-reverse'
              }`}
            >
              
              {/* Text Area */}
              <div className={`lg:col-span-5 space-y-6 ${
                isEven ? 'lg:order-1' : 'lg:order-2'
              }`}>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${feature.badgeClass}`}>
                  <Sparkles size={11} />
                  <span>{feature.badgeText}</span>
                </div>
                
                <h3 className="font-display font-extrabold text-2xl md:text-3xl text-slate-900 tracking-tight leading-tight">
                  {feature.title}
                </h3>
                
                <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                  {feature.description}
                </p>

                <ul className="space-y-3">
                  {feature.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5 text-xs text-slate-600">
                      <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 mt-0.5">
                        <Check size={10} className="stroke-[3.5]" />
                      </div>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual Mockup Area using 3D Interactive Tilt Card with matching breathing accent shadow */}
              <div className={`lg:col-span-7 flex justify-center ${
                isEven ? 'lg:order-2' : 'lg:order-1'
              }`}>
                <TiltCard 
                  accent={feature.accent}
                  className="w-full max-w-[500px] border border-slate-200 bg-white"
                >
                  
                  {/* Custom render based on mockupType */}
                  {feature.mockupType === 'today' && (
                    <div className="space-y-4">
                      {/* Simulated header */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-800">Monday, Jul 20</span>
                        </div>
                        <span className="text-[10px] font-mono text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-100/50">Daily Queue</span>
                      </div>
                      {/* Dynamic focus card */}
                      <div className="p-4 bg-gradient-to-r from-purple-50/50 via-pink-50/20 to-orange-50/10 border border-purple-100/50 rounded-xl flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-[10px] font-mono font-bold text-purple-600 uppercase">Primary Focus</p>
                          <p className="text-xs font-bold text-slate-800">Update design system tokens</p>
                        </div>
                        {/* Progress circle representation */}
                        <div className="relative w-11 h-11 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="22" cy="22" r="18" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
                            <circle cx="22" cy="22" r="18" stroke="#7C3AED" strokeWidth="4" fill="transparent" strokeDasharray="113" strokeDashoffset="28" strokeLinecap="round" />
                          </svg>
                          <span className="absolute text-[9px] font-mono font-bold text-slate-900">75%</span>
                        </div>
                      </div>
                      {/* Minor items */}
                      <div className="space-y-2">
                        <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl flex items-center justify-between">
                          <span className="text-xs text-slate-700 font-medium">Verify sandbox DevOps triggers</span>
                          <span className="bg-blue-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Low</span>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl flex items-center justify-between">
                          <span className="text-xs text-slate-700 font-medium">Review sprint reports velocity logs</span>
                          <span className="bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Medium</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {feature.mockupType === 'upcoming' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold text-slate-800">Timeline Scheduler</span>
                        <span className="text-[10px] text-rose-600 font-bold bg-rose-50 border border-rose-100/50 px-2 py-0.5 rounded">Weekly View</span>
                      </div>
                      
                      {/* Grid representation */}
                      <div className="grid grid-cols-3 gap-2.5">
                        
                        {/* Column Today */}
                        <div className="space-y-2">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 border-b pb-1">Today (Jul 20)</p>
                          <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-lg space-y-1">
                            <p className="text-[10px] font-bold text-rose-700 leading-tight">Mkt Strategy</p>
                            <span className="text-[8px] text-rose-500 block">5:00 PM</span>
                          </div>
                          <div className="p-2.5 bg-slate-50 border border-slate-200/40 rounded-lg">
                            <p className="text-[10px] font-medium text-slate-600 leading-tight">QA Testing</p>
                          </div>
                        </div>

                        {/* Column Tomorrow */}
                        <div className="space-y-2">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 border-b pb-1">Tomorrow</p>
                          <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-lg space-y-1">
                            <p className="text-[10px] font-bold text-amber-700 leading-tight">Twitter Assets</p>
                            <span className="text-[8px] text-amber-500 block">9:00 AM</span>
                          </div>
                        </div>

                        {/* Column Later */}
                        <div className="space-y-2">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 border-b pb-1">Later</p>
                          <div className="p-2.5 bg-slate-50 border border-slate-200/40 rounded-lg">
                            <p className="text-[10px] font-medium text-slate-600 leading-tight">Dev Sync</p>
                          </div>
                          <div className="p-2.5 bg-slate-50 border border-slate-200/40 rounded-lg">
                            <p className="text-[10px] font-medium text-slate-600 leading-tight">API Review</p>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {feature.mockupType === 'collab' && (
                    <div className="space-y-4">
                      {/* Header with active presence stacks */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold text-slate-800">Card Presence Sync</span>
                        <div className="flex -space-x-1.5 items-center">
                          <div className="relative">
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" className="w-5.5 h-5.5 rounded-full border border-white" alt="Elena" />
                            <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-white" />
                          </div>
                          <div className="relative">
                            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" className="w-5.5 h-5.5 rounded-full border border-white" alt="Marcus" />
                            <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-white" />
                          </div>
                          <div className="relative">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" className="w-5.5 h-5.5 rounded-full border border-white" alt="Sarah" />
                            <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-white" />
                          </div>
                          <span className="text-[9px] font-mono text-slate-400 font-bold ml-1">+3 active</span>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="bg-gradient-to-r from-[#4338CA] to-[#06B6D4] text-white text-[8px] font-black px-1.5 py-0.5 rounded">SHARED TASK</span>
                          <span className="text-[9px] font-mono text-slate-400">ID: t-30495</span>
                        </div>
                        <p className="text-xs font-bold text-slate-800">Deploy production release v2.4</p>
                        
                        {/* Feed comment */}
                        <div className="border-t border-slate-200/50 pt-2.5 flex gap-2">
                          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" className="w-5 h-5 rounded-full object-cover shrink-0" alt="Elena" />
                          <div className="bg-white p-2 border border-slate-200/40 rounded-lg text-[10px] leading-relaxed text-slate-600 flex-1">
                            <span className="font-bold text-slate-800 block">Elena Rostova</span>
                            "Build verified in staging. Deploy ready to launch!"
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {feature.mockupType === 'analytics' && (
                    <div className="space-y-4">
                      {/* Completed view logs */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                          <Trophy size={14} />
                          <span>Historical Milestones</span>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded">92% SPEED</span>
                      </div>

                      {/* Achievement Widget mockup */}
                      <div className="p-4 bg-gradient-to-br from-emerald-50/40 via-[#f4fef8] to-[#e6faf0]/30 border border-emerald-100/40 rounded-xl text-center flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                          <Trophy size={20} className="text-emerald-500 fill-current" />
                        </div>
                        <p className="text-xs font-bold text-slate-800">Sprint Cycle Complete</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Your team completed 12% faster than last cycle</p>
                      </div>

                      <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/40 rounded-lg text-xs font-medium text-slate-500">
                        <span>Total Deliverables Resolved:</span>
                        <span className="font-bold font-mono text-slate-800">18 tasks</span>
                      </div>
                    </div>
                  )}

                </TiltCard>
              </div>

            </div>
          );
        })}

      </section>


      {/* 5. Interactive Stats Section - Dark Base with Rose -> Amber combo blobs */}
      <section className="bg-[#111114] text-white py-20 md:py-28 relative overflow-hidden select-none px-6">
        
        {/* Soft layout background glows: combo of Rose & Amber */}
        <motion.div 
          animate={{ x: [-10, 15, -5, -10], y: [10, -20, 10, 10], scale: [1, 1.05, 0.95, 1] }}
          transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#F43F5E]/8 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ x: [15, -10, 5, 15], y: [-15, 10, -10, -15], scale: [1, 0.97, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#FBBF24]/6 rounded-full blur-3xl" 
        />
        
        <div className="max-w-7xl mx-auto relative z-10 space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="px-3 py-1 bg-[#F43F5E]/15 text-[#FBBF24] border border-[#F43F5E]/20 text-[10px] font-bold uppercase rounded-full tracking-widest inline-flex items-center gap-1.5">
              <Zap size={11} className="fill-current text-[#FBBF24]" />
              VELOCITY METRICS
            </span>
            <h2 className="font-display font-black text-2xl md:text-4xl text-white tracking-tight leading-tight">
              Scale without slowing down
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
            
            {/* Stat Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl flex flex-col justify-between h-44 hover:bg-white/[0.05] hover:border-white/10 transition-all group"
            >
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F43F5E] to-[#FBBF24] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-300"
              >
                <CheckCircle2 size={18} />
              </motion.div>
              <div>
                <AnimatedCounter value={2} suffix="M+" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tasks Cleared</p>
              </div>
            </motion.div>

            {/* Stat Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl flex flex-col justify-between h-44 hover:bg-white/[0.05] hover:border-white/10 transition-all group"
            >
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-300"
              >
                <Users size={18} />
              </motion.div>
              <div>
                <AnimatedCounter value={10000} suffix="+" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active Teams</p>
              </div>
            </motion.div>

            {/* Stat Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl flex flex-col justify-between h-44 hover:bg-white/[0.05] hover:border-white/10 transition-all group"
            >
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#10B981] to-[#14B8A6] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-300"
              >
                <Trophy size={18} />
              </motion.div>
              <div>
                <AnimatedCounter value={98} suffix="%" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Satisfaction Rate</p>
              </div>
            </motion.div>

            {/* Stat Card 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl flex flex-col justify-between h-44 hover:bg-white/[0.05] hover:border-white/10 transition-all group"
            >
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut" }}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4338CA] to-[#06B6D4] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-300"
              >
                <Zap size={18} />
              </motion.div>
              <div>
                <AnimatedCounter value={24} suffix="/7" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Concierge Care</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* 6. Testimonials / Reviews */}
      <section id="reviews" className="py-20 md:py-32 bg-[#f4f3f8] px-6 select-none overflow-hidden">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          
          <div className="space-y-3">
            <span className="px-3 py-1 bg-purple-50 text-purple-600 border border-purple-100/50 text-[10px] font-bold uppercase rounded-full tracking-widest inline-flex items-center gap-1">
              <Star size={11} className="fill-current text-purple-500" />
              SUCCESS REGISTRIES
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-slate-900 tracking-tight">
              Endorsed by high-velocity builders
            </h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              Read how developers, product leads, and founders leverage our workspace to ship.
            </p>
          </div>

          {/* Testimonial Desktop Slider View (3 side-by-side with active highlighted, others dimmed/scaled) */}
          <div className="hidden md:grid grid-cols-3 gap-6 items-center pt-4">
            {testimonials.map((t, idx) => {
              const isActive = idx === activeTestimonial;
              return (
                <motion.div
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  animate={{
                    scale: isActive ? 1.05 : 0.92,
                    opacity: isActive ? 1 : 0.55,
                    y: isActive ? -4 : 4,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`relative p-8 rounded-[24px] border border-slate-200/60 bg-white cursor-pointer select-none transition-all duration-300 ${
                    isActive ? 'breathe-primary shadow-xl z-10 border-transparent' : 'hover:opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-1 text-amber-500 mb-4 justify-start">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} size={14} className="fill-current" />
                    ))}
                  </div>

                  <p className="text-slate-700 text-xs md:text-sm leading-relaxed text-left italic mb-6">
                    "{t.quote}"
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <img 
                      src={t.avatar} 
                      alt={t.name} 
                      className="w-10 h-10 rounded-full border border-slate-200 object-cover shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-900 leading-none">{t.name}</p>
                      <p className="text-[10px] text-slate-400 mt-1 leading-none">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile swipeable single-card view with dot pagination */}
          <div className="md:hidden w-full max-w-md mx-auto pt-4 relative">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.x < -40) {
                  setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
                } else if (info.offset.x > 40) {
                  setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
                }
              }}
              className="relative p-6 rounded-[24px] border border-slate-200/60 bg-white breathe-primary shadow-lg cursor-grab active:cursor-grabbing text-left space-y-4"
            >
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: testimonials[activeTestimonial].stars }).map((_, i) => (
                  <Star key={i} size={14} className="fill-current" />
                ))}
              </div>

              <p className="text-slate-700 text-xs leading-relaxed italic">
                "{testimonials[activeTestimonial].quote}"
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <img 
                  src={testimonials[activeTestimonial].avatar} 
                  alt={testimonials[activeTestimonial].name} 
                  className="w-9 h-9 rounded-full border border-slate-200 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-none">{testimonials[activeTestimonial].name}</p>
                  <p className="text-[9px] text-slate-400 mt-1 leading-none">{testimonials[activeTestimonial].role}</p>
                </div>
              </div>
            </motion.div>
            
            <p className="text-[9px] text-slate-400 mt-2">← Swipe to navigate →</p>

            {/* Pagination dots */}
            <div className="flex justify-center gap-2 pt-4">
              {testimonials.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                    activeTestimonial === idx 
                      ? 'bg-purple-600 w-5' 
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>


      {/* 7. Pricing Preview */}
      <section id="pricing" className="py-20 md:py-32 bg-[#ffffff] border-t border-slate-200/50 px-6">
        <div className="max-w-7xl mx-auto space-y-12 text-center">
          
          <div className="space-y-3">
            <span className="px-3 py-1 bg-purple-50 text-purple-600 border border-purple-100/50 text-[10px] font-bold uppercase rounded-full tracking-widest inline-flex items-center gap-1">
              <Check className="stroke-[3] w-3 h-3 text-purple-500" />
              FAIR & SIMPLE TIERING
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-slate-900 tracking-tight">
              A plan for every scale
            </h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              Choose the velocity that matches your workflow. Cancel or adjust anytime.
            </p>

            {/* Billing Cycle Switch */}
            <div className="flex items-center justify-center gap-3 pt-6 select-none">
              <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>Monthly Billing</span>
              <button 
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-purple-600 focus:outline-none"
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  billingCycle === 'yearly' ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
              <span className={`text-xs font-bold flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>
                Yearly Billing
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">SAVE 20%</span>
              </span>
            </div>
          </div>

          {/* Pricing Cards Grid using staggered Premium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto pt-6 text-left">
            
            {/* Free Plan */}
            <PremiumCard accent="success" delay={0}>
              <div className="flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-slate-900">Starter Core</h3>
                    <p className="text-[11px] text-slate-400 leading-none mt-1">Perfect for single-player organization</p>
                  </div>
                  <div className="flex items-baseline">
                    <span className="font-display font-black text-4xl text-slate-900">$0</span>
                    <span className="text-xs text-slate-400 ml-1">/ lifetime</span>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-xs text-slate-600">
                      <Check size={14} className="text-emerald-500 stroke-[3.5] shrink-0" />
                      <span>Up to 25 tasks database</span>
                    </li>
                    <li className="flex items-center gap-2 text-xs text-slate-600">
                      <Check size={14} className="text-emerald-500 stroke-[3.5] shrink-0" />
                      <span>Local synchronization queue</span>
                    </li>
                    <li className="flex items-center gap-2 text-xs text-slate-600">
                      <Check size={14} className="text-emerald-500 stroke-[3.5] shrink-0" />
                      <span>Core Overview/Inbox panels</span>
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => navigate('/overview')}
                  className="w-full py-3 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer text-center"
                >
                  Get Started Core
                </button>
              </div>
            </PremiumCard>

            {/* Pro Plan (Elevated with Pulse & Premium shadow) */}
            <PremiumCard accent="primary" delay={0.1} isPopular={true} className="transform md:scale-105">
              {/* Most Popular badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#F97316] text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow">
                Most Popular
              </div>

              <div className="flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4 pt-1">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-slate-900">Premium Pro</h3>
                    <p className="text-[11px] text-purple-600 font-bold leading-none mt-1">For power builders and teams</p>
                  </div>
                  <div className="flex items-baseline">
                    <span className="font-display font-black text-4xl text-slate-900">
                      {billingCycle === 'monthly' ? '$9' : '$7'}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">/ user / mo</span>
                  </div>
                  <div className="h-px bg-purple-100/50" />
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-xs text-slate-600">
                      <Check size={14} className="text-purple-600 stroke-[3.5] shrink-0" />
                      <span className="font-semibold text-slate-800">Unlimited tasks database</span>
                    </li>
                    <li className="flex items-center gap-2 text-xs text-slate-600">
                      <Check size={14} className="text-purple-600 stroke-[3.5] shrink-0" />
                      <span>Weekly efficiency reports</span>
                    </li>
                    <li className="flex items-center gap-2 text-xs text-slate-600">
                      <Check size={14} className="text-purple-600 stroke-[3.5] shrink-0" />
                      <span>Real-time presence collaboration</span>
                    </li>
                    <li className="flex items-center gap-2 text-xs text-slate-600">
                      <Check size={14} className="text-purple-600 stroke-[3.5] shrink-0" />
                      <span>Custom tags & priority matrices</span>
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => navigate('/overview')}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#F97316] hover:brightness-110 shadow-md shadow-purple-500/15 transition-all cursor-pointer text-center uppercase tracking-wider text-[10px]"
                >
                  Start Premium Trial
                </button>
              </div>
            </PremiumCard>

            {/* Team Plan */}
            <PremiumCard accent="secondary" delay={0.2}>
              <div className="flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-slate-900">Enterprise Team</h3>
                    <p className="text-[11px] text-slate-400 leading-none mt-1">Total control for organizations</p>
                  </div>
                  <div className="flex items-baseline">
                    <span className="font-display font-black text-4xl text-slate-900">
                      {billingCycle === 'monthly' ? '$29' : '$23'}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">/ user / mo</span>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-xs text-slate-600">
                      <Check size={14} className="text-indigo-600 stroke-[3.5] shrink-0" />
                      <span className="font-semibold text-slate-800">Everything in Premium Pro</span>
                    </li>
                    <li className="flex items-center gap-2 text-xs text-slate-600">
                      <Check size={14} className="text-indigo-600 stroke-[3.5] shrink-0" />
                      <span>Custom developer webhooks</span>
                    </li>
                    <li className="flex items-center gap-2 text-xs text-slate-600">
                      <Check size={14} className="text-indigo-600 stroke-[3.5] shrink-0" />
                      <span>Advanced team-level permissions</span>
                    </li>
                    <li className="flex items-center gap-2 text-xs text-slate-600">
                      <Check size={14} className="text-indigo-600 stroke-[3.5] shrink-0" />
                      <span>Dedicated SLA & Support desk</span>
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => navigate('/overview')}
                  className="w-full py-3 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer text-center"
                >
                  Contact Sales
                </button>
              </div>
            </PremiumCard>

          </div>

        </div>
      </section>


      {/* 8. FAQ Accordion */}
      <section id="faq" className="py-20 md:py-32 bg-[#f4f3f8] px-6">
        <div className="max-w-3xl mx-auto space-y-12 text-left">
          
          <div className="text-center space-y-3 max-w-md mx-auto select-none">
            <span className="px-3 py-1 bg-purple-50 text-purple-600 border border-purple-100/50 text-[10px] font-bold uppercase rounded-full tracking-widest inline-flex items-center gap-1">
              <MessageSquare size={11} className="text-purple-500" />
              FAQ REGISTRY
            </span>
            <h2 className="font-display font-black text-2xl md:text-3xl text-slate-900 tracking-tight">
              Frequently Queried Codes
            </h2>
          </div>

          <div className="space-y-4" id="faq-accordion-list">
            {faqData.map((faq, idx) => {
              const isOpen = activeFAQ === idx;
              return (
                <div 
                  key={idx} 
                  className="border border-slate-200/70 rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFAQ(isOpen ? null : idx)}
                    className="w-full py-5 px-6 flex items-center justify-between text-left focus:outline-none hover:bg-slate-50/50 transition-colors cursor-pointer"
                    id={`faq-btn-${idx}`}
                  >
                    <span className="text-sm font-bold text-slate-800 leading-tight">{faq.q}</span>
                    <ChevronDown 
                      size={16} 
                      className={`text-slate-400 transition-transform duration-300 shrink-0 ml-4 ${
                        isOpen ? 'rotate-180 text-purple-600' : ''
                      }`} 
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-5 text-xs md:text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* 9. Final CTA Banner - Dark base with Indigo -> Cyan wash */}
      <section className="py-20 md:py-28 bg-[#111114] text-white relative overflow-hidden select-none px-6">
        
        {/* Soft glowing absolute elements: Combo of Indigo & Cyan */}
        <motion.div 
          animate={{ x: [0, 30, -15, 0], y: [0, -20, 30, 0], scale: [1, 1.06, 0.94, 1] }}
          transition={{ repeat: Infinity, duration: 13, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-96 h-96 bg-[#4338CA]/10 blur-3xl rounded-full" 
        />
        <motion.div 
          animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0], scale: [1, 0.95, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-[#06B6D4]/8 blur-3xl rounded-full" 
        />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-[#06B6D4] bg-[#06B6D4]/10 border border-[#06B6D4]/20 uppercase tracking-widest">
            <Zap size={11} className="fill-current text-[#06B6D4]" /> High Velocity Productivity
          </span>

          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight leading-none text-white">
            Ready to get more done today?
          </h2>

          <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
            Synchronize workspace milestones, audit daily objectives, and reclaim speed. 
            No credit card required. Cancel or adjust anytime.
          </p>

          <div className="pt-4">
            <motion.button 
              onClick={() => navigate('/overview')}
              whileHover={{ scale: 1.05, filter: 'brightness(1.15)', boxShadow: '0 0 30px rgba(124, 58, 237, 0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4.5 rounded-xl text-xs md:text-sm font-black text-white bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#F97316] transition-all cursor-pointer shadow-2xl shadow-purple-500/20 text-center uppercase tracking-widest inline-flex items-center gap-2 duration-300"
            >
              Start Free — No Card Required
              <ArrowRight size={14} className="stroke-[3]" />
            </motion.button>
          </div>

          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Loved by founders, product directors, and builders</p>
        </div>
      </section>


      {/* 10. Footer */}
      <footer className="bg-[#111114] text-slate-400 py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 text-left">
          
          {/* Brand/Tagline */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#7C3AED] via-[#EC4899] to-[#F97316] flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-white stroke-[4.5]" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-white">TaskFlow</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              TaskFlow is a premium SaaS productivity platform constructed with clean, type-safe engines, serving power builders across software workspaces.
            </p>
            {/* Social icons with hover fill */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-purple-600 hover:border-transparent transition-all">
                <Smartphone size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-purple-600 hover:border-transparent transition-all">
                <Mail size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-purple-600 hover:border-transparent transition-all">
                <MessageSquare size={14} />
              </a>
            </div>
          </div>

          {/* Links Columns: Accordions on Mobile, standard list grids on Desktop */}
          <div className="md:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Column 1: Workspace */}
            <div className="space-y-3">
              <button 
                onClick={() => setExpandedFooterGroup(expandedFooterGroup === 'workspace' ? null : 'workspace')}
                className="w-full md:pointer-events-none flex items-center justify-between text-left focus:outline-none cursor-pointer"
              >
                <h4 className="text-[10px] font-bold font-display uppercase tracking-widest text-slate-300">Workspace</h4>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 md:hidden ${expandedFooterGroup === 'workspace' ? 'rotate-180 text-purple-400' : ''}`} />
              </button>

              {/* Desktop Always Visible List */}
              <ul className="hidden md:block space-y-2 text-xs">
                <li><a href="#product" className="hover:text-white transition-colors">Product Overview</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Core Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">SaaS Pricing</a></li>
                <li><a href="#reviews" className="hover:text-white transition-colors">User Reviews</a></li>
              </ul>

              {/* Mobile Accordion */}
              <AnimatePresence initial={false}>
                {expandedFooterGroup === 'workspace' && (
                  <motion.ul 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2 text-xs overflow-hidden flex flex-col md:hidden"
                  >
                    <li><a href="#product" className="hover:text-white transition-colors block py-1">Product Overview</a></li>
                    <li><a href="#features" className="hover:text-white transition-colors block py-1">Core Features</a></li>
                    <li><a href="#pricing" className="hover:text-white transition-colors block py-1">SaaS Pricing</a></li>
                    <li><a href="#reviews" className="hover:text-white transition-colors block py-1">User Reviews</a></li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Column 2: Resources */}
            <div className="space-y-3">
              <button 
                onClick={() => setExpandedFooterGroup(expandedFooterGroup === 'resources' ? null : 'resources')}
                className="w-full md:pointer-events-none flex items-center justify-between text-left focus:outline-none cursor-pointer"
              >
                <h4 className="text-[10px] font-bold font-display uppercase tracking-widest text-slate-300">Resources</h4>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 md:hidden ${expandedFooterGroup === 'resources' ? 'rotate-180 text-purple-400' : ''}`} />
              </button>

              {/* Desktop Always Visible List */}
              <ul className="hidden md:block space-y-2 text-xs">
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ Support</a></li>
                <li><button onClick={() => navigate('/help')} className="hover:text-white transition-colors text-left bg-transparent border-none p-0 cursor-pointer focus:outline-none">Help Desk Center</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Security Desk</a></li>
                <li><button onClick={() => navigate('/settings')} className="hover:text-white transition-colors text-left bg-transparent border-none p-0 cursor-pointer focus:outline-none">Settings Account</button></li>
              </ul>

              {/* Mobile Accordion */}
              <AnimatePresence initial={false}>
                {expandedFooterGroup === 'resources' && (
                  <motion.ul 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2 text-xs overflow-hidden flex flex-col md:hidden"
                  >
                    <li><a href="#faq" className="hover:text-white transition-colors block py-1">FAQ Support</a></li>
                    <li><button onClick={() => { setIsMobileMenuOpen(false); navigate('/help'); }} className="hover:text-white transition-colors block py-1 text-left bg-transparent border-none p-0 cursor-pointer">Help Desk Center</button></li>
                    <li><a href="#" className="hover:text-white transition-colors block py-1">Security Desk</a></li>
                    <li><button onClick={() => { setIsMobileMenuOpen(false); navigate('/settings'); }} className="hover:text-white transition-colors block py-1 text-left bg-transparent border-none p-0 cursor-pointer">Settings Account</button></li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Newsletter signup */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[10px] font-bold font-display uppercase tracking-widest text-slate-300">Subscribe Newsletter</h4>
            <p className="text-xs text-slate-500 leading-normal">
              Keep updated with our latest core performance features, tutorials, and roadmap plans.
            </p>
            {subscribed ? (
              <p className="text-emerald-400 text-xs font-semibold bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-center flex items-center justify-center gap-1.5">
                <Check size={14} className="stroke-[3]" /> Successfully subscribed! Welcome aboard.
              </p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }} className="flex gap-2 w-full pt-1">
                <input 
                  type="email" 
                  placeholder="developer@work.com"
                  required
                  className="w-full px-3.5 py-2 text-xs bg-white/[0.04] border border-white/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-white placeholder:text-slate-600 transition-all"
                />
                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#EC4899] transition-all cursor-pointer shrink-0"
                >
                  Join
                </motion.button>
              </form>
            )}
          </div>

        </div>

        {/* Copyright strip */}
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
          <p>© 2026 TaskFlow. All Registries Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of workspace</a>
          </div>
        </div>

      </footer>


      {/* Video Demo Modal popup */}
      <AnimatePresence>
        {showDemoModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/85 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl max-w-2xl w-full text-left space-y-4 relative"
            >
              <button 
                onClick={() => setShowDemoModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="font-display font-extrabold text-xl text-slate-900 tracking-tight flex items-center gap-1.5 pt-1">
                <Sparkles size={18} className="text-purple-600" />
                TaskFlow Workspace Demo
              </h3>

              <div className="aspect-video w-full bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center text-slate-400 gap-3 border border-slate-800">
                <div className="w-14 h-14 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-500 animate-pulse border border-purple-500/30">
                  <Play size={24} className="fill-current text-purple-500 ml-1" />
                </div>
                <p className="text-xs font-mono font-bold tracking-widest uppercase">Streaming video pipeline offline demo</p>
                <p className="text-[10px] text-slate-600 max-w-[250px] text-center">In actual live sandbox context, workspace features load dynamically in standard browser iframe.</p>
              </div>

              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono uppercase tracking-wider select-none border-t border-slate-100 pt-3">
                <span>DUR: 2MIN 45SEC</span>
                <span>RESOLVED: 1080P PRO</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
