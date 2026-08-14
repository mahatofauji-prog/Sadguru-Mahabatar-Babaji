import React, { useState, useMemo } from 'react';
import {
  Heart,
  Search,
  Filter,
  Download,
  Printer,
  Trash2,
  Eye,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  MapPin,
  Sparkles,
  X
} from 'lucide-react';
import { useDonationContext } from '../context/DonationContext';
import { DonationRecord, DONATION_PURPOSES } from '../types/donation';
import { INDIA_STATES_AND_DISTRICTS, getDistrictsForState } from '../data/indiaLocations';
import { DonationReceipt } from './DonationReceipt';

export const AdminDonationManager: React.FC = () => {
  const { donations, deleteDonation, approveDonation, rejectDonation, statistics } = useDonationContext();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'SUCCESS' | 'FAILED'>('ALL');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR'>('ALL');
  const [filterState, setFilterState] = useState('ALL');
  const [filterDistrict, setFilterDistrict] = useState('ALL');
  const [filterPurpose, setFilterPurpose] = useState('ALL');
  const [filterAmountRange, setFilterAmountRange] = useState<'ALL' | 'UNDER_1K' | '1K_5K' | '5K_20K' | 'ABOVE_20K'>('ALL');

  // Selected Donor for Modal Viewing / Verification / Receipt Generation
  const [selectedDonor, setSelectedDonor] = useState<DonationRecord | null>(null);
  const [viewingReceipt, setViewingReceipt] = useState<DonationRecord | null>(null);
  const [rejectionModalDonor, setRejectionModalDonor] = useState<DonationRecord | null>(null);
  const [customRejectionReason, setCustomRejectionReason] = useState('');

  // Active Tab inside Donation Management
  const [activeTab, setActiveTab] = useState<'DATABASE' | 'REPORTS'>('DATABASE');

  // Pending count for quick badge display
  const pendingCount = useMemo(() => {
    return donations.filter((d) => d.paymentStatus === 'PENDING').length;
  }, [donations]);

  // District options based on filter state
  const availableDistricts = useMemo(() => {
    if (filterState === 'ALL') return [];
    return getDistrictsForState(filterState);
  }, [filterState]);

  // Filtered Donors List
  const filteredDonations = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = now.getTime() - 7 * 24 * 3600 * 1000;
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();

    return donations.filter((d) => {
      // Status Filter
      if (statusFilter !== 'ALL' && d.paymentStatus !== statusFilter) return false;

      // Search Query
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesName = d.fullName.toLowerCase().includes(q);
        const matchesMobile = d.mobile.includes(q);
        const matchesReceipt = d.receiptNo.toLowerCase().includes(q);
        const matchesTxn = d.transactionId.toLowerCase().includes(q);
        const matchesUtr = d.utrNumber ? d.utrNumber.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesMobile && !matchesReceipt && !matchesTxn && !matchesUtr) {
          return false;
        }
      }

      // Date Filter
      if (dateFilter === 'TODAY' && d.createdTimestamp < startOfToday) return false;
      if (dateFilter === 'WEEK' && d.createdTimestamp < startOfWeek) return false;
      if (dateFilter === 'MONTH' && d.createdTimestamp < startOfMonth) return false;
      if (dateFilter === 'YEAR' && d.createdTimestamp < startOfYear) return false;

      // State Filter
      if (filterState !== 'ALL' && d.state !== filterState) return false;

      // District Filter
      if (filterDistrict !== 'ALL' && d.district !== filterDistrict) return false;

      // Purpose Filter
      if (filterPurpose !== 'ALL' && d.purpose !== filterPurpose) return false;

      // Amount Range Filter
      const amt = Number(d.amount) || 0;
      if (filterAmountRange === 'UNDER_1K' && amt >= 1000) return false;
      if (filterAmountRange === '1K_5K' && (amt < 1000 || amt > 5000)) return false;
      if (filterAmountRange === '5K_20K' && (amt < 5000 || amt > 20000)) return false;
      if (filterAmountRange === 'ABOVE_20K' && amt <= 20000) return false;

      return true;
    });
  }, [
    donations,
    searchQuery,
    statusFilter,
    dateFilter,
    filterState,
    filterDistrict,
    filterPurpose,
    filterAmountRange
  ]);

  // Export to Excel (CSV Download)
  const handleExportCsv = () => {
    if (filteredDonations.length === 0) {
      alert('निर्यात (Export) करने के लिए कोई रिकॉर्ड उपलब्ध नहीं है!');
      return;
    }

    const headers = [
      'Receipt No',
      'Transaction ID',
      'Payment ID',
      'Donor Name',
      'Mobile',
      'Email',
      'Gender',
      'DOB',
      'Marital Status',
      'Address',
      'State',
      'District',
      'Pincode',
      'PAN Number',
      'Donation Purpose',
      'Amount (₹)',
      'Payment Date',
      'Payment Status',
      'Payment Gateway'
    ];

    const rows = filteredDonations.map((d) => [
      `"${d.receiptNo}"`,
      `"${d.transactionId}"`,
      `"${d.paymentId}"`,
      `"${d.fullName.replace(/"/g, '""')}"`,
      `"${d.mobile}"`,
      `"${d.email || ''}"`,
      `"${d.gender}"`,
      `"${d.dob || ''}"`,
      `"${d.maritalStatus}"`,
      `"${d.address.replace(/"/g, '""')}"`,
      `"${d.state}"`,
      `"${d.district}"`,
      `"${d.pincode}"`,
      `"${d.panNumber || ''}"`,
      `"${d.purpose.replace(/"/g, '""')}"`,
      d.amount,
      `"${d.formattedDate}"`,
      `"${d.paymentStatus}"`,
      `"${d.gatewayName}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Peeth_Donors_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF / Print Summary
  const handlePrintSummary = () => {
    window.print();
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`क्या आप दानदाता "${name}" का रिकॉर्ड हटाना चाहते हैं?`)) {
      await deleteDonation(id);
    }
  };

  return (
    <div className="space-y-6 text-gold-100 font-sans">
      {/* DASHBOARD STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Total Collected */}
        <div className="col-span-2 sm:col-span-2 bg-gradient-to-br from-coffee-900 to-coffee-950 p-4 rounded-2xl border border-gold-500/40 shadow-lg">
          <div className="flex items-center justify-between text-xs text-saffron-400 font-semibold mb-1">
            <span>कुल प्राप्त दान राशि (Total Collection)</span>
            <DollarSign size={18} />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-black text-saffron-400">
            ₹ {statistics.totalAmount.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-gold-300/60 block mt-1">
            कुल दान संख्या: {statistics.totalCount} दानदाताओं द्वारा
          </span>
        </div>

        {/* Today's Collection */}
        <div className="bg-coffee-900/90 p-3.5 rounded-2xl border border-gold-500/30">
          <span className="text-[10px] text-gold-300/70 block">आज का दान (Today)</span>
          <div className="font-serif text-lg font-bold text-emerald-400">
            ₹ {statistics.todayAmount.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-gold-300/60 block">{statistics.todayCount} दान</span>
        </div>

        {/* Monthly Collection */}
        <div className="bg-coffee-900/90 p-3.5 rounded-2xl border border-gold-500/30">
          <span className="text-[10px] text-gold-300/70 block">इस माह (Monthly)</span>
          <div className="font-serif text-lg font-bold text-gold-300">
            ₹ {statistics.monthlyAmount.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-gold-300/60 block">{statistics.monthlyCount} दान</span>
        </div>

        {/* Yearly Collection */}
        <div className="bg-coffee-900/90 p-3.5 rounded-2xl border border-gold-500/30">
          <span className="text-[10px] text-gold-300/70 block">इस वर्ष (Yearly)</span>
          <div className="font-serif text-lg font-bold text-saffron-300">
            ₹ {statistics.yearlyAmount.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-gold-300/60 block">{statistics.yearlyCount} दान</span>
        </div>

        {/* Success Count */}
        <div className="bg-coffee-900/90 p-3.5 rounded-2xl border border-gold-500/30">
          <span className="text-[10px] text-gold-300/70 block">स्वीकृत दान (Verified)</span>
          <div className="font-serif text-lg font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={16} />
            <span>{statistics.successCount}</span>
          </div>
          <span className="text-[10px] text-emerald-300/60 block">100% Approved</span>
        </div>

        {/* Pending Verification Badge Card */}
        <div
          onClick={() => {
            setActiveTab('DATABASE');
            setStatusFilter('PENDING');
          }}
          className={`p-3.5 rounded-2xl border transition cursor-pointer ${
            pendingCount > 0
              ? 'bg-amber-950/80 border-amber-500/60 hover:bg-amber-900/90 shadow-lg'
              : 'bg-coffee-900/90 border-gold-500/30'
          }`}
        >
          <span className="text-[10px] text-amber-300/90 font-bold block flex items-center justify-between">
            <span>सत्यापन लंबित (Pending)</span>
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </span>
          <div className="font-serif text-lg font-bold text-amber-400 flex items-center gap-1.5 pt-0.5">
            <Clock size={16} />
            <span>{pendingCount} दानप्रविष्टि</span>
          </div>
          <span className="text-[10px] text-amber-200/70 block mt-0.5">
            {pendingCount > 0 ? 'सत्यापन हेतु क्लिक करें' : 'कोई लंबित सत्यापन नहीं'}
          </span>
        </div>
      </div>

      {/* PENDING VERIFICATION ALERT BANNER */}
      {pendingCount > 0 && (
        <div className="bg-amber-950/90 border-2 border-amber-500/60 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-xl animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center shrink-0">
              <Clock size={20} className="text-amber-400 animate-pulse" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-amber-200 text-sm">
                {pendingCount} नया दान सत्यापन हेतु लंबित है (Manual Verification Required)
              </h4>
              <p className="text-gold-200/80 text-[11px]">
                दानदाताओं द्वारा UTR एवं भुगतान स्क्रीनशॉट सबमिट किया गया है। कृपया सत्यापन करके स्वीकृति प्रदान करें।
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveTab('DATABASE');
              setStatusFilter('PENDING');
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-coffee-50 font-bold rounded-xl text-xs transition cursor-pointer shrink-0 shadow-md"
          >
            लंबित दान देखें ({pendingCount})
          </button>
        </div>
      )}

      {/* TABS HEADER (Database vs Reports) */}
      <div className="flex items-center justify-between border-b border-gold-500/30 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('DATABASE')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'DATABASE'
                ? 'bg-saffron-500 text-coffee-50 shadow-md'
                : 'bg-coffee-900 text-gold-300 hover:bg-coffee-800'
            }`}
          >
            <Users size={16} />
            <span>दानदाता डेटाबेस (Donor Database)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('REPORTS')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'REPORTS'
                ? 'bg-saffron-500 text-coffee-50 shadow-md'
                : 'bg-coffee-900 text-gold-300 hover:bg-coffee-800'
            }`}
          >
            <TrendingUp size={16} />
            <span>एनालिटिक्स एवं रिपोर्ट (Reports)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet size={15} />
            <span className="hidden sm:inline">Excel Export</span>
          </button>

          <button
            type="button"
            onClick={handlePrintSummary}
            className="px-3 py-1.5 bg-coffee-800 hover:bg-coffee-700 text-gold-200 border border-gold-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer size={15} />
            <span className="hidden sm:inline">Print Report</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DONOR DATABASE TABLE & SEARCH/FILTERS */}
      {activeTab === 'DATABASE' && (
        <div className="space-y-4">
          {/* SEARCH & FILTERS BAR */}
          <div className="bg-coffee-950/90 p-4 rounded-2xl border border-gold-500/30 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
              {/* Search Box */}
              <div className="sm:col-span-2 relative">
                <Search size={16} className="absolute left-3 top-2.5 text-gold-400" />
                <input
                  type="text"
                  placeholder="खोजें: नाम, UTR, मोबाइल या रसीद..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-coffee-900 border border-gold-500/40 rounded-xl text-gold-100 placeholder-gold-300/40 focus:outline-none focus:border-gold-400"
                />
              </div>

              {/* Payment Verification Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 bg-coffee-900 border border-amber-500/50 rounded-xl text-amber-200 font-bold focus:outline-none"
                >
                  <option value="ALL">सभी स्थितियां (All Status)</option>
                  <option value="PENDING">⏳ सत्यापन लंबित ({pendingCount})</option>
                  <option value="SUCCESS">✓ स्वीकृत (Approved)</option>
                  <option value="FAILED">✕ अस्वीकृत (Rejected)</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as any)}
                  className="w-full px-3 py-2 bg-coffee-900 border border-gold-500/40 rounded-xl text-gold-100 focus:outline-none"
                >
                  <option value="ALL">सभी समयावधि (All Time)</option>
                  <option value="TODAY">आज का दान (Today)</option>
                  <option value="WEEK">इस सप्ताह (This Week)</option>
                  <option value="MONTH">इस माह (This Month)</option>
                  <option value="YEAR">इस वर्ष (This Year)</option>
                </select>
              </div>

              {/* Purpose Filter */}
              <div>
                <select
                  value={filterPurpose}
                  onChange={(e) => setFilterPurpose(e.target.value)}
                  className="w-full px-3 py-2 bg-coffee-900 border border-gold-500/40 rounded-xl text-gold-100 focus:outline-none"
                >
                  <option value="ALL">सभी दान उद्देश्य (All Purpose)</option>
                  {DONATION_PURPOSES.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.labelHi}
                    </option>
                  ))}
                </select>
              </div>

              {/* State Filter */}
              <div>
                <select
                  value={filterState}
                  onChange={(e) => {
                    setFilterState(e.target.value);
                    setFilterDistrict('ALL');
                  }}
                  className="w-full px-3 py-2 bg-coffee-900 border border-gold-500/40 rounded-xl text-gold-100 focus:outline-none"
                >
                  <option value="ALL">सभी राज्य (All States)</option>
                  {INDIA_STATES_AND_DISTRICTS.map((st) => (
                    <option key={st.state} value={st.state}>
                      {st.state}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* DONATION RECORDS TABLE */}
          <div className="bg-coffee-950/80 rounded-2xl border border-gold-500/30 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-coffee-900 text-saffron-400 border-b border-gold-500/30 font-bold uppercase tracking-wider">
                    <th className="p-3">रसीद सं. / ID</th>
                    <th className="p-3">दानदाता नाम</th>
                    <th className="p-3">मोबाइल / UTR</th>
                    <th className="p-3">उद्देश्य</th>
                    <th className="p-3">राशि (₹)</th>
                    <th className="p-3">सत्यापन स्थिति</th>
                    <th className="p-3">दिनांक</th>
                    <th className="p-3 text-center">कार्रवाई (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-500/10">
                  {filteredDonations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gold-300/60 font-serif">
                        कोई रिकॉर्ड उपलब्ध नहीं है। (No records matching filters)
                      </td>
                    </tr>
                  ) : (
                    filteredDonations.map((d) => (
                      <tr key={d.id} className="hover:bg-coffee-900/60 transition">
                        <td className="p-3 font-mono font-bold text-saffron-400 whitespace-nowrap">
                          {d.receiptNo}
                        </td>
                        <td className="p-3 font-semibold text-gold-100">{d.fullName}</td>
                        <td className="p-3">
                          <div className="font-mono text-gold-200">{d.mobile}</div>
                          {d.utrNumber && (
                            <div className="font-mono text-[10px] text-saffron-400 font-bold">
                              UTR: {d.utrNumber}
                            </div>
                          )}
                        </td>
                        <td className="p-3 font-serif text-gold-200">{d.purpose.split('(')[0]}</td>
                        <td className="p-3 font-serif font-black text-saffron-300 text-sm">
                          ₹ {Number(d.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {d.paymentStatus === 'PENDING' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold rounded-full">
                              <Clock size={12} className="animate-spin" />
                              <span>सत्यापन लंबित</span>
                            </span>
                          )}
                          {d.paymentStatus === 'SUCCESS' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold rounded-full">
                              <CheckCircle2 size={12} />
                              <span>स्वीकृत (Approved)</span>
                            </span>
                          )}
                          {d.paymentStatus === 'FAILED' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-bold rounded-full">
                              <XCircle size={12} />
                              <span>अस्वीकृत (Rejected)</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-gold-300/70 whitespace-nowrap">{d.formattedDate}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* APPROVE / REJECT BUTTONS FOR PENDING ITEMS */}
                            {d.paymentStatus === 'PENDING' && (
                              <>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (confirm(`क्या आप ${d.fullName} के ₹${d.amount} के दान (UTR: ${d.utrNumber}) को स्वीकृत करना चाहते हैं?`)) {
                                      await approveDonation(d.id, 'Admin');
                                    }
                                  }}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] transition cursor-pointer flex items-center gap-1 shadow"
                                  title="दान स्वीकृत करें (Approve)"
                                >
                                  <CheckCircle2 size={12} />
                                  <span>स्वीकृत</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setRejectionModalDonor(d)}
                                  className="px-2 py-1 bg-red-800 hover:bg-red-700 text-white font-bold rounded-lg text-[10px] transition cursor-pointer flex items-center gap-1"
                                  title="अस्वीकृत करें (Reject)"
                                >
                                  <XCircle size={12} />
                                  <span>अस्वीकृत</span>
                                </button>
                              </>
                            )}

                            {/* View Details */}
                            <button
                              type="button"
                              onClick={() => setSelectedDonor(d)}
                              className="p-1.5 bg-coffee-800 hover:bg-gold-500 hover:text-coffee-50 text-gold-300 rounded-lg transition cursor-pointer"
                              title="विवरण देखें (View Details)"
                            >
                              <Eye size={15} />
                            </button>

                            {/* View / Download Receipt (Only if SUCCESS) */}
                            {d.paymentStatus === 'SUCCESS' && (
                              <button
                                type="button"
                                onClick={() => setViewingReceipt(d)}
                                className="p-1.5 bg-saffron-500/20 hover:bg-saffron-500 hover:text-coffee-50 text-saffron-300 rounded-lg transition cursor-pointer"
                                title="रसीद देखें / डाउनलोड (Receipt)"
                              >
                                <FileText size={15} />
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDelete(d.id, d.fullName)}
                              className="p-1.5 bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition cursor-pointer"
                              title="हटाएं (Delete)"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ANALYTICS & REPORTS */}
      {activeTab === 'REPORTS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PURPOSE-WISE COLLECTION REPORT */}
          <div className="bg-coffee-950 p-5 rounded-2xl border border-gold-500/30 space-y-4">
            <h3 className="font-serif font-bold text-base text-gold-200 border-b border-gold-500/20 pb-2 flex items-center gap-2">
              <Heart size={18} className="text-saffron-400" />
              <span>दान उद्देश्य अनुसार संग्रह (Purpose-wise Collection)</span>
            </h3>

            <div className="space-y-3">
              {Object.entries(statistics.purposeBreakdown).map(([purp, rawData]) => {
                const data = rawData as { count: number; amount: number };
                const percent = statistics.totalAmount > 0 ? (data.amount / statistics.totalAmount) * 100 : 0;
                return (
                  <div key={purp} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gold-200 font-serif">{purp.split('(')[0]}</span>
                      <span className="text-saffron-400 font-mono font-bold">
                        ₹ {data.amount.toLocaleString('en-IN')} ({data.count} दान)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-coffee-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-saffron-500 to-gold-400 rounded-full"
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STATE-WISE COLLECTION REPORT */}
          <div className="bg-coffee-950 p-5 rounded-2xl border border-gold-500/30 space-y-4">
            <h3 className="font-serif font-bold text-base text-gold-200 border-b border-gold-500/20 pb-2 flex items-center gap-2">
              <MapPin size={18} className="text-saffron-400" />
              <span>राज्य-वार संग्रह (State-wise Collection)</span>
            </h3>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {Object.entries(statistics.stateBreakdown).map(([st, rawData]) => {
                const data = rawData as { count: number; amount: number };
                return (
                  <div key={st} className="flex justify-between items-center bg-coffee-900/60 p-2.5 rounded-xl text-xs">
                    <span className="font-semibold text-gold-100">{st}</span>
                    <div className="text-right">
                      <span className="font-serif font-bold text-saffron-400 block">
                        ₹ {data.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-gold-300/60">{data.count} दानदाता</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* DONOR DETAILS MODAL */}
      {selectedDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-coffee-950 border-2 border-gold-500/50 rounded-3xl p-6 space-y-4 shadow-2xl">
            <button
              onClick={() => setSelectedDonor(null)}
              className="absolute top-4 right-4 text-gold-400 hover:text-white p-1 rounded-full bg-coffee-900"
            >
              <X size={20} />
            </button>

            <h3 className="font-serif text-xl font-bold text-gold-300 border-b border-gold-500/30 pb-2">
              दानदाता पूर्ण विवरण (Donor Full Profile)
            </h3>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-gold-500/10 py-1">
                <span className="text-gold-300/60">सत्यापन स्थिति:</span>
                <div>
                  {selectedDonor.paymentStatus === 'PENDING' && (
                    <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 rounded-full text-xs">
                      ⏳ सत्यापन लंबित (Pending)
                    </span>
                  )}
                  {selectedDonor.paymentStatus === 'SUCCESS' && (
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 rounded-full text-xs">
                      ✓ स्वीकृत (Approved)
                    </span>
                  )}
                  {selectedDonor.paymentStatus === 'FAILED' && (
                    <span className="px-2.5 py-0.5 bg-red-500/20 text-red-300 font-bold border border-red-500/40 rounded-full text-xs">
                      ✕ अस्वीकृत (Rejected)
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between border-b border-gold-500/10 py-1">
                <span className="text-gold-300/60">रसीद संख्या:</span>
                <span className="font-mono font-bold text-saffron-400">{selectedDonor.receiptNo}</span>
              </div>
              <div className="flex justify-between border-b border-gold-500/10 py-1">
                <span className="text-gold-300/60">UTR / Ref Number:</span>
                <span className="font-mono font-bold text-saffron-300 bg-coffee-900 px-2 py-0.5 rounded border border-gold-500/20">
                  {selectedDonor.utrNumber || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between border-b border-gold-500/10 py-1">
                <span className="text-gold-300/60">प्राप्तकर्ता UPI ID:</span>
                <span className="font-mono font-bold text-saffron-400">
                  {selectedDonor.upiId || '8308444455@kotak'}
                </span>
              </div>
              <div className="flex justify-between border-b border-gold-500/10 py-1">
                <span className="text-gold-300/60">दानदाता नाम:</span>
                <span className="font-bold text-gold-100">{selectedDonor.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-gold-500/10 py-1">
                <span className="text-gold-300/60">मोबाइल नंबर:</span>
                <span className="font-mono text-gold-200">{selectedDonor.mobile}</span>
              </div>
              <div className="flex justify-between border-b border-gold-500/10 py-1">
                <span className="text-gold-300/60">ईमेल:</span>
                <span className="font-mono text-gold-200">{selectedDonor.email || 'उपलब्ध नहीं'}</span>
              </div>
              <div className="flex justify-between border-b border-gold-500/10 py-1">
                <span className="text-gold-300/60">दान का उद्देश्य:</span>
                <span className="font-serif font-bold text-gold-200">{selectedDonor.purpose}</span>
              </div>
              <div className="flex justify-between border-b border-gold-500/10 py-1">
                <span className="text-gold-300/60">दान राशि:</span>
                <span className="font-serif font-black text-saffron-400 text-base">
                  ₹ {Number(selectedDonor.amount).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between border-b border-gold-500/10 py-1">
                <span className="text-gold-300/60">पूरा पता:</span>
                <span className="text-gold-200 text-right">
                  {selectedDonor.address}, {selectedDonor.district}, {selectedDonor.state} - {selectedDonor.pincode}
                </span>
              </div>

              {/* Screenshot Preview */}
              {selectedDonor.screenshotUrl && (
                <div className="pt-2 border-t border-gold-500/20 space-y-1">
                  <span className="block text-gold-300/70 font-bold">भुगतान का स्क्रीनशॉट (Payment Proof):</span>
                  <div className="relative bg-coffee-900 rounded-xl p-2 border border-gold-500/30 flex items-center justify-between">
                    <img
                      src={selectedDonor.screenshotUrl}
                      alt="Proof"
                      className="w-16 h-16 rounded object-cover border border-gold-500/30 cursor-pointer"
                      onClick={() => window.open(selectedDonor.screenshotUrl, '_blank')}
                      referrerPolicy="no-referrer"
                    />
                    <a
                      href={selectedDonor.screenshotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-coffee-800 hover:bg-gold-500 hover:text-coffee-50 text-gold-200 rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      <Eye size={14} />
                      <span>पूर्ण स्क्रीन में देखें</span>
                    </a>
                  </div>
                </div>
              )}

              {selectedDonor.rejectionReason && (
                <div className="bg-red-950/60 border border-red-500/40 p-2.5 rounded-xl text-red-200 text-xs">
                  <strong>अस्वीकृति कारण:</strong> {selectedDonor.rejectionReason}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gold-500/20">
              {selectedDonor.paymentStatus === 'PENDING' && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await approveDonation(selectedDonor.id, 'Admin');
                      setSelectedDonor((prev) => (prev ? { ...prev, paymentStatus: 'SUCCESS' } : null));
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg"
                  >
                    <CheckCircle2 size={16} />
                    <span>सत्यापन स्वीकृत करें (Approve)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRejectionModalDonor(selectedDonor);
                      setSelectedDonor(null);
                    }}
                    className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <XCircle size={16} />
                    <span>अस्वीकृत करें (Reject)</span>
                  </button>
                </div>
              )}

              {selectedDonor.paymentStatus === 'SUCCESS' && (
                <button
                  type="button"
                  onClick={() => {
                    setViewingReceipt(selectedDonor);
                    setSelectedDonor(null);
                  }}
                  className="px-4 py-2 bg-saffron-500 text-coffee-50 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <FileText size={15} />
                  <span>रसीद देखें व प्रिंट करें</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedDonor(null)}
                className="px-4 py-2 bg-coffee-800 hover:bg-coffee-700 text-gold-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectionModalDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-coffee-950 border-2 border-red-500/60 rounded-3xl p-6 space-y-4 shadow-2xl">
            <button
              onClick={() => setRejectionModalDonor(null)}
              className="absolute top-4 right-4 text-gold-400 hover:text-white p-1 rounded-full bg-coffee-900 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 border-b border-red-500/30 pb-3">
              <XCircle size={28} className="text-red-400 shrink-0" />
              <div>
                <h3 className="font-serif text-lg font-bold text-red-200">
                  दान अस्वीकृत करें (Reject Donation Verification)
                </h3>
                <p className="text-xs text-gold-300/70">
                  दानदाता: {rejectionModalDonor.fullName} (₹{rejectionModalDonor.amount})
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gold-200">
                अस्वीकृति का कारण दर्ज करें (Rejection Reason):
              </label>
              <textarea
                rows={3}
                placeholder="उदा: यूटीआर नंबर (UTR) बैंक रिकॉर्ड में नहीं पाया गया / भुगतान असफल..."
                value={customRejectionReason}
                onChange={(e) => setCustomRejectionReason(e.target.value)}
                className="w-full p-3 bg-coffee-900 border border-red-500/40 rounded-xl text-xs text-gold-100 focus:outline-none focus:border-red-400"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectionModalDonor(null)}
                className="px-4 py-2 bg-coffee-800 text-gold-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                रद्द करें
              </button>

              <button
                type="button"
                onClick={async () => {
                  await rejectDonation(
                    rejectionModalDonor.id,
                    customRejectionReason || 'यूटीआर (UTR) बैंक विवरण में उपलब्ध नहीं पाया गया।',
                    'Admin'
                  );
                  setRejectionModalDonor(null);
                  setCustomRejectionReason('');
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow"
              >
                अस्वीकृत पुष्टि करें (Confirm Reject)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW RECEIPT MODAL */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#fcf8f0] border-2 border-[#c59b27] rounded-3xl p-5 sm:p-7 space-y-4 my-auto shadow-2xl">
            <button
              onClick={() => setViewingReceipt(null)}
              className="absolute top-4 right-4 text-[#7a5432] hover:text-[#2b1408] p-2 rounded-full bg-[#f3e6d3] hover:bg-[#ebd5bb] border border-[#d4af37]/50 cursor-pointer shadow-sm z-10"
              title="बंद करें (Close)"
            >
              <X size={20} />
            </button>

            <DonationReceipt receipt={viewingReceipt} />
          </div>
        </div>
      )}
    </div>
  );
};
