import React from 'react';
import {
  CheckSquare,
  Sparkles,
  Tag,
  Zap,
  RefreshCw,
  Trash2,
  X,
  Check,
  CalendarClock,
  Wand2,
  Layers,
} from 'lucide-react';

interface BatchActionsBarProps {
  selectedCount: number;
  totalFilteredCount: number;
  totalTasksCount: number;
  isAllFilteredSelected: boolean;
  onSelectAllFiltered: () => void;
  onSelectAllTotal: () => void;
  onClearSelection: () => void;
  onOpenAiAutoTag: () => void;
  onOpenTagModal: () => void;
  onOpenPriorityModal: () => void;
  onOpenStatusModal: () => void;
  onApplySmartSchedule: () => void;
  onOpenDeleteModal: () => void;
  isBangla?: boolean;
}

export const BatchActionsBar: React.FC<BatchActionsBarProps> = ({
  selectedCount,
  totalFilteredCount,
  totalTasksCount,
  isAllFilteredSelected,
  onSelectAllFiltered,
  onSelectAllTotal,
  onClearSelection,
  onOpenAiAutoTag,
  onOpenTagModal,
  onOpenPriorityModal,
  onOpenStatusModal,
  onApplySmartSchedule,
  onOpenDeleteModal,
  isBangla = false,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-4xl animate-slideUp">
      <div className="rounded-2xl bg-[#0e0407]/95 border border-[#FF204E]/40 p-3 sm:p-3.5 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(255,32,78,0.25)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left Side: Counter & Quick Selection Controls */}
        <div className="flex items-center justify-between md:justify-start gap-2.5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#FF204E] to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-[0_0_10px_rgba(255,32,78,0.5)]">
              {selectedCount}
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                {isBangla
                  ? `${selectedCount}টি টাস্ক নির্বাচিত`
                  : `${selectedCount} Tasks Selected`}
              </span>
              <span className="text-[10px] text-slate-400">
                {isBangla ? 'ব্যাচ অ্যাকশন চালান' : 'Bulk actions ready'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 pl-2 border-l border-white/10">
            <button
              type="button"
              onClick={onSelectAllFiltered}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
                isAllFilteredSelected
                  ? 'bg-white/10 text-slate-300'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              title="Select all tasks matching current search and filter"
            >
              {isAllFilteredSelected
                ? isBangla ? 'সব সিলেক্টেড' : 'All Filtered'
                : isBangla ? `ফিল্টারকৃত সব (${totalFilteredCount})` : `Select Filtered (${totalFilteredCount})`}
            </button>

            {totalTasksCount > totalFilteredCount && (
              <button
                type="button"
                onClick={onSelectAllTotal}
                className="hidden sm:inline-block px-2 py-1 rounded-lg text-[10px] font-mono text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                title="Select all tasks across entire workspace"
              >
                {isBangla ? `সকল টাস্ক (${totalTasksCount})` : `All (${totalTasksCount})`}
              </button>
            )}

            <button
              type="button"
              onClick={onClearSelection}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Clear selection (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Side: Bulk Actions Hub Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-1.5 overflow-x-auto">
          {/* AI Auto-Tag with Gemini */}
          <button
            type="button"
            id="btn_batch_ai_tag"
            onClick={onOpenAiAutoTag}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-[#FF204E] hover:from-purple-500 hover:to-[#FF204E] text-white text-xs font-bold shadow-[0_0_12px_rgba(168,85,247,0.35)] transition-all cursor-pointer shrink-0"
            title="Auto-categorize and tag all selected tasks with Gemini AI"
          >
            <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-spin" />
            <span>{isBangla ? '✨ এআই অটো-ট্যাগ' : '✨ AI Auto-Tag'}</span>
          </button>

          {/* Add / Edit Tags */}
          <button
            type="button"
            id="btn_batch_tags"
            onClick={onOpenTagModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-xs font-semibold transition-all cursor-pointer shrink-0"
            title="Add or edit tags in bulk"
          >
            <Tag className="h-3.5 w-3.5 text-sky-400" />
            <span>{isBangla ? 'ট্যাগ' : 'Tags'}</span>
          </button>

          {/* Priority */}
          <button
            type="button"
            id="btn_batch_priority"
            onClick={onOpenPriorityModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all cursor-pointer shrink-0"
            title="Set priority across all selected tasks"
          >
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>{isBangla ? 'প্রায়োরিটি' : 'Priority'}</span>
          </button>

          {/* Status */}
          <button
            type="button"
            id="btn_batch_status"
            onClick={onOpenStatusModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all cursor-pointer shrink-0"
            title="Set status across all selected tasks"
          >
            <RefreshCw className="h-3.5 w-3.5 text-emerald-400" />
            <span>{isBangla ? 'স্ট্যাটাস' : 'Status'}</span>
          </button>

          {/* AI Smart Schedule */}
          <button
            type="button"
            id="btn_batch_schedule"
            onClick={onApplySmartSchedule}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all cursor-pointer shrink-0"
            title="Auto-calculate historical due dates for selected tasks"
          >
            <CalendarClock className="h-3.5 w-3.5 text-purple-400" />
            <span>{isBangla ? 'শিডিউল' : 'AI Schedule'}</span>
          </button>

          {/* Delete Selected */}
          <button
            type="button"
            id="btn_batch_delete"
            onClick={onOpenDeleteModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all cursor-pointer shrink-0"
            title="Delete all selected tasks"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-400" />
            <span>{isBangla ? 'ডিলিট' : 'Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
