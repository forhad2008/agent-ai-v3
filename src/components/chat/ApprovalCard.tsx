import React, { useState } from 'react';
import { ShieldAlert, Check, X, Edit3, RotateCw, AlertTriangle, Send } from 'lucide-react';
import { ApprovalRequest } from '../../types';
import { useAgent } from '../../context/AgentContext';

interface ApprovalCardProps {
  approval: ApprovalRequest;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({ approval }) => {
  const { approveAction, rejectAction, handleSendMessage, settings, t } = useAgent();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPreview, setEditedPreview] = useState(approval.preview || approval.details);

  const isPending = approval.status === 'pending';
  const isApproved = approval.status === 'approved';
  const isRejected = approval.status === 'rejected';

  const handleApprove = () => {
    approveAction(approval.id);
  };

  const handleReject = () => {
    rejectAction(approval.id);
  };

  const handleRegenerate = () => {
    handleSendMessage(`Please regenerate the draft for: "${approval.action}" with a slightly different professional tone.`);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    approval.preview = editedPreview;
  };

  return (
    <div
      id={`approval_card_${approval.id}`}
      className="my-4 overflow-hidden rounded-2xl neumorph-card"
    >
      {/* Header Banner */}
      <div
        className={`flex items-center justify-between border-b px-4 py-3 ${
          isApproved
            ? 'bg-[#E50914]/15 border-[#FF204E]/30'
            : isRejected
            ? 'bg-rose-950/40 border-rose-500/30'
            : 'bg-[#140307]/70 border-[#E50914]/20'
        }`}
      >
        <div className="flex items-center gap-2">
          {isApproved ? (
            <Check className="h-4 w-4 text-[#FF204E]" />
          ) : isRejected ? (
            <X className="h-4 w-4 text-rose-400" />
          ) : (
            <ShieldAlert className="h-4 w-4 text-[#FF204E] animate-pulse" />
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
            {isApproved
              ? t.actionApprovedExecuted
              : isRejected
              ? t.actionDeniedCancelled
              : t.approvalRequired}
          </span>
        </div>

        <div className="flex items-center gap-1.5 rounded-full neumorph-badge px-3 py-1 text-[10px] font-mono">
          <AlertTriangle className="h-3 w-3 text-[#FF204E]" />
          <span className="text-[#FF204E] font-semibold">{approval.riskLevel}</span>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-4 sm:p-5 space-y-3.5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#94A3B8]">
          <div className="rounded-xl neumorph-inset p-3">
            <span className="text-[10px] font-medium text-[#94A3B8] block uppercase tracking-wide">
              {settings.language === 'Bangla' ? 'অ্যাকশন:' : 'Action:'}
            </span>
            <span className="font-semibold text-[#F8FAFC]">{approval.action}</span>
          </div>
          <div className="rounded-xl neumorph-inset p-3">
            <span className="text-[10px] font-medium text-[#94A3B8] block uppercase tracking-wide">
              {settings.language === 'Bangla' ? 'প্রাপক / লক্ষ্য:' : 'Recipient / Target:'}
            </span>
            <span className="font-semibold text-[#F8FAFC]">{approval.recipient}</span>
          </div>
        </div>

        <div className="rounded-xl neumorph-inset p-3">
          <span className="text-[10px] font-medium text-[#94A3B8] block uppercase tracking-wide">
            {settings.language === 'Bangla' ? 'ঝুঁকির কারণ:' : 'Risk Category:'}
          </span>
          <p className="text-[#F8FAFC] mt-0.5">{approval.riskReason}</p>
        </div>

        {/* Message Preview or Editable Text */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium text-[#94A3B8] uppercase tracking-wide">
              {settings.language === 'Bangla' ? 'খসড়া মেসেজ প্রিভিউ:' : 'Message Draft Preview:'}
            </span>
            {isPending && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-[11px] text-[#FF204E] hover:text-[#FF4D4D] cursor-pointer"
              >
                <Edit3 className="h-3 w-3" />
                {settings.language === 'Bangla' ? 'সংশোধন' : 'Edit Draft'}
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editedPreview}
                onChange={(e) => setEditedPreview(e.target.value)}
                rows={4}
                className="w-full rounded-xl neumorph-inset p-3 text-xs text-[#F8FAFC] focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl neumorph-btn-secondary px-3 py-1 text-[11px] text-[#94A3B8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="rounded-xl neumorph-btn-primary px-3 py-1 text-[11px] font-medium cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl neumorph-inset p-3 text-[#F8FAFC] font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
              {editedPreview}
            </div>
          )}
        </div>

        {/* Actions Button Bar */}
        {isPending ? (
          <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-[#E50914]/20">
            <button
              id={`btn_regenerate_${approval.id}`}
              onClick={handleRegenerate}
              className="flex items-center gap-1.5 rounded-xl neumorph-btn-secondary px-3.5 py-2 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>{t.regenerateOption}</span>
            </button>

            <button
              id={`btn_reject_${approval.id}`}
              onClick={handleReject}
              className="flex items-center gap-1.5 rounded-xl neumorph-btn-secondary px-3.5 py-2 text-xs font-semibold text-rose-300 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span>{t.rejectCancel}</span>
            </button>

            <button
              id={`btn_approve_${approval.id}`}
              onClick={handleApprove}
              className="flex items-center gap-1.5 rounded-xl neumorph-btn-primary px-4 py-2 text-xs font-bold cursor-pointer"
            >
              <Check className="h-3.5 w-3.5 stroke-[3]" />
              <span>{t.approveExecute}</span>
            </button>
          </div>
        ) : (
          <div className="pt-2 flex items-center justify-between border-t border-[#E50914]/20 text-[11px] text-[#94A3B8]">
            <span>Logged in audit trail</span>
            <span className="font-mono">{approval.timestamp}</span>
          </div>
        )}
      </div>
    </div>
  );
};
