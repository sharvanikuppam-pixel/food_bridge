import React, { useState, useEffect } from 'react';
import { Heart, Utensils, ShieldCheck, MapPin, Sparkles, Building2 } from 'lucide-react';
import { fetchImpactStats } from '../../lib/api';
import { InteractiveMap } from '../../components/InteractiveMap';

export const NGOImpactPage: React.FC = () => {
  const [impactData, setImpactData] = useState<any>(null);

  useEffect(() => {
    fetchImpactStats()
      .then((res) => {
        if (res.success) setImpactData(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-2">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Heart className="w-6 h-6 text-blue-400" /> NGO Community Impact Matrix
        </h1>
        <p className="text-xs text-slate-400">
          Tracking community food distribution, shelter meal service, and local environmental rescue.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Community Meals Distributed</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-brand-400 mt-2">
            {impactData?.totalMeals || 1240}
          </div>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">People Fed</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 mt-2">
            {impactData?.peopleReached || 1100}
          </div>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Food Rescued (kg)</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-2">
            {impactData?.totalKgRescued || 320} kg
          </div>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Average Dispatch Time</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 mt-2">
            34 mins
          </div>
        </div>
      </div>

      {/* Map View */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
        <h3 className="font-bold text-white text-base">Community Coverage Area Map</h3>
        <InteractiveMap
          centerLat={12.9650}
          centerLng={77.6010}
          zoom={12}
          height="h-80"
          pins={[
            { id: 'n1', name: 'Hope Community Kitchen', type: 'ngo', address: '14 Residency Road', lat: 12.9650, lng: 77.6010 },
            { id: 'n2', name: 'Helping Hands Foundation', type: 'ngo', address: '88 Koramangala', lat: 12.9380, lng: 77.6180 },
            { id: 'n3', name: 'Care & Share Center', type: 'ngo', address: '45 Whitefield', lat: 12.9698, lng: 77.7500 },
          ]}
        />
      </div>
    </div>
  );
};
