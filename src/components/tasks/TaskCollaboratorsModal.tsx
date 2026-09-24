import React, { useState } from 'react';
import {
  X,
  Users,
  UserPlus,
  Mail,
  Shield,
  Edit3,
  Eye,
  UserCheck,
  Check,
  Copy,
  Trash2,
  Sparkles,
  Radio,
  Clock,
  Send,
  AlertCircle,
} from 'lucide-react';
import { TaskItem, TaskCollaborator, CollaboratorRole, CollaboratorPresence } from '../../types';
import { useAgent } from '../../context/AgentContext';

interface TaskCollaboratorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskItem | null;
}

const SUGGESTED_TEAMMATES = [
  { name: 'Sarah Rahman', email: 'sarah.seo@agency.dev', role: 'Editor' as CollaboratorRole, dept: 'SEO & Performance' },
  { name: 'Alex Chen', email: 'alex.chen@cloudstack.dev', role: 'Assignee' as CollaboratorRole, dept: 'Backend Architecture' },
  { name: 'Maria Santos', email: 'maria.backend@node.org', role: 'Editor' as CollaboratorRole, dept: 'DevOps & Reliability' },
  { name: 'Tanvir Hasan', email: 'tanvir.cx@support.com', role: 'Viewer' as CollaboratorRole, dept: 'Customer Support Lead' },
];

export const TaskCollaboratorsModal: React.FC<TaskCollaboratorsModalProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  const { addCollaboratorToTask, removeCollaboratorFromTask, updateCollaboratorRole, settings } = useAgent();
  const isBangla = settings.language === 'Bangla';

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<CollaboratorRole>('Editor');
  const [inviteName, setInviteName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !task) return null;

  const currentCollaborators: TaskCollaborator[] = task.collaborators || [];

  const handleSendInvite = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inviteEmail.trim()) {
      setFormError(isBangla ? 'অনুগ্রহ করে একটি ইমেইল অ্যাড্রেস লিখুন।' : 'Please enter an email address.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      const res = await addCollaboratorToTask(task.id, inviteEmail.trim(), inviteRole, inviteName.trim() || undefined);
      if (res.success) {
        setInviteEmail('');
        setInviteName('');
        setInviteRole('Editor');
      } else {
        setFormError(res.message || 'Failed to add collaborator.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Error adding collaborator.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAddSuggested = async (teammate: typeof SUGGESTED_TEAMMATES[0]) => {
    setFormError(null);
    await addCollaboratorToTask(task.id, teammate.email, teammate.role, teammate.name);
  };

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/#task-${task.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getPresenceBadge = (status: CollaboratorPresence) => {
    switch (status) {
      case 'online':
      case 'active':
        return {
          dot: 'bg-emerald-400 ring-2 ring-emerald-500/40',
          badge: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30',
          label: isBangla ? 'অনলাইন / সক্রিয়' : 'Active Now',
        };
      case 'busy':
        return {
          dot: 'bg-amber-400 ring-2 ring-amber-500/40',
          badge: 'bg-amber-950/40 text-amber-300 border-amber-500/30',
          label: isBangla ? 'কাজে ব্যস্ত' : 'Busy',
        };
      case 'offline':
      default:
        return {
          dot: 'bg-slate-500 ring-2 ring-slate-600/20',
          badge: 'bg-slate-900 text-slate-400 border-slate-700/40',
          label: isBangla ? 'অফলাইন' : 'Offline',
        };
    }
  };

  const getRoleIcon = (role: CollaboratorRole) => {
    switch (role) {
      case 'Owner':
        return <Shield className="h-3.5 w-3.5 text-amber-400" />;
      case 'Editor':
        return <Edit3 className="h-3.5 w-3.5 text-cyan-400" />;
      case 'Assignee':
        return <UserCheck className="h-3.5 w-3.5 text-emerald-400" />;
      case 'Viewer':
      default:
        return <Eye className="h-3.5 w-3.5 text-slate-400" />;
    }
  };

  const onlineCount = currentCollaborators.filter(
    (c) => c.status === 'online' || c.status === 'active'
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl rounded-2xl neumorph-card p-5 sm:p-6 text-xs text-[#F8FAFC] space-y-5 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E50914]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl neumorph-circle flex items-center justify-center text-[#FF204E] shrink-0">
              <Users className="h-5 w-5 text-[#FF204E]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{isBangla ? 'টাস্ক সহযোগী ও টিম ইনভাইট' : 'Task Collaborators & Team Invites'}</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#FF204E]/20 text-[#FF204E] border border-[#FF204E]/30">
                  {currentCollaborators.length} {isBangla ? 'জন সদস্য' : 'members'}
                </span>
              </div>
              <p className="mt-0.5 text-slate-400 text-[11px] line-clamp-1">
                {task.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Presence Status Bar */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300">
              {isBangla
                ? `রিয়েল-টাইম স্ট্যাটাস: ${onlineCount} জন অনলাইনে সংযুক্ত`
                : `Real-time Presence: ${onlineCount} collaborator${onlineCount === 1 ? '' : 's'} online`}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyShareLink}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
            title="Copy shareable task link"
          >
            {copiedLink ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">{isBangla ? 'কপি হয়েছে' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-slate-400" />
                <span>{isBangla ? 'টাস্ক লিংক কপি' : 'Copy Link'}</span>
              </>
            )}
          </button>
        </div>

        {/* Invite Form */}
        <form onSubmit={handleSendInvite} className="p-4 rounded-xl neumorph-inset space-y-3 border border-white/5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-[#FF204E]" />
              <span>{isBangla ? 'টিম ইনভাইট পাঠান (ইমেইল)' : 'Invite Team Member by Email'}</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              Real-time collaboration
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div className="sm:col-span-7">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="colleague@company.com"
                  className="w-full rounded-xl bg-black/50 border border-white/10 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF204E]"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as CollaboratorRole)}
                className="w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#FF204E] cursor-pointer"
              >
                <option value="Editor">Editor (Full edit)</option>
                <option value="Assignee">Assignee (Lead)</option>
                <option value="Viewer">Viewer (Read-only)</option>
                <option value="Owner">Co-Owner</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting || !inviteEmail.trim()}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl neumorph-btn-primary py-2 text-xs font-bold text-white disabled:opacity-40 cursor-pointer shadow-md"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isBangla ? 'যুক্ত' : 'Invite'}</span>
              </button>
            </div>
          </div>

          {formError && (
            <div className="flex items-center gap-1.5 text-rose-400 text-[11px] pt-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Quick Add Suggested Teammates */}
          <div className="pt-2 border-t border-white/5 space-y-1.5">
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>{isBangla ? 'প্রস্তাবিত টিম মেম্বারদের দ্রুত যুক্ত করুন:' : 'Suggested Teammates:'}</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TEAMMATES.map((tm) => {
                const isAlreadyAdded = currentCollaborators.some(
                  (c) => c.email.toLowerCase() === tm.email.toLowerCase()
                );
                return (
                  <button
                    key={tm.email}
                    type="button"
                    disabled={isAlreadyAdded}
                    onClick={() => handleQuickAddSuggested(tm)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
                      isAlreadyAdded
                        ? 'bg-emerald-950/20 text-emerald-400/60 border border-emerald-500/20 cursor-default'
                        : 'bg-white/[0.04] hover:bg-[#FF204E]/15 text-slate-300 hover:text-white border border-white/10 hover:border-[#FF204E]/40'
                    }`}
                  >
                    <span>{tm.name}</span>
                    <span className="text-[9px] text-slate-400">({tm.role})</span>
                    {isAlreadyAdded ? (
                      <Check className="h-2.5 w-2.5 text-emerald-400" />
                    ) : (
                      <UserPlus className="h-2.5 w-2.5 text-[#FF204E]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* Current Collaborators List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-semibold text-slate-300 text-xs">
            <span>{isBangla ? 'যুক্ত থাকা সহযোগীগণ' : 'Active Collaborators'}</span>
            <span className="text-[11px] font-mono text-slate-400 font-normal">
              {currentCollaborators.length} {currentCollaborators.length === 1 ? 'member' : 'members'}
            </span>
          </div>

          {currentCollaborators.length === 0 ? (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center text-slate-500 text-xs">
              {isBangla
                ? 'এখনও কোনো সহযোগী যুক্ত করা হয়নি। উপরের ইমেইল ফর্মের মাধ্যমে টিম মেম্বারদের ইনভাইট করুন।'
                : 'No collaborators added to this task yet. Use the invite form above to add team members.'}
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {currentCollaborators.map((collab) => {
                const presence = getPresenceBadge(collab.status);

                return (
                  <div
                    key={collab.id || collab.email}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/5 hover:border-white/15 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Avatar with Presence Indicator */}
                      <div className="relative shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#FF204E] to-purple-800 flex items-center justify-center font-bold text-white text-xs font-mono border border-black shadow">
                          {collab.name ? collab.name.slice(0, 2).toUpperCase() : collab.email.slice(0, 2).toUpperCase()}
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-black ${presence.dot}`}
                        />
                      </div>

                      {/* Name, Email and Activity */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white truncate text-xs">
                            {collab.name || collab.email}
                          </span>
                          {collab.isCurrentUser && (
                            <span className="px-1.5 py-0.2 rounded bg-[#FF204E]/20 text-[#FF204E] text-[9px] font-mono">
                              You
                            </span>
                          )}
                          <span
                            className={`px-1.5 py-0.2 rounded border text-[9px] font-mono ${presence.badge}`}
                          >
                            {presence.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono truncate mt-0.5">
                          <span>{collab.email}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5 text-slate-500" />
                            <span>{collab.lastActive || 'Active recently'}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Role selector and Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <select
                        value={collab.role}
                        onChange={(e) =>
                          updateCollaboratorRole(task.id, collab.id, e.target.value as CollaboratorRole)
                        }
                        className="rounded-lg bg-black/60 border border-white/10 px-2 py-1 text-[11px] font-mono text-slate-200 focus:outline-none focus:border-[#FF204E] cursor-pointer"
                      >
                        <option value="Owner">Owner</option>
                        <option value="Assignee">Assignee</option>
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                      </select>

                      {!collab.isCurrentUser && (
                        <button
                          type="button"
                          onClick={() => removeCollaboratorFromTask(task.id, collab.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Remove collaborator"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-white/10 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl neumorph-btn-secondary text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
          >
            {isBangla ? 'বন্ধ করুন' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
