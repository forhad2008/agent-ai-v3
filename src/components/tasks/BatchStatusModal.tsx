import React, { useState } from 'react';
import { RefreshCw, X, Check, Play, CheckCircle2, AlertCircle, Clock, ShieldAlert } from 'lucide-react';
import { TaskItem, TaskStatus } from '../../types';

interface BatchStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTasks: TaskItem[];
  onApplyStatus: (status: TaskStatus) => void;
  isBangla?: boolean;
}

export const BatchStatusModal: React.FC<BatchStatusModalProps> = ({
  isOpen,
  onClose,
  selectedTasks,
  onApplyStatus,
  isBangla = false,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>('Completed');

  if (!isOpen) return null;

  const STATUS_OPTIONS: {
    id: TaskStatus;
    label: string;
    banglaLabel: string;
    desc: string;
    colorClass: string;
    icon: any;
  }[] = [
    {
      id: 'Completed',
      label: 'Completed',
      banglaLabel: 'সম্পন্ন (Completed)',
      desc: 'Mark tasks 100% complete and record completion metrics',
      colorClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      icon: CheckCircle2,
    },
    {
      id: 'Running',
      label: 'Running',
      banglaLabel: 'চলমান (Running)',
      desc: 'Set tasks active in current agent execution pipeline',
      colorClass: 'text-[#FF204E] border-[#FF204E]/30 bg-[#FF204E]/10',
      icon: Play,
    },
    {
      id: 'Waiting for Approval',
      label: 'Waiting for Approval',
      banglaLabel: 'অনুমোদনের অপেক্ষায় (Approval)',
      desc: 'Halt consequential actions until human gatekeeper consent',
      colorClass: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      icon: ShieldAlert,
    },
    {
      id: 'Planning',
      label: 'Planning',
      banglaLabel: 'পরিকল্পনাধীন (Planning)',
      desc: 'Deep reasoning, goal decomposition and tool selection',
      colorClass: 'text-[#FF758F] border-[#FF758F]/30 bg-[#FF758F]/10',
      icon: Clock,
    },
    {
      id: 'Pending',
      label: 'Pending',
      banglaLabel: 'পেন্ডিং (Pending)',
      desc: 'Queued in roadmap backlog awaiting execution schedule',
      colorClass: 'text-slate-400 border-slate-500/30 bg-slate-500/10',
      icon: AlertCircle,
    },
  ];

  const handleApply = () => {
    onApplyStatus(selectedStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl neumorph-card p-5 sm:p-6 text-xs space-y-4 border border-[#FF204E]/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E50914]/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl neumorph-circle flex items-center justify-center text-emerald-400">
              <RefreshCw className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {isBangla ? 'ব্যাচ স্ট্যাটাস আপডেট' : 'Bulk Set Status'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isBangla
                  ? `${selectedTasks.length}টি টাস্কের স্ট্যাটাস পরিবর্তন করুন`
                  : `Change pipeline status for ${selectedTasks.length} selected tasks`}
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

        {/* Status List Options */}
        <div className="space-y-2 pt-1">
          {STATUS_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedStatus === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedStatus(opt.id)}
                className={`w-full p-3 rounded-xl text-left transition-all cursor-pointer border flex items-center justify-between ${
                  isSelected
                    ? 'bg-white/10 border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                    : 'bg-black/30 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg border ${opt.colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block">
                      {isBangla ? opt.banglaLabel : opt.label}
                    </span>
                    <p className="text-[10px] text-slate-400">
                      {opt.desc}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <div className="h-5 w-5 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
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
                ? `${selectedTasks.length}টি টাস্কে [${selectedStatus}] সেট করুন`
                : `Update ${selectedTasks.length} Tasks to "${selectedStatus}"`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
