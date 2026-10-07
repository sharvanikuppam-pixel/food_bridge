import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Utensils, User, Mail, Lock, Building, MapPin, ArrowRight } from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithProfile } = useAuth();
  const [role, setRole] = useState<UserRole>('donor');
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile = {
      id: `prof-${Date.now()}`,
      name: fullName || 'New User',
      email: email || 'user@foodbridge.ai',
      role,
      organizationName: orgName || (role === 'donor' ? 'My Restaurant' : 'My Community NGO'),
      address: address || 'MG Road, Bengaluru',
      city: 'Bengaluru',
    };
    loginWithProfile(newProfile);
    if (role === 'donor') navigate('/donor/dashboard');
    else navigate('/ngo/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="glass-card max-w-lg w-full p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-3">
            <Utensils className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Join FoodBridge AI</h2>
          <p className="text-xs text-slate-400">Select your role to register your organization</p>
        </div>

        {/* Role Select Options */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('donor')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              role === 'donor'
                ? 'bg-brand-950/40 border-brand-500/60 ring-2 ring-brand-500/20'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="font-bold text-sm text-brand-400">🍱 I am a Food Donor</div>
            <p className="text-[11px] text-slate-400 mt-1">Restaurant, Hotel, Canteen, Catering, Supermarket</p>
          </button>

          <button
            type="button"
            onClick={() => setRole('ngo')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              role === 'ngo'
                ? 'bg-blue-950/40 border-blue-500/60 ring-2 ring-blue-500/20'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="font-bold text-sm text-blue-400">🤝 I represent an NGO</div>
            <p className="text-[11px] text-slate-400 mt-1">Shelter, Community Kitchen, Charity Trust</p>
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Contact Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Priya Sharma"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Organization Name</label>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder={role === 'donor' ? 'Green Leaf Restaurant' : 'Hope Community Kitchen'}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@organization.com"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Address / Location</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="102 MG Road, Brigade Junction, Bengaluru"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
          >
            Create Account & Register Profile <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-brand-400 font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
