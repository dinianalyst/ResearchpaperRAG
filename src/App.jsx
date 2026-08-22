import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import QueryPage from './pages/QueryPage';
import PapersPage from './pages/PapersPage';
import EvalPage from './pages/EvalPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('query');
  const [stats, setStats] = useState(null);
  const [prefilledQuery, setPrefilledQuery] = useState('');

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch system stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSelectPaperQuery = (queryText) => {
    setPrefilledQuery(queryText);
    setActiveTab('query');
  };

  return (
    <div className="relative min-h-screen bg-cosmic-950 text-slate-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Dynamic Animated Particle Mesh Backdrop */}
      <ParticleBackground />

      {/* Top Glassmorphic Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
      />

      {/* Main Content Area with Animated Page Transitions */}
      <main className="flex-1 z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'query' && (
            <motion.div
              key="query"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <QueryPage
                initialQuery={prefilledQuery}
                onNavigateToPapers={() => setActiveTab('papers')}
              />
            </motion.div>
          )}

          {activeTab === 'papers' && (
            <motion.div
              key="papers"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <PapersPage onSelectPaperQuery={handleSelectPaperQuery} />
            </motion.div>
          )}

          {activeTab === 'eval' && (
            <motion.div
              key="eval"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <EvalPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modern Glass Footer */}
      <footer className="z-10 py-6 border-t border-white/10 glass-panel mt-16 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Research Paper RAG Assistant • Fast & Memory-Efficient LLMs</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>ChromaDB Vector Store</span>
            <span>•</span>
            <span>sentence-transformers</span>
            <span>•</span>
            <span>Dual Chunking RAG</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
