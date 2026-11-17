import React, { useMemo } from 'react';
import { User, DollarSign, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import FormatSelector from './FormatSelector';
import { clientNumberToWords, FIXED_CLAIMS_MESSAGE } from '../utils/formatters';

export default function AccountForm({
  formData,
  setFormData,
  onGenerate,
  isGenerating,
  error
}) {
  const mainAmountInWords = useMemo(() => {
    return clientNumberToWords(formData.mainAmount);
  }, [formData.mainAmount]);

  const additionalAmountInWords = useMemo(() => {
    return clientNumberToWords(formData.additionalAmount);
  }, [formData.additionalAmount]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuickFill = () => {
    setFormData({
      accountHolderName: 'Gary Frisch',
      formatType: formData.formatType || 'format1',
      mainAmount: '7500000',
      additionalAmount: formData.formatType === 'format2' ? '35000' : ''
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Account Generation Configuration
          </h2>
          <p className="text-xs text-slate-500">
            Configure record parameters and select target output format
          </p>
        </div>
        <button
          type="button"
          onClick={handleQuickFill}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200/60"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Demo Data
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onGenerate();
        }}
        className="space-y-6"
      >
        {/* Step 1: Format Selector */}
        <FormatSelector
          selectedFormat={formData.formatType}
          onSelectFormat={(format) => handleInputChange('formatType', format)}
        />

        {/* Step 2: Account Holder Name */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5">
            Account Holder Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              required
              placeholder="e.g. Gary Frisch"
              value={formData.accountHolderName}
              onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
              className="block w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 placeholder:text-slate-400 transition"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Name entered manually. Commas are automatically filtered for clean CSV formatting.
          </p>
        </div>

        {/* Step 3: Main Amount & Real-time Words Conversion */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5">
            Main Amount (USD) <span className="text-rose-500">*</span>
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <input
              type="number"
              min="0"
              step="any"
              required
              placeholder="e.g. 7500000"
              value={formData.mainAmount}
              onChange={(e) => handleInputChange('mainAmount', e.target.value)}
              className="block w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 placeholder:text-slate-400 transition"
            />
          </div>

          {/* Real-time converted words preview */}
          {mainAmountInWords && (
            <div className="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex-shrink-0 mt-0.5">
                In Words:
              </span>
              <span className="text-xs font-semibold text-indigo-700 break-words">
                {mainAmountInWords}
              </span>
            </div>
          )}
        </div>

        {/* Step 4: Additional Amount (Conditional for Format 2) */}
        {formData.formatType === 'format2' ? (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              Additional Amount (USD) <span className="text-rose-500">*</span>
              <span className="ml-2 text-xs font-normal text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Required for Format 2
              </span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <input
                type="number"
                min="0"
                step="any"
                required
                placeholder="e.g. 35000"
                value={formData.additionalAmount}
                onChange={(e) => handleInputChange('additionalAmount', e.target.value)}
                className="block w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-emerald-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 placeholder:text-slate-400 transition"
              />
            </div>

            {/* Real-time converted words preview for additional amount */}
            {additionalAmountInWords && (
              <div className="mt-2 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200/80 flex items-start gap-2">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex-shrink-0 mt-0.5">
                  In Words:
                </span>
                <span className="text-xs font-semibold text-emerald-800 break-words">
                  {additionalAmountInWords}
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Format 1 Static Message Preview */
          <div className="p-3.5 bg-blue-50/70 border border-blue-200/70 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                Fifth Field Message (Fixed for Format 1)
              </span>
              <span className="text-[10px] text-blue-600 bg-white px-2 py-0.5 rounded-full border border-blue-200 font-medium">
                Auto-Applied
              </span>
            </div>
            <p className="text-xs text-blue-800 italic leading-relaxed">
              &quot;{FIXED_CLAIMS_MESSAGE}&quot;
            </p>
          </div>
        )}

        {/* Error notification if any */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Auto Generated Preview Info */}
        <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Account Number (starts with <strong>8190</strong>) & 4-digit PIN will be auto-generated</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Prefix: 8190 + 8 digits</span>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition duration-150 shadow-md shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating Unique Account & PIN...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Account Details
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
