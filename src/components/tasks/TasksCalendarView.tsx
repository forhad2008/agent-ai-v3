import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Sparkles,
  Move,
  Search,
  Filter,
  Layers,
  Check,
  CalendarDays,
  ListTodo,
} from 'lucide-react';
import { TaskItem, TaskPriority, TaskStatus } from '../../types';
import { useAgent } from '../../context/AgentContext';
import { CollaboratorAvatarStack } from './CollaboratorAvatarStack';

interface TasksCalendarViewProps {
  tasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
  onOpenCreateTaskWithDate?: (dateTimestamp: number) => void;
  onOpenInviteModal?: (task: TaskItem) => void;
}

type CalendarViewMode = 'month' | 'week' | 'agenda';

export const TasksCalendarView: React.FC<TasksCalendarViewProps> = ({
  tasks,
  onSelectTask,
  onOpenCreateTaskWithDate,
  onOpenInviteModal,
}) => {
  const { rescheduleTask, settings, currentLanguage } = useAgent();
  const isBangla = settings.language === 'Bangla' || currentLanguage?.id === 'bn';

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverDateKey, setDragOverDateKey] = useState<string | null>(null);
  const [calendarSearch, setCalendarSearch] = useState('');
  const [showUnscheduledDrawer, setShowUnscheduledDrawer] = useState(true);

  // Month navigation
  const prevPeriod = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'month') {
        d.setMonth(d.getMonth() - 1);
      } else if (viewMode === 'week') {
        d.setDate(d.getDate() - 7);
      } else {
        d.setDate(d.getDate() - 3);
      }
      return d;
    });
  };

  const nextPeriod = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'month') {
        d.setMonth(d.getMonth() + 1);
      } else if (viewMode === 'week') {
        d.setDate(d.getDate() + 7);
      } else {
        d.setDate(d.getDate() + 3);
      }
      return d;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Helper to extract a normalized date key: YYYY-MM-DD
  const getDateKey = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Parse task due date into Date object or timestamp
  const getTaskDateKey = (task: TaskItem): string | null => {
    if (task.dueDateTimeStamp) {
      return getDateKey(new Date(task.dueDateTimeStamp));
    }
    if (task.createdTimeStamp) {
      return getDateKey(new Date(task.createdTimeStamp));
    }
    return null;
  };

  // Filter tasks matching calendar search
  const filteredTasks = useMemo(() => {
    if (!calendarSearch.trim()) return tasks;
    const q = calendarSearch.toLowerCase();
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q)))
    );
  }, [tasks, calendarSearch]);

  // Tasks grouped by date key
  const tasksByDate = useMemo(() => {
    const map = new Map<string, TaskItem[]>();
    filteredTasks.forEach((task) => {
      const key = getTaskDateKey(task);
      if (key) {
        const existing = map.get(key) || [];
        map.set(key, [...existing, task]);
      }
    });
    return map;
  }, [filteredTasks]);

  // Unscheduled tasks (or tasks with no due date set explicitly)
  const unscheduledTasks = useMemo(() => {
    return filteredTasks.filter((t) => !t.dueDateTimeStamp && t.status !== 'Completed');
  }, [filteredTasks]);

  // Generate Month Days Grid (6 weeks matrix)
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday

    const days: { date: Date; isCurrentMonth: boolean; isToday: boolean; dateKey: string }[] = [];

    // Previous month filler days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: d,
        isCurrentMonth: false,
        isToday: getDateKey(d) === getDateKey(new Date()),
        dateKey: getDateKey(d),
      });
    }

    // Current month days
    const currentMonthTotalDays = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= currentMonthTotalDays; i++) {
      const d = new Date(year, month, i);
      days.push({
        date: d,
        isCurrentMonth: true,
        isToday: getDateKey(d) === getDateKey(new Date()),
        dateKey: getDateKey(d),
      });
    }

    // Next month filler days to complete 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        isCurrentMonth: false,
        isToday: getDateKey(d) === getDateKey(new Date()),
        dateKey: getDateKey(d),
      });
    }

    return days;
  }, [currentDate]);

  // Generate Week Days (7 days starting Sunday or Current Week)
  const weekDays = useMemo(() => {
    const start = new Date(currentDate);
    const day = start.getDay();
    start.setDate(start.getDate() - day); // Sunday

    const days: { date: Date; isToday: boolean; dateKey: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push({
        date: d,
        isToday: getDateKey(d) === getDateKey(new Date()),
        dateKey: getDateKey(d),
      });
    }
    return days;
  }, [currentDate]);

  // Drag and Drop Rescheduling Handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, dateKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverDateKey !== dateKey) {
      setDragOverDateKey(dateKey);
    }
  };

  const handleDragLeave = (e: React.DragEvent, dateKey: string) => {
    if (dragOverDateKey === dateKey) {
      setDragOverDateKey(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    setDragOverDateKey(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    setDraggedTaskId(null);

    if (!taskId) return;

    // Reschedule task to target date
    const targetTimestamp = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      17, // default 5:00 PM
      0,
      0
    ).getTime();

    const formattedDate = targetDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: targetDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    }) + ' 05:00 PM';

    rescheduleTask(taskId, targetTimestamp, formattedDate);
  };

  const getPriorityStyle = (priority: TaskPriority) => {
    switch (priority) {
      case 'Urgent':
        return 'border-l-2 border-l-[#FF204E] bg-rose-950/40 text-rose-200 hover:bg-rose-900/60 shadow-[0_0_8px_rgba(255,32,78,0.2)]';
      case 'High':
        return 'border-l-2 border-l-amber-500 bg-amber-950/40 text-amber-200 hover:bg-amber-900/60';
      case 'Medium':
        return 'border-l-2 border-l-cyan-500 bg-cyan-950/40 text-cyan-200 hover:bg-cyan-900/60';
      case 'Low':
      default:
        return 'border-l-2 border-l-slate-500 bg-slate-900/60 text-slate-300 hover:bg-slate-800/80';
    }
  };

  const WEEK_DAYS = isBangla
    ? ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Calendar Top Controls & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl neumorph-card border border-white/5">
        {/* Navigation & Month Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-black/40 rounded-xl p-1 border border-white/10">
            <button
              onClick={prevPeriod}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Previous Month/Week"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={goToToday}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer font-mono"
            >
              {isBangla ? 'আজ' : 'Today'}
            </button>
            <button
              onClick={nextPeriod}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Next Month/Week"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-[#FF204E]" />
            <span>
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </h2>
        </div>

        {/* View Mode Toggle & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={calendarSearch}
              onChange={(e) => setCalendarSearch(e.target.value)}
              placeholder={isBangla ? 'ক্যালেন্ডারে খুঁজুন...' : 'Filter calendar...'}
              className="rounded-xl bg-black/40 border border-white/10 pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF204E] w-36 sm:w-44"
            />
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center rounded-xl bg-black/40 p-1 border border-white/10 text-xs">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-[#FF204E] text-white font-bold shadow-[0_0_8px_rgba(255,32,78,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isBangla ? 'মাস' : 'Month'}
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-[#FF204E] text-white font-bold shadow-[0_0_8px_rgba(255,32,78,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isBangla ? 'সপ্তাহ' : 'Week'}
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'agenda'
                  ? 'bg-[#FF204E] text-white font-bold shadow-[0_0_8px_rgba(255,32,78,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isBangla ? 'তালিকা' : 'Agenda'}
            </button>
          </div>

          {/* Toggle Unscheduled Tasks Drawer */}
          <button
            onClick={() => setShowUnscheduledDrawer(!showUnscheduledDrawer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              showUnscheduledDrawer
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10'
            }`}
            title="Toggle Unscheduled Tasks Sidebar"
          >
            <ListTodo className="h-3.5 w-3.5 text-purple-400" />
            <span className="hidden sm:inline">
              {isBangla ? `অনির্ধারিত (${unscheduledTasks.length})` : `Backlog (${unscheduledTasks.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* Main Calendar Body + Unscheduled Tasks Sidebar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Unscheduled Backlog Drawer (Drag onto calendar to schedule!) */}
        {showUnscheduledDrawer && (
          <div className="w-full lg:w-72 shrink-0 rounded-2xl neumorph-card p-4 space-y-3 border border-white/10 max-h-[750px] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-purple-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  {isBangla ? 'অনির্ধারিত টাস্ক ব্যাকলগ' : 'Unscheduled Backlog'}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300">
                {unscheduledTasks.length}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              {isBangla
                ? '💡 যেকোনো টাস্ক টেনে নিয়ে ক্যালেন্ডারের যেকোনো তারিখে ছেড়ে দিলে সরাসরি রিশিডিউল হয়ে যাবে।'
                : '💡 Drag & drop any task directly onto a calendar date to schedule it instantly.'}
            </p>

            {unscheduledTasks.length === 0 ? (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center text-slate-500 text-xs font-mono">
                {isBangla ? 'সকল টাস্ক ক্যালেন্ডারে নির্ধারিত আছে' : 'All tasks are scheduled! 🎉'}
              </div>
            ) : (
              <div className="space-y-2">
                {unscheduledTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onClick={() => onSelectTask(task)}
                    className={`p-2.5 rounded-xl transition-all cursor-grab active:cursor-grabbing border ${getPriorityStyle(
                      task.priority
                    )} hover:scale-[1.02]`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-slate-300">
                        {task.priority}
                      </span>
                      <Move className="h-3 w-3 text-slate-400 opacity-60" />
                    </div>
                    <h4 className="text-xs font-semibold text-white line-clamp-1">
                      {task.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {task.category || 'General'}
                    </p>

                    {task.collaborators && task.collaborators.length > 0 && (
                      <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between">
                        <CollaboratorAvatarStack
                          collaborators={task.collaborators}
                          size="sm"
                          showAddButton={false}
                          showSharedBadge={false}
                        />
                        <span className="text-[9px] font-mono text-slate-400">
                          {task.collaborators.length} collabs
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Calendar Grid Container */}
        <div className="flex-1 w-full rounded-2xl neumorph-card p-3 sm:p-4 border border-white/10 overflow-x-auto">
          {viewMode === 'month' && (
            <div className="min-w-[650px]">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1.5 mb-1.5 text-center">
                {WEEK_DAYS.map((dayName, idx) => (
                  <div
                    key={dayName}
                    className={`py-2 text-xs font-bold font-mono uppercase tracking-wider rounded-lg ${
                      idx === 0 || idx === 6
                        ? 'text-rose-400/80 bg-rose-950/20'
                        : 'text-slate-400 bg-white/[0.02]'
                    }`}
                  >
                    {dayName}
                  </div>
                ))}
              </div>

              {/* Month Days Grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {monthDays.map(({ date, isCurrentMonth, isToday, dateKey }) => {
                  const dayTasks = tasksByDate.get(dateKey) || [];
                  const isDropTarget = dragOverDateKey === dateKey;

                  return (
                    <div
                      key={dateKey}
                      onDragOver={(e) => handleDragOver(e, dateKey)}
                      onDragLeave={(e) => handleDragLeave(e, dateKey)}
                      onDrop={(e) => handleDrop(e, date)}
                      className={`min-h-[110px] sm:min-h-[130px] p-2 rounded-xl flex flex-col justify-between border transition-all ${
                        isDropTarget
                          ? 'border-[#FF204E] bg-[#FF204E]/20 ring-2 ring-[#FF204E]/60 shadow-[0_0_15px_rgba(255,32,78,0.4)]'
                          : isToday
                          ? 'border-[#FF204E]/50 bg-[#FF204E]/[0.06] shadow-sm'
                          : isCurrentMonth
                          ? 'border-white/5 bg-black/40 hover:border-white/20'
                          : 'border-transparent bg-black/20 opacity-40 hover:opacity-75'
                      }`}
                    >
                      {/* Day Header */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded-md ${
                            isToday
                              ? 'bg-[#FF204E] text-white shadow-[0_0_8px_rgba(255,32,78,0.5)]'
                              : isCurrentMonth
                              ? 'text-slate-300'
                              : 'text-slate-600'
                          }`}
                        >
                          {date.getDate()}
                        </span>

                        <button
                          type="button"
                          onClick={() => onOpenCreateTaskWithDate && onOpenCreateTaskWithDate(date.getTime())}
                          className="h-5 w-5 rounded-md flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all cursor-pointer"
                          title={`Schedule new task on ${date.toDateString()}`}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Scheduled Tasks Inside Cell */}
                      <div className="space-y-1 my-1 overflow-y-auto max-h-[85px] pr-0.5">
                        {dayTasks.map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectTask(task);
                            }}
                            className={`p-1.5 rounded-lg text-[10px] transition-all cursor-grab active:cursor-grabbing border ${getPriorityStyle(
                              task.priority
                            )} group/task`}
                            title={`${task.title} • Priority: ${task.priority} • Status: ${task.status}`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span
                                className={`font-semibold truncate ${
                                  task.status === 'Completed' ? 'line-through opacity-60' : ''
                                }`}
                              >
                                {task.title}
                              </span>
                              {task.status === 'Completed' && (
                                <Check className="h-2.5 w-2.5 text-emerald-400 shrink-0" />
                              )}
                            </div>

                            {/* Collaborator Avatars Mini Stack */}
                            {task.collaborators && task.collaborators.length > 0 && (
                              <div className="mt-1 flex items-center justify-between text-[9px] font-mono opacity-80">
                                <div className="flex items-center -space-x-1">
                                  {task.collaborators.slice(0, 2).map((c, i) => (
                                    <div
                                      key={i}
                                      className="h-3.5 w-3.5 rounded-full bg-slate-800 text-[8px] flex items-center justify-center font-bold text-white border border-black"
                                    >
                                      {c.name ? c.name[0].toUpperCase() : 'U'}
                                    </div>
                                  ))}
                                  {task.collaborators.length > 2 && (
                                    <span className="text-[8px] pl-1 text-slate-400">
                                      +{task.collaborators.length - 2}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[8px] text-slate-400">
                                  {task.dueDate?.split(' ')[0] || ''}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Drop Target Hint */}
                      {isDropTarget && (
                        <div className="text-[9px] font-mono text-center text-[#FF204E] font-bold animate-pulse py-0.5">
                          Drop to Reschedule
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === 'week' && (
            <div className="min-w-[650px] space-y-2">
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map(({ date, isToday, dateKey }) => {
                  const dayTasks = tasksByDate.get(dateKey) || [];
                  const isDropTarget = dragOverDateKey === dateKey;

                  return (
                    <div
                      key={dateKey}
                      onDragOver={(e) => handleDragOver(e, dateKey)}
                      onDragLeave={(e) => handleDragLeave(e, dateKey)}
                      onDrop={(e) => handleDrop(e, date)}
                      className={`min-h-[420px] p-3 rounded-2xl flex flex-col justify-between border transition-all ${
                        isDropTarget
                          ? 'border-[#FF204E] bg-[#FF204E]/20 ring-2 ring-[#FF204E]/60 shadow-[0_0_15px_rgba(255,32,78,0.4)]'
                          : isToday
                          ? 'border-[#FF204E]/50 bg-[#FF204E]/[0.06]'
                          : 'border-white/5 bg-black/40'
                      }`}
                    >
                      {/* Week Column Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <div>
                          <div className="text-[11px] font-mono uppercase text-slate-400">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div
                            className={`text-sm font-bold font-mono ${
                              isToday ? 'text-[#FF204E]' : 'text-white'
                            }`}
                          >
                            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onOpenCreateTaskWithDate && onOpenCreateTaskWithDate(date.getTime())}
                          className="h-6 w-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                          title="Schedule task"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Tasks in Week Day */}
                      <div className="flex-1 space-y-2 my-2 overflow-y-auto max-h-[340px] pr-1">
                        {dayTasks.map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            onClick={() => onSelectTask(task)}
                            className={`p-2 rounded-xl transition-all cursor-grab active:cursor-grabbing border ${getPriorityStyle(
                              task.priority
                            )} hover:scale-[1.02]`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1 text-[10px] font-mono">
                              <span className="px-1.5 py-0.2 rounded bg-black/40 text-slate-300">
                                {task.priority}
                              </span>
                              <span className="text-slate-400">{task.dueDate?.split(' ').slice(0, 2).join(' ')}</span>
                            </div>

                            <h4 className="text-xs font-semibold text-white line-clamp-2">
                              {task.title}
                            </h4>

                            {task.collaborators && task.collaborators.length > 0 && (
                              <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between">
                                <CollaboratorAvatarStack
                                  collaborators={task.collaborators}
                                  size="sm"
                                  showAddButton={false}
                                  showSharedBadge={false}
                                />
                                <span className="text-[9px] font-mono text-emerald-400">
                                  {task.collaborators.filter(c => c.status === 'online' || c.status === 'active').length} online
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {isDropTarget && (
                        <div className="text-xs font-mono text-center text-[#FF204E] font-bold animate-pulse py-1">
                          Release to Reschedule
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === 'agenda' && (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {Array.from(tasksByDate.entries())
                .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                .map(([dateKey, dayTasks]) => {
                  const dObj = new Date(dateKey + 'T00:00:00');
                  const isToday = dateKey === getDateKey(new Date());

                  return (
                    <div
                      key={dateKey}
                      className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2.5"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-[#FF204E]" />
                          <h3
                            className={`text-xs font-bold font-mono ${
                              isToday ? 'text-[#FF204E]' : 'text-white'
                            }`}
                          >
                            {dObj.toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </h3>
                          {isToday && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#FF204E] text-white">
                              Today
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-slate-400">
                          {dayTasks.length} task{dayTasks.length === 1 ? '' : 's'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {dayTasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => onSelectTask(task)}
                            className={`p-3 rounded-xl transition-all cursor-pointer border ${getPriorityStyle(
                              task.priority
                            )} hover:scale-[1.01]`}
                          >
                            <div className="flex items-center justify-between text-xs mb-1 font-mono">
                              <span className="font-bold">{task.priority}</span>
                              <span className="text-slate-400">{task.dueDate || 'Today'}</span>
                            </div>
                            <h4 className="text-xs font-bold text-white mb-1">
                              {task.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                              {task.description}
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                              <span className="text-[10px] font-mono text-slate-400">
                                Status: {task.status}
                              </span>
                              {task.collaborators && task.collaborators.length > 0 && (
                                <CollaboratorAvatarStack
                                  collaborators={task.collaborators}
                                  size="sm"
                                  showAddButton={false}
                                  showSharedBadge={true}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
