import React from 'react';
import { Sparkles, BrainCircuit, Check, Loader2, Wand2, Layers, Tag, X } from 'lucide-react';

interface BatchAiProgressModalProps {
  isOpen: boolean;
  isProcessing: boolean;
  progress: { current: number; total: number; currentTitle: string };
  onClose: () => void;
  isBangla?: boolean;
}

export const BatchAiProgressModal: React.FC<BatchAiProgressModalProps> = ({
  isOpen,
  isProcessing,
  progress,
  onClose,
  isBangla = false,
}) => {
  if (!isOpen) return null;

  const percent = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;
  const isDone = !isProcessing && progress.current >= progress.total;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl neumorph-card p-6 text-xs space-y-5 border border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.25)] text-center">
        {/* Animated AI Core Icon */}
        <div className="relative mx-auto h-16 w-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping opacity-75" />
          <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-[#FF204E] flex items-center justify-center text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]">
            {isDone ? (
              <Check className="h-8 w-8 stroke-[3] text-emerald-300 animate-bounce" />
            ) : (
              <BrainCircuit className="h-8 w-8 animate-pulse" />
            )}
          </div>
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-1">
          <h2 className="text-base font-bold text-white flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span>
              {isDone
                ? isBangla
                  ? '✨ এআই ব্যাচ ট্যাগিং সফলভাবে সম্পন্ন!'
                  : '✨ AI Batch Tagging Completed!'
                : isBangla
                ? '🤖 জেমিনাই এআই দ্বারা অটো-ট্যাগিং চলছে...'
                : '🤖 Gemini AI Batch Categorization...'}
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            {isDone
              ? isBangla
                ? `মোট ${progress.total}টি টাস্কে স্বয়ংক্রিয় ক্যাটাগরি, হ্যাশট্যাগ ও প্রায়োরিটি নির্ধারিত হয়েছে।`
                : `Successfully analyzed and attached domain tags to all ${progress.total} tasks.`
              : isBangla
              ? `প্রসেসিং চলছে (${progress.current}/${progress.total} সম্পন্ন)`
              : `Processing tasks (${progress.current} of ${progress.total} finished)`}
          </p>
        </div>

        {/* Real-time Task Title Banner */}
        {!isDone && (
          <div className="rounded-xl neumorph-inset p-3 border border-purple-500/20 text-left space-y-1">
            <span className="text-[10px] text-purple-300 font-mono uppercase tracking-wider flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin text-purple-400" />
              <span>{isBangla ? 'বর্তমান টাস্ক বিশ্লেষণ:' : 'Currently Analyzing:'}</span>
            </span>
            <p className="text-xs text-white font-semibold truncate">
              {progress.currentTitle || 'Initializing task parameters...'}
            </p>
          </div>
        )}

        {/* Progress Bar & Percentage */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
            <span className="text-purple-300">{percent}% Completed</span>
            <span>
              {progress.current} / {progress.total}
            </span>
          </div>

          <div className="h-2.5 w-full rounded-full neumorph-inset overflow-hidden p-0.5">
            <div
              className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-purple-500 via-[#FF204E] to-emerald-400 shadow-[0_0_10px_rgba(168,85,247,0.6)]"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Features Highlight */}
        <div className="grid grid-cols-2 gap-2 pt-2 text-left">
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
            <div className="flex items-center gap-1.5 text-purple-300 text-[10px] font-semibold">
              <Layers className="h-3 w-3" />
              <span>Domain Classification</span>
            </div>
            <span className="text-[9px] text-slate-400">Auto-mapped categories</span>
          </div>

          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
            <div className="flex items-center gap-1.5 text-sky-300 text-[10px] font-semibold">
              <Tag className="h-3 w-3" />
              <span>Hashtag Generation</span>
            </div>
            <span className="text-[9px] text-slate-400">Contextual skill tags</span>
          </div>
        </div>

        {/* Action Button */}
        {isDone && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl neumorph-btn-primary py-2.5 font-bold text-white flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(255,32,78,0.4)]"
            >
              <Check className="h-4 w-4 stroke-[3]" />
              <span>{isBangla ? 'সম্পন্ন (বন্ধ করুন)' : 'Done (Close)'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
