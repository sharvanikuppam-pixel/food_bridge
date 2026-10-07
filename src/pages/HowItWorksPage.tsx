import React from 'react';
import { Sparkles, ShieldCheck, Zap, Clock, MapPin, Scale, Heart, Utensils } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border border-brand-500/30 text-xs font-semibold text-brand-400">
          <Sparkles className="w-4 h-4 text-amber-400" /> Platform Architecture & System Principles
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          How <span className="gradient-text">FoodBridge AI</span> Operates
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
          Moving beyond simple CRUD lists to an intelligent, real-time coordination platform.
        </p>
      </div>

      {/* 5-Factor Matching System */}
      <section className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">1. Deterministic Smart Matching Engine</h2>
            <p className="text-xs text-slate-400">Section 5 Compliance Specification</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The backend calculates a deterministic match score ranging from 0% to 100% using five explicit parameters. AI is NOT used to invent random percentages; Gemini AI is used to synthesize human-readable explanations derived strictly from this mathematical breakdown.
        </p>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 font-mono text-xs text-brand-300 overflow-x-auto">
          Match Score = (Distance Score × 25%) + (Urgency Score × 25%) + (Capacity Score × 20%) + (Service Area Score × 15%) + (Food Compatibility Score × 15%)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <strong className="text-brand-400 block font-bold">Distance (25%)</strong>
            <p className="text-slate-400">Uses Haversine spherical distance formula to evaluate travel distance in kilometers between donor and recipient NGO.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <strong className="text-amber-400 block font-bold">Urgency (25%)</strong>
            <p className="text-slate-400">Prioritizes donations closer to safety expiration deadlines to prevent food spoilage.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <strong className="text-blue-400 block font-bold">NGO Capacity (20%)</strong>
            <p className="text-slate-400">Evaluates whether the NGO shelter has adequate storage and dining capacity for the total meal count.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <strong className="text-purple-400 block font-bold">Service Area (15%)</strong>
            <p className="text-slate-400">Verifies whether the donation address falls directly within the organization's designated community zone.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <strong className="text-teal-400 block font-bold">Food Compatibility (15%)</strong>
            <p className="text-slate-400">Matches vegetarian, non-vegetarian, and vegan dietary specifications with NGO dietary guidelines.</p>
          </div>
        </div>
      </section>

      {/* Urgency Engine Breakdown */}
      <section className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">2. Real-Time Urgency Engine</h2>
            <p className="text-xs text-slate-400">Section 6 Urgency Matrix</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 text-center space-y-1">
            <span className="text-xs font-extrabold text-emerald-400 uppercase">LOW</span>
            <div className="text-sm font-bold text-white">&gt; 6 Hours</div>
            <p className="text-[11px] text-slate-400">Flexible schedule</p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-center space-y-1">
            <span className="text-xs font-extrabold text-amber-400 uppercase">MEDIUM</span>
            <div className="text-sm font-bold text-white">2 – 6 Hours</div>
            <p className="text-[11px] text-slate-400">Standard dispatch</p>
          </div>
          <div className="p-4 rounded-2xl bg-orange-950/30 border border-orange-800/40 text-center space-y-1">
            <span className="text-xs font-extrabold text-orange-400 uppercase">HIGH</span>
            <div className="text-sm font-bold text-white">30m – 2 Hours</div>
            <p className="text-[11px] text-slate-400">Urgent pickup window</p>
          </div>
          <div className="p-4 rounded-2xl bg-red-950/30 border border-red-800/40 text-center space-y-1">
            <span className="text-xs font-extrabold text-red-400 uppercase">CRITICAL</span>
            <div className="text-sm font-bold text-white">&lt; 30 Minutes</div>
            <p className="text-[11px] text-slate-400">Immediate action needed</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
            <span className="text-xs font-extrabold text-slate-400 uppercase">EXPIRED</span>
            <div className="text-sm font-bold text-white">0 Minutes</div>
            <p className="text-[11px] text-slate-400">Safely delisted</p>
          </div>
        </div>
      </section>

      {/* Gemini AI Integration */}
      <section className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">3. Server-Side Gemini AI Architecture</h2>
            <p className="text-xs text-slate-400">Sections 11, 12, 13, 14, 25 Security & Integration</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          All AI calls are securely handled server-side through Express backend services. Your API keys are strictly stored in environment variables and never exposed to the client browser. If Gemini AI experiences network limits, robust fallbacks take over gracefully so the core application functions flawlessly.
        </p>
      </section>
    </div>
  );
};
