import React from 'react';
import { Search, Sparkles, Send, Flame } from 'lucide-react';

const SUGGESTIONS = [
  'How does FlashAttention reduce HBM memory access?',
  'Compare AWQ vs GPTQ post-training quantization',
  'What is BitNet b1.58 ternary weight representation?',
  'How does PagedAttention eliminate KV cache fragmentation in vLLM?',
  'Explain Speculative Decoding and draft model verification',
  'How does QLoRA achieve 4-bit fine-tuning with NF4?',
];

export default function SearchBar({ query, setQuery, onSubmit, isLoading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-4">
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative group">
        {/* Glowing Aura Ring on Hover / Focus */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-cyan-500 to-indigo-600 rounded-3xl blur-md opacity-40 group-hover:opacity-80 transition duration-500 pointer-events-none" />

        <div className="relative flex items-center glass-input rounded-2xl p-2 shadow-2xl transition-all">
          <div className="pl-3 pr-2 text-purple-400">
            <Search className="w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about LLM efficiency, quantization, FlashAttention, speculative decoding..."
            disabled={isLoading}
            className="w-full bg-transparent py-3 px-2 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none font-sans"
          />

          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className={`px-5 py-3 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all duration-300 ${
              query.trim() && !isLoading
                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-glow-purple hover:scale-105 active:scale-95'
                : 'bg-white/5 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </div>
      </form>

      {/* Suggested Prompt Badges */}
      <div className="mt-4 flex items-center gap-2 flex-wrap justify-center sm:justify-start">
        <div className="flex items-center gap-1 text-[11px] font-mono text-neon-amber">
          <Flame className="w-3.5 h-3.5" />
          <span>Trending Queries:</span>
        </div>
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setQuery(s);
              onSubmit(s);
            }}
            disabled={isLoading}
            className="px-2.5 py-1 text-[11px] rounded-lg bg-cosmic-900/90 hover:bg-purple-900/40 border border-white/10 hover:border-purple-500/40 text-slate-300 hover:text-white transition-all shadow-sm truncate max-w-[280px] sm:max-w-none text-left"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
