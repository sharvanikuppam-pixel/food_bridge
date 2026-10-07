import React, { useState } from 'react';
import { Sparkles, MapPin, CheckCircle2, ShieldCheck, ChevronRight, Loader2, X } from 'lucide-react';
import { explainAIMatch } from '../lib/api';

interface MatchingCardProps {
  ngo: {
    id: string;
    organization_name: string;
    service_area: string;
    capacity: number;
    description: string;
    verified: boolean;
  };
  score: number;
  reasons: string[];
  breakdown?: any;
  donation?: any;
  onClaim?: (ngoId: string) => void;
  isClaimed?: boolean;
}

export const MatchingCard: React.FC<MatchingCardProps> = ({
  ngo,
  score,
  reasons,
  breakdown,
  donation,
  onClaim,
  isClaimed = false,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleFetchAiExplanation = async () => {
    setShowExplanation(true);
    if (aiExplanation) return;

    setLoadingAi(true);
    try {
      const res = await explainAIMatch(
        donation || { food_name: 'Food Donation', servings: 50, food_type: 'vegetarian', address: ngo.service_area },
        ngo,
        score,
        reasons
      );
      if (res.success && res.explanation) {
        setAiExplanation(res.explanation);
      }
    } catch (err) {
      console.error(err);
      setAiExplanation(
        `This donation is a ${score}% match because ${ngo.organization_name} is located nearby (${breakdown?.distanceKm || 2.4} km away), has sufficient capacity, and operates in this area.`
      );
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="card-clean card-clean-hover p-5 space-y-4 relative flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-base text-slate-900">{ngo.organization_name}</h3>
              {ngo.verified && <ShieldCheck className="w-4 h-4 text-brand-600" />}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">📍 {ngo.service_area}</p>
          </div>

          <div className="px-3 py-1 rounded-xl bg-brand-100 text-brand-700 font-extrabold text-sm">
            {score}% Match
          </div>
        </div>

        <div className="space-y-1.5 my-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700">
          {reasons.map((reason, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
        <button
          onClick={handleFetchAiExplanation}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Why this match?
        </button>

        {onClaim && (
          <button
            onClick={() => onClaim(ngo.id)}
            disabled={isClaimed}
            className="btn-primary text-xs py-2 px-4"
          >
            {isClaimed ? 'Claimed' : 'Select Organization'}
          </button>
        )}
      </div>

      {/* AI Explanation Modal */}
      {showExplanation && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-xl space-y-4 relative animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setShowExplanation(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Why this organization is a good match
            </div>

            {loadingAi ? (
              <div className="p-6 flex flex-col items-center justify-center gap-2 text-slate-500 text-xs">
                <Loader2 className="w-5 h-5 text-brand-600 animate-spin" />
                <span>Asking AI coordinator...</span>
              </div>
            ) : (
              <p className="text-xs text-slate-700 leading-relaxed bg-brand-50/60 p-4 rounded-2xl border border-brand-100">
                "{aiExplanation}"
              </p>
            )}

            <button
              onClick={() => setShowExplanation(false)}
              className="btn-secondary w-full text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
