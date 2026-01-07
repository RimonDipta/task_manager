import { useEffect, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { Zap, CheckCircle, Kanban, BarChart3, ArrowRight, Star, Menu, X } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";

const LandingPage = () => {
    usePageTitle("Doora - The Future of Work");
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate("/dashboard/home");
        }
    }, [user, navigate]);

    if (user) return null; // Avoid flashing content

    return (
        <div className="min-h-screen bg-[#0f172a] text-white overflow-x-hidden selection:bg-indigo-500/30 font-sans">

            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
            </div>

            {/* Navbar - Capsule Glass Effect */}
            <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center animate-fadeIn" style={{ animationDuration: '0.8s' }}>
                <div className="relative">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2.5 flex items-center gap-8 shadow-2xl ring-1 ring-white/5 mx-4 md:mx-0">

                        {/* Logo */}
                        <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
                            <div className="relative">
                                <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
                                <div className="absolute inset-0 bg-indigo-400 blur-lg opacity-40"></div>
                            </div>
                            <span>Doora</span>
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
                            <a href="#features" className="hover:text-white transition-colors">Features</a>
                            <a href="#about" className="hover:text-white transition-colors">About</a>
                            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                        </div>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden md:flex items-center gap-2 pl-4 border-l border-white/10">
                            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-2">
                                Log in
                            </Link>
                            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.7)] flex items-center gap-1 group">
                                Start for free
                                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center ml-auto pl-4 border-l border-white/10">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-slate-300 hover:text-white transition-colors p-1"
                            >
                                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full left-0 right-0 mt-2 mx-4 md:hidden bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl p-4 overflow-hidden"
                            >
                                <div className="flex flex-col space-y-4">
                                    <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white transition-colors py-2 px-2 hover:bg-slate-800/50 rounded-lg">Features</a>
                                    <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white transition-colors py-2 px-2 hover:bg-slate-800/50 rounded-lg">About</a>
                                    <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white transition-colors py-2 px-2 hover:bg-slate-800/50 rounded-lg">Pricing</a>
                                    <div className="h-px bg-slate-800 my-2"></div>
                                    <div className="flex flex-col gap-3">
                                        <Link to="/login" className="text-center w-full py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                                            Log in
                                        </Link>
                                        <Link to="/register" className="text-center w-full py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors shadow-lg">
                                            Start for free
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative z-10 pt-48 pb-32 px-4 text-center max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        Doora 2.0 is now available
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent leading-[1.1]">
                        Manage tasks with <br className="hidden md:block" />
                        <span className="text-indigo-400 inline-block relative">
                            superpowers
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-indigo-500/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
                            </svg>
                        </span>
                    </h1>

                    <p className="text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
                        Doora replaces linear to-do lists with a fluid, spatial workspace.
                        Capture, organize, and execute your ideas at the speed of thought.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Link to="/register" className="h-12 px-8 rounded-full bg-white text-slate-900 font-bold flex items-center justify-center hover:bg-slate-200 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
                            Get Started
                        </Link>
                        <Link to="/login" className="h-12 px-8 rounded-full bg-[#1e293b] text-white font-medium border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-all">
                            Live Demo
                        </Link>
                    </div>
                </motion.div>

                {/* Hero Dashboard Abstract Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="mt-20 relative mx-auto max-w-5xl"
                >
                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 bg-[#0f172a] p-2 sm:p-4 perspective-1000 group">
                        {/* Browser Bar */}
                        <div className="h-8 bg-slate-800/50 rounded-t-xl flex items-center px-4 gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            <div className="ml-4 h-4 w-64 bg-slate-700/50 rounded-full hidden sm:block"></div>
                        </div>

                        {/* Abstract Interior */}
                        <div className="flex gap-4 h-[400px] sm:h-[500px] overflow-hidden bg-[#1e293b]/30 rounded-b-xl relative p-4">

                            {/* Sidebar Shape */}
                            <div className="w-16 sm:w-64 flex-shrink-0 flex flex-col gap-4">
                                {/* Headerish */}
                                <div className="h-10 w-10 sm:w-full bg-indigo-500/20 rounded-lg animate-pulse" style={{ animationDuration: '3s' }}></div>
                                {/* Nav Items */}
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-8 w-full bg-slate-700/30 rounded-lg"></div>
                                    ))}
                                </div>
                                <div className="mt-auto h-12 w-full bg-slate-700/30 rounded-lg"></div>
                            </div>

                            {/* Main Concent Area */}
                            <div className="flex-1 flex flex-col gap-4">
                                {/* Header Strip */}
                                <div className="h-16 w-full bg-slate-700/20 rounded-xl flex items-center justify-between px-4">
                                    <div className="h-6 w-32 bg-slate-600/40 rounded-full"></div>
                                    <div className="flex gap-2">
                                        <div className="h-8 w-8 rounded-full bg-slate-600/40"></div>
                                        <div className="h-8 w-8 rounded-full bg-indigo-500/40"></div>
                                    </div>
                                </div>

                                {/* Content Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                                    {/* Column 1 - Kanban */}
                                    <div className="bg-slate-800/20 rounded-xl p-3 flex flex-col gap-3">
                                        <div className="h-4 w-20 bg-slate-600/50 rounded"></div>
                                        <div className="h-24 bg-slate-700/40 rounded-lg transform transition-transform hover:scale-105 duration-300"></div>
                                        <div className="h-32 bg-slate-700/40 rounded-lg transform transition-transform hover:scale-105 duration-300 delay-100"></div>
                                        <div className="h-20 bg-slate-700/40 rounded-lg transform transition-transform hover:scale-105 duration-300 delay-200"></div>
                                    </div>
                                    {/* Column 2 - Kanban */}
                                    <div className="bg-slate-800/20 rounded-xl p-3 flex flex-col gap-3">
                                        <div className="h-4 w-24 bg-slate-600/50 rounded"></div>
                                        <div className="h-40 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 transform transition-transform hover:-translate-y-1 duration-300">
                                            <div className="h-3 w-16 bg-indigo-500/30 rounded mb-2"></div>
                                            <div className="space-y-2">
                                                <div className="h-2 w-full bg-indigo-500/20 rounded"></div>
                                                <div className="h-2 w-3/4 bg-indigo-500/20 rounded"></div>
                                            </div>
                                            <div className="mt-8 flex gap-2">
                                                <div className="h-6 w-6 rounded-full bg-indigo-400"></div>
                                                <div className="h-6 w-6 rounded-full bg-purple-400 ml-[-10px] border-2 border-[#1e293b]"></div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Column 3 - Stats */}
                                    <div className="bg-slate-800/20 rounded-xl p-3 hidden sm:flex flex-col gap-3">
                                        <div className="h-4 w-16 bg-slate-600/50 rounded"></div>
                                        <div className="flex-1 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-lg border border-white/5 relative overflow-hidden">
                                            {/* Abstract Chart */}
                                            <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-between px-2 gap-1 opacity-50">
                                                <div className="w-full bg-indigo-500/30 h-[40%] rounded-t-sm"></div>
                                                <div className="w-full bg-indigo-500/40 h-[70%] rounded-t-sm"></div>
                                                <div className="w-full bg-indigo-500/20 h-[50%] rounded-t-sm"></div>
                                                <div className="w-full bg-indigo-500/60 h-[80%] rounded-t-sm"></div>
                                                <div className="w-full bg-indigo-500/40 h-[60%] rounded-t-sm"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating elements */}
                        <div className="absolute top-[20%] -left-6 sm:-left-12 p-4 rounded-xl bg-[#1e293b] border border-slate-700 shadow-2xl animate-bounce z-10" style={{ animationDuration: '3s' }}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-green-500/20 text-green-400"><CheckCircle size={20} /></div>
                                <div>
                                    <p className="text-xs text-slate-400">Project Alpha</p>
                                    <p className="text-sm font-bold text-white">Completed!</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-[20%] -right-6 sm:-right-12 p-4 rounded-xl bg-[#1e293b] border border-slate-700 shadow-2xl animate-bounce z-10" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-purple-500/20 text-purple-400"><Kanban size={20} /></div>
                                <div>
                                    <p className="text-xs text-slate-400">Kanban Board</p>
                                    <p className="text-sm font-bold text-white">Updated Just Now</p>
                                </div>
                            </div>
                        </div>

                        {/* Glow effect behind */}
                        <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] -z-10 group-hover:bg-indigo-500/20 transition-all duration-1000"></div>

                    </div>
                </motion.div>
            </header>

            {/* Features Section - Bento Grid */}
            <section id="features" className="py-24 px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything you need</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Powerful features wrapped in a beautiful, intuitive interface.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <motion.div whileHover={{ y: -5 }} className="col-span-1 md:col-span-2 bg-[#1e293b]/40 border border-slate-700/50 rounded-3xl p-8 hover:bg-[#1e293b]/60 transition-colors backdrop-blur-sm group">
                            <div className="mb-6 inline-flex p-3 rounded-2xl bg-indigo-500/20 text-indigo-400">
                                <Kanban size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Kanban Boards</h3>
                            <p className="text-slate-400 mb-6">Visualize your workflow with flexible Kanban boards. Drag and drop tasks, track progress, and spot bottlenecks instantly.</p>
                            <div className="h-32 bg-slate-800/50 rounded-xl border border-slate-700/50 w-full overflow-hidden relative">
                                <div className="absolute top-4 left-4 right-4 h-8 bg-slate-700/50 rounded flex items-center px-3 gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                </div>
                                <div className="absolute top-16 left-4 w-24 h-24 bg-indigo-500/20 rounded-lg border border-indigo-500/30"></div>
                                <div className="absolute top-16 left-32 w-24 h-24 bg-purple-500/20 rounded-lg border border-purple-500/30"></div>
                            </div>
                        </motion.div>

                        {/* Card 2 */}
                        <motion.div whileHover={{ y: -5 }} className="col-span-1 bg-[#1e293b]/40 border border-slate-700/50 rounded-3xl p-8 hover:bg-[#1e293b]/60 transition-colors backdrop-blur-sm">
                            <div className="mb-6 inline-flex p-3 rounded-2xl bg-pink-500/20 text-pink-400">
                                <BarChart3 size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Analytics</h3>
                            <p className="text-slate-400">Gain insights into your productivity with real-time charts and reports.</p>
                        </motion.div>

                        {/* Card 3 */}
                        <motion.div whileHover={{ y: -5 }} className="col-span-1 bg-[#1e293b]/40 border border-slate-700/50 rounded-3xl p-8 hover:bg-[#1e293b]/60 transition-colors backdrop-blur-sm">
                            <div className="mb-6 inline-flex p-3 rounded-2xl bg-green-500/20 text-green-400">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Task Management</h3>
                            <p className="text-slate-400">Organize tasks with subtasks, tags, and priorities.</p>
                        </motion.div>

                        {/* Card 4 - Large */}
                        <motion.div whileHover={{ y: -5 }} className="col-span-1 md:col-span-2 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-3xl p-8 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold mb-4">Start your journey today</h3>
                                <p className="text-indigo-200 mb-8 max-w-md">Join thousands of users who are getting more done with Doora.</p>
                                <Link to="/register" className="inline-flex items-center gap-2 bg-white text-indigo-900 px-6 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors">
                                    Create Free Account
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                            <div className="absolute right-[-20px] bottom-[-20px] opacity-20">
                                <Zap size={200} />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 px-4 bg-[#0f172a] relative">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b] opacity-50 -z-10"></div>
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">Built for speed and simplicity</h2>
                    <p className="text-xl text-slate-400 mb-12 leading-relaxed">
                        We believe that project management tools shouldn't be a project themselves.
                        Doora was born from the frustration of complex, bloated software.
                        Our mission is to help you stay in flow and accomplish your best work.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="p-4">
                            <div className="text-4xl font-bold text-indigo-400 mb-2">10k+</div>
                            <div className="text-sm text-slate-500">Active Users</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl font-bold text-purple-400 mb-2">5M+</div>
                            <div className="text-sm text-slate-500">Tasks Completed</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl font-bold text-pink-400 mb-2">99.9%</div>
                            <div className="text-sm text-slate-500">Uptime</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
                            <div className="text-sm text-slate-500">Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Simple, transparent pricing</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Start for free, upgrade when you need to.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Free Tier */}
                        <div className="bg-[#1e293b]/40 border border-slate-700 rounded-3xl p-8 hover:border-slate-500 transition-colors">
                            <div className="text-xl font-bold mb-4 text-slate-300">Starter</div>
                            <div className="text-4xl font-bold mb-6">$0</div>
                            <ul className="space-y-4 mb-8 text-slate-400 text-sm">
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> Up to 5 projects</li>
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> Basic Analytics</li>
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> 1 User</li>
                            </ul>
                            <Link to="/register" className="block w-full py-3 rounded-full border border-slate-600 text-center font-medium hover:bg-slate-800 transition-colors">
                                Get Started
                            </Link>
                        </div>

                        {/* Pro Tier */}
                        <div className="bg-[#1e293b] border border-indigo-500 rounded-3xl p-8 relative shadow-2xl shadow-indigo-500/10 scale-105">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-b-lg">
                                MOST POPULAR
                            </div>
                            <div className="text-xl font-bold mb-4 text-indigo-400">Pro</div>
                            <div className="text-4xl font-bold mb-6">$12 <span className="text-lg text-slate-500 font-normal">/mo</span></div>
                            <ul className="space-y-4 mb-8 text-slate-300 text-sm">
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-indigo-400" /> Unlimited projects</li>
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-indigo-400" /> Advanced Analytics</li>
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-indigo-400" /> Up to 5 Team Members</li>
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-indigo-400" /> Custom Workflows</li>
                            </ul>
                            <Link to="/register" className="block w-full py-3 rounded-full bg-indigo-600 text-white text-center font-bold hover:bg-indigo-500 transition-colors shadow-lg">
                                Start 14-day Free Trial
                            </Link>
                        </div>

                        {/* Team Tier */}
                        <div className="bg-[#1e293b]/40 border border-slate-700 rounded-3xl p-8 hover:border-slate-500 transition-colors">
                            <div className="text-xl font-bold mb-4 text-slate-300">Enterprise</div>
                            <div className="text-4xl font-bold mb-6">$49 <span className="text-lg text-slate-500 font-normal">/mo</span></div>
                            <ul className="space-y-4 mb-8 text-slate-400 text-sm">
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> Unlimited Team Members</li>
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> SSO & Advanced Security</li>
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> 24/7 Priority Support</li>
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> Custom Integrations</li>
                            </ul>
                            <Link to="/register" className="block w-full py-3 rounded-full border border-slate-600 text-center font-medium hover:bg-slate-800 transition-colors">
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-slate-800 bg-[#0f172a] text-sm relative z-10">
                <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-10">

                    {/* Brand Column */}
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white mb-6">
                            <Zap className="w-6 h-6 text-indigo-500 fill-indigo-500/20" />
                            <span>Doora</span>
                        </div>
                        <p className="text-slate-400 mb-6 max-w-sm leading-relaxed">
                            Doora replaces linear to-do lists with a fluid, spatial workspace.
                            Designed for high-performance teams who care about speed and aesthetics.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-full bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                                <span className="sr-only">Twitter</span>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                            </a>
                            <a href="#" className="p-2 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all">
                                <span className="sr-only">GitHub</span>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                            </a>
                            <a href="#" className="p-2 rounded-full bg-slate-800 text-slate-400 hover:bg-[#0077b5] hover:text-white transition-all">
                                <span className="sr-only">LinkedIn</span>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Product</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Integrations</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Changelog</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Docs</a></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Company</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Partners</a></li>
                        </ul>
                    </div>

                    {/* Links Column 3 */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Contact</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li className="flex items-start gap-3">
                                <span className="text-slate-500">Email:</span>
                                <a href="mailto:rimondipta@gmail.com" className="hover:text-indigo-400 transition-colors">hello@rimondipta.com</a>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-slate-500">Phone:</span>
                                <a href="tel:+15550000000" className="hover:text-indigo-400 transition-colors">+1 (555) 000-0000</a>
                            </li>
                            <li className="mt-6">
                                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                    <p className="text-xs text-slate-400 mb-2">Developed by</p>
                                    <p className="font-bold text-white">Rimon Dipta</p>
                                    <p className="text-xs text-slate-500">Full Stack Developer</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-slate-500 text-xs">
                    <p>&copy; {new Date().getFullYear()} Doora Inc. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-slate-300 transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
