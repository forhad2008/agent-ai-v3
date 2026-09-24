import React, { useState } from 'react';
import { Tag, Tags, X, Plus, Check, AlertCircle } from 'lucide-react';
import { TaskItem } from '../../types';

interface BatchTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTasks: TaskItem[];
  onApplyTags: (tags: string[], mode: 'append' | 'replace') => void;
  isBangla?: boolean;
}

const COMMON_TAG_PRESETS = [
  '#AI',
  '#Automation',
  '#Frontend',
  '#Backend',
  '#UIUX',
  '#SEO',
  '#Sprint1',
  '#BugFix',
  '#Refactor',
  '#Urgent',
  '#HighPriority',
  '#Research',
  '#Review',
  '#Documentation',
];

export const BatchTagModal: React.FC<BatchTagModalProps> = ({
  isOpen,
  onClose,
  selectedTasks,
  onApplyTags,
  isBangla = false,
}) => {
  const [tags, setTags] = useState<string[]>(['#Sprint1']);
  const [inputTag, setInputTag] = useState('');
  const [mode, setMode] = useState<'append' | 'replace'>('append');

  if (!isOpen) return null;

  const handleAddTag = (tagToAdd?: string) => {
    const raw = (tagToAdd || inputTag).trim();
    if (!raw) return;
    const formatted = raw.startsWith('#') ? raw : `#${raw.replace(/\s+/g, '')}`;
    if (!tags.includes(formatted)) {
      setTags((prev) => [...prev, formatted]);
    }
    if (!tagToAdd) {
      setInputTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (tags.length === 0) return;
    onApplyTags(tags, mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl neumorph-card p-5 sm:p-6 text-xs space-y-4 border border-[#FF204E]/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E50914]/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl neumorph-circle flex items-center justify-center text-sky-400">
              <Tags className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {isBangla ? 'ব্যাচ ট্যাগ যোগ ও এডিট করুন' : 'Bulk Tag Manager'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isBangla
                  ? `${selectedTasks.length}টি নির্বাচিত টাস্কে ট্যাগ প্রযোজ্য হবে`
                  : `Applying tags across ${selectedTasks.length} selected tasks`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-xl neumorph-circle flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Selected Tasks Preview Pills */}
        <div className="rounded-xl neumorph-inset p-2.5 space-y-1.5 border border-white/5 max-h-24 overflow-y-auto">
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
            {isBangla ? 'নির্বাচিত টাস্কসমূহ:' : 'Target Tasks:'}
          </span>
          <div className="flex flex-wrap gap-1">
            {selectedTasks.map((t) => (
              <span
                key={t.id}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10 font-mono truncate max-w-[200px]"
                title={t.title}
              >
                <Check className="h-2.5 w-2.5 text-sky-400 shrink-0" />
                <span className="truncate">{t.title}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Active Tags to Apply */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-sky-400" />
              <span>{isBangla ? 'যেসব ট্যাগ যুক্ত হবে' : 'Tags to Apply'}</span>
            </span>
            <span className="text-[10px] font-mono text-sky-400">
              {tags.length} {tags.length === 1 ? 'tag' : 'tags'}
            </span>
          </label>

          <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 rounded-xl neumorph-inset border border-white/5">
            {tags.length === 0 ? (
              <span className="text-[11px] text-slate-500 italic flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {isBangla ? 'নিচের প্রি-সেট থেকে সিলেক্ট করুন বা নতুন ট্যাগ টাইপ করুন' : 'Select presets below or type custom tags'}
              </span>
            ) : (
              tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[11px] font-mono shadow-[0_0_8px_rgba(56,189,248,0.2)]"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-400 cursor-pointer transition-colors ml-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Add Custom Tag Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTag();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400 font-mono text-xs">#</span>
            <input
              type="text"
              value={inputTag}
              onChange={(e) => setInputTag(e.target.value)}
              placeholder={isBangla ? 'কাস্টম ট্যাগ টাইপ করুন...' : 'Type custom tag (e.g. Q3Launch)...'}
              className="w-full rounded-xl neumorph-inset pl-7 pr-3 py-2 text-xs text-[#F8FAFC] placeholder:text-slate-500 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => handleAddTag()}
            disabled={!inputTag.trim()}
            className="rounded-xl neumorph-btn-primary px-3 py-2 text-white font-bold disabled:opacity-40 flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{isBangla ? 'যুক্ত করুন' : 'Add'}</span>
          </button>
        </form>

        {/* Quick Tag Presets */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] text-slate-400 font-semibold block">
            {isBangla ? '⚡ দ্রুত প্রি-সেট ট্যাগসমূহ:' : '⚡ Quick Presets:'}
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {COMMON_TAG_PRESETS.map((preset) => {
              const isSelected = tags.includes(preset);
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => (isSelected ? handleRemoveTag(preset) : handleAddTag(preset))}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500 text-black font-bold shadow-[0_0_8px_rgba(56,189,248,0.4)]'
                      : 'bg-white/[0.04] text-slate-300 hover:text-white border border-white/5 hover:border-sky-500/30'
                  }`}
                >
                  {preset}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode Selector (Append vs Replace) */}
        <div className="rounded-xl neumorph-card p-3 space-y-2 border border-white/5">
          <span className="text-[10px] text-slate-400 font-semibold block">
            {isBangla ? 'ট্যাগ প্রয়োগের নিয়ম:' : 'Tagging Mode:'}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode('append')}
              className={`p-2 rounded-xl text-left transition-all cursor-pointer border ${
                mode === 'append'
                  ? 'bg-sky-500/15 border-sky-500/50 text-white shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                  : 'bg-black/20 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${mode === 'append' ? 'bg-sky-400' : 'bg-slate-600'}`} />
                <span>{isBangla ? 'বর্তমান ট্যাগে যোগ (Append)' : 'Append Tags'}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {isBangla ? 'টাস্কের বিদ্যমান ট্যাগ বহাল থাকবে' : 'Preserves current tags on tasks'}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMode('replace')}
              className={`p-2 rounded-xl text-left transition-all cursor-pointer border ${
                mode === 'replace'
                  ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                  : 'bg-black/20 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${mode === 'replace' ? 'bg-amber-400' : 'bg-slate-600'}`} />
                <span>{isBangla ? 'সব বদলে দিন (Replace)' : 'Replace All Tags'}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {isBangla ? 'পূর্বের ট্যাগ মুছে নতুনগুলো বসবে' : 'Overwrites all existing tags'}
              </p>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E50914]/20">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl neumorph-btn-secondary px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
          >
            {isBangla ? 'বাতিল' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={tags.length === 0}
            className="rounded-xl neumorph-btn-primary px-5 py-2 font-bold text-white disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="h-4 w-4" />
            <span>
              {isBangla
                ? `${selectedTasks.length}টি টাস্কে ট্যাগ লাগান`
                : `Apply Tags to ${selectedTasks.length} Tasks`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
