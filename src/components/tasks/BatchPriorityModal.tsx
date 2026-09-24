import React, { useState } from 'react';
import { Zap, X, Check, Flame, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { TaskItem, TaskPriority } from '../../types';

interface BatchPriorityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTasks: TaskItem[];
  onApplyPriority: (priority: TaskPriority) => void;
  isBangla?: boolean;
}

export const BatchPriorityModal: React.FC<BatchPriorityModalProps> = ({
  isOpen,
  onClose,
  selectedTasks,
  onApplyPriority,
  isBangla = false,
}) => {
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority>('High');

  if (!isOpen) return null;

  const PRIORITY_OPTIONS: {
    id: TaskPriority;
    label: string;
    banglaLabel: string;
    desc: string;
    banglaDesc: string;
    colorClass: string;
    icon: any;
    borderActive: string;
  }[] = [
    {
      id: 'Urgent',
      label: 'Urgent',
      banglaLabel: 'জরুরি (Urgent)',
      desc: 'Top critical priority, immediate agent execution & alarms',
      banglaDesc: 'সর্বোচ্চ অগ্রাধিকার, অতি দ্রুত সম্পাদনযোগ্য',
      colorClass: 'text-[#FF204E] bg-[#FF204E]/10 border-[#FF204E]/40',
      icon: Flame,
      borderActive: 'border-[#FF204E] bg-[#FF204E]/20 shadow-[0_0_15px_rgba(255,32,78,0.35)]',
    },
    {
      id: 'High',
      label: 'High Priority',
      banglaLabel: 'উচ্চ অগ্রাধিকার (High)',
      desc: 'High velocity roadmap milestone and deliverables',
      banglaDesc: 'গুরুত্বপূর্ণ মাইলফলক ও রোডম্যাপ ডেলিভারি',
      colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/40',
      icon: AlertTriangle,
      borderActive: 'border-amber-400 bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.35)]',
    },
    {
      id: 'Medium',
      label: 'Medium Priority',
      banglaLabel: 'স্বাভাবিক (Medium)',
      desc: 'Standard operational cadence and workflow tasks',
      banglaDesc: 'স্ট্যান্ডার্ড কাজের পরিধি ও ওয়ার্কফ্লো',
      colorClass: 'text-[#FF758F] bg-[#FF758F]/10 border-[#FF758F]/40',
      icon: ShieldCheck,
      borderActive: 'border-[#FF758F] bg-[#FF758F]/20 shadow-[0_0_15px_rgba(255,117,143,0.35)]',
    },
    {
      id: 'Low',
      label: 'Low Priority',
      banglaLabel: 'কম অগ্রাধিকার (Low)',
      desc: 'Backlog tasks, future exploration or non-urgent refactors',
      banglaDesc: 'পরবর্তী সময়ের রিফ্যাক্টরিং বা সাধারণ ব্যাকলগ',
      colorClass: 'text-slate-400 bg-slate-500/10 border-slate-500/40',
      icon: Clock,
      borderActive: 'border-slate-400 bg-slate-500/20 shadow-[0_0_15px_rgba(148,163,184,0.3)]',
    },
  ];

  const handleApply = () => {
    onApplyPriority(selectedPriority);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl neumorph-card p-5 sm:p-6 text-xs space-y-4 border border-[#FF204E]/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E50914]/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl neumorph-circle flex items-center justify-center text-amber-400">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {isBangla ? 'ব্যাচ প্রায়োরিটি পরিবর্তন' : 'Bulk Set Priority'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isBangla
                  ? `${selectedTasks.length}টি টাস্কের প্রায়োরিটি পরিবর্তন করুন`
                  : `Change priority level across ${selectedTasks.length} selected tasks`}
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

        {/* Priority Grid Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {PRIORITY_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedPriority === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedPriority(opt.id)}
                className={`p-3 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                  isSelected ? opt.borderActive : 'bg-black/30 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border ${opt.colorClass}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-bold text-xs text-white">
                      {isBangla ? opt.banglaLabel : opt.label}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="h-4 w-4 rounded-full bg-white text-black flex items-center justify-center font-bold">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {isBangla ? opt.banglaDesc : opt.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Target Tasks Summary */}
        <div className="rounded-xl neumorph-inset p-2.5 space-y-1 border border-white/5 max-h-24 overflow-y-auto">
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
            {isBangla ? 'প্রভাবিত টাস্কসমূহ:' : 'Target Tasks:'}
          </span>
          <div className="flex flex-wrap gap-1">
            {selectedTasks.map((t) => (
              <span
                key={t.id}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 font-mono truncate max-w-[200px]"
                title={t.title}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                <span className="truncate">{t.title}</span>
              </span>
            ))}
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
            className="rounded-xl neumorph-btn-primary px-5 py-2 font-bold text-white flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="h-4 w-4" />
            <span>
              {isBangla
                ? `${selectedTasks.length}টি টাস্কে [${selectedPriority}] সেট করুন`
                : `Set [${selectedPriority}] on ${selectedTasks.length} Tasks`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
