import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  X,
  Play,
  Sparkles,
  Trash2,
  Globe,
  ExternalLink,
  Loader2,
  Compass,
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';
import { TaskItem, TaskPriority, TaskStatus } from '../../types';

export const TasksView: React.FC = () => {
  const {
    tasks,
    createTask,
    gatherWebInfoForTask,
    selectedTask,
    setSelectedTask,
    handleSendMessage,
    setActiveView,
    settings,
    currentLanguage,
    t,
    deleteTaskWithSync,
  } = useAgent();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('Medium');
  const [gatherWebInfoForNewTask, setGatherWebInfoForNewTask] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isGatheringWebId, setIsGatheringWebId] = useState<string | null>(null);

  const handleDeleteTask = (taskId: string) => {
    deleteTaskWithSync(taskId);
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
    setConfirmDeleteId(null);
  };

  const handleGatherWebForTask = async (taskId: string) => {
    setIsGatheringWebId(taskId);
    try {
      await gatherWebInfoForTask(taskId);
    } finally {
      setIsGatheringWebId(null);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const task = createTask(newTitle.trim(), newDesc.trim(), newPriority, gatherWebInfoForNewTask);
    setIsCreateOpen(false);
    setNewTitle('');
    setNewDesc('');
    setSelectedTask(task);
  };

  const handleExecuteInChat = (task: TaskItem) => {
    setActiveView('chat');
    handleSendMessage(`Execute task: "${task.title}". Description: ${task.description}`);
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'Urgent':
        return 'neumorph-badge text-[#FF204E] font-bold border-[#FF204E]/50 shadow-[0_0_10px_rgba(255,32,78,0.3)]';
      case 'High':
        return 'neumorph-badge text-[#FF204E] font-semibold';
      case 'Medium':
        return 'neumorph-badge text-[#FF758F]';
      case 'Low':
        return 'neumorph-badge text-slate-400';
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'Completed':
        return 'neumorph-badge text-emerald-400';
      case 'Running':
        return 'neumorph-badge text-[#FF204E] animate-pulse';
      case 'Waiting for Approval':
        return 'neumorph-badge text-amber-400 animate-pulse';
      case 'Planning':
        return 'neumorph-badge text-[#FF758F]';
      case 'Failed':
        return 'neumorph-badge text-rose-500 font-bold';
      case 'Cancelled':
        return 'neumorph-badge text-slate-500';
      default:
        return 'neumorph-badge text-slate-400';
    }
  };

  return (
    <div id="tasks_view" className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full text-[#F8FAFC] bg-[#080204]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E50914]/20 pb-4 sm:pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#F8FAFC] flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl neumorph-circle flex items-center justify-center text-[#FF204E]">
              <CheckSquare className="h-5 w-5 text-[#FF204E]" />
            </div>
            <span>{currentLanguage.labels.tasksTitle}</span>
          </h1>
          <p className="mt-1 text-xs text-[#94A3B8]">
            {t.tasksSubheader}
          </p>
        </div>

        <button
          id="btn_create_task_modal"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl neumorph-btn-primary px-4 py-2.5 text-xs font-bold shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{t.createTask}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchTasksPlaceholder}
            className="w-full rounded-xl neumorph-inset pl-10 pr-4 py-2.5 text-xs text-[#F8FAFC] placeholder:text-[#94A3B8]/60 focus:outline-none"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {['All', 'Running', 'Waiting for Approval', 'Completed', 'Planning'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl px-3 py-1.5 font-medium transition-all shrink-0 cursor-pointer ${
                statusFilter === status
                  ? 'neumorph-btn-primary text-white font-bold'
                  : 'neumorph-btn-secondary text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {status === 'All' ? t.allTasksFilter : status}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            id={`task_card_${task.id}`}
            className="group flex flex-col justify-between rounded-2xl neumorph-card p-4 sm:p-5 transition-all"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`px-2.5 py-0.5 text-[10px] font-mono rounded-lg ${getStatusBadge(task.status)}`}>
                  {task.status}
                </span>
                <span className={`px-2.5 py-0.5 text-[10px] font-mono rounded-lg ${getPriorityBadge(task.priority)}`}>
                  {task.priority}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#FF204E] transition-colors mt-2">
                {task.title}
              </h3>
              <p className="mt-1 text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                {task.description}
              </p>

              {/* Required Tools */}
              {task.requiredTools && task.requiredTools.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {task.requiredTools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg neumorph-inset px-2 py-0.5 text-[10px] text-[#FF204E] font-mono"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              )}

              {/* Web Intelligence Gathered Badge on Task Card */}
              {task.groundingMetadata && (
                <div className="mt-2.5 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-400">
                    <Globe className="h-3 w-3 animate-pulse" />
                    <span>{settings.language === 'Bangla' ? 'ওয়েব তথ্য সংযুক্ত' : 'Web Intel Gathered'}</span>
                    {task.groundingMetadata.sources && (
                      <span className="opacity-75">({task.groundingMetadata.sources.length})</span>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Footer with Progress & Execution CTA */}
            <div className="mt-4 pt-3 border-t border-[#E50914]/20 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                <span className="font-mono">{task.createdTime}</span>
                <span className="font-mono font-semibold text-[#FF204E]">{task.progress}%</span>
              </div>

              <div className="h-2 w-full rounded-full neumorph-inset overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#990000] to-[#FF204E] shadow-[0_0_8px_rgba(255,32,78,0.5)]"
                  style={{ width: `${task.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedTask(task)}
                    className="text-xs text-[#94A3B8] hover:text-[#FF204E] underline underline-offset-4 cursor-pointer transition-colors"
                  >
                    View Details
                  </button>

                  {confirmDeleteId === task.id ? (
                    <div className="flex items-center gap-1 rounded-lg neumorph-card p-1 animate-fadeIn">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task.id);
                        }}
                        className="rounded-lg neumorph-btn-primary px-2 py-0.5 text-[10px] font-bold text-white cursor-pointer"
                        title="Confirm Delete"
                      >
                        Delete
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(null);
                        }}
                        className="rounded p-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Cancel"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      id={`btn_delete_task_${task.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteId(task.id);
                      }}
                      className="p-1.5 rounded-lg neumorph-circle text-[#FF204E] hover:text-white transition-colors cursor-pointer"
                      title={settings.language === 'Bangla' ? 'কাজ ডিলিট করুন' : 'Delete Task'}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleExecuteInChat(task)}
                  className="flex items-center gap-1 rounded-xl neumorph-btn-primary px-3 py-1.5 text-xs font-semibold cursor-pointer"
                >
                  <Play className="h-3 w-3" />
                  <span>Execute in Chat</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Task Details Modal Drawer */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-2xl neumorph-card p-6 text-xs space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E50914]/20 pb-3">
              <div>
                <span className="font-mono text-[10px] text-[#94A3B8] uppercase neumorph-badge px-2 py-0.5 rounded-md">
                  Task ID: {selectedTask.id}
                </span>
                <h2 className="text-base font-bold text-[#F8FAFC] mt-2">
                  {selectedTask.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="h-8 w-8 rounded-xl neumorph-circle flex items-center justify-center text-[#94A3B8] hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[#94A3B8] font-semibold uppercase text-[10px] tracking-wider block">
                  Description
                </span>
                <p className="text-[#F8FAFC] mt-1 text-xs leading-relaxed neumorph-inset p-3 rounded-xl">
                  {selectedTask.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 neumorph-inset p-3 rounded-xl">
                <div>
                  <span className="text-[#94A3B8] text-[10px] uppercase">Status</span>
                  <p className="font-bold text-[#FF204E] mt-0.5">{selectedTask.status}</p>
                </div>
                <div>
                  <span className="text-[#94A3B8] text-[10px] uppercase">Priority</span>
                  <p className="font-bold text-[#F8FAFC] mt-0.5">{selectedTask.priority}</p>
                </div>
              </div>

              {selectedTask.result && (
                <div>
                  <span className="text-[#94A3B8] font-semibold uppercase text-[10px] tracking-wider block">
                    {t.verifiedOutcome}
                  </span>
                  <div className="mt-1 rounded-xl neumorph-inset p-3 font-mono text-[11px] text-[#FF204E] leading-relaxed">
                    {selectedTask.result}
                  </div>
                </div>
              )}

              {selectedTask.planSteps && selectedTask.planSteps.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#94A3B8] font-semibold uppercase text-[10px] tracking-wider block">
                      {t.taskExecutionStages}
                    </span>
                    <button
                      onClick={() => handleGatherWebForTask(selectedTask.id)}
                      disabled={isGatheringWebId === selectedTask.id}
                      className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 font-medium px-2 py-0.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isGatheringWebId === selectedTask.id ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin text-sky-400" />
                          <span>{settings.language === 'Bangla' ? 'ওয়েব তথ্য সংগ্রহ হচ্ছে...' : 'Gathering web info...'}</span>
                        </>
                      ) : (
                        <>
                          <Globe className="h-3 w-3 text-sky-400" />
                          <span>{settings.language === 'Bangla' ? '🌐 প্ল্যানের জন্য লাইভ ওয়েব তথ্য খুঁজুন' : '🌐 Gather Web Intel for Plan'}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="space-y-1.5 neumorph-inset p-3 rounded-xl">
                    {selectedTask.planSteps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[#F8FAFC]">
                        <span className="h-2 w-2 rounded-full bg-[#FF204E] shadow-[0_0_6px_rgba(255,32,78,0.8)]"></span>
                        <span>{step.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gathered Web Intelligence for Task Plan */}
              {selectedTask.groundingMetadata && (
                <div className="rounded-xl border border-sky-500/25 bg-sky-950/20 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
                      {settings.language === 'Bangla' ? '🌐 সংগৃহীত লাইভ ওয়েব তথ্য ও সোর্সসমূহ' : '🌐 Gathered Web Intelligence & Sources'}
                    </span>
                    <span className="text-[10px] font-mono text-sky-400/80 bg-sky-500/15 px-2 py-0.5 rounded border border-sky-500/30">
                      Google Search Grounding
                    </span>
                  </div>

                  {selectedTask.groundingMetadata.searchQueries && selectedTask.groundingMetadata.searchQueries.length > 0 && (
                    <div>
                      <span className="text-[10px] text-sky-400/80 font-mono block mb-1">
                        {settings.language === 'Bangla' ? 'অনুসন্ধানকৃত কুয়েরি:' : 'Executed Queries:'}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {selectedTask.groundingMetadata.searchQueries.map((q, qIdx) => (
                          <span key={qIdx} className="px-2 py-0.5 rounded bg-sky-900/40 border border-sky-500/30 text-sky-200 text-[10px] font-mono">
                            "{q}"
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTask.groundingMetadata.sources && selectedTask.groundingMetadata.sources.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] text-sky-400/80 font-mono block mb-1">
                        {settings.language === 'Bangla' ? 'রেফারেন্স লিঙ্কসমূহ:' : 'Retrieved Sources:'}
                      </span>
                      <div className="grid grid-cols-1 gap-1">
                        {selectedTask.groundingMetadata.sources.map((src, sIdx) => (
                          <a
                            key={sIdx}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-2 px-2 py-1 rounded bg-white/[0.03] hover:bg-sky-500/15 border border-white/10 hover:border-sky-400/40 text-slate-200 transition-all group"
                          >
                            <span className="truncate text-[10px] group-hover:text-sky-300">
                              {src.title || src.domain}
                            </span>
                            <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-sky-300 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E50914]/20">
              <button
                onClick={() => handleDeleteTask(selectedTask.id)}
                className="flex items-center gap-1.5 rounded-xl neumorph-btn-secondary text-rose-400 px-3 py-2 text-xs font-semibold cursor-pointer"
                title="Delete this task"
              >
                <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                <span>{settings.language === 'Bangla' ? 'টাস্ক ডিলিট করুন' : 'Delete Task'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="rounded-xl neumorph-btn-secondary px-4 py-2 text-[#94A3B8] hover:text-white cursor-pointer"
                >
                  {t.closeModal}
                </button>
                <button
                  onClick={() => {
                    handleExecuteInChat(selectedTask);
                    setSelectedTask(null);
                  }}
                  className="flex items-center gap-1.5 rounded-xl neumorph-btn-primary px-4 py-2 text-xs font-bold text-white cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{t.runWithAgent}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl neumorph-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E50914]/20 pb-3 mb-4">
              <h2 className="text-base font-bold text-[#F8FAFC]">{t.createTask}</h2>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="h-8 w-8 rounded-xl neumorph-circle flex items-center justify-center text-[#94A3B8] hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#94A3B8] font-medium mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Audit checkout flow and fix error states"
                  className="w-full rounded-xl neumorph-inset px-3.5 py-2.5 text-[#F8FAFC] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] font-medium mb-1">
                  Objective & Details
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe requirements, targeted files, and expected output..."
                  className="w-full rounded-xl neumorph-inset p-3 text-[#F8FAFC] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] font-medium mb-1">
                  Priority
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                  className="w-full rounded-xl neumorph-inset px-3 py-2.5 text-[#F8FAFC] focus:outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E50914]/20">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl neumorph-btn-secondary px-4 py-2 text-[#94A3B8] hover:text-white cursor-pointer"
                >
                  {t.closeModal}
                </button>
                <button
                  type="submit"
                  className="rounded-xl neumorph-btn-primary px-4 py-2 font-bold text-white cursor-pointer"
                >
                  {t.createTask}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
