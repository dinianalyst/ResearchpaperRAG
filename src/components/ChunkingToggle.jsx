import React from 'react';
import { Layers, AlignLeft, HelpCircle } from 'lucide-react';

export default function ChunkingToggle({ strategy, setStrategy, disabled }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl glass-panel border border-white/10 shadow-lg">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-neon-purple">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-mono">
            Chunking Strategy
            <span className="group relative cursor-pointer">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-cyan-300 transition-colors" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col w-64 p-2.5 text-[11px] font-sans font-normal text-slate-200 bg-cosmic-900 border border-purple-500/30 rounded-xl shadow-2xl z-50 pointer-events-none">
                <strong className="text-neon-cyan mb-1">Comparative Chunking:</strong>
                <span>• <strong>Fixed-Size:</strong> Constant 500 token windows with 50 token overlap.</span>
                <span>• <strong>Semantic:</strong> Preserves heading hierarchies & paragraph boundaries.</span>
              </span>
            </span>
          </span>
          <p className="text-[11px] text-slate-400">
            {strategy === 'semantic'
              ? 'Preserving document structure & headings'
              : 'Fixed 500 token windows with 50t overlap'}
          </p>
        </div>
      </div>

      {/* Toggle Pill Buttons */}
      <div className="relative flex p-1 rounded-xl bg-cosmic-950/80 border border-white/10">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setStrategy('semantic')}
          className={`relative px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
            strategy === 'semantic'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-glow-purple'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlignLeft className="w-3.5 h-3.5" />
          <span>Semantic / Paragraph</span>
          <span className="px-1.5 py-0.2 text-[9px] rounded bg-white/20 font-mono">Optimal</span>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => setStrategy('fixed')}
          className={`relative px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
            strategy === 'fixed'
              ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold shadow-glow-cyan'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Fixed-Size (500t)</span>
        </button>
      </div>
    </div>
  );
}
