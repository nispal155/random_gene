import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import AccountForm from './components/AccountForm';
import GeneratedResultCard from './components/GeneratedResultCard';
import RecordsTable from './components/RecordsTable';
import ConfirmModal from './components/ConfirmModal';
import NotificationToast from './components/NotificationToast';
import {
  generateAccountPreview,
  saveAccountRecord,
  fetchAccounts,
  deleteAccountRecord
} from './api/accountApi';

export default function App() {
  // Form State
  const [formData, setFormData] = useState({
    accountHolderName: 'Gary Frisch',
    formatType: 'format1',
    mainAmount: '7500000',
    additionalAmount: ''
  });

  // Generation Preview State
  const [generatedAccount, setGeneratedAccount] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [formError, setFormError] = useState('');

  // Records Table State
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [search, setSearch] = useState('');
  const [formatFilter, setFormatFilter] = useState('');
  const [isTableLoading, setIsTableLoading] = useState(false);

  // Modal & Toast State
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch saved records from API
  const loadRecords = useCallback(async (page = 1) => {
    setIsTableLoading(true);
    try {
      const data = await fetchAccounts({
        page,
        limit: 10,
        search,
        formatType: formatFilter
      });
      if (data.success) {
        setRecords(data.records);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Failed to load records:', err);
      showToast('Failed to load records from database.', 'error');
    } finally {
      setIsTableLoading(false);
    }
  }, [search, formatFilter]);

  // Initial fetch and on filter/search change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadRecords(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [loadRecords]);

  // Handle Account Generation Preview
  const handleGenerate = async () => {
    setFormError('');
    setIsGenerating(true);

    try {
      const payload = {
        accountHolderName: formData.accountHolderName,
        formatType: formData.formatType,
        mainAmount: Number(formData.mainAmount),
        additionalAmount:
          formData.formatType === 'format2'
            ? Number(formData.additionalAmount)
            : null
      };

      const result = await generateAccountPreview(payload);
      if (result.success) {
        setGeneratedAccount(result.data);
        setIsSaved(false);
        showToast('Generated 12-digit account number & PIN successfully!');
      } else {
        setFormError(result.message || 'Generation failed');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Generation failed.';
      setFormError(message);
      showToast(message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Save Generated Record to MongoDB
  const handleSaveRecord = async () => {
    if (!generatedAccount || isSaved) return;
    setIsSaving(true);
    try {
      const result = await saveAccountRecord(generatedAccount);
      if (result.success) {
        setIsSaved(true);
        showToast('Record saved to MongoDB successfully!');
        loadRecords(1);
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to save record.';
      showToast(message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset/Generate Another
  const handleReset = () => {
    setGeneratedAccount(null);
    setIsSaved(false);
    setFormError('');
  };

  // Handle Record Deletion
  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      const res = await deleteAccountRecord(deleteCandidate._id);
      if (res.success) {
        showToast('Record deleted successfully.');
        setDeleteCandidate(null);
        loadRecords(pagination.page);
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to delete record.';
      showToast(message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Sticky Header */}
      <Header />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Split Layout: Generation Config & Result Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Generation Configuration Form */}
          <div className={generatedAccount ? 'lg:col-span-6 min-w-0 w-full' : 'lg:col-span-12 max-w-3xl mx-auto w-full'}>
            <AccountForm
              formData={formData}
              setFormData={setFormData}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              error={formError}
            />
          </div>

          {/* Generated Result Card */}
          {generatedAccount && (
            <div className="lg:col-span-6 min-w-0 w-full">
              <GeneratedResultCard
                accountData={generatedAccount}
                onSave={handleSaveRecord}
                onReset={handleReset}
                isSaving={isSaving}
                isSaved={isSaved}
              />
            </div>
          )}
        </div>

        {/* Database Records History Table */}
        <section className="pt-2">
          <RecordsTable
            records={records}
            pagination={pagination}
            search={search}
            setSearch={setSearch}
            formatFilter={formatFilter}
            setFormatFilter={setFormatFilter}
            onPageChange={(page) => loadRecords(page)}
            onDeleteRequest={(record) => setDeleteCandidate(record)}
            onRefresh={() => loadRecords(pagination.page)}
            isLoading={isTableLoading}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            Account Number Generator • Built with React, Vite, Node.js, Express & MongoDB.
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            All generated accounts, PINs, and monetary details are for fictional simulation and testing purposes only.
          </p>
        </div>
      </footer>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteCandidate)}
        title="Delete Account Record"
        message={`Are you sure you want to permanently delete the record for ${deleteCandidate?.accountHolderName} (${deleteCandidate?.accountNumber})? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteCandidate(null)}
        isDeleting={isDeleting}
      />

      {/* Toast Notifications */}
      <NotificationToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
