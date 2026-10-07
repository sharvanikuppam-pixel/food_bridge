import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, MapPin, Sparkles, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import { fetchDonationById, claimDonation } from '../../lib/api';
import { ProgressTimeline } from '../../components/ProgressTimeline';
import { UrgencyBadge } from '../../components/UrgencyBadge';
import { MatchingCard } from '../../components/MatchingCard';

export const DonationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [donation, setDonation] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetchDonationById(id);
      if (res.success && res.data) setDonation(res.data);
      const matchRes = await fetch(`/api/donations/${id}/matches`).then((r) => r.json());
      if (matchRes.success && matchRes.matches) setMatches(matchRes.matches);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleClaim = async (ngoId: string) => {
    if (!id) return;
    try {
      const res = await claimDonation(id, ngoId);
      if (res.success) loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        <span className="text-xs text-slate-500">Finding nearby organizations...</span>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Donation Not Found</h2>
        <Link to="/donor/dashboard" className="btn-secondary inline-flex text-xs">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const bestMatch = matches[0];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Top Navigation */}
      <Link to="/donor/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> Back to My Donations
      </Link>

      {/* MATCHED RESULT HIGHLIGHT (Section 9) */}
      {donation.status === 'CREATED' || donation.status === 'MATCHING' ? (
        <div className="card-clean p-6 bg-gradient-to-br from-brand-50 to-white border-brand-200 space-y-4">
          <div className="flex items-center gap-2 text-brand-700 font-bold text-sm">
            <Sparkles className="w-5 h-5 text-brand-600" /> Great! We found a nearby organization.
          </div>

          {bestMatch && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">{bestMatch.ngo.organization_name}</h3>
                  <p className="text-xs text-slate-500">📍 {bestMatch.breakdown.distanceKm} km away • Serves {bestMatch.ngo.service_area}</p>
                </div>
                <div className="px-3 py-1 rounded-xl bg-brand-100 text-brand-700 font-extrabold text-sm">
                  {bestMatch.score}% Match
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 bg-white p-3.5 rounded-xl border border-slate-200/80">
                {bestMatch.reasons.map((r: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleClaim(bestMatch.ngo.id)}
                className="btn-primary w-full text-sm"
              >
                Continue with this organization
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* DONATION TRACKING CARD (Section 10) */}
      <div className="card-clean p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">{donation.food_name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {donation.servings} Servings ({donation.food_type}) • {donation.address}
            </p>
          </div>
          <UrgencyBadge expiresAt={donation.expires_at} urgency={donation.urgency} />
        </div>

        {/* Status Timeline */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Donation Status</h3>
          <ProgressTimeline status={donation.status} />
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Pickup Location:</span>
            <strong className="text-slate-800">{donation.address}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Expires:</span>
            <strong className="text-amber-700">{new Date(donation.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
