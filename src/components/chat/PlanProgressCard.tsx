import React from 'react';
import { Check, Loader2, Circle, ListOrdered, BrainCircuit, Sparkles } from 'lucide-react';
import { PlanStep } from '../../types';
import { useAgent } from '../../context/AgentContext';

interface PlanProgressCardProps {
  taskTitle?: string;
  steps: PlanStep[];
  isGenerating?: boolean;
}

export const PlanProgressCard: React.FC<PlanProgressCardProps> = ({
  taskTitle,
  steps,
  isGenerating,
}) => {
  const { t, settings, userProfile } = useAgent();
  if (!steps || steps.length === 0) return null;

  const isBangla = settings?.language === 'Bangla';

  return (
    <div
      id="plan_progress_card"
      className="my-3 overflow-hidden rounded-2xl neumorph-card border border-[#FF204E]/25"
    >
      <div className="flex items-center justify-between border-b border-[#E50914]/20 bg-[#140307]/80 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <ListOrdered className="h-4 w-4 text-[#FF204E]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#F8FAFC]">
            {t.taskExecutionPlan}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FF204E]/10 border border-[#FF204E]/30 text-[#FF204E]">
            <BrainCircuit className="h-3 w-3" />
            <span>{isBangla ? 'মেমরি ও জেমিনি প্ল্যানিং' : 'Memory & Gemini Planning'}</span>
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
      </div>
    </div>
  );
};
