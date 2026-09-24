import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  Globe,
  Wrench,
  ShieldAlert,
  Info,
  X,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';
import { sound } from '../../services/sound';

export const NotificationToast: React.FC = () => {
  const {
    activeNotificationToast,
    setActiveNotificationToast,
    deleteNotification,
    setIsNotificationCenterOpen,
    setSelectedTask,
    tasks,
    setActiveView,
  } = useAgent();

  if (!activeNotificationToast) return null;

  const notif = activeNotificationToast;

  const getIcon = () => {
    switch (notif.type) {
      case 'task_started':
        return <Sparkles className="h-4 w-4 text-[#FF204E] animate-spin" />;
      case 'task_completed':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case 'web_gathering':
        return <Globe className="h-4 w-4 text-cyan-400" />;
      case 'tool_executed':
        return <Wrench className="h-4 w-4 text-amber-400" />;
      case 'approval_required':
        return <ShieldAlert className="h-4 w-4 text-red-500 animate-pulse" />;
      case 'system':
      default:
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const getBorderColor = () => {
    switch (notif.type) {
      case 'task_started':
        return 'border-[#FF204E]/50 shadow-[0_0_20px_rgba(255,32,78,0.3)]';
      case 'task_completed':
        return 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]';
      case 'web_gathering':
        return 'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]';
      case 'approval_required':
        return 'border-red-500/60 shadow-[0_0_25px_rgba(239,68,68,0.4)]';
      default:
        return 'border-[#E50914]/40 shadow-2xl';
    }
  };

  const handleClickToast = () => {
    if (notif.taskId) {
      const task = tasks.find((t) => t.id === notif.taskId);
      if (task) {
        setSelectedTask(task);
        setActiveView('tasks');
      }
    }
    setIsNotificationCenterOpen(true);
    setActiveNotificationToast(null);
    sound.play('click');
  };

  return (
    <div className="fixed top-20 right-6 z-[120] max-w-sm w-full animate-slideInRight">
      <div
        onClick={handleClickToast}
        className={`relative flex items-start gap-3 p-4 rounded-2xl bg-zinc-950/95 backdrop-blur-xl border ${getBorderColor()} text-xs cursor-pointer group transition-all hover:scale-[1.02]`}
      >
        <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0 pr-8">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-bold text-[#FF204E] uppercase tracking-wider">
              {notif.type.replace('_', ' ')}
            </span>
            <span className="text-[10px] text-zinc-500">• Just now</span>
          </div>
          <h4 className="font-bold text-white truncate">{notif.title}</h4>
          <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">{notif.message}</p>
        </div>

        {/* Delete button on toast */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              deleteNotification(notif.id);
              setActiveNotificationToast(null);
              sound.play('delete');
            }}
            className="h-6 w-6 rounded-md bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer"
            title="Delete notification"
          >
            <Trash2 className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveNotificationToast(null);
            }}
            className="h-6 w-6 rounded-md bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            title="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
