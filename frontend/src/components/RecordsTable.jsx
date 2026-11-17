import React, { useState } from 'react';
import {
  Search,
  Download,
  Trash2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  MessageSquareText,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { getExportCSVUrl } from '../api/accountApi';

export default function RecordsTable({
  records,
  pagination,
  search,
  setSearch,
  formatFilter,
  setFormatFilter,
  onPageChange,
  onDeleteRequest,
  onRefresh,
  isLoading
}) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyRecord = async (record) => {
    try {
      await navigator.clipboard.writeText(record.completeOutput);
      setCopiedId(record._id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy record:', err);
    }
  };

  const handleCopyAllVisible = async () => {
    if (!records || records.length === 0) return;
    const allText = records.map((r) => r.completeOutput).join('\n');
    try {
      await navigator.clipboard.writeText(allText);
      setCopiedId('ALL');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy all:', err);
    }
  };

  const exportUrl = getExportCSVUrl({ search, formatType: formatFilter });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
      {/* Top Bar: Title, Search, Filter, Export */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              Generated Records History
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {pagination.total} records
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Search, filter, export, and copy persisted account records
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[220px] flex-1 sm:flex-initial">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search number or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 placeholder:text-slate-400 transition"
            />
          </div>

          {/* Format Filter */}
          <div className="relative">
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="pl-3 pr-8 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 text-slate-700 bg-white cursor-pointer transition appearance-none"
            >
              <option value="">All Formats</option>
              <option value="format1">Format 1 (Claims Message)</option>
              <option value="format2">Format 2 (Additional Amount)</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Copy All Button */}
          <button
            type="button"
            onClick={handleCopyAllVisible}
            disabled={!records || records.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition disabled:opacity-50"
          >
            {copiedId === 'ALL' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Copied Page!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Page
              </>
            )}
          </button>

          {/* Export CSV */}
          <a
            href={exportUrl}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </a>
        </div>
      </div>

      {/* Table Container */}
      <div className="border border-slate-200 rounded-xl overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th scope="col" className="px-3.5 py-3 w-12 text-center">
                #
              </th>
              <th scope="col" className="px-3.5 py-3">
                Account Number
              </th>
              <th scope="col" className="px-3.5 py-3">
                PIN
              </th>
              <th scope="col" className="px-3.5 py-3">
                Account Holder
              </th>
              <th scope="col" className="px-3.5 py-3">
                Format
              </th>
              <th scope="col" className="px-3.5 py-3 max-w-[200px]">
                Main Amount in Words
              </th>
              <th scope="col" className="px-3.5 py-3 max-w-[240px]">
                Fifth Field Output
              </th>
              <th scope="col" className="px-3.5 py-3 whitespace-nowrap">
                Date
              </th>
              <th scope="col" className="px-3.5 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  <div className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                    <span>Loading database records...</span>
                  </div>
                </td>
              </tr>
            ) : !records || records.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400 space-y-2">
                    <FileSpreadsheet className="w-8 h-8 text-slate-300" />
                    <p className="font-medium text-slate-600 text-sm">No saved accounts found</p>
                    <p className="text-xs text-slate-400">
                      Generate an account above and click &quot;Save Record&quot; to populate this table.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((record, index) => {
                const serialNum = (pagination.page - 1) * pagination.limit + index + 1;
                const isFmt1 = record.formatType === 'format1';

                return (
                  <tr
                    key={record._id}
                    className="hover:bg-slate-50/80 transition-colors duration-100"
                  >
                    <td className="px-3.5 py-3 text-center font-mono text-slate-400 font-medium">
                      {serialNum}
                    </td>
                    <td className="px-3.5 py-3 font-mono font-bold text-indigo-600 whitespace-nowrap">
                      {record.accountNumber}
                    </td>
                    <td className="px-3.5 py-3 font-mono text-slate-400 font-semibold tracking-widest whitespace-nowrap">
                      {record.pinMasked || '****'}
                    </td>
                    <td className="px-3.5 py-3 font-medium text-slate-900 whitespace-nowrap">
                      {record.accountHolderName}
                    </td>
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          isFmt1
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isFmt1 ? (
                          <>
                            <MessageSquareText className="w-3 h-3" />
                            Format 1
                          </>
                        ) : (
                          <>
                            <Layers className="w-3 h-3" />
                            Format 2
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 max-w-[200px] truncate text-slate-600" title={record.mainAmountWords}>
                      {record.mainAmountWords}
                    </td>
                    <td className="px-3.5 py-3 max-w-[240px] truncate text-slate-600" title={record.fifthField}>
                      {record.fifthField}
                    </td>
                    <td className="px-3.5 py-3 whitespace-nowrap text-slate-400 text-[11px]">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3.5 py-3 text-right whitespace-nowrap space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyRecord(record)}
                        title="Copy pure comma-separated string"
                        className={`p-1.5 rounded-lg border transition ${
                          copiedId === record._id
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {copiedId === record._id ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteRequest(record)}
                        title="Delete record"
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-300 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500">
            Showing Page <span className="font-bold text-slate-700">{pagination.page}</span> of{' '}
            <span className="font-bold text-slate-700">{pagination.totalPages}</span> ({pagination.total} total)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg">
              {pagination.page}
            </span>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
