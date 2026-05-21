"use client";

import { useState } from "react";

// Matches the Seed Data from the assignment
const SERVICES = ["Service 1", "Service 2", "Service 3"];

export default function RequestServicePage() {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        city: "",
        service: SERVICES[0],
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");
        
        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            // Parse the backend response to extract specific error messages (like duplicates)
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                // If the backend enforces the duplicate rule and returns a 409 or 400, catch it here
                if (res.status === 409) {
                    throw new Error("A request with this phone number for this service already exists.");
                }
                throw new Error(data.error || data.message || "Failed to submit request. Please try again.");
            }

            setSuccess("Your request has been submitted successfully! We'll be in touch soon.");
            setForm({ name: "", phone: "", city: "", service: SERVICES[0], description: "" });
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row">
            {/* Left Side: Brand & Messaging */}
            <div className="relative w-full lg:w-5/12 bg-indigo-900 text-white flex flex-col justify-between p-10 lg:p-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
                    <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-600 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-full h-96 bg-gradient-to-t from-indigo-950 to-transparent"></div>
                </div>

                <div className="relative z-10">
                    <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                        Let's build something <span className="text-indigo-400">amazing</span> together.
                    </h2>
                    <p className="text-indigo-200 text-lg mb-12 max-w-md leading-relaxed">
                        Fill out the form with your details and service requirements. Our team of experts will review your request and assign it to the right providers.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="bg-indigo-800/50 p-3 rounded-lg border border-indigo-700/50">
                                <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </div>
                            <div>
                                <h4 className="text-indigo-100 font-semibold mb-1">Email Us</h4>
                                <p className="text-indigo-300 text-sm">support@yourcompany.com</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-indigo-800/50 p-3 rounded-lg border border-indigo-700/50">
                                <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            </div>
                            <div>
                                <h4 className="text-indigo-100 font-semibold mb-1">Call Us</h4>
                                <p className="text-indigo-300 text-sm">+1 (555) 123-4567</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: The Form */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-8 lg:p-24 bg-gray-50/50">
                <div className="w-full max-w-2xl">
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-900">Request a Service</h1>
                        <p className="text-gray-500 mt-2">Please provide your information below.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="name">Full Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    disabled={loading}
                                    placeholder="John Doe"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:bg-gray-100 disabled:text-gray-500"
                                    value={form.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="phone">Phone Number</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    disabled={loading}
                                    placeholder="9999999999"
                                    pattern="[0-9]*"
                                    minLength={10}
                                    maxLength={15}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:bg-gray-100 disabled:text-gray-500"
                                    value={form.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="city">City</label>
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    required
                                    disabled={loading}
                                    placeholder="New York"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:bg-gray-100 disabled:text-gray-500"
                                    value={form.city}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="service">Service Type</label>
                                <select
                                    id="service"
                                    name="service"
                                    disabled={loading}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    value={form.service}
                                    onChange={handleChange}
                                >
                                    {SERVICES.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="description">Project Description</label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                disabled={loading}
                                rows={5}
                                placeholder="Tell us a little bit about what you need help with..."
                                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none disabled:bg-gray-100 disabled:text-gray-500"
                                value={form.description}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Status Messages */}
                        {success && (
                            <div className="p-5 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3 text-green-800 text-sm">
                                <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <p className="font-medium">{success}</p>
                            </div>
                        )}
                        {error && (
                            <div className="p-5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm">
                                <svg className="w-5 h-5 text-red-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <p className="font-medium">{error}</p>
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading && (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {loading ? "Submitting Request..." : "Submit Request"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}