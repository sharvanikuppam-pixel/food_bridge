import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Award, Heart, Utensils, Loader2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { fetchImpactStats, generateAIImpactStory } from '../../lib/api';

export const ImpactAnalyticsPage: React.FC = () => {
  const [impact, setImpact] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiStory, setAiStory] = useState<string | null>(null);
  const [loadingStory, setLoadingStory] = useState(false);

  useEffect(() => {
    fetchImpactStats()
      .then((res) => {
        if (res.success) setImpact(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleGenerateStory = async () => {
    setLoadingStory(true);
    try {
      const res = await generateAIImpactStory({
        food_name: 'Paneer Curry & Rice',
        servings: 50,
        ngo_name: 'Hope Community Kitchen',
        donor_name: 'Priya Sharma',
      });
      if (res.success && res.story) setAiStory(res.story);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStory(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        <span className="text-xs text-slate-500">Preparing your impact summary...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Your impact</h1>
          <p className="text-xs text-slate-500 mt-1">See how your surplus food helps your local community</p>
        </div>

        <button
          onClick={handleGenerateStory}
          disabled={loadingStory}
          className="btn-secondary text-xs"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          {loadingStory ? 'Writing story...' : '✨ Generate AI Impact Story'}
        </button>
      </div>

      {/* AI Story Callout */}
      {aiStory && (
        <div className="card-clean p-6 bg-amber-50/60 border-amber-200 space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-amber-600" /> AI Impact Story
          </div>
          <p className="text-sm text-slate-800 italic leading-relaxed">
            "{aiStory}"
          </p>
        </div>
      )}

      {/* Big Hero Impact Highlight Card */}
      <div className="card-clean p-8 bg-gradient-to-r from-brand-600 to-brand-700 text-white text-center space-y-2">
        <span className="text-xs uppercase font-extrabold tracking-wider text-brand-200">Environmental Rescue</span>
        <div className="text-4xl sm:text-5xl font-extrabold">You helped rescue 320 kg of food</div>
        <p className="text-xs text-brand-100 max-w-sm mx-auto">
          Diverted surplus meals from landfills to community feeding centers.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card-clean p-5 text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-brand-600">{impact?.totalMeals || 1240}</div>
          <div className="text-xs text-slate-500 font-semibold mt-1">Meals Donated</div>
        </div>
        <div className="card-clean p-5 text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">{impact?.peopleReached || 1100}</div>
          <div className="text-xs text-slate-500 font-semibold mt-1">People Reached</div>
        </div>
        <div className="card-clean p-5 text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">{impact?.totalKgRescued || 320} kg</div>
          <div className="text-xs text-slate-500 font-semibold mt-1">Food Rescued</div>
        </div>
      </div>

      {/* One Clean Meaningful Chart */}
      <div className="card-clean p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900">Rescued Meals Growth</h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={impact?.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="meals" stroke="#16a34a" strokeWidth={3} dot={{ r: 4, fill: '#16a34a' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
