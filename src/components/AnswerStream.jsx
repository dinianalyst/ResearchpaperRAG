import React, { useState } from 'react';
import { Copy, Check, Sparkles, Clock, BookOpen, Bot } from 'lucide-react';

export default function AnswerStream({
  answerText,
  isStreaming,
  citations = [],
  latencyInfo = {},
  modelUsed = '',
  onCitationClick,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(answerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render markdown text with interactive citation pills
  const renderFormattedAnswer = (text) => {
    if (!text) return null;

    // Split text by citations like [1], [2], etc.
    const parts = text.split(/(\[[0-9]+\])/g);

    return parts.map((part, index) => {
      const match = part.match(/\[([0-9]+)\]/);
      if (match) {
        const citationNum = parseInt(match[1], 10);
        return (
          <button
            key={index}
            onClick={() => onCitationClick && onCitationClick(citationNum)}
            title={`Jump to Source [${citationNum}]`}
            className="inline-flex items-center justify-center px-1.5 py-0.5 mx-0.5 text-[11px] font-mono font-bold rounded-md bg-purple-500/20 hover:bg-neon-cyan hover:text-cosmic-950 text-cyan-300 border border-purple-500/40 transition-all duration-200 transform hover:scale-110 shadow-sm cursor-pointer align-baseline"
          >
            [{citationNum}]
          </button>
        );
      }

      // Render standard markdown headers and bolding
      return (
        <span key={index} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  };

  return (
    <div className="w-full rounded-3xl glass-panel border border-white/15 p-6 md:p-8 shadow-2xl relative overflow-hidden my-6">
      {/* Background Accent Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shadow-glow-purple">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-display">Synthesized Research Answer</h3>
              {isStreaming && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  Generating...
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Model: <span className="text-purple-300">{modelUsed || 'Claude 3.5 / Local Neural RAG'}</span>
            </p>
          </div>
        </div>

        {/* Copy & Latency Metadata */}
        <div className="flex items-center gap-3">
          {latencyInfo.total_latency_ms && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cosmic-950/80 border border-white/10 text-xs font-mono text-slate-300">
              <Clock className="w-3.5 h-3.5 text-neon-cyan" />
              <span>{latencyInfo.total_latency_ms} ms</span>
            </div>
          )}

          <button
            onClick={handleCopy}
            disabled={!answerText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Answer</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Answer Body with Typewriter / Streaming Effect */}
      <div className="prose prose-invert max-w-none text-slate-200 text-sm md:text-base leading-relaxed space-y-4">
        {renderFormattedAnswer(answerText)}
        {isStreaming && (
          <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse align-middle" />
        )}
      </div>

      {/* Citations Footer Bar */}
      {citations && citations.length > 0 && (
        <div className="mt-8 pt-5 border-t border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-neon-purple" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Grounded Source Citations ({citations.length})
            </h4>
          </div>

          <div className="flex flex-wrap gap-2">
            {citations.map((c) => (
              <button
                key={c.citation_index}
                onClick={() => onCitationClick && onCitationClick(c.citation_index)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cosmic-950/80 hover:bg-purple-900/40 border border-purple-500/30 text-xs text-slate-300 hover:text-cyan-300 transition-all duration-200 shadow-sm text-left group"
              >
                <span className="font-mono font-bold text-neon-cyan group-hover:scale-110 transition-transform">
                  [{c.citation_index}]
                </span>
                <span className="truncate max-w-[220px] font-medium">{c.paper_title}</span>
                <span className="text-[10px] text-purple-400 font-mono font-semibold">
                  {Math.round((c.similarity || 0) * 100)}%
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
