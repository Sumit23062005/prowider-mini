"use client";

import { useState } from "react";

const N = 10;

// CHANGE SERVICE HERE TO TEST DIFFERENT POOLS
const services = [
  "Service 1",
  "Service 2",
  "Service 3",
];

export default function TestToolsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loadingConcurrency, setLoadingConcurrency] = useState(false);
  const [loadingWebhook, setLoadingWebhook] = useState(false);
  const [selectedService, setSelectedService] = useState("Service 3");

  // ==================================================
  // CONCURRENCY TEST
  // ==================================================

  const handleConcurrencyTest = async () => {
    setLoadingConcurrency(true);
    setResults([]);

    const requests = Array.from(
      { length: N },
      async (_, i) => {
        // Unique phone every request
        const uniquePhone =
          "9" +
          Math.floor(
            100000000 + Math.random() * 900000000
          ).toString();

        try {
          const res = await fetch("/api/leads", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: `Test User ${i + 1}`,
              phone: uniquePhone,
              city: "Pune",
              service: selectedService,
              description: "Concurrency load test",
            }),
          });

          const data = await res.json();

          return {
            status: res.status,
            data,
            type: "Lead Generated",
          };
        } catch (err: any) {
          return {
            status: 500,
            data: err.message,
            type: "Network Error",
          };
        }
      }
    );

    const response = await Promise.all(requests);

    setResults(response);
    setLoadingConcurrency(false);
  };

  // ==================================================
  // RESET WEBHOOK
  // ==================================================

  const handleWebhookReset = async () => {
    setLoadingWebhook(true);
    try {
      // 1. Generate a mock eventId (replace with real eventId in production)
      const eventId = 'mock-event-id-123';
      // 2. Call a new API route that implements idempotency logic
      const res = await fetch("/api/webhook/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      setResults((prev) => [
        {
          status: res.status,
          data,
          type: "Webhook Reset",
        },
        ...prev,
      ]);
    } catch (err: any) {
      setResults((prev) => [
        {
          status: 500,
          data: err.message,
          type: "Webhook Error",
        },
        ...prev,
      ]);
    }
    setLoadingWebhook(false);
  };

  // ==================================================
  // IDEMPOTENCY TEST
  // ==================================================

  const handleIdempotencyTest = async () => {
    setLoadingWebhook(true);

    const spamRequests = Array.from(
      { length: 5 },
      async () => {
        try {
          const res = await fetch(
            "/api/webhook/payment",
            {
              method: "POST",
            }
          );

          const data = await res.json();

          return {
            status: res.status,
            data,
            type: "Webhook Spam",
          };
        } catch (err: any) {
          return {
            status: 500,
            data: err.message,
            type: "Webhook Error",
          };
        }
      }
    );

    const spamResults = await Promise.all(spamRequests);

    setResults((prev) => [
      ...spamResults,
      ...prev,
    ]);

    setLoadingWebhook(false);
  };

  // ==================================================
  // STATS
  // ==================================================

  const successCount = results.filter(
    (r) => r.status >= 200 && r.status < 300
  ).length;

  const errorCount = results.length - successCount;

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="border-b border-slate-200 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            System Testing Panel
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Test concurrency, round robin, quota handling, and webhook APIs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT PANEL: CONTROLS */}
          <div className="lg:col-span-4 space-y-8">

            {/* CONCURRENCY CARD */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Concurrency Test
                </h2>
              </div>

              <p className="text-sm text-slate-500 mb-6">
                Fires {N} simultaneous lead requests to verify allocation logic and database locks.
              </p>

              {/* SERVICE SELECT */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Select Target Pool
                </label>
                <div className="relative">
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none cursor-pointer text-slate-700 font-medium"
                  >
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConcurrencyTest}
                disabled={loadingConcurrency}
                className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {loadingConcurrency ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {loadingConcurrency ? "Blasting API..." : `Generate ${N} Leads`}
              </button>
            </div>

            {/* WEBHOOK CARD */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-rose-100 p-2 rounded-lg text-rose-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Webhook Tests
                </h2>
              </div>

              <p className="text-sm text-slate-500 mb-6">
                Simulate payment gateway events and test idempotency mechanisms.
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleWebhookReset}
                  disabled={loadingWebhook}
                  className="w-full flex justify-center items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Fire Reset Webhook
                </button>

                <button
                  onClick={handleIdempotencyTest}
                  disabled={loadingWebhook}
                  className="w-full flex justify-center items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  Spam Webhook x5
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: TERMINAL */}
          <div className="lg:col-span-8 bg-slate-900 rounded-3xl overflow-hidden shadow-2xl h-[720px] flex flex-col border border-slate-800">

            {/* TERMINAL HEADER */}
            <div className="bg-slate-950 px-6 py-4 flex justify-between items-center border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <h3 className="text-slate-300 font-semibold text-sm ml-2 font-mono">
                  ~/server/response-log
                </h3>
              </div>

              {results.length > 0 && (
                <div className="flex gap-4 text-xs font-bold font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-emerald-400">
                    Success: {successCount}
                  </span>
                  <span className="text-rose-400">
                    Failed: {errorCount}
                  </span>
                </div>
              )}
            </div>

            {/* LOGS CONTAINER */}
            {/* Custom scrollbar classes added via arbitrary Tailwind variants (works in standard browsers) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-sm [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-900 [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">

              {results.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                  <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M4 18h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <p className="italic">Awaiting test execution...</p>
                </div>
              ) : (
                results.map((result, i) => {
                  const isSuccess = result.status >= 200 && result.status < 300;

                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-xl border ${
                        isSuccess
                          ? "bg-emerald-950/20 border-emerald-900/50"
                          : "bg-rose-950/20 border-rose-900/50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-extrabold ${
                              isSuccess
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            }`}
                          >
                            {result.status}
                          </span>
                          <span className="text-slate-300 font-semibold tracking-wide">
                            {result.type}
                          </span>
                        </div>
                        <span className="text-slate-500 text-xs font-bold bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                          REQ #{i + 1}
                        </span>
                      </div>

                      <div className="pl-4 border-l-2 border-slate-700">
                        <pre className="text-slate-400 whitespace-pre-wrap break-all text-xs leading-relaxed">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  );
                })
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}