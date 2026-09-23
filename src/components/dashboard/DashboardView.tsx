import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Clock,
  Globe,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  Settings,
  Star,
  Users,
  CheckCircle2,
  Crown,
  Check,
  Search,
  Code,
  Palette,
  Activity,
  Plus,
  Trash2,
  Bell,
  Cpu,
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';

export const DashboardView: React.FC = () => {
  const {
    setActiveView,
    userProfile,
    handleSendMessage,
    alarms,
    addAlarm,
    toggleAlarm,
    deleteAlarm,
  } = useAgent();

  const [promptInput, setPromptInput] = useState('');
  const [newAlarmTime, setNewAlarmTime] = useState('');
  const [newAlarmLabel, setNewAlarmLabel] = useState('');
  const [showQuickAlarmInput, setShowQuickAlarmInput] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning,';
    if (hour >= 12 && hour < 17) return 'Good afternoon,';
    if (hour >= 17 && hour < 22) return 'Good evening,';
    return 'Good night,';
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    handleSendMessage(promptInput);
    setActiveView('chat');
  };

  const handleCreateAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlarmTime) return;

    const [hrsStr, minsStr] = newAlarmTime.split(':');
    const hrs = parseInt(hrsStr);
    const mins = parseInt(minsStr);

    const targetDate = new Date();
    targetDate.setHours(hrs, mins, 0, 0);
    if (targetDate.getTime() < Date.now()) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    const ampm = hrs >= 12 ? 'PM' : 'AM';
    const displayHrs = hrs % 12 || 12;
    const formattedTimeStr = `${displayHrs}:${mins.toString().padStart(2, '0')} ${ampm}`;

    const label = newAlarmLabel.trim() || 'Agent-sigma08 Task Alarm';
    addAlarm(formattedTimeStr, label, targetDate.getTime());

    setNewAlarmTime('');
    setNewAlarmLabel('');
    setShowQuickAlarmInput(false);
  };

  return (
    <div
      id="dashboard_view"
      className="flex-1 overflow-y-auto space-y-5 max-w-6xl mx-auto w-full animate-fadeIn relative pb-10 px-2 sm:px-4"
    >
      {/* ======================================================== */}
      {/* 1. TOP HERO BANNER (Exact Match of Screenshot)           */}
      {/* ======================================================== */}
      <div
        id="hero_agent_card"
        className="
          relative
          overflow-hidden
          rounded-3xl
          p-6
          sm:p-8
          md:p-10
          border
          border-[#E50914]/30
          bg-gradient-to-br
          from-[#1a0308]/90
          via-[#0a0204]/95
          to-[#28040b]/90
          backdrop-blur-xl
          shadow-[0_15px_50px_rgba(229,9,20,0.3)]
        "
      >
        {/* Cosmic Red Horizon Background Particles */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-[450px] w-[450px] rounded-full bg-[#E50914]/20 blur-[140px] animate-pulse" />
        <div className="pointer-events-none absolute left-1/3 -bottom-20 h-[300px] w-[300px] rounded-full bg-[#FF204E]/15 blur-[100px]" />

        {/* Top Indicators Row */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          {/* Status Pill: Agent Online ⚡ */}
          <div className="flex items-center gap-2 rounded-full border border-[#FF204E]/40 bg-black/60 px-3 py-1 text-xs font-bold text-white shadow-[0_0_15px_rgba(255,32,78,0.25)]">
            <span className="h-2 w-2 rounded-full bg-[#FF204E] shadow-[0_0_8px_#FF204E] animate-pulse" />
            <span>Agent Online</span>
            <span className="text-[#FF204E]">⚡</span>
          </div>

          {/* Version badge: v3.8.0 */}
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono font-semibold text-white/70">
            v3.8.0
          </div>
        </div>

        {/* Main Content Grid inside Hero */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Greeting & Intro */}
          <div className="md:col-span-7 space-y-3">
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {getGreeting()}
              </h2>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FF204E] tracking-tight leading-tight drop-shadow-[0_0_20px_rgba(229,9,20,0.6)]">
                {userProfile.name || 'Abdullah'}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-lg">
              I'm <strong className="text-white">Agent-sigma08</strong> — your intelligent AI agent, ready to assist, automate, research and bring your ideas to life.
            </p>
          </div>

          {/* Right Column: 3D Red Metallic Logo Display Artwork (Matches image) */}
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <div className="relative group p-6 rounded-3xl border border-[#E50914]/40 bg-black/40 backdrop-blur-md shadow-[0_0_40px_rgba(229,9,20,0.35)] flex flex-col items-center text-center max-w-xs">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#E50914]/20 via-transparent to-transparent pointer-events-none" />
              
              <img
                src={`${import.meta.env.BASE_URL}logomax.png`}
                alt="AGENT-SIGMA08 Logo"
                className="h-28 w-28 object-contain drop-shadow-[0_0_25px_rgba(229,9,20,0.9)] transform group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = `${import.meta.env.BASE_URL}logo.png`;
                }}
              />

              <div className="mt-3 space-y-0.5">
                <div className="text-xs font-black tracking-[0.2em] text-white">
                  AGENT-SIGMA08
                </div>
                <div className="text-[8px] font-bold tracking-[0.2em] text-[#FF204E] uppercase">
                  THINK · CREATE · EXECUTE
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Floating Search/Prompt Bar at bottom of Hero (Exact match: Ask me anything... ->) */}
        <form onSubmit={handlePromptSubmit} className="relative z-10 mt-8">
          <div className="relative flex items-center rounded-full border border-[#E50914]/50 bg-black/80 p-2 shadow-[0_0_25px_rgba(229,9,20,0.3)] hover:border-[#FF204E] transition-all">
            <div className="flex h-9 w-9 items-center justify-center rounded-full text-[#FF204E] ml-2">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>

            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-white/50 focus:outline-none"
            />

            <button
              type="submit"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#E50914] to-[#FF204E] text-white hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#E50914]/50"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </form>

      </div>

      {/* ======================================================== */}
      {/* 2. QUICK ACTIONS BAR (5 Cards, Match Screenshot)         */}
      {/* ======================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <span className="text-[#FF204E]">⚡</span> Quick Actions
          </h3>
          <button
            onClick={() => setActiveView('tools')}
            className="text-xs text-white/60 hover:text-[#FF204E] flex items-center gap-1 transition-colors"
          >
            <span>Access your most important tools</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          
          {/* Card 1: AI Chat */}
          <div
            onClick={() => setActiveView('chat')}
            className="cursor-pointer group relative overflow-hidden rounded-2xl border border-[#E50914]/30 bg-[#120307]/80 p-4 hover:border-[#FF204E] transition-all hover:translate-y-[-2px] shadow-lg"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E50914]/20 border border-[#E50914]/40 text-[#FF204E] mb-3">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-white leading-tight">AI Chat</h4>
            <p className="text-[10px] text-white/50 mt-1 leading-snug">Start a new conversation</p>
            <div className="mt-3 flex justify-end">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E50914] text-white group-hover:bg-[#FF204E] transition-colors">
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>

          {/* Card 2: Create Content */}
          <div
            onClick={() => setActiveView('chat')}
            className="cursor-pointer group relative overflow-hidden rounded-2xl border border-[#E50914]/30 bg-[#120307]/80 p-4 hover:border-[#FF204E] transition-all hover:translate-y-[-2px] shadow-lg"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E50914]/20 border border-[#E50914]/40 text-[#FF204E] mb-3">
              <FileText className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-white leading-tight">Create Content</h4>
            <p className="text-[10px] text-white/50 mt-1 leading-snug">Write, generate, edit</p>
            <div className="mt-3 flex justify-end">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E50914] text-white group-hover:bg-[#FF204E] transition-colors">
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>

          {/* Card 3: Image Studio */}
          <div
            onClick={() => setActiveView('ailab')}
            className="cursor-pointer group relative overflow-hidden rounded-2xl border border-[#E50914]/30 bg-[#120307]/80 p-4 hover:border-[#FF204E] transition-all hover:translate-y-[-2px] shadow-lg"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E50914]/20 border border-[#E50914]/40 text-[#FF204E] mb-3">
              <ImageIcon className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-white leading-tight">Image Studio</h4>
            <p className="text-[10px] text-white/50 mt-1 leading-snug">Create stunning images</p>
            <div className="mt-3 flex justify-end">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E50914] text-white group-hover:bg-[#FF204E] transition-colors">
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>

          {/* Card 4: Automation */}
          <div
            onClick={() => setActiveView('automations')}
            className="cursor-pointer group relative overflow-hidden rounded-2xl border border-[#E50914]/30 bg-[#120307]/80 p-4 hover:border-[#FF204E] transition-all hover:translate-y-[-2px] shadow-lg"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E50914]/20 border border-[#E50914]/40 text-[#FF204E] mb-3">
              <Settings className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-white leading-tight">Automation</h4>
            <p className="text-[10px] text-white/50 mt-1 leading-snug">Build workflows & save time</p>
            <div className="mt-3 flex justify-end">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E50914] text-white group-hover:bg-[#FF204E] transition-colors">
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>

          {/* Card 5: Task Flow */}
          <div
            onClick={() => setActiveView('tasks')}
            className="cursor-pointer group relative overflow-hidden rounded-2xl border border-[#E50914]/30 bg-[#120307]/80 p-4 hover:border-[#FF204E] transition-all hover:translate-y-[-2px] shadow-lg col-span-2 sm:col-span-1"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E50914]/20 border border-[#E50914]/40 text-[#FF204E] mb-3">
              <Zap className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-white leading-tight">Task Flow</h4>
            <p className="text-[10px] text-white/50 mt-1 leading-snug">Plan, track, execute</p>
            <div className="mt-3 flex justify-end">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E50914] text-white group-hover:bg-[#FF204E] transition-colors">
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. METRICS GRID (4 Cards, Exact Match of Screenshot)     */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Active Agents */}
        <div className="rounded-2xl border border-[#E50914]/30 bg-[#120307]/80 p-4 relative overflow-hidden shadow-lg space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E50914]/20 text-[#FF204E]">
              <Users className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-white/70">Active Agents</span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">12</span>
              <span className="text-[10px] text-white/50">in execution</span>
            </div>
            <span className="text-[10px] font-bold text-[#FF204E] bg-[#E50914]/15 px-2 py-0.5 rounded-full border border-[#E50914]/30">
              ↑ 3 today
            </span>
          </div>

          {/* Mini Red Sparkline Graphic */}
          <div className="h-8 w-full pt-1">
            <svg className="h-full w-full stroke-[#FF204E] fill-none" viewBox="0 0 100 25">
              <path d="M0,20 Q20,15 40,18 T80,8 T100,2" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Metric 2: Tasks Completed */}
        <div className="rounded-2xl border border-[#E50914]/30 bg-[#120307]/80 p-4 relative overflow-hidden shadow-lg space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E50914]/20 text-[#FF204E]">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-white/70">Tasks Completed</span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">48</span>
              <span className="text-[10px] text-white/50">today</span>
            </div>
            <span className="text-[10px] font-bold text-[#FF204E] bg-[#E50914]/15 px-2 py-0.5 rounded-full border border-[#E50914]/30">
              ↑ 12%
            </span>
          </div>

          {/* Mini Red Bar Chart */}
          <div className="h-8 w-full flex items-end justify-between gap-1 pt-1">
            {[40, 60, 35, 80, 55, 90, 75, 100].map((val, idx) => (
              <div
                key={idx}
                className="w-full bg-gradient-to-t from-[#800000] to-[#FF204E] rounded-t-sm"
                style={{ height: `${val}%` }}
              />
            ))}
          </div>
        </div>

        {/* Metric 3: Time Saved */}
        <div className="rounded-2xl border border-[#E50914]/30 bg-[#120307]/80 p-4 relative overflow-hidden shadow-lg space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E50914]/20 text-[#FF204E]">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-white/70">Time Saved</span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">6.8h</span>
              <span className="text-[10px] text-white/50">this week</span>
            </div>
            <span className="text-[10px] font-bold text-[#FF204E] bg-[#E50914]/15 px-2 py-0.5 rounded-full border border-[#E50914]/30">
              ↑ 24%
            </span>
          </div>

          {/* Mini Red Wave Graphic */}
          <div className="h-8 w-full pt-1">
            <svg className="h-full w-full stroke-[#FF204E] fill-none" viewBox="0 0 100 25">
              <path d="M0,22 C30,22 30,5 60,15 C80,20 85,2 100,5" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Metric 4: Success Rate */}
        <div className="rounded-2xl border border-[#E50914]/30 bg-[#120307]/80 p-4 relative overflow-hidden shadow-lg space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E50914]/20 text-[#FF204E]">
              <Star className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-white/70">Success Rate</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">98%</span>
              </div>
              <span className="text-[10px] text-white/50">overall</span>
              <div className="mt-1">
                <span className="text-[10px] font-bold text-[#FF204E] bg-[#E50914]/15 px-2 py-0.5 rounded-full border border-[#E50914]/30">
                  ↑ 5%
                </span>
              </div>
            </div>

            {/* Red Donut Ring Chart */}
            <div className="relative h-12 w-12 flex items-center justify-center">
              <svg className="h-12 w-12 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="stroke-white/10"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="stroke-[#E50914]"
                  strokeWidth="3.5"
                  strokeDasharray="98, 100"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 4. SPLIT TWO-COLUMN SECTION (Exact Match of Screenshot)  */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Left Column: Your AI Agents */}
        <div className="rounded-3xl border border-[#E50914]/30 bg-[#120307]/80 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4.5 w-4.5 text-[#FF204E]" />
              <h3 className="text-sm font-bold text-white">Your AI Agents</h3>
            </div>
            <button
              onClick={() => setActiveView('profile')}
              className="text-xs text-white/60 hover:text-[#FF204E] flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Agent 1: Research Agent */}
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-3 hover:border-[#FF204E]/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E50914]/20 text-[#FF204E]">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Research Agent</h4>
                  <p className="text-[10px] text-white/50">Web search · Analysis · Reports</p>
                </div>
              </div>
              <span className="rounded-full bg-[#E50914]/15 border border-[#FF204E]/40 px-2.5 py-0.5 text-[10px] font-bold text-[#FF204E]">
                Active
              </span>
            </div>

            {/* Agent 2: Content Creator */}
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-3 hover:border-[#FF204E]/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E50914]/20 text-[#FF204E]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Content Creator</h4>
                  <p className="text-[10px] text-white/50">Blogs · Social Media · Copywriting</p>
                </div>
              </div>
              <span className="rounded-full bg-[#E50914]/15 border border-[#FF204E]/40 px-2.5 py-0.5 text-[10px] font-bold text-[#FF204E]">
                Active
              </span>
            </div>

            {/* Agent 3: Code Assistant */}
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-3 hover:border-[#FF204E]/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E50914]/20 text-[#FF204E]">
                  <Code className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Code Assistant</h4>
                  <p className="text-[10px] text-white/50">Develop · Debug · Optimize</p>
                </div>
              </div>
              <span className="rounded-full bg-[#E50914]/15 border border-[#FF204E]/40 px-2.5 py-0.5 text-[10px] font-bold text-[#FF204E]">
                Active
              </span>
            </div>

            {/* Agent 4: Design Studio */}
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-3 hover:border-[#FF204E]/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E50914]/20 text-[#FF204E]">
                  <Palette className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Design Studio</h4>
                  <p className="text-[10px] text-white/50">UI/UX · Graphics · Branding</p>
                </div>
              </div>
              <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-bold text-white/50">
                Idle
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="rounded-3xl border border-[#E50914]/30 bg-[#120307]/80 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-[#FF204E]" />
              <h3 className="text-sm font-bold text-white">Recent Activity</h3>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#FF204E]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF204E] animate-pulse" />
              <span>Live updates</span>
            </div>
          </div>

          <div className="space-y-3">
            {/* Timeline 1 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E50914]/20 text-[#FF204E]">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Research Agent</h4>
                  <p className="text-[10px] text-white/60">Completed web research task</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-white/40">2m ago</span>
            </div>

            {/* Timeline 2 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E50914]/20 text-[#FF204E]">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Content Creator</h4>
                  <p className="text-[10px] text-white/60">Generated blog draft</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-white/40">12m ago</span>
            </div>

            {/* Timeline 3 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E50914]/20 text-[#FF204E]">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Image Studio</h4>
                  <p className="text-[10px] text-white/60">Created 4 images</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-white/40">18m ago</span>
            </div>

            {/* Timeline 4 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E50914]/20 text-[#FF204E]">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Task Flow</h4>
                  <p className="text-[10px] text-white/60">Automated workflow executed</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-white/40">34m ago</span>
            </div>

            {/* Timeline 5 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E50914]/20 text-[#FF204E]">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">AI Chat</h4>
                  <p className="text-[10px] text-white/60">New conversation started</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-white/40">1h ago</span>
            </div>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 5. BOTTOM UPGRADE BANNER (Exact Match of Screenshot)     */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl border border-[#E50914]/40 bg-gradient-to-r from-[#200308] via-[#0f0205] to-[#2b040a] p-6 sm:p-8 shadow-[0_10px_40px_rgba(229,9,20,0.3)]">
        {/* Glowing backdrop ambient energy */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#E50914]/20 via-transparent to-transparent" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-4">
            
            {/* Crown badge: Unlock More Possibilities */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FF204E]/40 bg-[#E50914]/20 px-3 py-1 text-xs font-extrabold text-[#FF204E]">
              <Crown className="h-3.5 w-3.5" />
              <span>Unlock More Possibilities</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Go Beyond with <span className="text-[#FF204E]">Agent-sigma08</span>
              </h2>
              <p className="text-xs sm:text-sm text-white/70">
                Premium features, unlimited creativity, and next-level AI tools.
              </p>
            </div>

            {/* Red Checkmark Features List */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Check className="h-4 w-4 text-[#FF204E] shrink-0" />
                <span>Unlimited Agents</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Check className="h-4 w-4 text-[#FF204E] shrink-0" />
                <span>Advanced Models</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Check className="h-4 w-4 text-[#FF204E] shrink-0" />
                <span>Priority Support</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Check className="h-4 w-4 text-[#FF204E] shrink-0" />
                <span>Exclusive Tools</span>
              </div>
            </div>

            {/* Red Upgrade Button */}
            <div className="pt-2">
              <button
                onClick={() => setActiveView('settings')}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E50914] to-[#FF204E] hover:from-[#FF204E] hover:to-[#E50914] px-6 py-3 text-xs font-extrabold text-white shadow-[0_4px_20px_rgba(229,9,20,0.5)] transition-all hover:scale-105 active:scale-95"
              >
                <span>Upgrade Now</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>

          {/* Right side floating glowing red 3D crystal diamond graphic */}
          <div className="md:col-span-4 flex justify-center md:justify-end">
            <div className="relative flex items-center justify-center h-28 w-28 sm:h-36 sm:w-36">
              <div className="absolute inset-0 rounded-full bg-[#FF204E]/25 blur-2xl animate-pulse" />
              <img
                src={`${import.meta.env.BASE_URL}logomax.png`}
                alt="Agent-sigma08 Logo"
                className="relative h-24 w-24 sm:h-28 sm:w-28 object-contain drop-shadow-[0_0_25px_rgba(229,9,20,0.9)] transition-transform hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = `${import.meta.env.BASE_URL}logo.png`;
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 6. REAL-TIME ALARMS SYSTEM                               */}
      {/* ======================================================== */}
      <div 
        id="section_alarms_scheduler"
        className="rounded-3xl p-5 space-y-4 border border-[#E50914]/25 bg-[#120307]/80 backdrop-blur-xl shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E50914]/20 border border-[#E50914]/30">
              <Bell className="h-4.5 w-4.5 text-[#FF204E]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white">
                Agent-sigma08 Task Alarms & Reminders
              </h3>
              <p className="text-[10px] text-white/50">
                Scheduled execution triggers and live sound alerts
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowQuickAlarmInput(!showQuickAlarmInput)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#E50914] to-[#FF204E] px-3 py-1.5 text-xs font-bold text-white transition-all hover:scale-105"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Alarm</span>
          </button>
        </div>

        {showQuickAlarmInput && (
          <form onSubmit={handleCreateAlarm} className="bg-black/60 rounded-2xl p-4 border border-[#E50914]/30 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end animate-fadeIn">
            <div>
              <label className="block text-[10px] font-bold text-[#FF204E] uppercase tracking-wider mb-1">Time (24h)</label>
              <input
                type="time"
                required
                value={newAlarmTime}
                onChange={(e) => setNewAlarmTime(e.target.value)}
                className="w-full rounded-xl bg-black/50 px-3 py-2 text-xs text-white border border-[#E50914]/30 focus:outline-none focus:border-[#FF204E]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#FF204E] uppercase tracking-wider mb-1">Label</label>
              <input
                type="text"
                placeholder="Agent task reminder..."
                value={newAlarmLabel}
                onChange={(e) => setNewAlarmLabel(e.target.value)}
                className="w-full rounded-xl bg-black/50 px-3 py-2 text-xs text-white border border-[#E50914]/30 focus:outline-none focus:border-[#FF204E]"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-[#E50914] hover:bg-[#FF204E] py-2 text-xs font-bold text-white transition-all cursor-pointer"
              >
                Add Alert
              </button>
              <button
                type="button"
                onClick={() => setShowQuickAlarmInput(false)}
                className="rounded-xl bg-white/5 px-3 py-2 text-xs text-white/60 border border-white/5"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {alarms.length === 0 ? (
          <div className="h-10 flex items-center justify-center text-xs text-white/40 italic">
            No active alarms configured. Click "New Alarm" to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {alarms.map((alarm) => (
              <div 
                key={alarm.id} 
                className={`relative overflow-hidden rounded-2xl p-3 border transition-all ${alarm.enabled ? 'border-[#E50914]/40 bg-black/50' : 'border-white/5 bg-black/20 opacity-60'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${alarm.enabled ? 'bg-[#E50914]/20 text-[#FF204E] animate-pulse' : 'bg-white/5 text-white/40'}`}>
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-black font-mono text-white">
                      {alarm.time}
                    </span>
                    <span className="block text-[10px] text-[#FF204E] truncate font-bold mt-0.5">
                      {alarm.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 absolute right-3 top-1/2 -translate-y-1/2">
                  <button
                    type="button"
                    onClick={() => toggleAlarm(alarm.id)}
                    className={`rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase transition-all ${alarm.enabled ? 'bg-[#E50914]/20 text-[#FF204E] border border-[#E50914]/40' : 'bg-white/5 text-white/40'}`}
                  >
                    {alarm.enabled ? 'On' : 'Off'}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteAlarm(alarm.id)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
