import { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { Zap, CheckCircle, Kanban, BarChart3, ArrowRight, Star } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";

const LandingPage = () => {
    usePageTitle("Doora - The Future of Work");
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

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
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fadeIn" style={{ animationDuration: '0.8s' }}>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2.5 flex items-center gap-8 shadow-2xl ring-1 ring-white/5">

                    {/* Logo */}
                    <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
                        <div className="relative">
                            <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
                            <div className="absolute inset-0 bg-indigo-400 blur-lg opacity-40"></div>
                        </div>
                        <span>Doora</span>
                    </div>

                    {/* Links */}
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#about" className="hover:text-white transition-colors">About</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-2 pl-4 border-l border-white/10">
                        <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-2">
                            Log in
                        </Link>
                        <Link to="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.7)] flex items-center gap-1 group">
                            Start for free
                            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
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

                {/* Hero Image/Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="mt-20 relative mx-auto max-w-4xl"
                >
                    <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 bg-[#1e293b]/50 backdrop-blur-sm p-2">
                        <img
                            src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=2669&auto=format&fit=crop"
                            alt="App Screenshot"
                            className="rounded-lg w-full h-auto opacity-90"
                        />

                        {/* Floating elements */}
                        <div className="absolute -top-12 -left-12 p-4 rounded-xl bg-[#1e293b] border border-slate-700 shadow-xl hidden md:block animate-bounce" style={{ animationDuration: '3s' }}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-green-500/20 text-green-400"><CheckCircle size={20} /></div>
                                <div>
                                    <p className="text-xs text-slate-400">Project Alpha</p>
                                    <p className="text-sm font-bold text-white">Completed!</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -bottom-8 -right-8 p-4 rounded-xl bg-[#1e293b] border border-slate-700 shadow-xl hidden md:block animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-purple-500/20 text-purple-400"><Kanban size={20} /></div>
                                <div>
                                    <p className="text-xs text-slate-400">Kanban Board</p>
                                    <p className="text-sm font-bold text-white">Updated Just Now</p>
                                </div>
                            </div>
                        </div>
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

            {/* Footer */}
            <footer className="py-12 border-t border-slate-800 text-center text-slate-500 text-sm">
                <div className="flex justify-center items-center gap-2 mb-4 font-bold text-slate-300">
                    <Zap size={16} /> Doora
                </div>
                <p>&copy; {new Date().getFullYear()} Doora Inc. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
