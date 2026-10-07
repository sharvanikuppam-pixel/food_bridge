import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, AlertOctagon, XCircle } from 'lucide-react';

interface UrgencyBadgeProps {
  expiresAt: string;
  urgency?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EXPIRED';
  showCountdown?: boolean;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({
  expiresAt,
  urgency: initialUrgency,
  showCountdown = true,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    text: string;
    level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EXPIRED';
  }>({ text: 'Calculating...', level: initialUrgency || 'MEDIUM' });

  useEffect(() => {
    const updateCountdown = () => {
      const expiry = new Date(expiresAt).getTime();
      const now = new Date().getTime();
      const diffMs = expiry - now;

      if (diffMs <= 0) {
        setTimeLeft({ text: 'EXPIRED', level: 'EXPIRED' });
        return;
      }

      const totalMinutes = Math.floor(diffMs / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EXPIRED' = 'LOW';
      if (totalMinutes < 30) {
        level = 'CRITICAL';
      } else if (totalMinutes <= 120) {
        level = 'HIGH';
      } else if (totalMinutes <= 360) {
        level = 'MEDIUM';
      }

      let timeText = '';
      if (hours > 0) {
        timeText = `${hours}h ${minutes}m`;
      } else if (minutes > 0) {
        timeText = `${minutes}m ${seconds}s`;
      } else {
        timeText = `${seconds}s`;
      }

      setTimeLeft({ text: `Expires in ${timeText}`, level });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const levelStyles = {
    LOW: {
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      badge: 'bg-emerald-500 text-white',
      icon: CheckCircle,
      label: 'LOW URGENCY',
    },
    MEDIUM: {
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      badge: 'bg-amber-500 text-slate-950',
      icon: Clock,
      label: 'MEDIUM URGENCY',
    },
    HIGH: {
      bg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
      badge: 'bg-orange-500 text-white',
      icon: AlertTriangle,
      label: 'HIGH URGENCY',
    },
    CRITICAL: {
      bg: 'bg-red-500/15 border-red-500/40 text-red-400 animate-pulse',
      badge: 'bg-red-600 text-white font-bold',
      icon: AlertOctagon,
      label: 'CRITICAL URGENCY',
    },
    EXPIRED: {
      bg: 'bg-slate-700/20 border-slate-700 text-slate-400',
      badge: 'bg-slate-600 text-white',
      icon: XCircle,
      label: 'EXPIRED',
    },
  };

  const style = levelStyles[timeLeft.level] || levelStyles.MEDIUM;
  const Icon = style.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${style.bg}`}>
      <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold ${style.badge}`}>
        {style.label}
      </span>
      {showCountdown && (
        <span className="flex items-center gap-1 font-mono tracking-tight font-semibold">
          <Icon className="w-3.5 h-3.5" />
          {timeLeft.text}
        </span>
      )}
    </div>
  );
};
