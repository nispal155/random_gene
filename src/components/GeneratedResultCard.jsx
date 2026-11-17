import React, { useState } from 'react';
import {
  Copy,
  Check,
  Save,
  RotateCcw,
  CheckCircle,
  Hash,
  KeyRound,
  UserCheck,
  DollarSign,
  FileText
} from 'lucide-react';

export default function GeneratedResultCard({
  accountData,
  onSave,
  onReset,
  isSaving,
  isSaved
}) {
  const [copied, setCopied] = useState(false);

  if (!accountData) return null;

  const handleCopyOutput = async () => {
    try {
      await navigator.clipboard.writeText(accountData.completeOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const isFormat1 = accountData.formatType === 'format1';

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-indigo-200/80 shadow-md shadow-indigo-100/50 space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Header of Generated Result */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Account Generated Successfully
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-500 font-medium">Selected Format:</span>
              <span
                className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                  isFormat1
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {isFormat1 ? 'Format 1 – Claims Message' : 'Format 2 – Additional Amount'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Generate Another
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || isSaved}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition ${
              isSaved
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm disabled:opacity-60'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Saved to Database
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Saving...' : 'Save Record'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Account Number */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Account Number
            </span>
            <Hash className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-extrabold font-mono text-indigo-600 tracking-wide">
            {accountData.accountNumber}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Unique • Starts with 8190</span>
        </div>

        {/* PIN */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              4-Digit PIN
            </span>
            <KeyRound className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-extrabold font-mono text-slate-900 tracking-wider">
            {accountData.pin}
          </div>
          <span className="text-[10px] text-slate-400">Preserved leading zeros</span>
        </div>

        {/* Account Holder Name */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Account Holder
            </span>
            <UserCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-base font-bold text-slate-900 truncate">
            {accountData.accountHolderName}
          </div>
          <span className="text-[10px] text-slate-400">Registered entity</span>
        </div>

        {/* Main Amount */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Numeric Amount
            </span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-base font-bold text-slate-900">
            ${Number(accountData.mainAmount).toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">
            {accountData.additionalAmount ? `+ $${Number(accountData.additionalAmount).toLocaleString()}` : 'Base amount'}
          </span>
        </div>
      </div>

      {/* Words & Message Breakdown */}
      <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Field 4: Main Amount in Words
          </span>
          <p className="text-xs font-semibold text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 break-words">
            {accountData.mainAmountWords}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Field 5: {isFormat1 ? 'Fixed Claims Message' : 'Additional Amount in Words'}
          </span>
          <p
            className={`text-xs p-2.5 rounded-lg border break-words font-medium ${
              isFormat1
                ? 'bg-blue-50 text-blue-900 border-blue-200'
                : 'bg-emerald-50 text-emerald-900 border-emerald-200'
            }`}
          >
            {accountData.fifthField}
          </p>
        </div>
      </div>

      {/* Raw Comma-Separated Output Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            Complete Comma-Separated Output
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            Exact 5 comma-delimited fields
          </span>
        </div>

        <div className="relative group">
          <textarea
            readOnly
            rows={3}
            value={accountData.completeOutput}
            className="w-full p-3.5 pr-28 text-xs font-mono bg-slate-900 text-slate-100 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none selection:bg-indigo-500 selection:text-white"
          />
          <button
            type="button"
            onClick={handleCopyOutput}
            className={`absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
              copied
                ? 'bg-emerald-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Output
              </>
            )}
          </button>
        </div>
        <p className="text-[11px] text-slate-500">
          The &quot;Copy Output&quot; button copies the pure comma-separated record without tags, labels, or formatting artifacts.
        </p>
      </div>
    </div>
  );
}
