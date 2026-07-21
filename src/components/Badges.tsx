import React from 'react';
import { Check } from 'lucide-react';

interface PriorityBadgeProps {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  id?: string;
}

export function PriorityBadge({ priority, id }: PriorityBadgeProps) {
  const getStyles = () => {
    switch (priority) {
      case 'HIGH':
        return 'bg-rose-500 text-white text-[9px] font-black px-2.5 py-0.5 rounded uppercase tracking-tighter';
      case 'MEDIUM':
        return 'bg-amber-500 text-white text-[9px] font-black px-2.5 py-0.5 rounded uppercase';
      case 'LOW':
        return 'bg-blue-500 text-white text-[9px] font-black px-2.5 py-0.5 rounded uppercase';
      default:
        return 'bg-slate-500 text-white text-[9px] font-black px-2.5 py-0.5 rounded uppercase';
    }
  };

  return (
    <span
      id={id}
      className={`inline-flex items-center transition-all duration-200 select-none cursor-default ${getStyles()}`}
    >
      {priority}
    </span>
  );
}

interface StatusBadgeProps {
  id?: string;
}

export function StatusBadge({ id }: StatusBadgeProps) {
  return (
    <span
      id={id}
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-500/10 hover:scale-105 transition-all duration-200 select-none cursor-default"
    >
      <Check size={10} className="stroke-[4]" />
      COMPLETED
    </span>
  );
}
