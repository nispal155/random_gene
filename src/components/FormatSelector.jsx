import React from 'react';
import { MessageSquareText, Layers, CheckCircle2 } from 'lucide-react';

export default function FormatSelector({ selectedFormat, onSelectFormat }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-slate-800">
          Select Output Format <span className="text-rose-500">*</span>
        </label>
        <span className="text-xs text-slate-500 font-medium">
          Step 1: Choose which 5-field schema to generate
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Format 1 Card */}
        <div
          onClick={() => onSelectFormat('format1')}
          className={`cursor-pointer relative rounded-xl p-4 transition-all duration-200 border-2 ${
            selectedFormat === 'format1'
              ? 'bg-indigo-50/40 border-indigo-600 shadow-sm ring-2 ring-indigo-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-lg ${
                  selectedFormat === 'format1'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <MessageSquareText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    Format 1 – Claims Message
                  </span>
                  <span className="inline-flex px-1.5 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                    Predefined Message
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Generates account details with the fixed claims guidance message in the fifth position.
                </p>
                <div className="mt-2.5 bg-slate-100/90 rounded px-2.5 py-1.5 text-[11px] font-mono text-slate-700 border border-slate-200/60">
                  AccountNumber,PIN,Name,MainAmountWords,<span className="text-indigo-600 font-semibold">ClaimsMessage</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 mt-0.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                  selectedFormat === 'format1'
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {selectedFormat === 'format1' && <CheckCircle2 className="w-4 h-4" />}
              </div>
            </div>
          </div>
        </div>

        {/* Format 2 Card */}
        <div
          onClick={() => onSelectFormat('format2')}
          className={`cursor-pointer relative rounded-xl p-4 transition-all duration-200 border-2 ${
            selectedFormat === 'format2'
              ? 'bg-indigo-50/40 border-indigo-600 shadow-sm ring-2 ring-indigo-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-lg ${
                  selectedFormat === 'format2'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    Format 2 – Additional Amount
                  </span>
                  <span className="inline-flex px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                    Two Amounts
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Generates account details with a second numeric amount automatically translated into words.
                </p>
                <div className="mt-2.5 bg-slate-100/90 rounded px-2.5 py-1.5 text-[11px] font-mono text-slate-700 border border-slate-200/60">
                  AccountNumber,PIN,Name,MainAmountWords,<span className="text-emerald-600 font-semibold">AdditionalAmountWords</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 mt-0.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                  selectedFormat === 'format2'
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {selectedFormat === 'format2' && <CheckCircle2 className="w-4 h-4" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
