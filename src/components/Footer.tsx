import React from 'react';
import { Heart, Utensils, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-slate-950 font-bold">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white">FoodBridge AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Turning surplus food into community support. Built for BUILD-TO-SHIP Hackathon.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-amber-400 font-medium">
              <Sparkles className="w-3 h-3" /> Gemini 2.5 AI Powered Engine
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Platform Roles</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/donor/dashboard" className="hover:text-brand-400 transition-colors">Food Donors Portal</Link></li>
              <li><Link to="/ngo/dashboard" className="hover:text-brand-400 transition-colors">NGO & Shelter Partners</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-brand-400 transition-colors">Admin Governance</Link></li>
              <li><Link to="/donor/create-donation" className="hover:text-brand-400 transition-colors">Create Donation</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Smart Features</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Deterministic Smart Matching (5-factor algorithm)</li>
              <li>Real-time Urgency & Expiry Engine</li>
              <li>Gemini AI Match Explanation & Assistant</li>
              <li>Live Delivery Progress Timeline</li>
              <li>Location & Proximity Calculation</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Impact Metrics</h4>
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Meals Rescued:</span>
                <strong className="text-brand-400 font-bold">1,240+</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Food Saved:</span>
                <strong className="text-brand-400 font-bold">320 kg</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Avg Pickup Speed:</span>
                <strong className="text-emerald-400 font-bold">34 mins</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FoodBridge AI. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>for community impact.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
