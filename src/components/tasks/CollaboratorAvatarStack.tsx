import React from 'react';
import { User, UserPlus, Users, Shield, Edit3, Eye, UserCheck } from 'lucide-react';
import { TaskCollaborator, CollaboratorRole, CollaboratorPresence } from '../../types';

interface CollaboratorAvatarStackProps {
  collaborators?: TaskCollaborator[];
  onOpenInviteModal?: (e: React.MouseEvent) => void;
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
  showAddButton?: boolean;
  showSharedBadge?: boolean;
}

export const CollaboratorAvatarStack: React.FC<CollaboratorAvatarStackProps> = ({
  collaborators = [],
  onOpenInviteModal,
  maxVisible = 3,
  size = 'sm',
  showAddButton = true,
  showSharedBadge = true,
}) => {
  const visibleCollabs = collaborators.slice(0, maxVisible);
  const overflowCount = Math.max(0, collaborators.length - maxVisible);

  const getPresenceColor = (status: CollaboratorPresence) => {
    switch (status) {
      case 'online':
      case 'active':
        return 'bg-emerald-400 border-emerald-950 ring-2 ring-emerald-500/40';
      case 'busy':
        return 'bg-amber-400 border-amber-950 ring-2 ring-amber-500/40';
      case 'offline':
      default:
        return 'bg-slate-500 border-slate-900';
    }
  };

  const getRoleIcon = (role: CollaboratorRole) => {
    switch (role) {
      case 'Owner':
        return <Shield className="h-2.5 w-2.5 text-amber-400" />;
      case 'Editor':
        return <Edit3 className="h-2.5 w-2.5 text-cyan-400" />;
      case 'Assignee':
        return <UserCheck className="h-2.5 w-2.5 text-emerald-400" />;
      case 'Viewer':
      default:
        return <Eye className="h-2.5 w-2.5 text-slate-400" />;
    }
  };

  const getInitials = (name: string, email: string) => {
    if (name && name.trim()) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
  };

  const getAvatarGradient = (idx: number) => {
    const gradients = [
      'from-rose-600 to-red-800 text-rose-100',
      'from-purple-600 to-indigo-800 text-purple-100',
      'from-cyan-600 to-blue-800 text-cyan-100',
      'from-emerald-600 to-teal-800 text-emerald-100',
      'from-amber-600 to-orange-800 text-amber-100',
    ];
    return gradients[idx % gradients.length];
  };

  const sizeClasses = {
    sm: {
      avatar: 'h-6 w-6 text-[10px]',
      dot: 'h-2 w-2 -bottom-0.5 -right-0.5',
      badge: 'text-[9px] px-1.5 py-0.5',
      btn: 'h-6 w-6 text-[11px]',
    },
    md: {
      avatar: 'h-7 w-7 text-xs',
      dot: 'h-2.5 w-2.5 -bottom-0.5 -right-0.5',
      badge: 'text-[10px] px-2 py-0.5',
      btn: 'h-7 w-7 text-xs',
    },
    lg: {
      avatar: 'h-9 w-9 text-sm',
      dot: 'h-3 w-3 -bottom-0.5 -right-0.5',
      badge: 'text-xs px-2.5 py-1',
      btn: 'h-9 w-9 text-sm',
    },
  }[size];

  const onlineCount = collaborators.filter((c) => c.status === 'online' || c.status === 'active').length;

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {/* Shared Task Real-Time Presence Badge */}
      {showSharedBadge && collaborators.length > 0 && (
        <span
          className={`inline-flex items-center gap-1 rounded-md font-mono border font-medium ${
            onlineCount > 0
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
              : 'bg-white/[0.03] text-slate-400 border-white/5'
          } ${sizeClasses.badge}`}
          title={`${collaborators.length} collaborator${collaborators.length > 1 ? 's' : ''} (${onlineCount} active now)`}
        >
          {onlineCount > 0 ? (
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
          ) : (
            <Users className="h-3 w-3 text-slate-400" />
          )}
          <span>
            {onlineCount > 0 ? `${onlineCount} active` : `Shared (${collaborators.length})`}
          </span>
        </span>
      )}

      {/* Stacked Avatar List */}
      <div className="flex items-center -space-x-1.5 hover:space-x-0.5 transition-all">
        {visibleCollabs.map((collab, idx) => (
          <div
            key={collab.id || collab.email}
            className="group/avatar relative flex items-center justify-center cursor-pointer transition-transform hover:scale-110 hover:z-20"
            title={`${collab.name} (${collab.email}) • Role: ${collab.role} • Status: ${collab.status.toUpperCase()}`}
            onClick={onOpenInviteModal}
          >
            <div
              className={`rounded-full flex items-center justify-center font-bold font-mono border border-black/60 shadow-md bg-gradient-to-br ${getAvatarGradient(
                idx
              )} ${sizeClasses.avatar}`}
            >
              {getInitials(collab.name, collab.email)}
            </div>

            {/* Real-time Presence Dot */}
            <span
              className={`absolute rounded-full border ${getPresenceColor(collab.status)} ${sizeClasses.dot}`}
            />
          </div>
        ))}

        {/* Overflow Count */}
        {overflowCount > 0 && (
          <div
            onClick={onOpenInviteModal}
            className={`rounded-full flex items-center justify-center font-bold font-mono bg-slate-800 text-slate-300 border border-slate-700/80 shadow-md cursor-pointer hover:bg-slate-700 transition-colors ${sizeClasses.avatar}`}
            title={`+${overflowCount} more collaborators`}
          >
            +{overflowCount}
          </div>
        )}

        {/* Add / Invite Button */}
        {showAddButton && onOpenInviteModal && (
          <button
            type="button"
            onClick={onOpenInviteModal}
            className={`rounded-full flex items-center justify-center bg-white/[0.04] hover:bg-[#FF204E]/20 text-slate-400 hover:text-[#FF204E] border border-dashed border-slate-600 hover:border-[#FF204E]/60 transition-all cursor-pointer ml-1 ${sizeClasses.btn}`}
            title="Invite or manage task collaborators"
          >
            <UserPlus className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};
