import React from 'react';
import { Trash2, AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { TaskItem } from '../../types';

interface BatchDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTasks: TaskItem[];
  onConfirmDelete: () => void;
  isBangla?: boolean;
}

export const BatchDeleteModal: React.FC<BatchDeleteModalProps> = ({
  isOpen,
  onClose,
  selectedTasks,
  onConfirmDelete,
  isBangla = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl neumorph-card p-5 sm:p-6 text-xs space-y-4 border border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.25)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {isBangla ? 'টাস্কসমূহ স্থায়ীভাবে ডিলিট করবেন?' : 'Confirm Bulk Task Deletion'}
              </h2>
              <p className="text-[11px] text-rose-300">
                {isBangla
                  ? `একসাথে ${selectedTasks.length}টি টাস্ক মুছে ফেলা হবে`
                  : `You are about to permanently delete ${selectedTasks.length} tasks`}
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

        {/* Warning Callout */}
        <div className="rounded-xl bg-rose-950/40 border border-rose-500/30 p-3 flex items-start gap-2.5 text-rose-200">
          <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-xs text-rose-300">
              {isBangla ? 'সতর্কতা: এই অ্যাকশনটি ফিরিয়ে আনা যাবে না' : 'Warning: Irreversible Operation'}
            </span>
            <p className="text-[11px] text-rose-200/80 leading-relaxed">
              {isBangla
                ? 'ডিলিট করার পর নির্বাচিত টাস্কগুলোর সাব-টাস্ক, শিডিউল এবং এআই মেটাডেটা ওয়ার্কস্পেস স্টোরেজ থেকে চিরতরে মুছে যাবে।'
                : 'All selected tasks, nested sub-tasks, and smart schedule reminders will be permanently purged from your workspace storage.'}
            </p>
          </div>
        </div>

        {/* Selected Tasks List Preview */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-slate-400 font-semibold uppercase font-mono tracking-wider block">
            {isBangla ? 'যেসব টাস্ক ডিলিট হবে:' : 'Tasks Queued for Deletion:'}
          </span>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {selectedTasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-2 p-2 rounded-xl bg-black/40 border border-rose-500/20"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                  <span className="text-xs text-white truncate font-medium">{t.title}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                    {t.priority}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-rose-500/20">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl neumorph-btn-secondary px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
          >
            {isBangla ? 'বাতিল' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmDelete();
              onClose();
            }}
            className="rounded-xl bg-gradient-to-r from-rose-600 to-[#FF204E] hover:from-rose-500 hover:to-rose-600 px-5 py-2 font-bold text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span>
              {isBangla
                ? `হ্যাঁ, ${selectedTasks.length}টি টাস্ক ডিলিট করুন`
                : `Permanently Delete ${selectedTasks.length} Tasks`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
