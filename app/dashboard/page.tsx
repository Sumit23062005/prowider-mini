"use client";

import { useEffect, useState } from "react";

// ---------------- TYPES ----------------

interface Provider {
  _id: string;
  name: string;
  usedQuota: number;
  monthlyQuota: number;
}

interface Lead {
  _id: string;
  name: string;
  phone: string;
  city: string;
  serviceId: string;
  createdAt: string;
}

interface Assignment {
  _id: string;
  leadId: string;
  providerId?: {
    name: string;
  };
  assignedAt: string;
}

interface ProviderAssignedLead {
  customerName: string;
  phone: string;
  city: string;
  service: string;
  assignedAt: string;
}

interface ProviderDetails {
  name: string;
  usedQuota: number;
  monthlyQuota: number;
  remainingQuota: number;
  totalAssignedLeads: number;
  assignedLeads: ProviderAssignedLead[];
}

interface DashboardData {
  totalLeads: number;
  totalProviders: number;
  providers: Provider[];
  recentLeads: Lead[];
  recentAssignments: Assignment[];
  providerDetails: ProviderDetails[];
}

// ---------------- COMPONENT ----------------

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState("");

  // ---------------- FETCH DASHBOARD ----------------

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard");

      if (!res.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const dashboardData = await res.json();
      setData(dashboardData);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- AUTO REFRESH ----------------

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // ---------------- RESET QUOTAS ----------------

  const handleResetQuotas = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all provider quotas?"
    );

    if (!confirmed) return;

    try {
      setResetLoading(true);
      setResetSuccess("");

      const res = await fetch("/api/reset-quotas", {
        method: "POST",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Reset failed");
      }

      setResetSuccess("All provider quotas reset successfully.");
      await fetchDashboardData();
    } catch (err: any) {
      setResetSuccess(err.message || "Something went wrong");
    } finally {
      setResetLoading(false);
    }
  };

  // ---------------- PROGRESS COLOR ----------------

  const getProgressBarColor = (used: number, total: number) => {
    const percentage = used / total;

    if (percentage >= 1) {
      return "bg-rose-500";
    }

    if (percentage >= 0.7) {
      return "bg-amber-400";
    }

    return "bg-emerald-500";
  };

  // ---------------- LOADING ----------------


  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center gap-4 w-full max-w-xs animate-in fade-in slide-in-from-top-4">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <h1 className="text-lg font-semibold text-slate-700 animate-pulse text-center">
            Loading dashboard data...
          </h1>
        </div>
      </div>
    );
  }

  // ---------------- ERROR ----------------


  if (error && !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border-l-4 border-rose-500 shadow-lg text-slate-700 p-8 rounded-3xl max-w-md w-full animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-1.414-1.414A9 9 0 103 12h1a8 8 0 1113.95-6.364l-1.414-1.414z"></path></svg>
            <h3 className="text-rose-600 font-bold tracking-wide uppercase text-sm">Connection Error</h3>
          </div>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => { setLoading(true); setError(""); fetchDashboardData(); }}
            className="mt-2 px-4 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 font-semibold hover:bg-rose-100 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // ---------------- UI ----------------

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 sm:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 md:px-8 md:py-6 rounded-3xl shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Admin Dashboard
                </h1>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Live
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">
                Lead Distribution Monitoring System
              </p>
            </div>
          </div>

          <button
            onClick={handleResetQuotas}
            disabled={resetLoading}
            className="group flex items-center gap-2 bg-white border-2 border-rose-100 hover:border-rose-200 hover:bg-rose-50 text-rose-600 px-6 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <svg className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            {resetLoading ? "Resetting..." : "Reset Quotas"}
          </button>
        </div>

        {/* SUCCESS MESSAGE */}
        {resetSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-4">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="font-medium">{resetSuccess}</span>
          </div>
        )}

        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-2">
                Total Leads
              </p>
              <h2 className="text-6xl font-black text-indigo-600 tracking-tighter">
                {data.totalLeads}
              </h2>
            </div>
            <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-500">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-2">
                Total Providers
              </p>
              <h2 className="text-6xl font-black text-emerald-500 tracking-tighter">
                {data.totalProviders}
              </h2>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-500">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
          </div>
        </div>

        {/* PROVIDERS */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Provider Quotas
            </h2>
            <div className="h-px bg-slate-200 flex-1 mt-1"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {data.providers.map((provider) => {
              const percentage = (provider.usedQuota / provider.monthlyQuota) * 100;
              const isExhausted = provider.usedQuota >= provider.monthlyQuota;

              return (
                <div key={provider._id} className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${isExhausted ? 'border-rose-200 shadow-rose-100/50' : 'border-slate-200/60'}`}>
                  <div className="flex justify-between items-end mb-4">
                    <h3 className="font-bold text-slate-800 truncate pr-2">
                      {provider.name}
                    </h3>
                    <div className="flex items-baseline gap-1 text-sm">
                      <span className={`font-bold ${isExhausted ? 'text-rose-600' : 'text-slate-700'}`}>{provider.usedQuota}</span>
                      <span className="text-slate-400">/</span>
                      <span className="text-slate-500">{provider.monthlyQuota}</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${getProgressBarColor(provider.usedQuota, provider.monthlyQuota)}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  {isExhausted && <p className="text-[11px] font-bold text-rose-500 tracking-wide uppercase mt-3">Quota Exhausted</p>}
                </div>
              );
            })}
          </div>
        </div>

        {/* PROVIDER-WISE LEADS */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Provider-wise Assigned Leads
            </h2>
            <div className="h-px bg-slate-200 flex-1 mt-1"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.providerDetails.length === 0 ? (
              <div className="col-span-full text-center text-slate-400 italic py-8">No providers found.</div>
            ) : (
              data.providerDetails.map((provider) => (
                <div key={provider.name} className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <h3 className="font-bold text-lg text-slate-900 truncate max-w-[60%]">{provider.name}</h3>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-indigo-50 text-indigo-600 border border-indigo-100/50">
                      {provider.usedQuota} / {provider.monthlyQuota} quota
                    </span>
                  </div>
                  <div className="text-slate-500 text-xs mb-2">Total Assigned Leads: <span className="font-bold text-slate-700">{provider.totalAssignedLeads}</span></div>
                  <div className="flex-1 min-h-[60px]">
                    {provider.assignedLeads.length === 0 ? (
                      <div className="text-slate-400 italic text-sm py-6 text-center">No assigned leads for this provider.</div>
                    ) : (
                      <ul className="divide-y divide-slate-100">
                        {provider.assignedLeads.map((lead, idx) => (
                          <li key={idx} className="py-3 flex flex-col gap-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                              <span className="font-semibold text-slate-800">{lead.customerName}</span>
                              <span className="text-xs text-slate-400 font-mono break-all">{lead.phone}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                              <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">{lead.city}</span>
                              <span className="bg-indigo-50 px-2 py-0.5 rounded font-medium text-indigo-600 border border-indigo-100/50">{lead.service}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* RECENT LEADS */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 flex flex-col overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">
                Recent Leads
              </h2>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">Live Feed</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white text-slate-400 text-xs uppercase tracking-widest font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">City</th>
                    <th className="px-6 py-4 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.recentLeads.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-slate-400 italic">No recent leads.</td>
                    </tr>
                  ) : (
                    data.recentLeads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {lead.name}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {lead.city}
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-right font-mono text-xs">
                          {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RECENT ASSIGNMENTS */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 flex flex-col overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">
                Recent Assignments
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white text-slate-400 text-xs uppercase tracking-widest font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Lead ID</th>
                    <th className="px-6 py-4">Provider</th>
                    <th className="px-6 py-4 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.recentAssignments.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-slate-400 italic">No recent assignments.</td>
                    </tr>
                  ) : (
                    data.recentAssignments.map((assignment) => (
                      <tr key={assignment._id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                          #{assignment.leadId.slice(-6)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100/50 shadow-sm">
                            {assignment.providerId?.name || "Unknown"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-right font-mono text-xs">
                          {new Date(assignment.assignedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}