import React from 'react';
import { Sparkles, BookOpen, BarChart3, Database, Cpu, Zap, Search } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, stats }) {
  const tabs = [
    { id: 'query', label: 'RAG Assistant', icon: Search, badge: 'Live Stream' },
    { id: 'papers', label: 'Papers Explorer', icon: BookOpen, badge: stats?.total_papers ? `${stats.total_papers}` : '60' },
    { id: 'eval', label: 'Evaluation & Benchmarks', icon: BarChart3, badge: 'Precision@k' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 lg:px-8 py-3 glass-panel border-b border-white/10 shadow-2xl backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Topic Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 shadow-glow-purple p-0.5">
            <div className="w-full h-full bg-cosmic-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-neon-purple animate-pulse-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 font-display">
                Research Paper <span className="gradient-text-purple">RAG Assistant</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono tracking-wider font-semibold rounded-full bg-purple-500/10 border border-purple-500/30 text-neon-purple uppercase">
                v1.0 RAG
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Topic: <span className="text-cyan-300 font-semibold">Efficient LLMs, Quantization & Attention</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center p-1 rounded-xl bg-cosmic-900/80 border border-white/10 shadow-inner">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-2 transition-all duration-300 ${
                  isActive
                    ? 'text-white font-semibold shadow-glow-purple bg-gradient-to-r from-purple-600/90 to-indigo-600/90'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] rounded-full font-mono ${
                      isActive
                        ? 'bg-black/30 text-cyan-200'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System Status Indicators */}
        <div className="hidden xl:flex items-center gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cosmic-900/90 border border-emerald-500/20 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Database className="w-3.5 h-3.5" />
            <span>ChromaDB Ready</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cosmic-900/90 border border-purple-500/20 text-purple-300">
            <Cpu className="w-3.5 h-3.5 text-neon-purple" />
            <span>all-MiniLM-L6-v2</span>
          </div>
        </div>

      </div>
    </header>
  );
}
