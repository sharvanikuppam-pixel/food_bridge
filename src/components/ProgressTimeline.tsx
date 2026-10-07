import React from 'react';
import { CheckCircle2, Circle, Truck, Package, Heart, AlertCircle, Clock } from 'lucide-react';

export type DonationStatus =
  | 'CREATED'
  | 'MATCHING'
  | 'CLAIMED'
  | 'PICKUP_ASSIGNED'
  | 'PICKUP_IN_PROGRESS'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED';

interface ProgressTimelineProps {
  status: DonationStatus;
  className?: string;
}

const STEPS = [
  { key: 'CREATED', label: 'Donation Created', icon: Package },
  { key: 'MATCHING', label: 'NGO Matched', icon: Clock },
  { key: 'CLAIMED', label: 'Donation Claimed', icon: CheckCircle2 },
  { key: 'PICKUP_ASSIGNED', label: 'Pickup Assigned', icon: Truck },
  { key: 'PICKUP_IN_PROGRESS', label: 'Pickup In Progress', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: Heart },
  { key: 'COMPLETED', label: 'Completed', icon: Heart },
];

export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ status, className = '' }) => {
  if (status === 'EXPIRED') {
    return (
      <div className={`p-4 rounded-xl bg-red-950/40 border border-red-800/40 text-red-400 flex items-center gap-3 ${className}`}>
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-sm">Donation Expired</h4>
          <p className="text-xs text-red-300/80">This donation was not claimed before its safety expiration deadline.</p>
        </div>
      </div>
    );
  }

  if (status === 'CANCELLED') {
    return (
      <div className={`p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 flex items-center gap-3 ${className}`}>
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-sm">Donation Cancelled</h4>
          <p className="text-xs text-slate-400/80">This donation listing was cancelled by the donor.</p>
        </div>
      </div>
    );
  }

  const getStepIndex = (st: string) => {
    switch (st) {
      case 'CREATED':
        return 0;
      case 'MATCHING':
        return 1;
      case 'CLAIMED':
        return 2;
      case 'PICKUP_ASSIGNED':
        return 3;
      case 'PICKUP_IN_PROGRESS':
        return 4;
      case 'DELIVERED':
        return 5;
      case 'COMPLETED':
        return 6;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className={`w-full overflow-x-auto py-3 ${className}`}>
      <div className="min-w-[650px] flex items-center justify-between relative px-4">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-800 -z-0" />

        {/* Active Progress Line */}
        <div
          className="absolute top-1/2 left-8 -translate-y-1/2 h-1 bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500 -z-0"
          style={{ width: `${(currentIndex / (STEPS.length - 1)) * 90}%` }}
        />

        {STEPS.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isFuture = idx > currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10 group">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 font-semibold text-xs ${
                  isDone
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                    : isCurrent
                    ? 'bg-emerald-400 text-slate-950 ring-4 ring-emerald-500/20 scale-110 animate-pulse'
                    : 'bg-slate-900 border border-slate-700 text-slate-500'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isCurrent ? (
                  <step.icon className="w-5 h-5 text-slate-950" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>

              <span
                className={`text-[11px] mt-2 font-medium tracking-tight whitespace-nowrap ${
                  isDone
                    ? 'text-slate-300 font-semibold'
                    : isCurrent
                    ? 'text-brand-400 font-bold'
                    : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
