import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, MapPin, Clock, Utensils, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createDonation, generateAIDescription } from '../../lib/api';
import { InteractiveMap } from '../../components/InteractiveMap';
import { AIFoodScanner } from '../../components/AIFoodScanner';

export const CreateDonationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);

  // Step 1 Fields
  const [foodName, setFoodName] = useState('');
  const [foodType, setFoodType] = useState<'vegetarian' | 'non-vegetarian' | 'vegan'>('vegetarian');
  const [quantity, setQuantity] = useState('50');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Cooked Meals');
  const [foodImageUrl, setFoodImageUrl] = useState('');
  const [showAiSuggestedBadge, setShowAiSuggestedBadge] = useState(false);

  // Step 2 Fields
  const [expiresAt, setExpiresAt] = useState(
    new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [pickupRequired, setPickupRequired] = useState(true);
  const [address, setAddress] = useState(user?.address || '102 MG Road, Bengaluru');

  const handleApplyAiDetails = (details: {
    foodName: string;
    foodType: 'vegetarian' | 'non-vegetarian' | 'vegan';
    description: string;
    category?: string;
    imageUrl?: string;
  }) => {
    setFoodName(details.foodName);
    setFoodType(details.foodType);
    setDescription(details.description);
    if (details.category) setCategory(details.category);
    if (details.imageUrl) setFoodImageUrl(details.imageUrl);
    setShowAiSuggestedBadge(true);
  };

  const handleGenerateAiDescription = async () => {
    if (!foodName) return;
    setLoadingAi(true);
    try {
      const res = await generateAIDescription({
        food_name: foodName,
        food_type: foodType,
        quantity: Number(quantity),
        unit: 'meals',
        servings: Number(quantity),
      });
      if (res.success && res.description) {
        setDescription(res.description);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        donor_id: user?.id || 'prof-donor-1',
        donor_name: user?.name || 'Priya Sharma',
        donor_org: user?.organizationName || 'Green Leaf Restaurant',
        food_name: foodName || 'Prepared Surplus Meals',
        category: category || 'Cooked Meals',
        food_type: foodType,
        quantity: Number(quantity),
        unit: 'meals',
        servings: Number(quantity),
        description: description || `${quantity} ${foodType} meals ready for donation.`,
        expires_at: new Date(expiresAt).toISOString(),
        address,
        city: 'Bengaluru',
        latitude: 12.9716,
        longitude: 77.5946,
        image_url: foodImageUrl || undefined,
      };

      const res = await createDonation(payload);
      if (res.success && res.data) {
        navigate(`/donor/donations/${res.data.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Donate Food</h1>
        <p className="text-xs text-slate-500 mt-1">Step {step} of 3 — Share your surplus food with nearby shelters</p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full transition-all ${
              step >= s ? 'bg-brand-600' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* STEP 1: WHAT DO YOU HAVE? */}
      {step === 1 && (
        <div className="card-clean p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">What food do you want to donate?</h2>
            <p className="text-xs text-slate-500">Scan with camera or enter details manually below.</p>
          </div>

          {/* AI FOOD CAMERA SCANNER */}
          <AIFoodScanner onApplyDetails={handleApplyAiDetails} />

          {showAiSuggestedBadge && (
            <div className="bg-emerald-50 border border-emerald-200/80 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-800 font-semibold animate-fadeIn">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>✨ AI suggestions applied — please review and edit details.</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAiSuggestedBadge(false)}
                className="text-[11px] text-emerald-700 hover:underline flex-shrink-0 ml-2"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Food Name</label>
              <input
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g. Vegetarian Paneer Curry & Rice"
                className="input-clean"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity (Number of Meals)</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="50"
                className="input-clean"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Food Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'vegetarian', label: 'Vegetarian' },
                  { key: 'non-vegetarian', label: 'Non-Veg' },
                  { key: 'vegan', label: 'Vegan' },
                ].map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setFoodType(t.key as any)}
                    className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                      foodType === t.key
                        ? 'bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Description (Optional)</label>
                <button
                  type="button"
                  onClick={handleGenerateAiDescription}
                  disabled={loadingAi || !foodName}
                  className="text-[11px] text-brand-600 hover:underline flex items-center gap-1 font-semibold disabled:opacity-40"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {loadingAi ? 'Writing...' : '✨ Help me describe this food'}
                </button>
              </div>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Freshly prepared meals packaged in hygienic containers..."
                className="input-clean resize-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={!foodName}
            className="btn-primary w-full disabled:opacity-50"
          >
            Continue to When & Where <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: WHEN AND WHERE? */}
      {step === 2 && (
        <div className="card-clean p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">When and where should it be collected?</h2>
            <p className="text-xs text-slate-500">Set safety expiration time and pickup address.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Safety Expiration Time</label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="input-clean"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pickup Required?</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPickupRequired(true)}
                  className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                    pickupRequired
                      ? 'bg-brand-50 border-brand-500 text-brand-700'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  Yes, NGO picks up
                </button>
                <button
                  type="button"
                  onClick={() => setPickupRequired(false)}
                  className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                    !pickupRequired
                      ? 'bg-brand-50 border-brand-500 text-brand-700'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  No, I will deliver
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input-clean"
              />
            </div>

            <InteractiveMap height="h-44" centerLat={12.9716} centerLng={77.5946} zoom={13} />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1">
              Review Donation <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & SUBMIT */}
      {step === 3 && (
        <div className="card-clean p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Review your donation</h2>
            <p className="text-xs text-slate-500">Confirm your details before finding nearby organizations.</p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Food</span>
                <h3 className="font-extrabold text-base text-slate-900">
                  {quantity} {foodType} Meals ({foodName})
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200/60">
              <div>
                <span className="text-slate-500 block">Pickup</span>
                <strong className="text-slate-800">{pickupRequired ? 'Required' : 'Self-deliver'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Expires</span>
                <strong className="text-amber-700">{new Date(expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block">Location</span>
                <strong className="text-slate-800">{address}</strong>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary flex-1 text-base"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              {loading ? 'Finding nearby NGOs...' : 'Donate Food'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
