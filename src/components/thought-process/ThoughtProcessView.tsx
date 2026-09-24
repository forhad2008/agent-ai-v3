import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import { ThoughtProcessRecord } from '../../types';
import {
  Brain,
  Sparkles,
  CheckCircle2,
  Clock,
  Zap,
  ShieldAlert,
  ArrowRight,
  Database,
  Search,
  Cpu,
  Layers,
  Activity,
  ChevronDown,
  ChevronUp,
  Play,
  Terminal,
  MessageSquare,
  Lock,
  Compass,
  Globe,
  ExternalLink,
} from 'lucide-react';

export const ThoughtProcessView: React.FC = () => {
  const {
    thoughtProcessRecords,
    activeThoughtProcess,
    setActiveThoughtProcess,
    activePlan,
    isGenerating,
    userProfile,
    settings,
    handleSendMessage,
    setActiveView,
  } = useAgent();

  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>('deep-reasoning');
  const [customSimQuery, setCustomSimQuery] = useState<string>('');

  const currentActiveRecord = thoughtProcessRecords.find(
    (r) => r.id === (selectedRecordId || activeThoughtProcess?.id || thoughtProcessRecords[0]?.id)
  ) || thoughtProcessRecords[0];

  const handleSimulateThought = (promptText: string) => {
    if (!promptText.trim()) return;
    handleSendMessage(promptText);
    setActiveView('thought-process');
  };

  const getPhaseBadgeColor = (phase: string) => {
    switch (phase) {
      case 'Goal Understanding':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'Deep Reasoning':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'Risk Evaluation':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Tool Orchestration':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'Synthesis & Verification':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      default:
        return 'bg-[#FF204E]/20 text-[#FF204E] border-[#FF204E]/40';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-3xl neumorph-card p-6 sm:p-8 border border-[#FF204E]/30 bg-gradient-to-r from-[#1a0508] via-[#0d0103] to-[#120204]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF204E]/20 border border-[#FF204E]/40 px-3 py-1 text-xs font-mono font-bold text-[#FF4D4D] uppercase tracking-wider">
                <Brain className="h-3.5 w-3.5 text-[#FF204E] animate-pulse" />
                Transparent AI Cognition Engine
              </span>
              <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 text-xs font-semibold">
                No Rigid Time Pressure · Full Depth
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Agent <span className="text-[#FF204E]">Thought Process</span> & Real-Time Reasoning
            </h1>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Experience the inner cognitive architecture of <strong className="text-white">Agent-sigma08</strong>.
              Inspect sub-goals, internal risk deliberations, memory recall nodes, and tool chain execution in real-time without artificial time cutoffs.
            </p>
          </div>

          {/* Quick Simulation Trigger */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => handleSimulateThought('আমার ফ্রিল্যান্সিং ক্যারিয়ারে মাসে $৭,০০০ আয়ের একটি ডিপ টেকনিক্যাল প্ল্যান তৈরি করো')}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E50914] to-[#B80610] hover:from-[#FF204E] hover:to-[#E50914] text-white px-5 py-3 font-bold text-xs shadow-[0_0_20px_rgba(229,9,20,0.5)] transition-all cursor-pointer transform hover:scale-[1.02]"
            >
              <Zap className="h-4 w-4 fill-white" />
              <span>Trigger Deep Reasoning Plan</span>
            </button>
            <button
              onClick={() => setActiveView('chat')}
              className="flex items-center justify-center gap-2 rounded-2xl neumorph-card border border-white/10 hover:border-[#FF204E]/40 text-white/90 px-4 py-2.5 font-semibold text-xs transition-all cursor-pointer"
            >
              <MessageSquare className="h-3.5 w-3.5 text-[#FF204E]" />
              <span>Switch to Live Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Cognitive Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl neumorph-card border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-white/60 text-xs">
            <span>Cognitive Latency</span>
            <Clock className="h-3.5 w-3.5 text-[#FF204E]" />
          </div>
          <div className="text-base sm:text-lg font-black text-white">Uncapped Time</div>
          <div className="text-[10px] text-emerald-400 font-mono">Max Cognitive Depth</div>
        </div>

        <div className="p-4 rounded-2xl neumorph-card border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-white/60 text-xs">
            <span>Web Gathering</span>
            <Globe className="h-3.5 w-3.5 text-sky-400" />
          </div>
          <div className="text-base sm:text-lg font-black text-sky-400">Live Search</div>
          <div className="text-[10px] text-sky-300 font-mono">Real-Time Web Intel</div>
        </div>

        <div className="p-4 rounded-2xl neumorph-card border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-white/60 text-xs">
            <span>Reasoning Phase</span>
            <Activity className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <div className="text-base sm:text-lg font-black text-cyan-400 truncate">
            {isGenerating ? 'Active Reasoning' : currentActiveRecord?.phase || 'Verified'}
          </div>
          <div className="text-[10px] text-white/50 font-mono">5 Architectural Gates</div>
        </div>

        <div className="p-4 rounded-2xl neumorph-card border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-white/60 text-xs">
            <span>Memory Anchor</span>
            <Database className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <div className="text-base sm:text-lg font-black text-purple-400 truncate">
            {userProfile.name || 'Abdullah'}
          </div>
          <div className="text-[10px] text-white/50 font-mono truncate">
            {userProfile.role || 'Senior Software Engineer'}
          </div>
        </div>

        <div className="p-4 rounded-2xl neumorph-card border border-white/5 space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-white/60 text-xs">
            <span>Confidence</span>
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="text-base sm:text-lg font-black text-amber-400">
            {currentActiveRecord?.confidenceScore || 98}%
          </div>
          <div className="text-[10px] text-white/50 font-mono">Self-Corrected AST</div>
        </div>
      </div>

      {/* Main Split: Left Selector & Pipeline, Right Live Thought Trace & Sub-Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Cognitive Traces & Phase Pipeline (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* History of Cognitive Processes */}
          <div className="p-5 rounded-3xl neumorph-card border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#FF204E]" />
                Recent Cognitive Executions
              </h3>
              <span className="text-[11px] text-white/50 font-mono">
                {thoughtProcessRecords.length} Saved
              </span>
            </div>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {thoughtProcessRecords.map((rec) => {
                const isSelected = rec.id === currentActiveRecord?.id;
                return (
                  <div
                    key={rec.id}
                    onClick={() => {
                      setSelectedRecordId(rec.id);
                      setActiveThoughtProcess(rec);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF204E]/10 border-[#FF204E]/60 shadow-[0_0_15px_rgba(255,32,78,0.2)]'
                        : 'bg-[#151515] border-white/5 hover:border-white/20 hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPhaseBadgeColor(rec.phase)}`}>
                        {rec.phase}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono">{rec.timestamp}</span>
                    </div>
                    <div className="text-xs font-semibold text-white truncate line-clamp-1">
                      "{rec.query}"
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-white/50">
                      <span>{rec.subGoals.length} Sub-goals</span>
                      <span className="text-emerald-400 font-mono">{rec.confidenceScore}% Confidence</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Reasoning Test Input */}
          <div className="p-5 rounded-3xl neumorph-card border border-white/5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-[#FF204E]" />
              Trigger Live Thought Trace
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSimQuery}
                onChange={(e) => setCustomSimQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSimulateThought(customSimQuery);
                    setCustomSimQuery('');
                  }
                }}
                placeholder="Ask complex question to watch reasoning..."
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#FF204E]"
              />
              <button
                onClick={() => {
                  handleSimulateThought(customSimQuery);
                  setCustomSimQuery('');
                }}
                className="shrink-0 px-3 py-2 rounded-xl bg-[#FF204E] hover:bg-[#ff4d73] text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Play className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Web Information Gathering & Real-Time Intelligence Card */}
          {currentActiveRecord?.webInformationGathered && (
            <div className="p-5 rounded-3xl neumorph-card border border-sky-500/25 bg-gradient-to-b from-sky-950/20 via-[#050e1d]/40 to-transparent space-y-3">
              <div className="flex items-center justify-between text-sky-400 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-sky-400 animate-pulse" />
                  <span>Web Information Gathered for Plan</span>
                </div>
                <span className="text-[10px] font-mono bg-sky-500/20 border border-sky-500/30 text-sky-300 px-2 py-0.5 rounded-full">
                  {currentActiveRecord.webInformationGathered.sources?.length || 0} Sources
                </span>
              </div>

              {/* Search Queries */}
              {currentActiveRecord.webInformationGathered.searchQueries?.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-sky-300/70">Search Grounding Queries:</div>
                  <div className="flex flex-wrap gap-1">
                    {currentActiveRecord.webInformationGathered.searchQueries.map((query, qIdx) => (
                      <span
                        key={qIdx}
                        className="inline-flex items-center gap-1 rounded-lg bg-sky-950/60 border border-sky-500/30 px-2 py-0.5 text-[10px] text-sky-200 font-mono"
                      >
                        <Search className="h-2.5 w-2.5 text-sky-400" />
                        <span>"{query}"</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Web Sources */}
              {currentActiveRecord.webInformationGathered.sources?.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="text-[10px] uppercase font-bold text-sky-300/70">Retrieved Web Sources:</div>
                  <div className="space-y-1.5">
                    {currentActiveRecord.webInformationGathered.sources.map((src, sIdx) => (
                      <a
                        key={sIdx}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-white/[0.03] hover:bg-sky-500/10 border border-white/5 hover:border-sky-400/40 text-xs text-white/90 flex items-center justify-between transition-all group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[9px] font-bold text-sky-400 bg-sky-500/20 rounded px-1 shrink-0">
                            {sIdx + 1}
                          </span>
                          <span className="truncate text-[11px] font-medium text-slate-200 group-hover:text-sky-300">
                            {src.title || src.domain}
                          </span>
                        </div>
                        <ExternalLink className="h-3 w-3 text-slate-500 group-hover:text-sky-400 shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Memory Integration Recall Card */}
          {currentActiveRecord?.memoryRecalled && (
            <div className="p-5 rounded-3xl neumorph-card border border-purple-500/20 bg-gradient-to-b from-purple-950/15 to-transparent space-y-3">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-bold">
                <Database className="h-4 w-4" />
                <span>Memory Context Recalled During Reasoning</span>
              </div>
              <div className="text-[11px] text-white/80 space-y-1.5 font-mono">
                <div>
                  <span className="text-purple-400 font-semibold">User:</span> {currentActiveRecord.memoryRecalled.user} ({currentActiveRecord.memoryRecalled.role})
                </div>
                <div>
                  <span className="text-purple-400 font-semibold">Goals:</span> {currentActiveRecord.memoryRecalled.goals}
                </div>
                <div>
                  <span className="text-purple-400 font-semibold">Tech Stack:</span> {currentActiveRecord.memoryRecalled.techStack}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Deep Real-Time Reasoning & Plan Execution Progress (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-time Sub-Goals & Plan Steps */}
          <div className="p-6 rounded-3xl neumorph-card border border-white/5 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Compass className="h-4 w-4 text-[#FF204E]" />
                  Sub-Goals & Real-Time Plan Execution
                </h3>
                <p className="text-xs text-white/60 mt-0.5">
                  Deconstructed breakdown derived from user query
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getPhaseBadgeColor(currentActiveRecord?.phase || 'Deep Reasoning')}`}>
                {currentActiveRecord?.phase}
              </span>
            </div>

            {/* Sub-goals list */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-white/50 uppercase tracking-wider">
                1. Architectural Sub-Goals
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentActiveRecord?.subGoals?.map((subGoal, idx) => (
                  <div
                    key={subGoal.id || idx}
                    className="p-3 rounded-2xl bg-[#121212] border border-white/5 flex items-start gap-2.5"
                  >
                    <div className="mt-0.5">
                      {subGoal.status === 'completed' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      ) : subGoal.status === 'in_progress' ? (
                        <div className="h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-white/20 shrink-0" />
                      )}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {subGoal.title}
                      </div>
                      <div className="text-[10px] text-white/40 font-mono capitalize">
                        Status: {subGoal.status.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Multi-Step Plan Execution */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-white/50 uppercase tracking-wider">
                2. Plan Execution Progress (Real-Time)
              </div>
              <div className="space-y-2">
                {(currentActiveRecord?.planSteps || activePlan || []).map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#141414] border border-white/5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5 text-[11px] font-bold text-white">
                        {idx + 1}
                      </div>
                      <div className="text-xs font-medium text-white/90 truncate">
                        {step.title}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {step.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" /> Done
                        </span>
                      ) : step.status === 'running' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/20">
                          <Activity className="h-3 w-3 animate-spin" /> Executing
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold text-white/40 border border-white/10">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Internal Reasoning Thoughts & Cognitive Notes */}
          <div className="p-6 rounded-3xl neumorph-card border border-white/5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Cpu className="h-4 w-4 text-purple-400" />
                Raw Cognitive Thinking Trace
              </h3>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                Independent Reasoning Stream
              </span>
            </div>

            {/* Thinking Paragraph */}
            <div className="p-4 rounded-2xl bg-[#0e0e0e] border border-white/10 font-mono text-xs text-emerald-400/90 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
              {currentActiveRecord?.thinkingRaw || (
                `Recalling long-term user profile for Abdullah...\nRole: Senior Software Engineer & AI Work Leader\nDirectives: Action-oriented, direct step-by-step with zero fluff.\nCognitive deliberation: Analyzing multi-tier architecture, validating safety thresholds, verifying external document links, synthesizing structured plan deliverables.`
              )}
            </div>

            {/* Deliberation Notes */}
            {currentActiveRecord?.reasoningNotes && currentActiveRecord.reasoningNotes.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-white/50 uppercase tracking-wider">
                  Critical Deliberation Notes:
                </div>
                <div className="space-y-1.5">
                  {currentActiveRecord.reasoningNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/80 flex items-start gap-2"
                    >
                      <ArrowRight className="h-3.5 w-3.5 text-[#FF204E] shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
