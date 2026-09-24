import React, { useState, useMemo } from 'react';
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
  Check,
  ChevronDown,
  ChevronUp,
  ListTodo,
  CornerDownRight,
  BarChart3,
  Tag,
  Tags,
  Cpu,
  Clock,
  Wand2,
  Layers,
  Zap,
  BrainCircuit,
  Award,
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';
import { SubTaskItem, TaskItem, TaskPriority, TaskStatus, TaskAiAnalysisResult } from '../../types';
import { TasksPerformanceDashboard } from './TasksPerformanceDashboard';

export const TasksView: React.FC = () => {
  const {
    tasks,
    createTask,
    autoCategorizeTask,
    analyzeTaskDescription,
    updateTaskTagsAndCategory,
    gatherWebInfoForTask,
    selectedTask,
    setSelectedTask,
    handleSendMessage,
    setActiveView,
    settings,
    currentLanguage,
    t,
    deleteTaskWithSync,
    addSubTask,
    toggleSubTask,
    updateSubTask,
    deleteSubTask,
  } = useAgent();

  const isBangla = settings.language === 'Bangla' || currentLanguage?.id === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(true);

  // Card-level AI auto-categorizing loader state
  const [isAutoCategorizingId, setIsAutoCategorizingId] = useState<string | null>(null);

  // Create Task Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('Medium');
  const [newCategory, setNewCategory] = useState<string>('AI & Automation');
  const [newTags, setNewTags] = useState<string[]>(['#AI', '#Automation', '#Task']);
  const [tagInputText, setTagInputText] = useState('');
  const [isModalAnalyzing, setIsModalAnalyzing] = useState(false);
  const [modalAiAnalysis, setModalAiAnalysis] = useState<TaskAiAnalysisResult | null>(null);
  const [gatherWebInfoForNewTask, setGatherWebInfoForNewTask] = useState(true);

  // Draft subtasks in Create Task Modal
  const [draftSubTasks, setDraftSubTasks] = useState<{ title: string; priority: TaskPriority; description?: string }[]>([]);
  const [draftSubTitle, setDraftSubTitle] = useState('');
  const [draftSubPriority, setDraftSubPriority] = useState<TaskPriority>('Medium');

  // Card-level accordion expansions and quick add subtask states
  const [expandedSubTaskCardIds, setExpandedSubTaskCardIds] = useState<Record<string, boolean>>({});
  const [cardQuickSubInputs, setCardQuickSubInputs] = useState<Record<string, { title: string; priority: TaskPriority }>>({});

  // Modal-level new subtask form states
  const [modalSubTitle, setModalSubTitle] = useState('');
  const [modalSubPriority, setModalSubPriority] = useState<TaskPriority>('Medium');
  const [modalSubDesc, setModalSubDesc] = useState('');

  // Task Details Modal Inline Tag addition
  const [detailTagInput, setDetailTagInput] = useState('');

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isGatheringWebId, setIsGatheringWebId] = useState<string | null>(null);

  // Preset categories for quick picker
  const CATEGORY_PRESETS = [
    'AI & Automation',
    'Frontend & UI/UX',
    'Backend & Infrastructure',
    'SEO & Performance',
    'Customer Support & CRM',
    'Code Quality & Testing',
    'Research & Strategy',
    'Operations & Workflow',
  ];

  // Extract all unique categories and tags across current tasks
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [tasks]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.tags) {
        t.tags.forEach((tag) => set.add(tag));
      }
    });
    return Array.from(set).slice(0, 15);
  }, [tasks]);

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

  const handleAutoCategorize = async (taskId: string) => {
    setIsAutoCategorizingId(taskId);
    try {
      await autoCategorizeTask(taskId);
    } finally {
      setIsAutoCategorizingId(null);
    }
  };

  const toggleCardSubTasks = (taskId: string) => {
    setExpandedSubTaskCardIds((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleAddCardQuickSubTask = (taskId: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const currentInput = cardQuickSubInputs[taskId];
    if (!currentInput || !currentInput.title.trim()) return;

    addSubTask(taskId, currentInput.title.trim(), currentInput.priority || 'Medium');
    setCardQuickSubInputs((prev) => ({
      ...prev,
      [taskId]: { title: '', priority: currentInput.priority || 'Medium' },
    }));
    setExpandedSubTaskCardIds((prev) => ({ ...prev, [taskId]: true }));
  };

  const handleAddModalSubTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !modalSubTitle.trim()) return;
    addSubTask(selectedTask.id, modalSubTitle.trim(), modalSubPriority, modalSubDesc.trim());
    setModalSubTitle('');
    setModalSubDesc('');
    setModalSubPriority('Medium');
  };

  const handleAddDraftSubTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftSubTitle.trim()) return;
    setDraftSubTasks((prev) => [
      ...prev,
      {
        title: draftSubTitle.trim(),
        priority: draftSubPriority,
      },
    ]);
    setDraftSubTitle('');
    setDraftSubPriority('Medium');
  };

  const handleRemoveDraftSubTask = (index: number) => {
    setDraftSubTasks((prev) => prev.filter((_, i) => i !== index));
  };

  // AI Auto-Detect in Create Task Modal
  const handleModalAiAnalyze = async () => {
    if (!newTitle.trim() && !newDesc.trim()) return;
    setIsModalAnalyzing(true);
    try {
      const result = await analyzeTaskDescription(newTitle.trim(), newDesc.trim());
      if (result) {
        setModalAiAnalysis(result);
        if (result.category) setNewCategory(result.category);
        if (result.tags && result.tags.length > 0) setNewTags(result.tags);
        if (result.suggestedPriority) setNewPriority(result.suggestedPriority);
        if (result.subTasksSuggestion && result.subTasksSuggestion.length > 0) {
          setDraftSubTasks(
            result.subTasksSuggestion.map((st) => ({
              title: st.title,
              priority: st.priority || 'Medium',
              description: st.description,
            }))
          );
        }
      }
    } catch (err) {
      console.warn('Modal AI analysis error:', err);
    } finally {
      setIsModalAnalyzing(false);
    }
  };

  const handleAddTagToNewTask = () => {
    const trimmed = tagInputText.trim();
    if (!trimmed) return;
    const formatted = trimmed.startsWith('#') ? trimmed : `#${trimmed.replace(/\s+/g, '')}`;
    if (!newTags.includes(formatted)) {
      setNewTags((prev) => [...prev, formatted]);
    }
    setTagInputText('');
  };

  const handleRemoveTagFromNewTask = (tagToRemove: string) => {
    setNewTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleAddDetailTag = (task: TaskItem) => {
    const trimmed = detailTagInput.trim();
    if (!trimmed) return;
    const formatted = trimmed.startsWith('#') ? trimmed : `#${trimmed.replace(/\s+/g, '')}`;
    const currentTags = task.tags || [];
    if (!currentTags.includes(formatted)) {
      const updatedTags = [...currentTags, formatted];
      updateTaskTagsAndCategory(task.id, task.category || 'Operations & Workflow', updatedTags);
    }
    setDetailTagInput('');
  };

  const handleRemoveDetailTag = (task: TaskItem, tagToRemove: string) => {
    const currentTags = task.tags || [];
    const updatedTags = currentTags.filter((t) => t !== tagToRemove);
    updateTaskTagsAndCategory(task.id, task.category || 'Operations & Workflow', updatedTags);
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (t.subTasks && t.subTasks.some((st) => st.title.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesTag = !selectedTagFilter || (t.tags && t.tags.includes(selectedTagFilter));

    return matchesSearch && matchesStatus && matchesCategory && matchesTag;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const task = createTask(
      newTitle.trim(),
      newDesc.trim(),
      newPriority,
      gatherWebInfoForNewTask,
      draftSubTasks,
      newCategory,
      newTags,
      modalAiAnalysis || undefined
    );

    setIsCreateOpen(false);
    setNewTitle('');
    setNewDesc('');
    setDraftSubTasks([]);
    setDraftSubTitle('');
    setNewTags(['#AI', '#Automation', '#Task']);
    setModalAiAnalysis(null);
    setSelectedTask(task);
  };

  const handleExecuteInChat = (task: TaskItem) => {
    setActiveView('chat');
    const tagsStr = task.tags && task.tags.length > 0 ? `\nTags: ${task.tags.join(' ')}` : '';
    const catStr = task.category ? `\nDomain: [${task.category}]` : '';
    const subTasksSummary =
      task.subTasks && task.subTasks.length > 0
        ? `\nNested Sub-tasks: ${task.subTasks.map((s) => `[${s.priority}] ${s.title} (${s.completed ? 'Done' : 'Pending'})`).join('; ')}`
        : '';
    handleSendMessage(`Execute task: "${task.title}". Description: ${task.description}${catStr}${tagsStr}${subTasksSummary}`);
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

  const getCategoryBadgeClass = (cat?: string) => {
    if (!cat) return 'bg-slate-800/60 text-slate-300 border-slate-700/50';
    const c = cat.toLowerCase();
    if (c.includes('ai') || c.includes('automation')) {
      return 'bg-purple-950/40 text-purple-300 border-purple-500/40 shadow-[0_0_8px_rgba(168,85,247,0.2)]';
    }
    if (c.includes('frontend') || c.includes('ui')) {
      return 'bg-cyan-950/40 text-cyan-300 border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)]';
    }
    if (c.includes('backend') || c.includes('infrastructure')) {
      return 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]';
    }
    if (c.includes('seo') || c.includes('performance')) {
      return 'bg-amber-950/40 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]';
    }
    if (c.includes('customer') || c.includes('crm') || c.includes('support')) {
      return 'bg-rose-950/40 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.2)]';
    }
    if (c.includes('code') || c.includes('quality') || c.includes('testing')) {
      return 'bg-indigo-950/40 text-indigo-300 border-indigo-500/40 shadow-[0_0_8px_rgba(99,102,241,0.2)]';
    }
    if (c.includes('research') || c.includes('strategy')) {
      return 'bg-sky-950/40 text-sky-300 border-sky-500/40 shadow-[0_0_8px_rgba(14,165,233,0.2)]';
    }
    return 'bg-slate-900/60 text-slate-300 border-slate-700/50';
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPerformanceDashboard(!showPerformanceDashboard)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              showPerformanceDashboard
                ? 'bg-[#FF204E]/20 text-[#FF204E] border border-[#FF204E]/40 shadow-[0_0_12px_rgba(255,32,78,0.25)]'
                : 'neumorph-btn-secondary text-slate-300 hover:text-white'
            }`}
            title="Toggle Performance Analytics Dashboard"
          >
            <BarChart3 className="h-3.5 w-3.5 text-[#FF204E]" />
            <span className="hidden sm:inline">
              {showPerformanceDashboard ? 'Hide Analytics' : 'Analytics & Charts'}
            </span>
          </button>

          <button
            id="btn_create_task_modal"
            onClick={() => {
              setDraftSubTasks([]);
              setDraftSubTitle('');
              setModalAiAnalysis(null);
              setIsCreateOpen(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl neumorph-btn-primary px-4 py-2.5 text-xs font-bold shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{t.createTask}</span>
          </button>
        </div>
      </div>

      {/* Recharts Performance Dashboard */}
      {showPerformanceDashboard && (
        <TasksPerformanceDashboard tasks={tasks} />
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-3">
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

        {/* Category & Tag Filter Ribbon */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5 text-xs">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold shrink-0">
            <Layers className="h-3 w-3 text-[#FF204E]" />
            <span>{isBangla ? 'ক্যাটাগরি:' : 'Category:'}</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setCategoryFilter('All')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                categoryFilter === 'All'
                  ? 'bg-[#FF204E]/20 text-[#FF204E] border border-[#FF204E]/50 font-bold'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {isBangla ? 'সকল ক্যাটাগরি' : 'All Categories'}
            </button>

            {CATEGORY_PRESETS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(categoryFilter === cat ? 'All' : cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#FF204E] text-white font-bold shadow-[0_0_8px_rgba(255,32,78,0.4)]'
                    : 'bg-white/[0.03] text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
            <div className="flex items-center gap-1 text-slate-400 font-medium shrink-0">
              <Tag className="h-3 w-3 text-sky-400" />
              <span>{isBangla ? 'ট্যাগ ফিল্টার:' : 'Tags:'}</span>
            </div>

            {selectedTagFilter && (
              <button
                onClick={() => setSelectedTagFilter(null)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono cursor-pointer"
              >
                <span>Clear: {selectedTagFilter}</span>
                <X className="h-2.5 w-2.5" />
              </button>
            )}

            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTagFilter(selectedTagFilter === tag ? null : tag)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all cursor-pointer ${
                  selectedTagFilter === tag
                    ? 'bg-sky-500 text-black font-bold shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                    : 'bg-white/[0.04] text-sky-300/80 hover:text-sky-200 border border-sky-500/20 hover:border-sky-500/40'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        {filteredTasks.map((task) => {
          const subTasksList = task.subTasks || [];
          const completedSubCount = subTasksList.filter((s) => s.completed).length;
          const isExpanded = !!expandedSubTaskCardIds[task.id];
          const quickInput = cardQuickSubInputs[task.id] || { title: '', priority: 'Medium' };
          const isAutoCategorizing = isAutoCategorizingId === task.id;

          return (
            <div
              key={task.id}
              id={`task_card_${task.id}`}
              className="group flex flex-col justify-between rounded-2xl neumorph-card p-4 sm:p-5 transition-all border border-white/5 hover:border-[#FF204E]/30 shadow-lg"
            >
              <div>
                {/* Header: Status & Priority Badges */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 text-[10px] font-mono rounded-lg ${getStatusBadge(task.status)}`}>
                    {task.status}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2.5 py-0.5 text-[10px] font-mono rounded-lg ${getPriorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>

                {/* AI Automated Category Badge & Auto-Tag Trigger */}
                <div className="flex items-center justify-between gap-1.5 mt-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[10px] font-semibold tracking-wide ${getCategoryBadgeClass(
                      task.category
                    )}`}
                  >
                    <Layers className="h-3 w-3" />
                    <span>{task.category || 'Operations & Workflow'}</span>
                  </span>

                  {/* 1-Click AI Auto Categorize & Tag button */}
                  <button
                    onClick={() => handleAutoCategorize(task.id)}
                    disabled={isAutoCategorizing}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-[10px] font-semibold transition-all cursor-pointer disabled:opacity-50"
                    title="Auto-Detect Category & Tags with Gemini AI"
                  >
                    {isAutoCategorizing ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin text-purple-300" />
                        <span>AI Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-3 w-3 text-purple-400" />
                        <span>Auto-Tag</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Title & Description */}
                <h3 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#FF204E] transition-colors mt-2.5">
                  {task.title}
                </h3>
                <p className="mt-1 text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                  {task.description}
                </p>

                {/* Automated AI Tags List */}
                {task.tags && task.tags.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {task.tags.map((tag, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTagFilter(tag)}
                        className="rounded-md bg-white/[0.03] hover:bg-sky-500/15 border border-white/10 hover:border-sky-500/40 px-2 py-0.5 text-[10px] text-sky-300 font-mono transition-all cursor-pointer"
                        title={`Filter by tag ${tag}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}

                {/* AI Analysis Summary Chip (if available) */}
                {task.aiAnalysis && (
                  <div className="mt-2 rounded-xl bg-purple-950/20 border border-purple-500/20 p-2 text-[10px] text-purple-200/90 space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span className="flex items-center gap-1 text-purple-300 font-semibold">
                        <BrainCircuit className="h-3 w-3 text-purple-400" />
                        <span>AI Scope Estimate</span>
                      </span>
                      <span className="text-slate-400">
                        {task.aiAnalysis.estimatedHours ? `~${task.aiAnalysis.estimatedHours}h` : ''} ({Math.round((task.aiAnalysis.confidence || 0.95) * 100)}% conf)
                      </span>
                    </div>
                    {task.aiAnalysis.analysisSummary && (
                      <p className="line-clamp-1 text-slate-300 italic">{task.aiAnalysis.analysisSummary}</p>
                    )}
                  </div>
                )}

                {/* Required Tools */}
                {task.requiredTools && task.requiredTools.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1">
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
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-400">
                      <Globe className="h-3 w-3 animate-pulse" />
                      <span>{isBangla ? 'ওয়েব তথ্য সংযুক্ত' : 'Web Intel Gathered'}</span>
                      {task.groundingMetadata.sources && (
                        <span className="opacity-75">({task.groundingMetadata.sources.length})</span>
                      )}
                    </span>
                  </div>
                )}

                {/* Nested Sub-Tasks Section Header on Card */}
                <div className="mt-3.5 pt-3 border-t border-[#E50914]/15">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleCardSubTasks(task.id)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 hover:text-[#FF204E] transition-colors cursor-pointer"
                    >
                      <ListTodo className="h-3.5 w-3.5 text-[#FF204E]" />
                      <span>{isBangla ? 'সাব-টাস্কসমূহ' : 'Sub-Tasks'}</span>
                      {subTasksList.length > 0 && (
                        <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white font-normal">
                          {completedSubCount}/{subTasksList.length}
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleCardSubTasks(task.id)}
                      className="text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {isExpanded
                        ? isBangla
                          ? 'লুকান'
                          : 'Hide'
                        : isBangla
                        ? '+ যোগ / দেখুন'
                        : '+ Add / View'}
                    </button>
                  </div>

                  {/* Expanded Sub-Tasks List & Inline Quick Add */}
                  {isExpanded && (
                    <div className="mt-2.5 space-y-2 animate-fadeIn">
                      {subTasksList.length > 0 ? (
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {subTasksList.map((st) => (
                            <div
                              key={st.id}
                              className={`flex items-center justify-between gap-2 p-2 rounded-xl transition-all ${
                                st.completed
                                  ? 'bg-black/40 border border-emerald-500/20 opacity-75'
                                  : 'neumorph-inset border border-transparent hover:border-[#FF204E]/30'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <button
                                  type="button"
                                  onClick={() => toggleSubTask(task.id, st.id)}
                                  className={`h-4 w-4 rounded flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                                    st.completed
                                      ? 'bg-emerald-500 text-black shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                      : 'border border-slate-500 hover:border-[#FF204E]'
                                  }`}
                                >
                                  {st.completed && <Check className="h-3 w-3 stroke-[3]" />}
                                </button>
                                <span
                                  className={`text-xs truncate select-none ${
                                    st.completed
                                      ? 'line-through text-slate-400'
                                      : 'text-[#F8FAFC] font-medium'
                                  }`}
                                >
                                  {st.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className={`px-2 py-0.5 text-[9px] font-mono rounded-md ${getPriorityBadge(st.priority)}`}>
                                  {st.priority}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => deleteSubTask(task.id, st.id)}
                                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                                  title="Delete sub-task"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 italic py-1">
                          {isBangla
                            ? 'কোনো সাব-টাস্ক নেই। নিচে নতুন সাব-টাস্ক যুক্ত করুন।'
                            : 'No sub-tasks yet. Add nested sub-tasks below.'}
                        </p>
                      )}

                      {/* Quick Add Sub-Task Form for Card */}
                      <div className="pt-2 border-t border-white/5">
                        <form
                          onSubmit={(e) => handleAddCardQuickSubTask(task.id, e)}
                          className="flex items-center gap-1.5"
                        >
                          <div className="relative flex-1">
                            <CornerDownRight className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-500" />
                            <input
                              type="text"
                              value={quickInput.title}
                              onChange={(e) =>
                                setCardQuickSubInputs((prev) => ({
                                  ...prev,
                                  [task.id]: {
                                    title: e.target.value,
                                    priority: prev[task.id]?.priority || 'Medium',
                                  },
                                }))
                              }
                              placeholder={isBangla ? 'নতুন সাব-টাস্কের নাম...' : 'New sub-task title...'}
                              className="w-full rounded-lg neumorph-inset pl-7 pr-2 py-1.5 text-[11px] text-[#F8FAFC] placeholder:text-slate-500 focus:outline-none"
                            />
                          </div>

                          <select
                            value={quickInput.priority}
                            onChange={(e) =>
                              setCardQuickSubInputs((prev) => ({
                                ...prev,
                                [task.id]: {
                                  title: prev[task.id]?.title || '',
                                  priority: e.target.value as TaskPriority,
                                },
                              }))
                            }
                            className="rounded-lg neumorph-inset px-2 py-1.5 text-[10px] text-[#F8FAFC] font-mono focus:outline-none cursor-pointer"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                          </select>

                          <button
                            type="submit"
                            disabled={!quickInput.title.trim()}
                            className="rounded-lg neumorph-btn-primary p-1.5 text-white disabled:opacity-40 cursor-pointer shrink-0"
                            title="Add sub-task"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
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
                        title={isBangla ? 'কাজ ডিলিট করুন' : 'Delete Task'}
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
          );
        })}
      </div>

      {/* Task Details Modal Drawer with Category & Tags & AI Scope Breakdown */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl neumorph-card p-6 text-xs space-y-5 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E50914]/20 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-[#94A3B8] uppercase neumorph-badge px-2 py-0.5 rounded-md">
                    Task ID: {selectedTask.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[10px] font-semibold ${getCategoryBadgeClass(
                      selectedTask.category
                    )}`}
                  >
                    <Layers className="h-3 w-3" />
                    <span>{selectedTask.category || 'Operations & Workflow'}</span>
                  </span>
                </div>
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

            <div className="space-y-4">
              {/* Category & Tags Section */}
              <div className="rounded-2xl neumorph-inset p-3.5 space-y-2.5 border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Tags className="h-3.5 w-3.5 text-sky-400" />
                    <span>{isBangla ? 'ক্যাটাগরি ও প্রাসঙ্গিক ট্যাগসমূহ' : 'Category & Assigned Tags'}</span>
                  </span>

                  <button
                    onClick={() => handleAutoCategorize(selectedTask.id)}
                    disabled={isAutoCategorizingId === selectedTask.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 font-semibold text-[10px] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isAutoCategorizingId === selectedTask.id ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin text-purple-300" />
                        <span>{isBangla ? 'এআই বিশ্লেষণ চলছে...' : 'AI Analyzing...'}</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-3 w-3 text-purple-400" />
                        <span>{isBangla ? '🤖 এআই দ্বারা পুনঃবিশ্লেষণ' : '🤖 Re-Analyze with AI'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Tags Chip List & Inline Add Tag Form */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {selectedTask.tags && selectedTask.tags.length > 0 ? (
                    selectedTask.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-950/40 border border-sky-500/30 text-sky-300 font-mono text-[11px]"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDetailTag(selectedTask, tag)}
                          className="text-slate-400 hover:text-rose-400 p-0.5 cursor-pointer"
                          title="Remove tag"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic text-[11px]">
                      {isBangla ? 'কোনো ট্যাগ নেই। নিচে ট্যাগ যোগ করুন।' : 'No tags assigned.'}
                    </span>
                  )}

                  {/* Add Tag Inline Input */}
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={detailTagInput}
                      onChange={(e) => setDetailTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddDetailTag(selectedTask);
                        }
                      }}
                      placeholder="+ Add #tag..."
                      className="rounded-lg neumorph-card px-2 py-1 text-[11px] text-[#F8FAFC] placeholder:text-slate-500 font-mono w-28 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddDetailTag(selectedTask)}
                      disabled={!detailTagInput.trim()}
                      className="p-1 rounded-md neumorph-btn-primary text-white disabled:opacity-40 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Analysis Executive Scope Card */}
              {selectedTask.aiAnalysis && (
                <div className="rounded-2xl bg-gradient-to-br from-purple-950/30 to-indigo-950/20 border border-purple-500/30 p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300 border border-purple-500/30">
                        <BrainCircuit className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-purple-200">
                          {isBangla ? 'এআই এক্সিকিউটিভ স্কোপ ও স্কিল বিশ্লেষণ' : 'Gemini AI Scope & Complexity Analysis'}
                        </h4>
                        <p className="text-[10px] text-purple-300/70">
                          {Math.round((selectedTask.aiAnalysis.confidence || 0.95) * 100)}% Confidence Model
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        <Clock className="h-3 w-3" />
                        <span>~{selectedTask.aiAnalysis.estimatedHours || 2.0} Hours</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed neumorph-inset p-3 rounded-xl">
                    {selectedTask.aiAnalysis.analysisSummary}
                  </p>

                  {selectedTask.aiAnalysis.keySkills && selectedTask.aiAnalysis.keySkills.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] text-purple-300/80 font-mono block mb-1">
                        {isBangla ? 'প্রয়োজনীয় মূল দক্ষতা ও টেকনোলজি:' : 'Recommended Key Skills & Tools:'}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {selectedTask.aiAnalysis.keySkills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded bg-purple-900/40 border border-purple-500/30 text-purple-200 text-[10px] font-mono"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div>
                <span className="text-[#94A3B8] font-semibold uppercase text-[10px] tracking-wider block">
                  Description
                </span>
                <p className="text-[#F8FAFC] mt-1 text-xs leading-relaxed neumorph-inset p-3 rounded-xl">
                  {selectedTask.description}
                </p>
              </div>

              {/* Status and Priority Overview */}
              <div className="grid grid-cols-2 gap-3 neumorph-inset p-3 rounded-xl">
                <div>
                  <span className="text-[#94A3B8] text-[10px] uppercase">Status</span>
                  <p className="font-bold text-[#FF204E] mt-0.5">{selectedTask.status}</p>
                </div>
                <div>
                  <span className="text-[#94A3B8] text-[10px] uppercase">Priority</span>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-mono rounded-md ${getPriorityBadge(selectedTask.priority)}`}>
                      {selectedTask.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* NESTED SUB-TASKS SECTION */}
              <div className="rounded-2xl neumorph-card p-4 space-y-3 border border-[#E50914]/25">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg neumorph-circle flex items-center justify-center text-[#FF204E]">
                      <ListTodo className="h-4 w-4 text-[#FF204E]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F8FAFC]">
                        {isBangla ? 'নেস্টেড সাব-টাস্ক ম্যানেজমেন্ট' : 'Nested Sub-Tasks'}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {selectedTask.subTasks && selectedTask.subTasks.length > 0
                          ? `${selectedTask.subTasks.filter((s) => s.completed).length} of ${selectedTask.subTasks.length} sub-tasks completed (${Math.round(
                              (selectedTask.subTasks.filter((s) => s.completed).length / selectedTask.subTasks.length) * 100
                            )}%)`
                          : isBangla
                          ? 'কোনো সাব-টাস্ক যুক্ত করা হয়নি'
                          : 'No sub-tasks attached'}
                      </p>
                    </div>
                  </div>

                  {selectedTask.subTasks && selectedTask.subTasks.length > 0 && (
                    <span className="text-[10px] font-mono font-bold text-[#FF204E] px-2 py-0.5 rounded-lg neumorph-badge">
                      {selectedTask.subTasks.filter((s) => s.completed).length}/{selectedTask.subTasks.length} Done
                    </span>
                  )}
                </div>

                {/* Subtasks List */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedTask.subTasks && selectedTask.subTasks.length > 0 ? (
                    selectedTask.subTasks.map((subTask) => (
                      <div
                        key={subTask.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl transition-all ${
                          subTask.completed
                            ? 'bg-black/50 border border-emerald-500/25'
                            : 'neumorph-inset border border-white/5 hover:border-[#FF204E]/30'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => toggleSubTask(selectedTask.id, subTask.id)}
                            className={`mt-0.5 h-4 w-4 rounded flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                              subTask.completed
                                ? 'bg-emerald-500 text-black shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                                : 'border border-slate-400 hover:border-[#FF204E]'
                            }`}
                          >
                            {subTask.completed && <Check className="h-3 w-3 stroke-[3]" />}
                          </button>
                          <div className="min-w-0">
                            <span
                              className={`text-xs font-semibold block ${
                                subTask.completed ? 'line-through text-slate-400' : 'text-[#F8FAFC]'
                              }`}
                            >
                              {subTask.title}
                            </span>
                            {subTask.description && (
                              <p className="text-[10px] text-slate-400 mt-0.5">{subTask.description}</p>
                            )}
                          </div>
                        </div>

                        {/* Priority Badge & Change Dropdown & Delete */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <span className={`px-2 py-0.5 text-[10px] font-mono rounded-md ${getPriorityBadge(subTask.priority)}`}>
                            {subTask.priority}
                          </span>

                          <select
                            value={subTask.priority}
                            onChange={(e) =>
                              updateSubTask(selectedTask.id, subTask.id, {
                                priority: e.target.value as TaskPriority,
                              })
                            }
                            className="rounded-lg neumorph-inset px-2 py-1 text-[10px] text-slate-300 font-mono focus:outline-none cursor-pointer"
                            title="Change sub-task priority"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => deleteSubTask(selectedTask.id, subTask.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                            title="Delete sub-task"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-slate-500 neumorph-inset rounded-xl">
                      <p className="text-xs">
                        {isBangla
                          ? 'এই প্রধান টাস্কে কোনো সাব-টাস্ক যুক্ত নেই।'
                          : 'No sub-tasks added to this main task yet.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Add Sub-Task Form in Modal */}
                <form onSubmit={handleAddModalSubTask} className="pt-2 border-t border-white/10 space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      required
                      value={modalSubTitle}
                      onChange={(e) => setModalSubTitle(e.target.value)}
                      placeholder={isBangla ? 'নতুন সাব-টাস্কের নাম লিখুন...' : 'Enter new sub-task title...'}
                      className="flex-1 rounded-xl neumorph-inset px-3 py-2 text-xs text-[#F8FAFC] placeholder:text-slate-500 focus:outline-none"
                    />

                    <div className="flex items-center gap-2">
                      <select
                        value={modalSubPriority}
                        onChange={(e) => setModalSubPriority(e.target.value as TaskPriority)}
                        className="rounded-xl neumorph-inset px-3 py-2 text-xs text-[#F8FAFC] font-mono focus:outline-none cursor-pointer"
                      >
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                        <option value="Urgent">Urgent Priority</option>
                      </select>

                      <button
                        type="submit"
                        disabled={!modalSubTitle.trim()}
                        className="flex items-center gap-1 rounded-xl neumorph-btn-primary px-3 py-2 font-bold text-white disabled:opacity-50 cursor-pointer shrink-0"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>{isBangla ? 'যুক্ত করুন' : 'Add'}</span>
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={modalSubDesc}
                    onChange={(e) => setModalSubDesc(e.target.value)}
                    placeholder={isBangla ? 'ঐচ্ছিক বিবরণ বা স্পেসিফিকেশন...' : 'Optional sub-task notes or scope...'}
                    className="w-full rounded-xl neumorph-inset px-3 py-1.5 text-[11px] text-[#F8FAFC] placeholder:text-slate-500 focus:outline-none"
                  />
                </form>
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
                          <span>{isBangla ? 'ওয়েব তথ্য সংগ্রহ হচ্ছে...' : 'Gathering web info...'}</span>
                        </>
                      ) : (
                        <>
                          <Globe className="h-3 w-3 text-sky-400" />
                          <span>{isBangla ? '🌐 প্ল্যানের জন্য লাইভ ওয়েব তথ্য খুঁজুন' : '🌐 Gather Web Intel for Plan'}</span>
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
                      {isBangla ? '🌐 সংগৃহীত লাইভ ওয়েব তথ্য ও সোর্সসমূহ' : '🌐 Gathered Web Intelligence & Sources'}
                    </span>
                    <span className="text-[10px] font-mono text-sky-400/80 bg-sky-500/15 px-2 py-0.5 rounded border border-sky-500/30">
                      Google Search Grounding
                    </span>
                  </div>

                  {selectedTask.groundingMetadata.searchQueries && selectedTask.groundingMetadata.searchQueries.length > 0 && (
                    <div>
                      <span className="text-[10px] text-sky-400/80 font-mono block mb-1">
                        {isBangla ? 'অনুসন্ধানকৃত কুয়েরি:' : 'Executed Queries:'}
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
                        {isBangla ? 'রেফারেন্স লিঙ্কসমূহ:' : 'Retrieved Sources:'}
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
                <span>{isBangla ? 'টাস্ক ডিলিট করুন' : 'Delete Task'}</span>
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

      {/* Create Task Modal with AI Auto-Categorize & Tagging Engine */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl neumorph-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E50914]/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg neumorph-circle flex items-center justify-center text-[#FF204E]">
                  <CheckSquare className="h-4 w-4 text-[#FF204E]" />
                </div>
                <h2 className="text-base font-bold text-[#F8FAFC]">{t.createTask}</h2>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="h-8 w-8 rounded-xl neumorph-circle flex items-center justify-center text-[#94A3B8] hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Smart AI Auto-Detect Banner */}
            <div className="rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-950/40 border border-purple-500/30 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-purple-400 animate-pulse" />
                <div>
                  <span className="text-xs font-bold text-purple-200 block">
                    {isBangla ? 'স্মার্ট এআই অটো-ট্যাগ ও ক্যাটাগরি ডিটেকশন' : 'AI Smart Auto-Categorize & Tagging'}
                  </span>
                  <p className="text-[10px] text-purple-300/70">
                    {isBangla
                      ? 'টাস্ক টাইটেল ও বিবরণ থেকে স্বয়ংক্রিয়ভাবে ক্যাটাগরি, ট্যাগ ও সাব-টাস্ক তৈরি করুন'
                      : 'Automatically extract tags, domain category, priority, and subtasks from description'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleModalAiAnalyze}
                disabled={isModalAnalyzing || (!newTitle.trim() && !newDesc.trim())}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)] transition-all cursor-pointer disabled:opacity-40 shrink-0"
              >
                {isModalAnalyzing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>{isBangla ? 'বিশ্লেষণ হচ্ছে...' : 'Analyzing...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{isBangla ? 'অটো ডিটেক্ট করুন' : 'Auto-Detect with AI'}</span>
                  </>
                )}
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
                  placeholder="e.g. Audit checkout flow and fix race conditions"
                  className="w-full rounded-xl neumorph-inset px-3.5 py-2.5 text-[#F8FAFC] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] font-medium mb-1">
                  Objective & Description
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe requirements, target files, customer ticket info, or technical goals..."
                  className="w-full rounded-xl neumorph-inset p-3 text-[#F8FAFC] focus:outline-none"
                />
              </div>

              {/* Category & Tags Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Category Selector */}
                <div>
                  <label className="block text-[#94A3B8] font-medium mb-1 flex items-center gap-1">
                    <Layers className="h-3 w-3 text-[#FF204E]" />
                    <span>Category Domain</span>
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-xl neumorph-inset px-3 py-2 text-[#F8FAFC] focus:outline-none font-medium cursor-pointer"
                  >
                    {CATEGORY_PRESETS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Selector */}
                <div>
                  <label className="block text-[#94A3B8] font-medium mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full rounded-xl neumorph-inset px-3 py-2 text-[#F8FAFC] focus:outline-none font-mono"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Tags Manager */}
              <div className="rounded-xl neumorph-inset p-3 space-y-2 border border-white/5">
                <label className="text-[#94A3B8] font-medium flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3 text-sky-400" />
                    <span>{isBangla ? 'ট্যাগসমূহ (#Hashtags)' : 'Task Tags (#Hashtags)'}</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{newTags.length} tags added</span>
                </label>

                <div className="flex flex-wrap gap-1.5">
                  {newTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-950/40 border border-sky-500/30 text-sky-300 font-mono text-[10px]"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTagFromNewTask(tag)}
                        className="text-slate-400 hover:text-rose-400 p-0.5 cursor-pointer"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <input
                    type="text"
                    value={tagInputText}
                    onChange={(e) => setTagInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTagToNewTask();
                      }
                    }}
                    placeholder="Type tag & press enter (e.g. #React, #Security)"
                    className="flex-1 rounded-lg neumorph-card px-2.5 py-1.5 text-[11px] text-[#F8FAFC] placeholder:text-slate-500 font-mono focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTagToNewTask}
                    disabled={!tagInputText.trim()}
                    className="rounded-lg neumorph-btn-primary px-2.5 py-1.5 text-white disabled:opacity-40 cursor-pointer text-xs font-semibold"
                  >
                    + Tag
                  </button>
                </div>
              </div>

              {/* Nested Sub-Tasks in Create Modal */}
              <div className="rounded-xl neumorph-inset p-3 space-y-2.5 border border-white/5">
                <div className="flex items-center justify-between">
                  <label className="text-[#F8FAFC] font-semibold flex items-center gap-1.5 text-xs">
                    <ListTodo className="h-3.5 w-3.5 text-[#FF204E]" />
                    <span>
                      {isBangla ? 'নেস্টেড সাব-টাস্ক যুক্ত করুন' : 'Add Nested Sub-Tasks (Optional)'}
                    </span>
                  </label>
                  {draftSubTasks.length > 0 && (
                    <span className="text-[10px] font-mono text-[#FF204E]">
                      {draftSubTasks.length} sub-tasks
                    </span>
                  )}
                </div>

                {/* Draft Sub-tasks List */}
                {draftSubTasks.length > 0 && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {draftSubTasks.map((st, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2 rounded-lg bg-black/40 border border-white/5"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#FF204E]" />
                          <span className="text-xs text-[#F8FAFC] truncate font-medium">{st.title}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2 py-0.5 text-[9px] font-mono rounded-md ${getPriorityBadge(st.priority)}`}>
                            {st.priority}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDraftSubTask(idx)}
                            className="text-slate-400 hover:text-rose-400 p-0.5 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Draft Sub-task Inputs */}
                <div className="flex items-center gap-1.5 pt-1">
                  <input
                    type="text"
                    value={draftSubTitle}
                    onChange={(e) => setDraftSubTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDraftSubTask(e);
                      }
                    }}
                    placeholder={isBangla ? 'সাব-টাস্কের নাম...' : 'Sub-task title...'}
                    className="flex-1 rounded-lg neumorph-card px-2.5 py-1.5 text-xs text-[#F8FAFC] placeholder:text-slate-500 focus:outline-none"
                  />
                  <select
                    value={draftSubPriority}
                    onChange={(e) => setDraftSubPriority(e.target.value as TaskPriority)}
                    className="rounded-lg neumorph-card px-2 py-1.5 text-[10px] text-[#F8FAFC] font-mono focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddDraftSubTask}
                    disabled={!draftSubTitle.trim()}
                    className="rounded-lg neumorph-btn-primary p-1.5 text-white disabled:opacity-40 cursor-pointer shrink-0"
                    title="Add subtask"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E50914]/20">
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
