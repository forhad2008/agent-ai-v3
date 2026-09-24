import React, { useState } from 'react';
import { Check, Loader2, Circle, ListOrdered, BrainCircuit, Sparkles, Globe, Search, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { PlanStep } from '../../types';
import { useAgent } from '../../context/AgentContext';

interface PlanProgressCardProps {
  taskTitle?: string;
  steps: PlanStep[];
  isGenerating?: boolean;
  groundingMetadata?: {
    searchQueries?: string[];
    sources?: { title: string; url: string; domain?: string }[];
  };
  onGatherWebInfo?: (topic: string) => void;
}

export const PlanProgressCard: React.FC<PlanProgressCardProps> = ({
  taskTitle,
  steps,
  isGenerating,
  groundingMetadata,
  onGatherWebInfo,
}) => {
  const { t, settings, userProfile } = useAgent();
  const [showWebIntel, setShowWebIntel] = useState(true);
  const [isGatheringWeb, setIsGatheringWeb] = useState(false);

  if (!steps || steps.length === 0) return null;

  const isBangla = settings?.language === 'Bangla';
  const hasGrounding = groundingMetadata && ((groundingMetadata.searchQueries && groundingMetadata.searchQueries.length > 0) || (groundingMetadata.sources && groundingMetadata.sources.length > 0));

  const handleManualGather = async () => {
    if (onGatherWebInfo) {
      setIsGatheringWeb(true);
      try {
        await onGatherWebInfo(taskTitle || steps[0]?.title || 'Task Plan');
      } finally {
        setIsGatheringWeb(false);
      }
    }
  };

  return (
    <div
      id="plan_progress_card"
      className="my-3 overflow-hidden rounded-2xl neumorph-card border border-[#FF204E]/25"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E50914]/20 bg-[#140307]/80 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <ListOrdered className="h-4 w-4 text-[#FF204E]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#F8FAFC]">
            {t.taskExecutionPlan}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FF204E]/10 border border-[#FF204E]/30 text-[#FF204E]">
            <BrainCircuit className="h-3 w-3" />
            <span>{isBangla ? 'মেমরি ও জেমিনি প্ল্যানিং' : 'Memory & Gemini Planning'}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Globe className="h-3 w-3 animate-pulse" />
            <span>{isBangla ? 'লাইভ ওয়েব তথ্য সংগৃহীত' : 'Web Intel Gathered'}</span>
          </span>
        </div>
        {isGenerating ? (
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#FF204E] neumorph-badge px-2.5 py-0.5 rounded-full">
            <Loader2 className="h-3 w-3 animate-spin text-[#FF204E]" />
            {t.inProgress}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full">
            <Sparkles className="h-2.5 w-2.5" />
            <span>{isBangla ? 'প্ল্যান প্রস্তুত' : 'Plan Ready'}</span>
          </span>
        )}
      </div>

      <div className="px-4 py-3">
        {taskTitle && (
          <p className="mb-2 text-xs font-medium text-[#94A3B8] italic">
            "{taskTitle}"
          </p>
        )}

        {/* User Memory alignment badge */}
        {userProfile?.name && (
          <div className="mb-2.5 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400 font-mono">
            <span className="text-[#FF204E]">● Context:</span>
            <span className="text-slate-300 font-semibold">{userProfile.name}</span>
            {userProfile.role && <span className="opacity-70">({userProfile.role})</span>}
            {userProfile.goals && (
              <span className="text-slate-400 italic truncate max-w-xs">
                • {userProfile.goals}
              </span>
            )}
          </div>
        )}

        {/* Plan Steps Sequence */}
        <div className="space-y-2">
          {steps.map((step, idx) => {
            const isDone = step.status === 'completed';
            const isRunning = step.status === 'running';

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs transition-colors p-1.5 rounded-xl ${
                  isDone
                    ? 'text-[#F8FAFC] neumorph-inset'
                    : isRunning
                    ? 'text-[#FF204E] font-medium neumorph-raised'
                    : 'text-[#94A3B8]/60'
                }`}
              >
                <div className="flex h-5 w-5 items-center justify-center shrink-0">
                  {isDone ? (
                    <div className="flex h-4 w-4 items-center justify-center rounded-full neumorph-btn-primary">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                  ) : isRunning ? (
                    <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF204E] opacity-60"></span>
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FF204E]"></span>
                    </div>
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-[#94A3B8]/40 stroke-[2]" />
                  )}
                </div>
                <span className="leading-snug">{step.title}</span>
              </div>
            );
          })}
        </div>

        {/* Gathered Web Intelligence Section for this Plan */}
        {hasGrounding && (
          <div className="mt-3.5 rounded-xl border border-sky-500/25 bg-gradient-to-r from-sky-950/25 via-[#030d1a]/50 to-[#0a192f]/20 p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300">
                <Globe className="h-3.5 w-3.5 text-sky-400 animate-spin-slow" />
                <span>{isBangla ? '🌐 এই প্ল্যানের সংগৃহীত লাইভ ওয়েব তথ্য' : '🌐 Web Intelligence Gathered for this Plan'}</span>
              </div>
              <button
                onClick={() => setShowWebIntel(!showWebIntel)}
                className="text-[11px] text-sky-400 hover:text-sky-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{showWebIntel ? (isBangla ? 'লুকান' : 'Hide') : (isBangla ? 'দেখুন' : 'Show')}</span>
                {showWebIntel ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            </div>

            {showWebIntel && (
              <div className="space-y-2 pt-1 border-t border-sky-500/20 text-[11px]">
                {/* Search queries used to gather information */}
                {groundingMetadata.searchQueries && groundingMetadata.searchQueries.length > 0 && (
                  <div>
                    <span className="text-[10px] text-sky-400/80 font-mono font-bold uppercase tracking-wider block mb-1">
                      {isBangla ? 'অনুসন্ধানকৃত কুয়েরি:' : 'Web Queries Executed:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {groundingMetadata.searchQueries.map((q, qIdx) => (
                        <span
                          key={qIdx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-900/40 border border-sky-500/30 text-sky-200 text-[10px] font-mono"
                        >
                          <Search className="h-2.5 w-2.5 text-sky-400" />
                          "{q}"
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sources collected from web */}
                {groundingMetadata.sources && groundingMetadata.sources.length > 0 && (
                  <div>
                    <span className="text-[10px] text-sky-400/80 font-mono font-bold uppercase tracking-wider block mb-1">
                      {isBangla ? 'যাচাইকৃত রেফারেন্স ও সোর্সসমূহ:' : 'Retrieved Live Sources:'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {groundingMetadata.sources.map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.04] hover:bg-sky-500/15 border border-white/10 hover:border-sky-400/40 text-slate-200 transition-all group"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-[9px] font-bold text-sky-400 bg-sky-500/20 px-1 py-0.5 rounded shrink-0">
                              {sIdx + 1}
                            </span>
                            <span className="truncate text-[10px] font-medium group-hover:text-sky-300">
                              {src.title || src.domain}
                            </span>
                          </div>
                          <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-sky-300 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action to gather or refresh web info if not yet present or user wants fresh scan */}
        {onGatherWebInfo && (
          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={handleManualGather}
              disabled={isGatheringWeb}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 px-2.5 py-1 rounded-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isGatheringWeb ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin text-sky-400" />
                  <span>{isBangla ? 'ওয়েব থেকে তথ্য সংগ্রহ করা হচ্ছে...' : 'Gathering web info for plan...'}</span>
                </>
              ) : (
                <>
                  <Globe className="h-3 w-3 text-sky-400" />
                  <span>{isBangla ? '🌐 এই প্ল্যানের জন্য নতুন ওয়েব তথ্য খুঁজুন' : '🌐 Gather Fresh Web Info for Plan'}</span>
                </>
              )}
            </button>
            <span className="text-[10px] font-mono text-slate-500">
              {isBangla ? 'লাইভ গুগল গ্রাউন্ডিং' : 'Google Search Grounding'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
