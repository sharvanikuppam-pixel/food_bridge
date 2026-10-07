import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Utensils, MapPin, Clock, Filter, CheckCircle2, Truck, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchDonations, claimDonation, updateClaimStatus } from '../../lib/api';
import { UrgencyBadge } from '../../components/UrgencyBadge';
import { ProgressTimeline } from '../../components/ProgressTimeline';

export const NGODashboard: React.FC = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'feed' | 'my-claims'>('feed');

  const loadData = async () => {
    setLoading(true);
    try {
      const donRes = await fetchDonations();
      if (donRes.success) setDonations(donRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClaim = async (donationId: string) => {
    try {
      const res = await claimDonation(donationId, user?.ngoId || 'ngo-1');
      if (res.success) {
        loadData();
        setActiveTab('my-claims');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (claimId: string, newStatus: string) => {
    try {
      const res = await updateClaimStatus(claimId, newStatus);
      if (res.success) loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const availableDonations = donations.filter(
    (d) => d.status === 'CREATED' || d.status === 'MATCHING'
  );
  const myClaims = donations.filter(
    (d) => d.status === 'CLAIMED' || d.status === 'PICKUP_ASSIGNED' || d.status === 'PICKUP_IN_PROGRESS' || d.status === 'DELIVERED' || d.status === 'COMPLETED'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Food Available Near You</h1>
          <p className="text-xs text-slate-500 mt-1">
            Organization: <strong className="text-slate-800">{user?.organizationName || 'Hope Community Kitchen'}</strong>
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'feed'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Available ({availableDonations.length})
          </button>
          <button
            onClick={() => setActiveTab('my-claims')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'my-claims'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Pickups ({myClaims.length})
          </button>
        </div>
      </div>

      {/* FEED TAB */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          {availableDonations.length === 0 ? (
            <div className="card-clean p-10 text-center space-y-2">
              <Utensils className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No nearby donations right now</p>
              <p className="text-xs text-slate-500">We'll show you when suitable food becomes available.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableDonations.map((donation) => (
                <div key={donation.id} className="card-clean p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{donation.food_name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Donor: <strong className="text-slate-800">{donation.donor_org}</strong> • 📍 2.4 km away
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-brand-100 text-brand-700 font-extrabold text-xs">
                        94% Match
                      </span>
                      <UrgencyBadge expiresAt={donation.expires_at} urgency={donation.urgency} />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-slate-500">Servings:</span> <strong className="text-brand-700 font-bold">{donation.servings} Meals</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Dietary:</span> <strong className="capitalize text-slate-800">{donation.food_type}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Location:</span> <span className="text-slate-700">{donation.address}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleClaim(donation.id)}
                    className="btn-primary w-full text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Claim Donation
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MY CLAIMS TAB */}
      {activeTab === 'my-claims' && (
        <div className="space-y-4">
          {myClaims.length === 0 ? (
            <div className="card-clean p-10 text-center space-y-2">
              <Truck className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No active claims</p>
              <p className="text-xs text-slate-500">Claim available donations to start pickup dispatch.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myClaims.map((claim) => (
                <div key={claim.id} className="card-clean p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{claim.food_name}</h3>
                      <p className="text-xs text-slate-500">{claim.servings} Servings • {claim.address}</p>
                    </div>
                  </div>

                  <ProgressTimeline status={claim.status} />

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-slate-500 font-semibold">Update Status:</span>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleUpdateStatus(claim.id, 'PICKUP_IN_PROGRESS')}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 hover:bg-amber-200"
                      >
                        Start Pickup
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(claim.id, 'DELIVERED')}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        Mark Picked Up
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(claim.id, 'COMPLETED')}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700"
                      >
                        Mark Delivered
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
