import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Heart,
  PlusCircle,
  Home,
  Package,
  TrendingUp,
  User,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';
import { NotificationCenter } from './NotificationCenter';

export const Navbar: React.FC = () => {
  const { user, role, loginAsRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* DESKTOP TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                🌱
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">FoodBridge</span>
                <span className="ml-1 text-xs font-bold px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">
                  AI
                </span>
              </div>
            </Link>

            {/* Desktop Nav Items (Minimal & Focused) */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm font-semibold transition-colors ${
                  isActive('/') ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Home
              </Link>

              {role === 'donor' && (
                <>
                  <Link
                    to="/donor/dashboard"
                    className={`text-sm font-semibold transition-colors ${
                      isActive('/donor/dashboard') ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    My Donations
                  </Link>
                  <Link
                    to="/donor/impact"
                    className={`text-sm font-semibold transition-colors ${
                      isActive('/donor/impact') ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Impact
                  </Link>
                </>
              )}

              {role === 'ngo' && (
                <>
                  <Link
                    to="/ngo/dashboard"
                    className={`text-sm font-semibold transition-colors ${
                      isActive('/ngo/dashboard') ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Available Food
                  </Link>
                  <Link
                    to="/ngo/impact"
                    className={`text-sm font-semibold transition-colors ${
                      isActive('/ngo/impact') ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Impact
                  </Link>
                </>
              )}

              {role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className={`text-sm font-semibold transition-colors ${
                    isActive('/admin/dashboard') ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Admin Overview
                </Link>
              )}
            </nav>

            {/* Right CTAs */}
            <div className="flex items-center gap-3">
              {/* Primary CTA button for Citizens */}
              <Link
                to="/donor/create-donation"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" /> Donate Food
              </Link>

              {/* Persona Switcher (Clean Dropdown) */}
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                  <span className="capitalize">{role}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in duration-150">
                    <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 mb-1">
                      Switch Role Persona
                    </div>
                    <button
                      onClick={() => {
                        loginAsRole('donor');
                        setRoleDropdownOpen(false);
                        navigate('/donor/dashboard');
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                        role === 'donor' ? 'text-brand-600 font-bold bg-brand-50' : 'text-slate-700'
                      }`}
                    >
                      <span>🍱 Citizen / Donor</span>
                      {role === 'donor' && <span className="text-[10px] text-brand-600">Active</span>}
                    </button>
                    <button
                      onClick={() => {
                        loginAsRole('ngo');
                        setRoleDropdownOpen(false);
                        navigate('/ngo/dashboard');
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                        role === 'ngo' ? 'text-brand-600 font-bold bg-brand-50' : 'text-slate-700'
                      }`}
                    >
                      <span>🤝 NGO Organization</span>
                      {role === 'ngo' && <span className="text-[10px] text-brand-600">Active</span>}
                    </button>
                    <button
                      onClick={() => {
                        loginAsRole('admin');
                        setRoleDropdownOpen(false);
                        navigate('/admin/dashboard');
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                        role === 'admin' ? 'text-brand-600 font-bold bg-brand-50' : 'text-slate-700'
                      }`}
                    >
                      <span>🛡️ Platform Admin</span>
                      {role === 'admin' && <span className="text-[10px] text-brand-600">Active</span>}
                    </button>
                  </div>
                )}
              </div>

              <NotificationCenter userId={user?.id} />
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg px-2 py-2 flex items-center justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center py-1 px-3 rounded-xl text-[11px] font-semibold ${
            isActive('/') ? 'text-brand-600' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </Link>

        {role === 'donor' ? (
          <Link
            to="/donor/dashboard"
            className={`flex flex-col items-center py-1 px-3 rounded-xl text-[11px] font-semibold ${
              isActive('/donor/dashboard') ? 'text-brand-600' : 'text-slate-500'
            }`}
          >
            <Package className="w-5 h-5 mb-0.5" />
            <span>Donations</span>
          </Link>
        ) : (
          <Link
            to="/ngo/dashboard"
            className={`flex flex-col items-center py-1 px-3 rounded-xl text-[11px] font-semibold ${
              isActive('/ngo/dashboard') ? 'text-brand-600' : 'text-slate-500'
            }`}
          >
            <Package className="w-5 h-5 mb-0.5" />
            <span>Feed</span>
          </Link>
        )}

        {/* Center Prominent Donate CTA */}
        <Link
          to="/donor/create-donation"
          className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-md -mt-5 border-4 border-white active:scale-95 transition-transform"
          title="Donate Food"
        >
          <PlusCircle className="w-6 h-6" />
        </Link>

        <Link
          to={role === 'ngo' ? '/ngo/impact' : '/donor/impact'}
          className={`flex flex-col items-center py-1 px-3 rounded-xl text-[11px] font-semibold ${
            isActive('/donor/impact') || isActive('/ngo/impact') ? 'text-brand-600' : 'text-slate-500'
          }`}
        >
          <TrendingUp className="w-5 h-5 mb-0.5" />
          <span>Impact</span>
        </Link>

        <button
          onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
          className="flex flex-col items-center py-1 px-3 rounded-xl text-[11px] font-semibold text-slate-500"
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Profile</span>
        </button>
      </div>
    </>
  );
};
