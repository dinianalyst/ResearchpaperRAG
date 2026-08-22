import React, { useState, useEffect, useRef } from 'react';
import SearchBar from '../components/SearchBar';
import ChunkingToggle from '../components/ChunkingToggle';
import NeuralPulseLoader from '../components/NeuralPulseLoader';
import AnswerStream from '../components/AnswerStream';
import SourceCard from '../components/SourceCard';
import { Sparkles, FileText, Compass, Layers, ShieldCheck, Zap } from 'lucide-react';

export default function QueryPage({ initialQuery, onNavigateToPapers }) {
  const [query, setQuery] = useState(initialQuery || '');
  const [strategy, setStrategy] = useState('semantic');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [citations, setCitations] = useState([]);
  const [retrievedChunks, setRetrievedChunks] = useState([]);
  const [latencyInfo, setLatencyInfo] = useState({});
  const [modelUsed, setModelUsed] = useState('');
  const [highlightedChunkIndex, setHighlightedChunkIndex] = useState(null);

  const sourcesSectionRef = useRef(null);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      setQuery(initialQuery);
      executeQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleCitationClick = (citationIndex) => {
    setHighlightedChunkIndex(citationIndex - 1);
    const element = document.getElementById(`source-card-${citationIndex}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // Remove pulse highlight after 3 seconds
    setTimeout(() => {
      setHighlightedChunkIndex(null);
    }, 3000);
  };

  const executeQuery = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setIsStreaming(false);
    setAnswerText('');
    setCitations([]);
    setRetrievedChunks([]);
    setLatencyInfo({});
    setModelUsed('');
    setHighlightedChunkIndex(null);

    try {
      // Use SSE streaming endpoint for live typewriter effect
      const response = await fetch('/api/query/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          strategy: strategy,
          top_k: 4,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      setIsLoading(false);
      setIsStreaming(true);

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'metadata') {
                setRetrievedChunks(data.retrieved_chunks || []);
                setLatencyInfo((prev) => ({
                  ...prev,
                  retrieval_latency_ms: data.retrieval_latency_ms,
                }));
              } else if (data.type === 'token') {
                setAnswerText((prev) => prev + data.token);
              } else if (data.type === 'done') {
                setCitations(data.citations || []);
                setLatencyInfo((prev) => ({
                  ...prev,
                  total_latency_ms: data.total_latency_ms,
                }));
                setModelUsed(data.model_used || 'Claude 3.5 / Local Neural RAG');
                setIsStreaming(false);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (err) {
      console.error('Streaming error, falling back to standard POST /api/query:', err);
      // Fallback to standard POST
      try {
        const fallbackRes = await fetch('/api/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: searchQuery,
            strategy: strategy,
            top_k: 4,
          }),
        });
        const data = await fallbackRes.json();
        setAnswerText(data.answer);
        setCitations(data.citations || []);
        setRetrievedChunks(data.retrieved_chunks || []);
        setLatencyInfo({
          retrieval_latency_ms: data.retrieval_latency_ms,
          total_latency_ms: data.total_latency_ms,
        });
        setModelUsed(data.model_used || 'Local Neural Synthesizer');
      } catch (fallbackErr) {
        setAnswerText(`Error querying research assistant: ${fallbackErr.message}`);
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Hero Section */}
      <div className="text-center my-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-neon-purple text-xs font-mono font-medium animate-float">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation AI Literature Intelligence</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display">
          Research Paper <span className="gradient-text-purple">RAG Assistant</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
          Ask complex technical questions across 60+ seminal research papers on{' '}
          <strong className="text-cyan-300">LLM Quantization, FlashAttention, Speculative Decoding</strong>, and{' '}
          <strong className="text-purple-300">KV Cache Compression</strong> with verified source citations.
        </p>
      </div>

      {/* Search Bar & Strategy Controls */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <SearchBar
          query={query}
          setQuery={setQuery}
          onSubmit={executeQuery}
          isLoading={isLoading || isStreaming}
        />

        <ChunkingToggle
          strategy={strategy}
          setStrategy={setStrategy}
          disabled={isLoading || isStreaming}
        />
      </div>

      {/* Neural Network Loader */}
      {isLoading && <NeuralPulseLoader strategy={strategy} />}

      {/* Answer View */}
      {(answerText || isStreaming) && (
        <AnswerStream
          answerText={answerText}
          isStreaming={isStreaming}
          citations={citations}
          latencyInfo={latencyInfo}
          modelUsed={modelUsed}
          onCitationClick={handleCitationClick}
        />
      )}

      {/* Retrieved Source Chunks Section */}
      {retrievedChunks && retrievedChunks.length > 0 && (
        <div ref={sourcesSectionRef} className="mt-12 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                Retrieved Context Passages ({retrievedChunks.length})
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Strategy: <strong className="text-neon-purple uppercase">{strategy}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {retrievedChunks.map((chunk, idx) => (
              <SourceCard
                key={chunk.chunk_id || idx}
                chunk={chunk}
                index={idx}
                isHighlighted={highlightedChunkIndex === idx}
              />
            ))}
          </div>
        </div>
      )}

      {/* Initial Landing Feature Cards (when idle) */}
      {!answerText && !isLoading && (
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-neon-purple flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white font-display">Dual Chunking Engine</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compare 500-token fixed windows with semantic paragraph-boundary chunks in ChromaDB.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-neon-cyan flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white font-display">Strict Grounding</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Answers cite exact paper sections and explicit context chunks to eliminate hallucination.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-neon-amber flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white font-display">Live Streaming SSE</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time token typewriter generation with interactive, clickable citation pills.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
