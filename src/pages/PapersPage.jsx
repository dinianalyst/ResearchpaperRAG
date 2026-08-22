import React, { useState, useEffect } from 'react';
import { Search, BookOpen, ExternalLink, Sparkles, Filter, PlusCircle, ArrowRight, CheckCircle2, Download, Tag } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Quantization',
  'Attention Optimization',
  '1-Bit LLMs',
  'Speculative Decoding',
  'KV Cache & Serving',
  'Parameter-Efficient Fine-Tuning',
  'Pruning & Sparsity',
];

export default function PapersPage({ onSelectPaperQuery }) {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPaperModal, setSelectedPaperModal] = useState(null);

  // Dynamic ingestion state
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [ingestTopic, setIngestTopic] = useState('');
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestMessage, setIngestMessage] = useState('');

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/papers');
      const data = await res.json();
      setPapers(data.papers || []);
    } catch (err) {
      console.error('Failed to load papers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const handleIngestNew = async (e) => {
    e.preventDefault();
    if (!ingestTopic.trim() || isIngesting) return;

    setIsIngesting(true);
    setIngestMessage('Querying arXiv API and extracting text via PyMuPDF...');

    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: ingestTopic, max_results: 10 }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setIngestMessage(`Successfully ingested ${data.added_count} new paper(s)!`);
        fetchPapers();
        setTimeout(() => {
          setShowIngestModal(false);
          setIngestTopic('');
          setIngestMessage('');
        }, 1800);
      } else {
        setIngestMessage(data.message || 'No new papers found.');
      }
    } catch (err) {
      setIngestMessage(`Error ingesting papers: ${err.message}`);
    } finally {
      setIsIngesting(false);
    }
  };

  // Filter papers based on search and category
  const filteredPapers = papers.filter((p) => {
    const sLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      p.title?.toLowerCase().includes(sLower) ||
      p.abstract?.toLowerCase().includes(sLower) ||
      (Array.isArray(p.authors) && p.authors.some((a) => a.toLowerCase().includes(sLower)));

    if (!matchesSearch) return false;
    if (selectedCategory === 'All') return true;

    const catLower = selectedCategory.toLowerCase();
    const textLower = (p.title + ' ' + p.abstract + ' ' + (p.primary_category || '')).toLowerCase();

    if (catLower.includes('quantization')) return textLower.includes('quant') || textLower.includes('bit');
    if (catLower.includes('attention')) return textLower.includes('attention') || textLower.includes('flash');
    if (catLower.includes('1-bit')) return textLower.includes('1-bit') || textLower.includes('ternary') || textLower.includes('1.58');
    if (catLower.includes('speculative')) return textLower.includes('speculative') || textLower.includes('medusa') || textLower.includes('draft');
    if (catLower.includes('kv cache')) return textLower.includes('kv cache') || textLower.includes('pagedattention') || textLower.includes('streaming');
    if (catLower.includes('fine-tuning')) return textLower.includes('lora') || textLower.includes('qlora') || textLower.includes('dora');
    if (catLower.includes('pruning')) return textLower.includes('prun') || textLower.includes('sparse');

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/10 border border-cyan-500/30 text-neon-cyan">
              arXiv Literature Corpus
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
            Papers <span className="gradient-text-cyan">Explorer</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Explore the {papers.length} indexed scientific papers in LLM efficiency, with structured full text & metadata.
          </p>
        </div>

        {/* Dynamic Ingest Button */}
        <button
          onClick={() => setShowIngestModal(true)}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-glow-purple flex items-center gap-2 transition-all duration-300"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Ingest Custom arXiv Topic</span>
        </button>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-4 mb-8">
        <div className="relative glass-input rounded-2xl p-2 shadow-lg max-w-xl">
          <div className="flex items-center">
            <Search className="w-4 h-4 text-slate-400 ml-3 mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search papers by title, author, or keywords (e.g., FlashAttention, Tri Dao)..."
              className="w-full bg-transparent py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-semibold shadow-glow-cyan'
                  : 'bg-cosmic-900/90 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Papers Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Sparkles className="w-8 h-8 mx-auto text-purple-400 animate-spin-slow mb-3" />
          <p className="font-mono text-sm">Loading research library...</p>
        </div>
      ) : filteredPapers.length === 0 ? (
        <div className="py-16 text-center text-slate-400 glass-card rounded-2xl p-8">
          <BookOpen className="w-10 h-10 mx-auto text-slate-600 mb-2" />
          <h4 className="text-base font-bold text-white mb-1">No research papers match your criteria</h4>
          <p className="text-xs text-slate-400">Try adjusting your search keywords or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper, idx) => {
            const authorsStr = Array.isArray(paper.authors)
              ? paper.authors.slice(0, 3).join(', ') + (paper.authors.length > 3 ? ' et al.' : '')
              : paper.authors || 'Unknown';

            return (
              <div
                key={paper.arxiv_id || idx}
                className="p-5 rounded-2xl glass-card border border-white/10 flex flex-col justify-between hover:border-cyan-500/40 group"
              >
                <div>
                  {/* Top Metadata Row */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300">
                      {paper.year || '2024'}
                    </span>
                    {paper.arxiv_id && (
                      <a
                        href={paper.arxiv_url || `https://arxiv.org/abs/${paper.arxiv_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-neon-cyan hover:underline"
                      >
                        <span>arXiv:{paper.arxiv_id}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors line-clamp-2 mb-2 font-display">
                    {paper.title}
                  </h3>

                  {/* Authors */}
                  <p className="text-xs text-slate-400 line-clamp-1 mb-3">
                    {authorsStr}
                  </p>

                  {/* Abstract Preview */}
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed bg-cosmic-950/40 p-2.5 rounded-xl border border-white/5">
                    {paper.abstract}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedPaperModal(paper)}
                    className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => onSelectPaperQuery(`Explain the key contributions and methodology of ${paper.title}`)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-neon-cyan flex items-center gap-1.5 transition-all"
                  >
                    <span>Ask AI</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Paper Details Modal */}
      {selectedPaperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 rounded-3xl glass-panel border border-purple-500/40 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-neon-cyan">
                  arXiv ID: {selectedPaperModal.arxiv_id} • {selectedPaperModal.year}
                </span>
                <h3 className="text-xl font-bold text-white font-display mt-1">
                  {selectedPaperModal.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {Array.isArray(selectedPaperModal.authors)
                    ? selectedPaperModal.authors.join(', ')
                    : selectedPaperModal.authors}
                </p>
              </div>
              <button
                onClick={() => setSelectedPaperModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold">
                Abstract
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-cosmic-950/60 p-4 rounded-2xl border border-white/5 whitespace-pre-wrap">
                {selectedPaperModal.abstract}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <a
                href={`https://arxiv.org/pdf/${selectedPaperModal.arxiv_id}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open PDF</span>
              </a>

              <button
                onClick={() => {
                  const p = selectedPaperModal;
                  setSelectedPaperModal(null);
                  onSelectPaperQuery(`Explain the key contributions and methodology of ${p.title}`);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-glow-purple flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Query Paper in RAG Assistant</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Ingest Modal */}
      {showIngestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-lg w-full p-6 rounded-3xl glass-panel border border-cyan-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Download className="w-5 h-5 text-neon-cyan" />
                <span>Ingest arXiv Papers</span>
              </h3>
              <button
                onClick={() => setShowIngestModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Fetch the latest papers live from arXiv, extract text with PyMuPDF, and index both Fixed and Semantic chunks into ChromaDB.
            </p>

            <form onSubmit={handleIngestNew} className="space-y-3">
              <input
                type="text"
                value={ingestTopic}
                onChange={(e) => setIngestTopic(e.target.value)}
                placeholder="e.g. KV Cache Quantization OR FlashAttention-3"
                className="w-full glass-input rounded-xl p-3 text-sm text-white placeholder-slate-400 focus:outline-none"
                disabled={isIngesting}
              />

              {ingestMessage && (
                <p className="text-xs font-mono text-cyan-300 bg-cosmic-950 p-2.5 rounded-xl border border-cyan-500/20">
                  {ingestMessage}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIngestModal(false)}
                  disabled={isIngesting}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!ingestTopic.trim() || isIngesting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-glow-cyan"
                >
                  {isIngesting ? 'Ingesting...' : 'Fetch & Index'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
