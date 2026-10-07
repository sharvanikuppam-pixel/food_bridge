import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, RefreshCw, CheckCircle2, AlertTriangle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { analyzeFoodImageAI } from '../lib/api';

export interface FoodAnalysisResult {
  isFood: boolean;
  foodName: string;
  category: string;
  foodType: 'vegetarian' | 'non-vegetarian' | 'vegan' | 'unknown';
  description: string;
  confidence: number;
  message?: string;
}

interface AIFoodScannerProps {
  onApplyDetails: (details: {
    foodName: string;
    foodType: 'vegetarian' | 'non-vegetarian' | 'vegan';
    description: string;
    category?: string;
    imageUrl?: string;
  }) => void;
  onSkipToManual?: () => void;
}

export const AIFoodScanner: React.FC<AIFoodScannerProps> = ({ onApplyDetails, onSkipToManual }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [state, setState] = useState<'idle' | 'preview' | 'analyzing' | 'result' | 'error_non_food' | 'error_low_confidence' | 'error_failed'>('idle');
  const [aiResult, setAiResult] = useState<FoodAnalysisResult | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('FoodBridge AI is looking at your food...');

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mime = file.type || 'image/jpeg';
    setMimeType(mime);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setBase64Data(result);
      setState('preview');
      setAiResult(null);
    };
    reader.readAsDataURL(file);
    // reset input
    e.target.value = '';
  };

  const handleScanFoodClick = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleUploadPhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAnalyze = async () => {
    if (!base64Data) return;
    setState('analyzing');
    setLoadingStep('FoodBridge AI is looking at your food...');

    const stepTimer = setTimeout(() => {
      setLoadingStep('Identifying the food...');
    }, 1200);

    try {
      const res = await analyzeFoodImageAI(base64Data, mimeType);
      clearTimeout(stepTimer);

      if (res.success && res.data) {
        const data: FoodAnalysisResult = res.data;
        setAiResult(data);

        if (!data.isFood) {
          setState('error_non_food');
        } else if (data.confidence < 0.4) {
          setState('error_low_confidence');
        } else {
          setState('result');
        }
      } else {
        setState('error_failed');
      }
    } catch (err) {
      clearTimeout(stepTimer);
      console.error('Failed to analyze food image:', err);
      setState('error_failed');
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setBase64Data(null);
    setAiResult(null);
    setState('idle');
  };

  const handleApply = () => {
    if (!aiResult) return;
    const foodType: 'vegetarian' | 'non-vegetarian' | 'vegan' =
      aiResult.foodType === 'non-vegetarian'
        ? 'non-vegetarian'
        : aiResult.foodType === 'vegan'
        ? 'vegan'
        : 'vegetarian';

    onApplyDetails({
      foodName: aiResult.foodName,
      foodType,
      description: aiResult.description,
      category: aiResult.category,
      imageUrl: imagePreview || undefined,
    });
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) {
      return { title: `Looks like ${aiResult?.foodName || 'this meal'}`, badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    }
    if (confidence >= 0.5) {
      return { title: `This may be ${aiResult?.foodName || 'this meal'}`, badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' };
    }
    return { title: "We couldn't confidently identify this food.", badgeColor: 'bg-slate-100 text-slate-700 border-slate-300' };
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 border border-emerald-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 transition-all">
      {/* Hidden Inputs */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* IDLE STATE */}
      {state === 'idle' && (
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  SCAN YOUR FOOD
                  <span className="text-[10px] uppercase tracking-wider bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-300/60">
                    ✨ AI Powered
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Take a photo of your food and let FoodBridge AI identify it for you.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleScanFoodClick}
              className="flex-1 min-w-[140px] bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Camera className="w-4 h-4" />
              Scan Food
            </button>
            <button
              type="button"
              onClick={handleUploadPhotoClick}
              className="flex-1 min-w-[140px] bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              Upload Photo
            </button>
          </div>

          <p className="text-[11px] text-slate-400 text-center font-medium">
            You can also enter the details manually below.
          </p>
        </div>
      )}

      {/* PREVIEW STATE */}
      {state === 'preview' && imagePreview && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Image selected
            </span>
            <span className="text-[11px] text-slate-400">Ready for AI Analysis</span>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 max-h-56 flex items-center justify-center">
            <img src={imagePreview} alt="Selected food preview" className="max-h-56 w-full object-contain" />
          </div>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={handleAnalyze}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Analyze Food
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retake
            </button>
          </div>
        </div>
      )}

      {/* ANALYZING / LOADING STATE */}
      {state === 'analyzing' && (
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-pulse">
              <Sparkles className="w-6 h-6 animate-spin text-emerald-600" />
            </div>
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin absolute inset-0" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">{loadingStep}</h4>
            <p className="text-xs text-slate-500 mt-0.5">Examining dish features, category, and food type...</p>
          </div>
        </div>
      )}

      {/* RESULT STATE */}
      {state === 'result' && aiResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              FoodBridge AI detected
            </div>
            <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
              {Math.round(aiResult.confidence * 100)}% Confidence
            </span>
          </div>

          <div className="flex gap-4 items-start">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Analyzed food"
                className="w-20 h-20 rounded-xl object-cover border border-slate-200 flex-shrink-0"
              />
            )}
            <div className="space-y-1.5 flex-1 text-xs">
              <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <span>🍛</span> {aiResult.foodName}
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                {getConfidenceText(aiResult.confidence).title}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                  Type: <strong className="capitalize text-slate-900">{aiResult.foodType}</strong>
                </span>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                  Category: <strong className="text-slate-900">{aiResult.category}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 text-xs text-slate-600 italic">
            "{aiResult.description}"
          </div>

          <div className="text-[11px] text-slate-500 bg-amber-50/80 border border-amber-200/60 p-2.5 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>✨ AI suggestions can be incorrect. Please review details before continuing.</span>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Use These Details
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center gap-1 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              Retake
            </button>
          </div>
        </div>
      )}

      {/* ERROR: NON-FOOD IMAGE */}
      {state === 'error_non_food' && (
        <div className="space-y-3 text-center py-2">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-900">We couldn't identify food in this image.</h4>
            <p className="text-[11px] text-slate-500 mt-1">Please upload a clear photo of the food you wish to donate.</p>
          </div>
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all"
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={() => {
                handleReset();
                if (onSkipToManual) onSkipToManual();
              }}
              className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-2 px-3 rounded-xl transition-all"
            >
              Enter Details Manually
            </button>
          </div>
        </div>
      )}

      {/* ERROR: LOW CONFIDENCE */}
      {state === 'error_low_confidence' && (
        <div className="space-y-3 text-center py-2">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-900">We couldn't confidently identify the food.</h4>
            <p className="text-[11px] text-slate-500 mt-1">
              The image may be too blurry, dark, or unclear. You can take another photo or fill in details manually.
            </p>
          </div>
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all"
            >
              Take Another Photo
            </button>
            <button
              type="button"
              onClick={() => {
                handleReset();
                if (onSkipToManual) onSkipToManual();
              }}
              className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-2 px-3 rounded-xl transition-all"
            >
              Enter Manually
            </button>
          </div>
        </div>
      )}

      {/* ERROR: FAILED SERVICE */}
      {state === 'error_failed' && (
        <div className="space-y-3 text-center py-2">
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-900">Food scanning isn't available right now.</h4>
            <p className="text-[11px] text-slate-500 mt-1">You can still enter the food details manually below.</p>
          </div>
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all"
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={() => {
                handleReset();
                if (onSkipToManual) onSkipToManual();
              }}
              className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-2 px-3 rounded-xl transition-all"
            >
              Enter Manually
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
