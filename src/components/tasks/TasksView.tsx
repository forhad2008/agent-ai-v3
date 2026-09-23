import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  X,
  Play,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';
import { TaskItem, TaskPriority, TaskStatus } from '../../types';

export const TasksView: React.FC = () => {
  const {
    tasks,
    createTask,
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
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDeleteTask = (taskId: string) => {
    deleteTaskWithSync(taskId);
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
    setConfirmDeleteId(null);
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
    const task = createTask(newTitle.trim(), newDesc.trim(), newPriority);
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
        return 'bg-[#990000] text-white border-[#FF204E]';
      case 'High':
        return 'bg-[#E50914]/30 text-[#FF204E] border-[#E50914]/60';
      case 'Medium':
        return 'bg-[#E50914]/20 text-[#FF204E] border-[#E50914]/40';
      case 'Low':
        return 'bg-[#1a050a] text-white/80 border-[#FF204E]/20';
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#E50914]/20 text-[#FF204E] border-[#E50914]/40';
      case 'Running':
        return 'bg-[#FF204E]/20 text-[#FF204E] border-[#FF204E]/50 animate-pulse';
      case 'Waiting for Approval':
        return 'bg-[#990000]/30 text-white border-[#FF204E]/50 animate-pulse';
      case 'Planning':
        return 'bg-[#E50914]/15 text-[#FF204E] border-[#E50914]/30';
      case 'Failed':
        return 'bg-[#990000] text-white border-[#FF204E]';
      case 'Cancelled':
        return 'bg-[#18040a] text-white/50 border-[#E50914]/20';
      default:
        return 'bg-[#0f0306] text-white/70 border-[#E50914]/20';
    }
  };

  return (
    <div id="tasks_view" className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full text-[#F8FAFC] bg-[#080204]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E50914]/25 pb-4 sm:pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#F8FAFC] flex items-center gap-2.5">
            <CheckSquare className="h-6 w-6 text-[#FF204E]" />
            <span>{currentLanguage.labels.tasksTitle}</span>
          </h1>
          <p className="mt-1 text-xs text-[#94A3B8]">
            {t.tasksSubheader}
          </p>
        </div>

        <button
          id="btn_create_task_modal"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#990000] via-[#E50914] to-[#FF204E] hover:brightness-110 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#E50914]/30 transition-all shrink-0 cursor-pointer"
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
            className="w-full rounded-2xl bg-[#0f0306] pl-10 pr-4 py-2.5 text-xs text-[#F8FAFC] placeholder:text-[#94A3B8]/60 border border-[#E50914]/25 focus:border-[#FF204E] focus:outline-none"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {['All', 'Running', 'Waiting for Approval', 'Completed', 'Planning'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl px-3 py-1.5 font-medium transition-colors shrink-0 cursor-pointer ${
                statusFilter === status
                  ? 'bg-[#E50914] text-white border border-[#FF204E] shadow-[0_0_10px_rgba(229,9,20,0.35)]'
                  : 'bg-[#0f0306] text-[#94A3B8] border border-[#E50914]/20 hover:bg-[#E50914]/15 hover:text-[#F8FAFC]'
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
            className="group flex flex-col justify-between rounded-2xl bg-[#0f0306] p-4 sm:p-5 border border-[#E50914]/25 hover:border-[#FF204E]/50 transition-all shadow-[0_0_20px_rgba(229,9,20,0.1)]"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`rounded-lg px-2.5 py-0.5 text-[10px] font-mono font-semibold border ${getStatusBadge(task.status)}`}>
                  {task.status}
                </span>
                <span className={`rounded-lg px-2.5 py-0.5 text-[10px] font-mono font-medium border ${getPriorityBadge(task.priority)}`}>
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
                      className="rounded-lg bg-[#070103] px-2 py-0.5 text-[10px] text-[#FF204E] border border-[#E50914]/20 font-mono"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Progress & Execution CTA */}
            <div className="mt-4 pt-3 border-t border-[#E50914]/15 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                <span className="font-mono">{task.createdTime}</span>
                <span className="font-mono font-semibold text-[#FF204E]">{task.progress}%</span>
              </div>

              <div className="h-1.5 w-full rounded-full bg-[#070103] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-[#E50914]"
                  style={{ width: `${task.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedTask(task)}
                    className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] underline underline-offset-4 cursor-pointer"
                  >
                    View Details
                  </button>

                  {confirmDeleteId === task.id ? (
                    <div className="flex items-center gap-1 rounded-lg bg-[#1a0205] border border-[#FF204E]/50 p-0.5 animate-fadeIn">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task.id);
                        }}
                        className="rounded bg-[#E50914] px-2 py-0.5 text-[10px] font-bold text-white hover:bg-[#FF204E] transition-colors cursor-pointer"
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
                      className="p-1.5 rounded-lg bg-[#E50914]/10 hover:bg-[#E50914]/25 text-[#FF204E] hover:text-white transition-colors cursor-pointer"
                      title={settings.language === 'Bangla' ? 'কাজ ডিলিট করুন' : 'Delete Task'}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleExecuteInChat(task)}
                  className="flex items-center gap-1 rounded-xl bg-[#E50914]/20 px-3 py-1 text-xs font-semibold text-[#FF204E] hover:bg-[#E50914]/35 transition-colors border border-[#FF204E]/40 shadow-sm cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-[#0f0306] p-6 border border-[#E50914]/30 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E50914]/25 pb-3">
              <div>
                <span className="font-mono text-[10px] text-[#94A3B8] uppercase">
                  Task ID: {selectedTask.id}
                </span>
                <h2 className="text-base font-bold text-[#F8FAFC] mt-0.5">
                  {selectedTask.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#070103] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[#94A3B8] font-semibold uppercase text-[10px] tracking-wider block">
                  Description
                </span>
                <p className="text-[#F8FAFC] mt-1 text-xs leading-relaxed">
                  {selectedTask.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#070103] p-3 rounded-xl border border-[#E50914]/25">
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
                  <div className="mt-1 rounded-xl bg-[#070103] p-3 font-mono text-[11px] text-[#FF204E] border border-[#E50914]/20 leading-relaxed">
                    {selectedTask.result}
                  </div>
                </div>
              )}

              {selectedTask.planSteps && selectedTask.planSteps.length > 0 && (
                <div>
                  <span className="text-[#94A3B8] font-semibold uppercase text-[10px] tracking-wider block mb-1">
                    {t.taskExecutionStages}
                  </span>
                  <div className="space-y-1.5 bg-[#070103] p-3 rounded-xl border border-[#E50914]/20">
                    {selectedTask.planSteps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[#F8FAFC]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF204E]"></span>
                        <span>{step.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E50914]/25">
              <button
                onClick={() => handleDeleteTask(selectedTask.id)}
                className="flex items-center gap-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 px-3 py-2 text-xs font-semibold transition-colors cursor-pointer"
                title="Delete this task"
              >
                <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                <span>{settings.language === 'Bangla' ? 'টাস্ক ডিলিট করুন' : 'Delete Task'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="rounded-xl px-4 py-2 text-[#94A3B8] hover:bg-[#070103] cursor-pointer"
                >
                  {t.closeModal}
                </button>
                <button
                  onClick={() => {
                    handleExecuteInChat(selectedTask);
                    setSelectedTask(null);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#990000] via-[#E50914] to-[#FF204E] px-4 py-2 text-xs font-bold text-white shadow-[0_0_15px_rgba(229,9,20,0.4)] cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0f0306] p-6 border border-[#E50914]/30 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E50914]/25 pb-3 mb-4">
              <h2 className="text-base font-bold text-[#F8FAFC]">{t.createTask}</h2>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#070103] hover:text-white"
              >
                <X className="h-5 w-5" />
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
                  className="w-full rounded-xl bg-[#070103] px-3.5 py-2.5 text-[#F8FAFC] border border-[#E50914]/25 focus:border-[#FF204E] focus:outline-none"
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
                  className="w-full rounded-xl bg-[#070103] p-3 text-[#F8FAFC] border border-[#E50914]/25 focus:border-[#FF204E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] font-medium mb-1">
                  Priority
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                  className="w-full rounded-xl bg-[#070103] px-3 py-2 text-[#F8FAFC] border border-[#E50914]/25 focus:outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E50914]/25">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl px-4 py-2 text-[#94A3B8] hover:bg-[#070103]"
                >
                  {t.closeModal}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#990000] via-[#E50914] to-[#FF204E] px-4 py-2 font-bold text-white shadow-[0_0_15px_rgba(229,9,20,0.4)]"
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
