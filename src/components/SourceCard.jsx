import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, FileText, Sparkles, Tag, CheckCircle2 } from 'lucide-react';

export default function SourceCard({ chunk, index, isHighlighted }) {
  const [expanded, setExpanded] = useState(false);

  const similarityPct = Math.round((chunk.similarity || 0) * 100);
  const authorsList = chunk.authors || 'Unknown';
  const cleanSection = chunk.section ? chunk.section.replace(/[\[\]]/g, '') : 'General';
  const arxivId = chunk.paper_id;
  const arxivUrl = arxivId && arxivId !== 'unknown' ? `https://arxiv.org/abs/${arxivId}` : null;

  return (
    <div
      id={`source-card-${index + 1}`}
      className={`relative p-5 rounded-2xl glass-card transition-all duration-500 ${
        isHighlighted
          ? 'border-neon-cyan shadow-glow-cyan bg-cosmic-800/90 ring-2 ring-cyan-400/50 scale-[1.01]'
          : 'border-white/10 hover:border-purple-500/40'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        
        <div className="flex items-center gap-2">
          {/* Citation Index Tag */}
          <span
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-colors ${
              isHighlighted
                ? 'bg-neon-cyan text-cosmic-950 shadow-glow-cyan'
                : 'bg-purple-600/30 text-neon-purple border border-purple-500/40'
            }`}
          >
            [{index + 1}]
          </span>

          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1">
            <Tag className="w-3 h-3 text-cyan-400" />
            <span>{cleanSection}</span>
          </span>
        </div>

        {/* Cosine Similarity Gauge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cosmic-950/80 border border-purple-500/30 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-neon-amber" />
          <span className="text-slate-300">Similarity:</span>
          <span className="text-neon-cyan font-semibold">{similarityPct}%</span>
        </div>
      </div>

      {/* Paper Title & arXiv Link */}
      <div className="mb-2">
        <h4 className="text-sm font-semibold text-white group-hover:text-purple-200 transition-colors leading-snug">
          {chunk.paper_title || 'Research Document'}
        </h4>
        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
          <span>{authorsList}</span>
          {chunk.year && <span>• {chunk.year}</span>}
          {arxivUrl && (
            <a
              href={arxivUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-neon-cyan hover:underline ml-auto font-mono text-[10px]"
            >
              <span>arXiv:{arxivId}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>

      {/* Chunk Content Preview & Full Toggle */}
      <div className="mt-3 text-xs text-slate-300 leading-relaxed font-sans bg-cosmic-950/50 p-3.5 rounded-xl border border-white/5">
        <p className="whitespace-pre-wrap">
          {expanded ? chunk.text : `${chunk.text.slice(0, 260)}...`}
        </p>

        {chunk.text.length > 260 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2.5 flex items-center gap-1 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            {expanded ? (
              <>
                <span>Show Less</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Expand Full Excerpt ({chunk.token_count || '500'} tokens)</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>

    </div>
  );
}
