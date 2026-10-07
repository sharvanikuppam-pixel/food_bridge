import React, { useState } from 'react';
import { Sparkles, Send, Loader2, CheckCircle2, RefreshCw, X } from 'lucide-react';
import { analyzeAIPrompt } from '../lib/api';

interface SuggestedDonation {
  food_name: string;
  food_type: 'vegetarian' | 'non-vegetarian' | 'vegan';
  quantity: number;
  unit: string;
  servings: number;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  suggested_description: string;
}

interface AIChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySuggestion: (suggestion: SuggestedDonation) => void;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({
  isOpen,
  onClose,
  onApplySuggestion,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestedDonation | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await analyzeAIPrompt(prompt);
      if (res.success && res.data) {
        setSuggestion(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (suggestion) {
      onApplySuggestion(suggestion);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-lg w-full p-6 rounded-2xl border border-slate-700 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-amber-400 mb-2">
          <Sparkles className="w-6 h-6 animate-pulse" />
          <h3 className="font-bold text-lg text-slate-100">AI Donation Assistant</h3>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Describe what food surplus you have in natural language (e.g. <em>"I have 40 biryani packets from a wedding event that need collection within 2 hours"</em>) and Gemini AI will structure the donation form automatically!
        </p>

        <form onSubmit={handleAnalyze} className="mb-4">
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 50 vegetarian paneer meal boxes ready at MG Road restaurant, expiry in 1.5 hours..."
              className="w-full p-3.5 pr-12 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-all resize-none"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="absolute bottom-3 right-3 p-2 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-white rounded-lg transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>

        {/* AI Suggested Output */}
        {suggestion && (
          <div className="p-4 bg-slate-900/90 border border-brand-500/40 rounded-xl mb-4 text-xs space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-brand-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400" /> Suggested Donation Details
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Urgency: {suggestion.urgency}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Food Name</span>
                <strong className="text-slate-100">{suggestion.food_name}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Food Type</span>
                <strong className="text-slate-100 capitalize">{suggestion.food_type}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Quantity</span>
                <strong className="text-slate-100">
                  {suggestion.quantity} {suggestion.unit} ({suggestion.servings} Servings)
                </strong>
              </div>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase mb-0.5">AI Description</span>
              <p className="text-slate-300 italic bg-slate-950/60 p-2 rounded border border-slate-800">
                "{suggestion.suggested_description}"
              </p>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-brand-600/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Confirm & Auto-Fill Form
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
