import { useParams, Link } from "react-router-dom";
import { Zap, ArrowLeft } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";

const PlaceholderPage = () => {
    const { slug } = useParams();

    // Convert slug to readable title (e.g., "privacy-policy" -> "Privacy Policy")
    const title = slug
        ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : "Page";

    usePageTitle(`${title} - Doora`);

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col font-sans">
            {/* Simple Header */}
            <header className="p-6 flex items-center justify-between border-b border-white/10">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
                    <Zap className="w-6 h-6 text-indigo-500 fill-indigo-500/20" />
                    <span>Doora</span>
                </Link>
                <Link to="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>
            </header>

            {/* Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
                    <Zap className="w-12 h-12 text-indigo-400 opacity-50" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    {title}
                </h1>
                <p className="text-slate-400 text-lg max-w-md mb-8">
                    We're currently working on this page. Check back soon for updates!
                </p>
                <Link
                    to="/"
                    className="px-8 py-3 rounded-full bg-indigo-600 font-bold hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/25"
                >
                    Return Home
                </Link>
            </main>

            {/* Footer */}
            <footer className="p-6 text-center text-slate-600 text-xs border-t border-white/5">
                &copy; {new Date().getFullYear()} Doora Inc. All rights reserved.
            </footer>
        </div>
    );
};

export default PlaceholderPage;
