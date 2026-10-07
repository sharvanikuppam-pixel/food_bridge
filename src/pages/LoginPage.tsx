import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Utensils, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleSelection, setRoleSelection] = useState<UserRole>('donor');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsRole(roleSelection);
    if (roleSelection === 'donor') navigate('/donor/dashboard');
    else if (roleSelection === 'ngo') navigate('/ngo/dashboard');
    else navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="glass-card max-w-md w-full p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-3">
            <Utensils className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400">Sign in to manage surplus food donations & pickups</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-3 gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setRoleSelection('donor')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              roleSelection === 'donor'
                ? 'bg-brand-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Donor
          </button>
          <button
            type="button"
            onClick={() => setRoleSelection('ngo')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              roleSelection === 'ngo'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            NGO Partner
          </button>
          <button
            type="button"
            onClick={() => setRoleSelection('admin')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              roleSelection === 'admin'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  roleSelection === 'donor'
                    ? 'priya@greenleaf.com'
                    : roleSelection === 'ngo'
                    ? 'joseph@hopecommunity.org'
                    : 'admin@foodbridge.ai'
                }
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
          >
            Sign In as {roleSelection.toUpperCase()} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 font-semibold hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
