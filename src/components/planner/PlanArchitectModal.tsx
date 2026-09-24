import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Dumbbell,
  DollarSign,
  Rocket,
  GraduationCap,
  Target,
  BrainCircuit,
  Globe,
  Loader2,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';
import { PlanGoalInput, GeneratedMasterPlan } from '../../types';
import { PlanDisplayCard } from './PlanDisplayCard';

interface PlanArchitectModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: PlanGoalInput['category'];
  initialGoal?: string;
}

export const PlanArchitectModal: React.FC<PlanArchitectModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'wealth_money',
  initialGoal = '',
}) => {
  const { t, settings, userProfile, generateMasterPlan } = useAgent();
  const isBangla = settings?.language === 'Bangla';

  const [category, setCategory] = useState<PlanGoalInput['category']>(initialCategory);
  const [goal, setGoal] = useState(initialGoal);
  const [currentWeight, setCurrentWeight] = useState('60 kg');
  const [targetWeight, setTargetWeight] = useState('68 kg');
  const [height, setHeight] = useState('5 ft 8 in (173 cm)');
  const [age, setAge] = useState('23');
  const [dietPreference, setDietPreference] = useState('Non-Vegetarian (Eggs, Chicken, Milk, Rice, Oats, Fish)');
  const [gymAccess, setGymAccess] = useState('Gym Membership Available');
  const [budgetOrCapital, setBudgetOrCapital] = useState('$0 (Bootstrapped / Zero Investment)');
  const [experienceLevel, setExperienceLevel] = useState('Beginner to Intermediate');
  const [dailyCommitment, setDailyCommitment] = useState('2-3 hours / day');
  const [targetMetric, setTargetMetric] = useState('$3,000 - $5,000 / month');
  const [timeframe, setTimeframe] = useState('90 Days (12 Weeks)');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedMasterPlan | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);

    const effectiveGoal =
      goal.trim() ||
      (category === 'fitness_body'
        ? (isBangla ? `মাসল বিল্ডিং ও ওজন বৃদ্ধি (${currentWeight} থেকে ${targetWeight})` : `Hypertrophy Muscle & Weight Gain (${currentWeight} -> ${targetWeight})`)
        : category === 'wealth_money'
        ? (isBangla ? `ডিজিটাল স্কিল দিয়ে মাসিক ${targetMetric} উপার্জন` : `High-Income Skill & Digital Revenue (${targetMetric})`)
        : category === 'business_startup'
        ? (isBangla ? 'একটি সফল বুটস্ট্র্যাপড SaaS বা ডিজিটাল এজেন্সি লঞ্চ করা' : 'Launch a Profitable Bootstrapped SaaS or Digital Agency')
        : (isBangla ? 'উচ্চ-মানসম্পন্ন এক্সিকিউশন মাস্টারপ্ল্যান' : 'High-Quality Execution Masterplan'));

    const inputData: PlanGoalInput = {
      goal: effectiveGoal,
      category,
      currentWeight,
      targetWeight,
      height,
      age,
      dietPreference,
      gymAccess,
      budgetOrCapital,
      experienceLevel,
      dailyCommitment,
      targetMetric,
      timeframe,
      additionalInfo,
    };

    try {
      const plan = await generateMasterPlan(inputData);
      if (plan) {
        setGeneratedPlan(plan);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const categories = [
    {
      id: 'wealth_money' as const,
      label: isBangla ? '💰 টাকা ও সম্পদ অর্জন' : '💰 Make Money & Wealth',
      desc: isBangla ? 'হাই-ইনকাম স্কিল, ফ্রিল্যান্সিং, ক্লায়েন্ট আউটরিচ ও রেভিনিউ' : 'High-income skills, agency client acquisition & recurring revenue',
      icon: <DollarSign className="h-4 w-4 text-emerald-400" />,
      defaultGoal: isBangla ? 'অনলাইন থেকে প্রতি মাসে ৩,০০০ ডলার আয় করার পূর্ণাঙ্গ রোডম্যাপ' : 'Build a high-income skill pipeline and earn $3,000-$5,000/mo',
    },
    {
      id: 'fitness_body' as const,
      label: isBangla ? '💪 মাসল বিল্ডিং ও ওজন বৃদ্ধি' : '💪 Bodybuilding & Weight Gain',
      desc: isBangla ? 'ক্যালোরি সারপ্লাস, বিজ্ঞানসম্মত ডায়েট ও হাইপারট্রফি ওয়ার্কআউট' : 'Caloric surplus, scientific nutrition & 4-phase hypertrophy splits',
      icon: <Dumbbell className="h-4 w-4 text-rose-400" />,
      defaultGoal: isBangla ? 'সঠিক ডায়েট ও ওয়ার্কআউট করে স্বাস্থ্যকরভাবে ৮ কেজি ওজন বাড়ানো' : 'Gain 8kg of lean muscle mass with progressive overload & nutrition',
    },
    {
      id: 'business_startup' as const,
      label: isBangla ? '🚀 স্টার্টআপ ও SaaS' : '🚀 Startup & SaaS Roadmap',
      desc: isBangla ? 'আইডিয়া ভ্যালিডেশন, এমভিপি তৈরি ও কাস্টমার একুইজিশন' : 'Idea validation, zero-to-one MVP launch & productized growth',
      icon: <Rocket className="h-4 w-4 text-cyan-400" />,
      defaultGoal: isBangla ? 'একটি লাভজনক মাইক্রো-SaaS বা টেক এজেন্সি লঞ্চ করা' : 'Launch a bootstrapped Micro-SaaS to $5k MRR',
    },
    {
      id: 'career_skill' as const,
      label: isBangla ? '🎓 স্কিল ও ক্যারিয়ার রোডম্যাপ' : '🎓 High-Income Skill Mastery',
      desc: isBangla ? 'ফুল-স্ট্যাক, এআই ইঞ্জিনিয়ারিং বা হাই-ভ্যালু ক্যারিয়ার প্ল্যান' : 'Master AI engineering, Full-Stack, or Tech Leadership in 90 days',
      icon: <GraduationCap className="h-4 w-4 text-amber-400" />,
      defaultGoal: isBangla ? '৯০ দিনে সিনিয়র ফুল-স্ট্যাক ও এআই ইঞ্জিনিয়ার হওয়া' : 'Master Full-Stack Next.js & AI Agent Systems in 90 Days',
    },
    {
      id: 'custom' as const,
      label: isBangla ? '🎯 যেকোনো কাস্টম লক্ষ্য' : '🎯 Custom Universal Plan',
      desc: isBangla ? 'যেকোনো ব্যক্তিগত বা পেশাগত লক্ষ্যের গুগল গ্রাউন্ডেড প্ল্যান' : 'Grounded 4-phase execution blueprint for any ambition',
      icon: <Target className="h-4 w-4 text-[#FF204E]" />,
      defaultGoal: '',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl neumorph-card border border-[#FF204E]/30 bg-[#090204]/98 shadow-[0_0_50px_rgba(255,32,78,0.25)] my-auto max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#FF204E]/20 bg-gradient-to-r from-[#1B050B] via-[#0F0205] to-[#090204] p-4 sm:p-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF204E]/15 border border-[#FF204E]/30 shadow-[0_0_15px_rgba(255,32,78,0.3)]">
              <BrainCircuit className="h-5 w-5 text-[#FF204E] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {isBangla ? 'এআই মাস্টারপ্ল্যান আর্কিটেক্ট ও গুগল ওয়েব অ্যানালিটিক্স' : 'AI Masterplan Architect & Google Live Intelligence'}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400">
                  <Globe className="h-2.5 w-2.5" />
                  <span>Google Live Grounding</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isBangla
                  ? 'যেকোনো লক্ষ্য (টাকা ইনকাম, বডি বিল্ডিং, ব্যবসা, ক্যারিয়ার)-এর জন্য নিখুঁত ৪-পর্যায়ের পরিকল্পনা'
                  : 'Synthesize actionable 4-phase blueprints with real-time web verification'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {generatedPlan ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setGeneratedPlan(null)}
                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>← {isBangla ? 'নতুন করে ইনপুট বদলান' : 'Edit Parameters & Re-generate'}</span>
                </button>
              </div>
              <PlanDisplayCard plan={generatedPlan} onClose={onClose} />
            </div>
          ) : (
            <form onSubmit={handleGenerate} className="space-y-5">
              {/* Category Picker Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block">
                  {isBangla ? '১. পরিকল্পনার ধরন নির্বাচন করুন:' : '1. Select Plan Objective Category:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {categories.map((cat) => {
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setCategory(cat.id);
                          if (!goal || categories.some(c => c.defaultGoal === goal)) {
                            setGoal(cat.defaultGoal);
                          }
                        }}
                        className={`flex items-start gap-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FF204E]/10 border-[#FF204E] shadow-[0_0_20px_rgba(255,32,78,0.2)]'
                            : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="p-1.5 rounded-lg bg-black/40 border border-white/5 shrink-0 mt-0.5">
                          {cat.icon}
                        </div>
                        <div className="min-w-0">
                          <span className={`text-xs font-bold block ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                            {cat.label}
                          </span>
                          <span className="text-[11px] text-slate-400 block line-clamp-2 mt-0.5">
                            {cat.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Goal Input Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block">
                  {isBangla ? '২. আপনার সুনির্দিষ্ট লক্ষ্য ও অভিপ্রায়:' : '2. Specific Target Goal & Ambition:'}
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder={
                    category === 'fitness_body'
                      ? (isBangla ? 'উদা: ৬০ কেজি থেকে ৬৮ কেজিতে ওজন বাড়ানো ও মাসল তৈরি' : 'e.g. Gain 8kg of lean muscle mass in 90 days')
                      : category === 'wealth_money'
                      ? (isBangla ? 'উদা: ফ্রিল্যান্সিং ও এজেন্সি দিয়ে প্রতি মাসে ৩,০০০ ডলার ইনকাম' : 'e.g. Earn $3,000 - $5,000/mo with digital agency & outreach')
                      : (isBangla ? 'আপনার মূল লক্ষ্যটি লিখুন...' : 'Describe your specific target goal...')
                  }
                  className="w-full rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#FF204E] focus:outline-none transition-colors"
                />
              </div>

              {/* Dynamic Parameter Grid depending on Category */}
              <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#FF204E] font-bold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isBangla ? '৩. গুরুত্বপূর্ণ তথ্য ও প্রোফাইল প্যারামিটারসমূহ (গাণিতিক নির্ভুলতার জন্য):' : '3. Important Profiling Parameters (For Mathematical & Scientific Precision):'}</span>
                </div>

                {category === 'fitness_body' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 font-mono block mb-1">{isBangla ? 'বর্তমান ওজন (Current Weight)' : 'Current Weight'}</label>
                      <input
                        type="text"
                        value={currentWeight}
                        onChange={(e) => setCurrentWeight(e.target.value)}
                        className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-white text-xs focus:border-[#FF204E] focus:outline-none"
                        placeholder="60 kg"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-mono block mb-1">{isBangla ? 'টার্গেট ওজন (Target Weight)' : 'Target Weight'}</label>
                      <input
                        type="text"
                        value={targetWeight}
                        onChange={(e) => setTargetWeight(e.target.value)}
                        className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-white text-xs focus:border-[#FF204E] focus:outline-none"
                        placeholder="68 kg"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-mono block mb-1">{isBangla ? 'উচ্চতা ও বয়স (Height & Age)' : 'Height & Age'}</label>
                      <input
                        type="text"
                        value={`${height}, Age: ${age}`}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHeight(val);
                        }}
                        className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-white text-xs focus:border-[#FF204E] focus:outline-none"
                        placeholder="5 ft 8 in, Age: 23"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-mono block mb-1">{isBangla ? 'ডায়েট পছন্দ (Diet Preference)' : 'Diet Preference'}</label>
                      <input
                        type="text"
                        value={dietPreference}
                        onChange={(e) => setDietPreference(e.target.value)}
                        className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-white text-xs focus:border-[#FF204E] focus:outline-none"
                        placeholder="Non-Veg (Eggs, Milk, Meat)"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-mono block mb-1">{isBangla ? 'জিম এক্সেস (Gym Access)' : 'Gym / Home Setup'}</label>
                      <input
                        type="text"
                        value={gymAccess}
                        onChange={(e) => setGymAccess(e.target.value)}
                        className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-white text-xs focus:border-[#FF204E] focus:outline-none"
                        placeholder="Gym Access Available"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-mono block mb-1">{isBangla ? 'টাইমলাইন (Timeline)' : 'Time Horizon'}</label>
                      <input
                        type="text"
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-white text-xs focus:border-[#FF204E] focus:outline-none"
                        placeholder="12 Weeks"
                      />
                    </div>
                  </div>
                )}

                {category === 'wealth_money' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 font-mono block mb-1">{isBangla ? 'টার্গেট মাসিক আয় (Target Income)' : 'Target Monthly Income'}</label>
                      <input
                        type="text"
                        value={targetMetric}
                        onChange={(e) => setTargetMetric(e.target.value)}
                        className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-white text-xs focus:border-[#FF204E] focus:outline-none"
                        placeholder="$3,000 - $5,000 / mo"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-mono block mb-1">{isBangla ? 'শুরুর বাজেট/মূলধন (Starting Capital)' : 'Starting Capital'}</label>
                      <input
                        type="text"
                        value={budgetOrCapital}
                        onChange={(e) => setBudgetOrCapital(e.target.value)}
                        className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-white text-xs focus:border-[#FF204E] focus:outline-none"
                        placeholder="$0 (Bootstrapped)"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-mono block mb-1">{isBangla ? 'দৈনিক সময় (Daily Commitment)' : 'Daily Hours Commitment'}</label>
                      <input
                        type="text"
                        value={dailyCommitment}
                        onChange={(e) => setDailyCommitment(e.target.value)}
                        className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-white text-xs focus:border-[#FF204E] focus:outline-none"
                        placeholder="2-4 hours/day"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-mono block mb-1">{isBangla ? 'অভিজ্ঞতা স্তর (Experience)' : 'Current Experience'}</label>
                      <input
                        type="text"
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-white text-xs focus:border-[#FF204E] focus:outline-none"
                        placeholder="Beginner / Intermediate"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-mono block mb-1">{isBangla ? 'টাইমলাইন (Timeline)' : 'Target Timeline'}</label>
                      <input
                        type="text"
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-white text-xs focus:border-[#FF204E] focus:outline-none"
                        placeholder="90 Days (3 Months)"
                      />
                    </div>
                  </div>
                )}

                {category !== 'fitness_body' && category !== 'wealth_money' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 font-mono block mb-1">{isBangla ? 'দৈনিক সময় বরাদ্দ (Daily Commitment)' : 'Daily Allocation'}</label>
                      <input
                        type="text"
                        value={dailyCommitment}
                        onChange={(e) => setDailyCommitment(e.target.value)}
                        className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-white text-xs focus:border-[#FF204E] focus:outline-none"
                        placeholder="2-3 hours/day"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-mono block mb-1">{isBangla ? 'টাইমলাইন (Target Timeframe)' : 'Target Timeframe'}</label>
                      <input
                        type="text"
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-white text-xs focus:border-[#FF204E] focus:outline-none"
                        placeholder="8-12 Weeks"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit & Generate Button */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Globe className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
                  <span>{isBangla ? 'গুগল লাইভ ডাটা ও পাবমেড গবেষণায় গ্রাউন্ডেড হবে' : 'Grounded with Google search & scientific benchmarks'}</span>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FF204E] hover:bg-[#ff3860] disabled:opacity-50 text-white font-bold text-sm transition-all shadow-[0_0_25px_rgba(255,32,78,0.4)] cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{isBangla ? 'গুগল ডাটা ও ডিপ থিংকিং দিয়ে মাস্টারপ্ল্যান তৈরি হচ্ছে...' : 'Synthesizing Google-Grounded Masterplan...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>{isBangla ? 'উচ্চ-মানসম্পন্ন মাস্টারপ্ল্যান তৈরি করুন' : 'Generate High-Quality Masterplan'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
