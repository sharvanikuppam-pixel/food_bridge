import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Heart, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { InteractiveMap } from '../components/InteractiveMap';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-20 pt-8">
      {/* HERO SECTION */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold">
          <span>🌱 Simple Food Donation Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Have extra food? <br />
          <span className="text-brand-600">Help someone with it.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          FoodBridge connects your surplus food with nearby NGOs and community organizations before it goes to waste.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/donor/create-donation" className="btn-primary w-full sm:w-auto text-base">
            <PlusCircle className="w-5 h-5" /> Donate Food
          </Link>
          <Link to="/how-it-works" className="btn-secondary w-full sm:w-auto text-base">
            How It Works
          </Link>
        </div>
      </section>

      {/* 3-STEP EXPLANATION */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">How it works in 3 easy steps</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-clean p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 font-extrabold text-xl flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="font-bold text-lg text-slate-900">Share your food</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tell us what food you have, the quantity, and when it should be picked up.
            </p>
          </div>

          <div className="card-clean p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 font-extrabold text-xl flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="font-bold text-lg text-slate-900">We find the right organization</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our system matches your food with a nearby verified NGO shelter that can collect it quickly.
            </p>
          </div>

          <div className="card-clean p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 font-extrabold text-xl flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="font-bold text-lg text-slate-900">Food reaches people in need</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              The organization picks up the food and distributes fresh meals to community members.
            </p>
          </div>
        </div>
      </section>

      {/* SIMPLE LOCAL MAP PREVIEW */}
      <section className="max-w-5xl mx-auto px-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Nearby community partners</h2>
            <p className="text-xs text-slate-500">Active NGOs and food donors in your area</p>
          </div>
        </div>

        <InteractiveMap
          centerLat={12.9650}
          centerLng={77.6010}
          zoom={12}
          height="h-72"
          pins={[
            { id: '1', name: 'Green Leaf Restaurant', type: 'donor', address: '102 MG Road', lat: 12.9716, lng: 77.5946, servings: 50 },
            { id: '2', name: 'Hope Community Kitchen', type: 'ngo', address: 'Residency Road', lat: 12.9650, lng: 77.6010 },
            { id: '3', name: 'Helping Hands Foundation', type: 'ngo', address: 'Koramangala 8th Block', lat: 12.9380, lng: 77.6180 },
          ]}
        />
      </section>

      {/* CLEAN CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="card-clean p-8 text-center space-y-4 bg-gradient-to-b from-brand-50/50 to-white border-brand-200">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Ready to make a difference today?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            It takes less than 2 minutes to list surplus food and connect with local community kitchens.
          </p>
          <div className="pt-2">
            <Link to="/donor/create-donation" className="btn-primary inline-flex">
              <PlusCircle className="w-5 h-5" /> Donate Food Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
