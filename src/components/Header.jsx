import React from 'react';
import { CreditCard, ShieldAlert } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Account Number Generator
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  v1.0 Fictional Data
                </span>
              </div>
              <p className="text-sm text-slate-500">
                Generate unique fictional account records, 4-digit PINs, and formatted output
              </p>
            </div>
          </div>

          {/* Safety Notice Disclaimer */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 rounded-lg px-3 py-2 text-xs text-amber-800">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong className="font-semibold">Notice:</strong> All generated numbers, PINs, and records are simulated test data for development purposes only.
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
