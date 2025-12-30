import { Mail, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer className="mt-20 bg-gradient-to-b from-transparent to-[#0a0f1a] border-t border-white/5 pt-16 pb-8 relative z-10">
            <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
                {/* Newsletter Section */}
                <div className="mb-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-[32px] p-8 md:p-10 relative overflow-hidden">
                    <div className="absolute -top-20 -left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                    <Mail size={20} className="text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white tracking-tight">Stay Updated</h3>
                            </div>
                            <p className="text-slate-300 text-sm max-w-md">
                                Get real-time air quality alerts and health recommendations delivered to your inbox.
                            </p>
                        </div>

                        <div className="w-full lg:w-auto lg:min-w-[400px]">
                            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                                />
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-500/30 active:scale-95">
                                    <Send size={16} />
                                    <span className="hidden sm:inline">Subscribe</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="flex flex-col gap-12 mb-12 lg:flex-row lg:justify-between">
                    <div className="mb-0 max-w-sm">
                        <Link to="/" className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#00f0ff] to-[#39ff14] rounded-xl flex items-center justify-center">
                                <div className="w-4 h-4 bg-white rounded-full" />
                            </div>
                            <h3 className="text-white font-bold text-xl tracking-tight">AQI Tracker</h3>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Real-time air quality monitoring for a healthier life. Track pollution levels, get health recommendations, and breathe easier.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-12 lg:gap-20">
                        <div>
                            <h4 className="text-white mb-5 font-bold text-sm uppercase tracking-wider">Resources</h4>
                            <Link to="/map" className="block text-slate-400 mb-3 text-sm transition-colors hover:text-blue-400">Air Quality Map</Link>
                            <Link to="/news" className="block text-slate-400 mb-3 text-sm transition-colors hover:text-blue-400">News & Research</Link>
                            <Link to="/" className="block text-slate-400 mb-3 text-sm transition-colors hover:text-blue-400">Station Widgets</Link>
                        </div>
                        <div>
                            <h4 className="text-white mb-5 font-bold text-sm uppercase tracking-wider">Site</h4>
                            <Link to="/" className="block text-slate-400 mb-3 text-sm transition-colors hover:text-blue-400">Home</Link>
                            <Link to="/rankings" className="block text-slate-400 mb-3 text-sm transition-colors hover:text-blue-400">City Rankings</Link>
                            <Link to="/" className="block text-slate-400 mb-3 text-sm transition-colors hover:text-blue-400">About Projects</Link>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/5 pt-8 flex flex-col items-center gap-4 text-center text-slate-500 text-xs lg:flex-row lg:justify-between lg:text-left">
                    <p className="m-0">&copy; 2025 AQI Tracker. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link to="/" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
                        <Link to="/" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
