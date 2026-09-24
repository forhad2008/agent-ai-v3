import React, { useState, useMemo } from 'react';
import {
  Bell,
  X,
  Trash2,
  CheckCircle2,
  Globe,
  Wrench,
  ShieldAlert,
  Info,
  ExternalLink,
  CheckCheck,
  Search,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';
import { AgentNotification, NotificationType } from '../../types';
import { sound } from '../../services/sound';

export const NotificationCenterModal: React.FC = () => {
  const {
    notifications,
    unreadNotificationCount,
    deleteNotification,
    deleteNotificationsByType,
    clearAllNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    isNotificationCenterOpen,
    setIsNotificationCenterOpen,
    setActiveView,
    setSelectedTask,
    tasks,
  } = useAgent();

  const [activeTab, setActiveTab] = useState<'all' | NotificationType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotifDetail, setSelectedNotifDetail] = useState<AgentNotification | null>(null);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      const matchType = activeTab === 'all' || notif.type === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        notif.title.toLowerCase().includes(q) ||
        notif.message.toLowerCase().includes(q) ||
        (notif.taskTitle && notif.taskTitle.toLowerCase().includes(q)) ||
        (notif.toolName && notif.toolName.toLowerCase().includes(q));
      return matchType && matchQuery;
    });
  }, [notifications, activeTab, searchQuery]);

  if (!isNotificationCenterOpen) return null;

  const getNotifIcon = (type: NotificationType) => {
    switch (type) {
      case 'task_started':
        return <Sparkles className="h-4 w-4 text-[#FF204E]" />;
      case 'task_completed':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case 'web_gathering':
        return <Globe className="h-4 w-4 text-cyan-400" />;
      case 'tool_executed':
        return <Wrench className="h-4 w-4 text-amber-400" />;
      case 'approval_required':
        return <ShieldAlert className="h-4 w-4 text-red-500" />;
      case 'system':
      default:
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const getBadgeStyle = (type: NotificationType) => {
    switch (type) {
      case 'task_started':
        return 'bg-[#FF204E]/15 text-[#FF204E] border-[#FF204E]/30';
      case 'task_completed':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'web_gathering':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'tool_executed':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'approval_required':
        return 'bg-red-600/20 text-red-400 border-red-500/40 animate-pulse';
      case 'system':
      default:
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
    }
  };

  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case 'task_started':
        return 'Real Working';
      case 'task_completed':
        return 'Task Completed';
      case 'web_gathering':
        return 'Web Intel Harvested';
      case 'tool_executed':
        return 'Tool Executed';
      case 'approval_required':
        return 'Action Required';
      case 'system':
      default:
        return 'System Notification';
    }
  };

  const handleOpenTask = (taskId?: string) => {
    if (!taskId) return;
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
    }
    setActiveView('tasks');
    setIsNotificationCenterOpen(false);
    sound.play('click');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-4xl h-[85vh] flex flex-col rounded-3xl neumorph-card border border-[#E50914]/30 shadow-2xl overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E50914]/20 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#FF204E]/20 border border-[#FF204E]/40 flex items-center justify-center text-[#FF204E] shadow-[0_0_15px_rgba(255,32,78,0.3)]">
              <Bell className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">Agent Notification Hub</h2>
                {unreadNotificationCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FF204E] text-white shadow-[0_0_10px_rgba(255,32,78,0.6)]">
                    {unreadNotificationCount} Unread
                  </span>
                )}
              </div>
              <p className="text-xs text-[#94A3B8]">
                Real-time stream of agent working states, web intelligence gathering, and completed tasks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    markAllNotificationsAsRead();
                    sound.play('click');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Mark All Read</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Delete all notifications? This action cannot be undone.')) {
                      clearAllNotifications();
                      sound.play('delete');
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600/30 border border-red-500/30 transition-all cursor-pointer"
                  title="Delete all notifications"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Clear All</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                setIsNotificationCenterOpen(false);
                sound.play('click');
              }}
              className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/15 text-[#94A3B8] hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 border-b border-[#E50914]/15 bg-black/20">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All', count: notifications.length },
              { id: 'task_started', label: 'Working', count: notifications.filter((n) => n.type === 'task_started').length },
              { id: 'task_completed', label: 'Completed', count: notifications.filter((n) => n.type === 'task_completed').length },
              { id: 'web_gathering', label: 'Web Intel', count: notifications.filter((n) => n.type === 'web_gathering').length },
              { id: 'approval_required', label: 'Actions', count: notifications.filter((n) => n.type === 'approval_required').length },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  sound.play('click');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#FF204E] text-white shadow-[0_0_12px_rgba(255,32,78,0.5)]'
                    : 'bg-white/5 text-[#94A3B8] hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-black/30 text-white' : 'bg-white/10 text-[#94A3B8]'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#FF204E]/60 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications List / Detail Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Main List */}
          <div className={`space-y-3 ${selectedNotifDetail ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-16 w-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8] mb-4">
                  <Bell className="h-8 w-8 opacity-40" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">No Notifications Found</h3>
                <p className="text-xs text-[#94A3B8] max-w-sm">
                  {searchQuery
                    ? `No notifications matched "${searchQuery}". Try a different filter.`
                    : 'The agent will notify you here in real-time as tasks start, web intelligence is gathered, and work finishes.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const isSelected = selectedNotifDetail?.id === notif.id;
                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      setSelectedNotifDetail(notif);
                      markNotificationAsRead(notif.id);
                    }}
                    className={`group relative flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF204E]/10 border-[#FF204E]/60 shadow-[0_0_20px_rgba(255,32,78,0.2)]'
                        : notif.read
                        ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/15'
                        : 'bg-gradient-to-r from-[#FF204E]/10 to-transparent border-[#FF204E]/30 hover:border-[#FF204E]/50'
                    }`}
                  >
                    {/* Unread Indicator Dot */}
                    {!notif.read && (
                      <span className="absolute top-4 left-2 h-2 w-2 rounded-full bg-[#FF204E] animate-pulse" />
                    )}

                    {/* Icon Box */}
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${getBadgeStyle(notif.type)}`}>
                      {getNotifIcon(notif.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-16">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle(notif.type)}`}>
                          {getTypeLabel(notif.type)}
                        </span>
                        <span className="text-[11px] text-[#94A3B8]">{notif.timestamp}</span>
                        {notif.taskTitle && (
                          <span className="text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded-md truncate max-w-[200px]">
                            Task: {notif.taskTitle}
                          </span>
                        )}
                      </div>

                      <h4 className={`text-sm font-bold truncate ${notif.read ? 'text-zinc-200' : 'text-white'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-xs text-[#94A3B8] line-clamp-2 mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>

                      {/* Web Sources Mini Badge */}
                      {notif.webSources && notif.webSources.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[10px] font-semibold text-cyan-300 flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {notif.webSources.length} Verified Web Sources Attached
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action & Deleting System Controls */}
                    <div className="absolute right-4 top-4 flex items-center gap-1.5">
                      {/* Delete Single Notification Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                          if (selectedNotifDetail?.id === notif.id) {
                            setSelectedNotifDetail(null);
                          }
                          sound.play('delete');
                        }}
                        className="h-8 w-8 rounded-lg bg-white/5 hover:bg-red-500/20 text-[#94A3B8] hover:text-red-400 flex items-center justify-center transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                        title="Delete notification"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Detail Panel (When an item is selected) */}
          {selectedNotifDetail && (
            <div className="lg:col-span-5 flex flex-col h-full rounded-2xl bg-black/40 border border-[#E50914]/25 p-5 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center border ${getBadgeStyle(selectedNotifDetail.type)}`}>
                    {getNotifIcon(selectedNotifDetail.type)}
                  </div>
                  <span className="text-xs font-bold text-white">Notification Inspector</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      deleteNotification(selectedNotifDetail.id);
                      setSelectedNotifDetail(null);
                      sound.play('delete');
                    }}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                    title="Delete this notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedNotifDetail(null)}
                    className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle(selectedNotifDetail.type)}`}>
                    {getTypeLabel(selectedNotifDetail.type)}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2 leading-snug">
                    {selectedNotifDetail.title}
                  </h3>
                  <span className="text-[11px] text-[#94A3B8] block mt-1">
                    Received: {selectedNotifDetail.timestamp} • {selectedNotifDetail.isoTime ? new Date(selectedNotifDetail.isoTime).toLocaleString() : 'Recent'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-zinc-300 leading-relaxed">
                  {selectedNotifDetail.message}
                </div>

                {selectedNotifDetail.resultSummary && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                    <span className="text-[11px] font-bold text-emerald-400 block mb-1">Delivered Outcome:</span>
                    <p className="text-xs text-zinc-300">{selectedNotifDetail.resultSummary}</p>
                  </div>
                )}

                {/* Web Sources Gathered */}
                {selectedNotifDetail.webSources && selectedNotifDetail.webSources.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" />
                      Live Web Intelligence Sources:
                    </span>
                    <div className="space-y-1.5">
                      {selectedNotifDetail.webSources.map((src, i) => (
                        <a
                          key={i}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.08] border border-white/5 hover:border-cyan-500/40 text-xs text-zinc-200 transition-all group"
                        >
                          <span className="truncate pr-2">{src.title}</span>
                          <ExternalLink className="h-3.5 w-3.5 text-cyan-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Connected Task Quick Link */}
                {selectedNotifDetail.taskId && (
                  <button
                    type="button"
                    onClick={() => handleOpenTask(selectedNotifDetail.taskId)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FF204E]/15 hover:bg-[#FF204E]/25 border border-[#FF204E]/40 text-xs font-bold text-white transition-all cursor-pointer shadow-[0_0_15px_rgba(255,32,78,0.2)]"
                  >
                    <span>View Task in Pipeline</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3 border-t border-[#E50914]/20 bg-black/40 flex items-center justify-between text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Agent-sigma08 Live Notification Dispatcher Active</span>
          </div>
          <span>Total: {notifications.length} notifications stored</span>
        </div>

      </div>
    </div>
  );
};
