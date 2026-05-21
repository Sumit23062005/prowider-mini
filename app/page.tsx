import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-slate-900 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>

      <div className="max-w-5xl w-full z-10 space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            System Evaluation Portal
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900">
            Prowider Mini <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">
              Lead Distribution
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-500 font-medium">
            Select a module below to test the public lead generation form, monitor real-time distribution, or simulate backend load.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* Card 1: Request Service */}
          <Link href="/request-service" className="group relative bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60 hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full"></div>
            <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 w-max mb-6 group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Public Form</h2>
            <p className="text-slate-500 text-sm leading-relaxed flex-1">
              The public-facing portal where customers submit service inquiries. Tests form validation and lead creation.
            </p>
            <div className="mt-6 flex items-center text-indigo-600 font-semibold text-sm group-hover:gap-2 transition-all">
              Launch Module <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
          </Link>

          {/* Card 2: Dashboard */}
          <Link href="/dashboard" className="group relative bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60 hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full"></div>
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 w-max mb-6 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Admin Dashboard</h2>
            <p className="text-slate-500 text-sm leading-relaxed flex-1">
              Live monitoring system. View real-time lead allocations, total system traffic, and track provider quotas.
            </p>
            <div className="mt-6 flex items-center text-emerald-600 font-semibold text-sm group-hover:gap-2 transition-all">
              Launch Module <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
          </Link>

          {/* Card 3: Test Tools */}
          <Link href="/test-tools" className="group relative bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60 hover:shadow-xl hover:border-rose-300 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full"></div>
            <div className="p-4 rounded-2xl bg-rose-50 text-rose-600 w-max mb-6 group-hover:scale-110 group-hover:bg-rose-100 transition-all duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Test Tools</h2>
            <p className="text-slate-500 text-sm leading-relaxed flex-1">
              Developer console to simulate concurrency, test backend locks, trigger webhooks, and verify idempotency.
            </p>
            <div className="mt-6 flex items-center text-rose-600 font-semibold text-sm group-hover:gap-2 transition-all">
              Launch Module <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}