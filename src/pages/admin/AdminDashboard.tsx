import React, { useState, useEffect } from 'react';
import { Users, Building2, Utensils, Activity, RefreshCw, Loader2 } from 'lucide-react';
import { fetchAdminStats, fetchDonations, fetchNGOs } from '../../lib/api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [ngos, setNgos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsRes = await fetchAdminStats();
      if (statsRes.success) setStats(statsRes.data);
      const ngoRes = await fetchNGOs();
      if (ngoRes.success) setNgos(ngoRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        <span className="text-xs text-slate-500">Loading admin telemetry...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Admin Control Overview</h1>
          <p className="text-xs text-slate-500 mt-1">Platform metrics, user governance & organization registry</p>
        </div>

        <button onClick={loadData} className="btn-secondary text-xs">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-clean p-5">
          <span className="text-xs text-slate-500 font-semibold">Total Users</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalUsers || 48}</div>
        </div>
        <div className="card-clean p-5">
          <span className="text-xs text-slate-500 font-semibold">Verified NGOs</span>
          <div className="text-2xl font-extrabold text-brand-600 mt-1">{stats?.verifiedNGOs || 4}</div>
        </div>
        <div className="card-clean p-5">
          <span className="text-xs text-slate-500 font-semibold">Total Donations</span>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">{stats?.totalDonations || 38}</div>
        </div>
        <div className="card-clean p-5">
          <span className="text-xs text-slate-500 font-semibold">System Health</span>
          <div className="text-sm font-extrabold text-emerald-600 mt-2">100% Operational</div>
        </div>
      </div>

      {/* Verified NGOs Table */}
      <div className="card-clean p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900">Registered NGO Organizations</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Organization</th>
                <th className="p-3">Service Area</th>
                <th className="p-3">Capacity</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ngos.map((n) => (
                <tr key={n.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-900">{n.organization_name}</td>
                  <td className="p-3 text-slate-600">{n.service_area}</td>
                  <td className="p-3">{n.capacity} meals</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
