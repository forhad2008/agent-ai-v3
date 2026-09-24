import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Check,
  Download,
  ListTodo,
  TrendingUp,
  ShieldAlert,
  BrainCircuit,
  Globe,
  Flame,
  Dumbbell,
  DollarSign,
  Rocket,
  GraduationCap,
  Target,
} from 'lucide-react';
import { GeneratedMasterPlan, TaskPriority } from '../../types';
import { useAgent } from '../../context/AgentContext';

interface PlanDisplayCardProps {
  plan: GeneratedMasterPlan;
  onClose?: () => void;
}

export const PlanDisplayCard: React.FC<PlanDisplayCardProps> = ({ plan, onClose }) => {
  const { t, settings, convertPlanToTasks, savePlanAsDocument } = useAgent();
  const isBangla = settings?.language === 'Bangla';

  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [tasksConverted, setTasksConverted] = useState(false);
  const [docSaved, setDocSaved] = useState(false);
  const [showThinking, setShowThinking] = useState(false);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = () => {
    const text = `MASTERPLAN: ${plan.title}\n\nEXECUTIVE SUMMARY:\n${plan.executiveSummary}\n\nPHASES:\n` +
      plan.phases.map(p => `Phase ${p.phaseNumber}: ${p.phaseTitle} (${p.duration})\n` + p.actionItems.map(a => `- [${a.priority}] ${a.task}`).join('\n')).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConvertTasks = () => {
    convertPlanToTasks(plan);
    setTasksConverted(true);
    setTimeout(() => setTasksConverted(false), 3000);
  };

  const handleSaveDoc = () => {
    savePlanAsDocument(plan);
    setDocSaved(true);
    setTimeout(() => setDocSaved(false), 3000);
  };

  const getCategoryIcon = () => {
    switch (plan.category) {
      case 'fitness_body':
        return <Dumbbell className="h-5 w-5 text-rose-400" />;
      case 'wealth_money':
        return <DollarSign className="h-5 w-5 text-emerald-400" />;
      case 'business_startup':
        return <Rocket className="h-5 w-5 text-cyan-400" />;
      case 'career_skill':
        return <GraduationCap className="h-5 w-5 text-amber-400" />;
      default:
        return <Target className="h-5 w-5 text-[#FF204E]" />;
    }
  };

  return (
    <div className="rounded-2xl neumorph-card border border-[#FF204E]/30 bg-[#0B0205]/95 overflow-hidden shadow-[0_8px_32px_rgba(255,32,78,0.15)] text-slate-200">
      {/* Header Banner */}
      <div className="border-b border-[#FF204E]/20 bg-gradient-to-r from-[#1E050B] via-[#120206] to-[#0B0205] p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#FF204E]/15 border border-[#FF204E]/30">
                {getCategoryIcon()}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF204E] font-bold">
                {isBangla ? 'গুগল ডেটা-গ্রাউন্ডেড মাস্টারপ্ল্যান' : 'Google Data-Grounded Masterplan'}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                {plan.userAssessment.feasibilityScore}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {plan.title}
            </h2>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleConvertTasks}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF204E] hover:bg-[#ff3860] text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,32,78,0.4)] cursor-pointer"
            >
              {tasksConverted ? <Check className="h-3.5 w-3.5" /> : <ListTodo className="h-3.5 w-3.5" />}
              <span>{tasksConverted ? (isBangla ? 'টাস্কে যুক্ত হয়েছে!' : 'Added to Tasks!') : (isBangla ? '📥 টাস্ক হিসেবে যোগ করুন' : '📥 Convert to Tasks')}</span>
            </button>

            <button
              onClick={handleSaveDoc}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              {docSaved ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Download className="h-3.5 w-3.5" />}
              <span>{docSaved ? (isBangla ? 'ফাইলে সংরক্ষিত!' : 'Saved in Files!') : (isBangla ? '📄 সেভ করুন' : '📄 Save Doc')}</span>
            </button>

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Copy Plan"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* User Assessment Calibration Bar */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">{isBangla ? 'বেসলাইন' : 'Baseline'}</span>
            <span className="text-white font-bold truncate block">{plan.userAssessment.baseline}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">{isBangla ? 'টার্গেট লক্ষ্য' : 'Target Goal'}</span>
            <span className="text-[#FF204E] font-bold truncate block">{plan.userAssessment.target}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">{isBangla ? 'টাইমলাইন' : 'Timeline'}</span>
            <span className="text-sky-400 font-bold truncate block">{plan.userAssessment.timeline}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase">{isBangla ? 'সফলতার সম্ভাবনা' : 'Feasibility'}</span>
            <span className="text-emerald-400 font-bold truncate block">{plan.userAssessment.feasibilityScore}</span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-5">
        {/* Executive Summary */}
        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4 text-sm text-slate-300 leading-relaxed">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#FF204E]" />
            <span>{isBangla ? 'সারসংক্ষেপ ও রণকৌশল' : 'Executive Summary & Strategy'}</span>
          </h3>
          <p>{plan.executiveSummary}</p>
        </div>

        {/* Cognitive Thinking Accordion */}
        {plan.thinking && (
          <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 overflow-hidden">
            <button
              onClick={() => setShowThinking(!showThinking)}
              className="w-full flex items-center justify-between p-3 text-xs text-purple-300 hover:text-purple-200 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 font-mono font-bold">
                <BrainCircuit className="h-4 w-4 text-purple-400 animate-pulse" />
                <span>{isBangla ? '🧠 এজেন্টের ডিপ থিংকিং ও গণিত বিশ্লেষণ' : '🧠 Agent Cognitive Deconstruction & Calculations'}</span>
              </div>
              {showThinking ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showThinking && (
              <div className="p-3.5 border-t border-purple-500/20 bg-[#06020c] font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
                {plan.thinking}
              </div>
            )}
          </div>
        )}

        {/* Google Web Intelligence & Grounding Citations */}
        {plan.groundingMetadata?.sources && plan.groundingMetadata.sources.length > 0 && (
          <div className="rounded-xl border border-sky-500/25 bg-sky-950/20 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
                <Globe className="h-3.5 w-3.5 text-sky-400 animate-spin-slow" />
                <span>{isBangla ? '🌐 সংগৃহীত লাইভ ওয়েব তথ্য ও রেফারেন্স' : '🌐 Live Web Citations & Research Data'}</span>
              </div>
              <span className="text-[10px] text-sky-300 font-mono">
                {plan.groundingMetadata.sources.length} sources
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {plan.groundingMetadata.sources.map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-sky-500/15 border border-white/10 hover:border-sky-400/40 text-[11px] text-slate-200 group transition-all"
                >
                  <span className="text-[9px] font-bold text-sky-400 bg-sky-500/20 px-1 rounded">{src.platform || 'Web'}</span>
                  <span className="truncate max-w-[200px]">{src.title || src.domain}</span>
                  <ExternalLink className="h-2.5 w-2.5 text-slate-500 group-hover:text-sky-300 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Scientific / Market Benchmarks */}
        {plan.scientificOrMarketBenchmarks && plan.scientificOrMarketBenchmarks.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              <span>{isBangla ? 'সাইন্টিফিক ও মার্কেট বেঞ্চমার্ক' : 'Scientific & Market Benchmarks'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {plan.scientificOrMarketBenchmarks.map((b, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200 leading-snug">
                  {b}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4-Phase Roadmap Accordion */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-[#FF204E]" />
            <span>{isBangla ? '৪-পর্যায়ের এক্সিকিউশন রোডম্যাপ' : '4-Phase Execution Roadmap'}</span>
          </h3>

          <div className="space-y-2.5">
            {plan.phases.map((phase) => {
              const isExpanded = expandedPhase === phase.phaseNumber;
              return (
                <div
                  key={phase.phaseNumber}
                  className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedPhase(isExpanded ? null : phase.phaseNumber)}
                    className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF204E]/20 border border-[#FF204E]/40 text-[#FF204E] font-mono font-black text-xs shrink-0">
                        {phase.phaseNumber}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white truncate">
                            {phase.phaseTitle}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 shrink-0">
                            {phase.duration}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {phase.focus}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </button>

                  {isExpanded && (
                    <div className="p-4 pt-1 border-t border-white/5 space-y-3 bg-black/20">
                      {/* Key Deliverables */}
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                          {isBangla ? 'মূল অর্জন ও আউটপুট:' : 'Key Deliverables:'}
                        </span>
                        <div className="space-y-1">
                          {phase.keyDeliverables.map((kd, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                              <span>{kd}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Items */}
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                          {isBangla ? 'করণীয় অ্যাকশন আইটেমস:' : 'Prioritized Action Items:'}
                        </span>
                        <div className="space-y-1.5">
                          {phase.actionItems.map((action, aIdx) => {
                            const priorityColor =
                              action.priority === 'High' || action.priority === 'Urgent'
                                ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                                : action.priority === 'Medium'
                                ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                                : 'bg-slate-900/60 border-slate-700 text-slate-300';

                            return (
                              <div
                                key={aIdx}
                                className="flex items-start justify-between gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs"
                              >
                                <div className="space-y-0.5">
                                  <span className="text-slate-200 font-medium">{action.task}</span>
                                  {action.description && (
                                    <p className="text-[11px] text-slate-400 italic">{action.description}</p>
                                  )}
                                </div>
                                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${priorityColor}`}>
                                  {action.priority}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Checklist */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-emerald-400" />
            <span>{isBangla ? 'দৈনিক এক্সিকিউশন চেকলিস্ট' : 'Daily Non-Negotiable Checklist'}</span>
          </h3>
          <div className="space-y-1.5">
            {plan.dailyChecklist.map((item, idx) => {
              const checked = Boolean(checkedItems[`daily_${idx}`]);
              return (
                <button
                  key={idx}
                  onClick={() => toggleCheck(`daily_${idx}`)}
                  className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    checked
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-slate-400 line-through'
                      : 'bg-white/[0.02] border-white/5 text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className={`flex h-4 w-4 items-center justify-center rounded border shrink-0 ${
                    checked ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-slate-500'
                  }`}>
                    {checked && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <span>{item}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Risks & Mitigation Matrix */}
        {plan.risksAndMitigations && plan.risksAndMitigations.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
              <span>{isBangla ? 'সম্ভাব্য ঝুঁকি ও নিরসন কৌশল' : 'Risks & Mitigation Matrix'}</span>
            </h3>
            <div className="space-y-2">
              {plan.risksAndMitigations.map((rm, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-rose-950/15 border border-rose-500/20 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-300 font-semibold">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 border border-rose-500/30">RISK</span>
                    <span>{rm.risk}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-300 pl-2 border-l border-emerald-500/40">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">MITIGATION</span>
                    <span>{rm.mitigation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Official Resources */}
        {plan.recommendedResources && plan.recommendedResources.length > 0 && (
          <div className="pt-2 border-t border-white/10 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              {isBangla ? 'প্রস্তাবিত রিসোর্স ও টুলস:' : 'Recommended Tools & Official Portals:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {plan.recommendedResources.map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-xs text-slate-200 transition-all group"
                >
                  <div className="min-w-0">
                    <span className="font-bold group-hover:text-[#FF204E] transition-colors block truncate">
                      {res.title}
                    </span>
                    {res.description && (
                      <span className="text-[10px] text-slate-400 block truncate">
                        {res.description}
                      </span>
                    )}
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-white shrink-0 ml-2" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
