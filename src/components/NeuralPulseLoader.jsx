import React, { useState, useEffect } from 'react';
import { Cpu, Sparkles, Network } from 'lucide-react';

export default function NeuralPulseLoader({ strategy = 'semantic' }) {
  const [stageIndex, setStageIndex] = useState(0);

  const stages = [
    { text: 'Embedding query using sentence-transformers (all-MiniLM-L6-v2)...', icon: Cpu, color: 'text-purple-400' },
    { text: `Querying ChromaDB (${strategy} collection) for cosine similarity...`, icon: Network, color: 'text-cyan-400' },
    { text: 'Synthesizing research findings & grounding paper citations [1], [2]...', icon: Sparkles, color: 'text-amber-400' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % stages.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [stages.length]);

  const CurrentIcon = stages[stageIndex].icon;

  return (
    <div className="w-full p-8 rounded-3xl glass-panel border border-purple-500/30 shadow-2xl relative overflow-hidden my-6 flex flex-col items-center justify-center text-center">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-cyan-500/10 to-indigo-600/10 animate-pulse-slow pointer-events-none" />

      {/* Interactive Neural Network Graphic */}
      <div className="relative w-32 h-32 flex items-center justify-center mb-6">
        {/* Outer rotating energy ring */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/40 animate-spin-slow" />
        
        {/* Pulsing Aura */}
        <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-purple-600/30 via-cyan-500/20 to-indigo-600/30 blur-md animate-pulse" />

        {/* Neural Network Nodes */}
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-cosmic-900 border border-cyan-400/50 shadow-glow-cyan flex items-center justify-center">
          <CurrentIcon className={`w-8 h-8 ${stages[stageIndex].color} animate-bounce`} />
        </div>

        {/* Orbiting satellite nodes */}
        <span className="absolute top-1 left-4 w-3.5 h-3.5 rounded-full bg-purple-400 shadow-glow-purple neural-node" />
        <span className="absolute bottom-2 right-4 w-3 h-3 rounded-full bg-cyan-400 shadow-glow-cyan neural-node" style={{ animationDelay: '0.4s' }} />
        <span className="absolute top-8 right-0 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-glow-amber neural-node" style={{ animationDelay: '0.8s' }} />
        <span className="absolute bottom-6 left-0 w-3 h-3 rounded-full bg-indigo-400 neural-node" style={{ animationDelay: '1.2s' }} />
      </div>

      {/* Stage Status Text */}
      <div className="relative z-10 max-w-md">
        <h4 className="text-base font-semibold text-white mb-2 font-display flex items-center justify-center gap-2">
          <span>AI Neural Retrieval In Progress</span>
          <span className="flex space-x-1">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
          </span>
        </h4>
        <p className="text-xs text-slate-300 font-mono transition-all duration-300 min-h-[36px] flex items-center justify-center">
          {stages[stageIndex].text}
        </p>

        {/* Micro-Progress Bar */}
        <div className="w-48 h-1.5 bg-cosmic-950 rounded-full overflow-hidden mx-auto mt-4 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${((stageIndex + 1) / stages.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
