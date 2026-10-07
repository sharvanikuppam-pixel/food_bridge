import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Clock, ChevronRight, Heart, Utensils, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchDonations } from '../../lib/api';
import { UrgencyBadge } from '../../components/UrgencyBadge';

export const DonorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchDonations({ donor_id: user?.id || 'prof-donor-1' });
      if (res.success) setDonations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const activeDonations = donations.filter(
    (d) => d.status !== 'COMPLETED' && d.status !== 'EXPIRED' && d.status !== 'CANCELLED'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Hello {user?.name.split(' ')[0] || 'Priya'} 👋
        </h1>
        <p className="text-sm text-slate-600 mt-1">Ready to make a difference today?</p>
      </div>

      {/* 2. Large Primary CTA Card */}
      <div className="card-clean p-6 sm:p-8 bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-md relative overflow-hidden space-y-4">
        <div className="max-w-md space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-200">Have Surplus Food?</span>
          <h2 className="text-2xl font-extrabold">Tell us about it and we'll help find the right organization.</h2>
        </div>
        <div>
          <Link
            to="/donor/create-donation"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-brand-800 font-bold text-sm shadow-sm hover:bg-brand-50 transition-all"
          >
            <PlusCircle className="w-5 h-5 text-brand-600" /> Donate Food Now
          </Link>
        </div>
      </div>

      {/* 3. Your Active Donations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Your Active Donations</h2>
          <span className="text-xs font-semibold text-slate-500">{activeDonations.length} active</span>
        </div>

        {activeDonations.length === 0 ? (
          <div className="card-clean p-8 text-center space-y-2">
            <Utensils className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No active food donations right now</p>
            <p className="text-xs text-slate-500">Your extra food could become someone's meal.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeDonations.map((donation) => (
              <div key={donation.id} className="card-clean p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{donation.food_name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {donation.servings} Servings ({donation.food_type})
                    </p>
                  </div>
                  <UrgencyBadge expiresAt={donation.expires_at} urgency={donation.urgency} />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Status: <strong className="text-slate-800">{donation.status}</strong>
                  </span>
                  <Link
                    to={`/donor/donations/${donation.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                  >
                    Track Donation <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Your Impact (Simple Summary) */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Your Impact</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="card-clean p-5 text-center">
            <div className="text-3xl font-extrabold text-brand-600">1,240</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Meals Donated</div>
          </div>
          <div className="card-clean p-5 text-center">
            <div className="text-3xl font-extrabold text-slate-800">38</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Donations Completed</div>
          </div>
        </div>

        <div className="text-right">
          <Link to="/donor/impact" className="text-xs font-bold text-brand-600 hover:underline inline-flex items-center gap-1">
            View Full Impact Summary <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
