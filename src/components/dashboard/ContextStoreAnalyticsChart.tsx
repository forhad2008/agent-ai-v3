import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Brain, Sparkles, Activity, Layers, Tag, RefreshCw, Smile, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { useAgent } from '../../context/AgentContext';

export const ContextStoreAnalyticsChart: React.FC = () => {
  const { sessionContext, resetSessionContext, reorderUserGoals } = useAgent();
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // Generate historical trend data points based on session context entities and goals
  const timelineData = [
    { time: 'Session Start', goalsCount: 1, activityScore: 20, complexity: 35 },
    { time: 'Mid Session', goalsCount: Math.max(2, sessionContext.userGoals.length - 1), activityScore: 65, complexity: 70 },
    { time: 'Current State', goalsCount: sessionContext.userGoals.length, activityScore: 90, complexity: 88 },
  ];

  // Category & Entity distribution data for Bar chart
  const entityDistributionData = (sessionContext.entities || ['Agent-sigma08', 'React', 'TypeScript']).map((entity, idx) => ({
    name: entity,
    frequency: (idx + 1) * 15 + Math.floor(Math.random() * 20),
    weight: Math.round((idx + 1) * 25),
  }));

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case 'motivated': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'curious': return 'bg-sky-500/20 text-sky-400 border-sky-500/40';
      case 'urgent': return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'positive': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default: return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIdx !== null && draggedIdx !== targetIndex) {
      reorderUserGoals(draggedIdx, targetIndex);
    }
    setDraggedIdx(null);
  };

  return (
    <div className="rounded-3xl neumorph-card p-6 space-y-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#FF204E]/10 blur-3xl" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E50914]/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl neumorph-circle text-[#FF204E] shadow-[0_0_15px_rgba(255,32,78,0.4)]">
            <Brain className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">Context Store Analytics</h3>
              <span className="text-[10px] font-bold text-[#FF204E] neumorph-badge px-2.5 py-0.5 rounded-full">
                Live Metadata Sync
              </span>
            </div>
            <p className="text-xs text-white/50">
              Tracking session awareness, entities, user goals, and sentiment across mode switches
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => resetSessionContext()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl neumorph-btn-secondary text-xs font-bold text-white/70 hover:text-white transition-colors cursor-pointer"
            title="Reset Context Store"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Store</span>
          </button>
        </div>
      </div>

      {/* Metadata Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Active Sentiment */}
        <div className="neumorph-inset rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/60">Active Sentiment</span>
            <Smile className="h-4 w-4 text-[#FF204E]" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border tracking-wider ${getSentimentBadgeColor(sessionContext.sentiment)}`}>
              {sessionContext.sentiment}
            </span>
            <span className="text-[10px] text-white/40">Updated {sessionContext.lastUpdated}</span>
          </div>
        </div>

        {/* Card 2: Active Topic */}
        <div className="neumorph-inset rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/60">Active Session Topic</span>
            <Sparkles className="h-4 w-4 text-[#FF204E]" />
          </div>
          <div className="text-xs font-black text-white truncate pt-1">
            "{sessionContext.activeTopic || 'General Work OS'}"
          </div>
        </div>

        {/* Card 3: Tracked Entities Count */}
        <div className="neumorph-inset rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/60">Tracked Entities & Goals</span>
            <Layers className="h-4 w-4 text-[#FF204E]" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-xl font-black text-white font-mono">{sessionContext.entities.length}</span>
            <span className="text-xs text-white/50">entities</span>
            <span className="text-xl font-black text-[#FF204E] font-mono ml-2">{sessionContext.userGoals.length}</span>
            <span className="text-xs text-white/50">goals</span>
          </div>
        </div>
      </div>

      {/* Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        
        {/* Chart 1: Trend Line of User Goals & Activity */}
        <div className="neumorph-inset rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#FF204E]" />
              <h4 className="text-xs font-bold text-white">Goals & Complexity Trend Over Time</h4>
            </div>
            <span className="text-[10px] text-white/40 font-mono">Session Velocity</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#140408',
                    borderColor: '#E50914',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="goalsCount" name="Tracked Goals" stroke="#FF204E" strokeWidth={3} dot={{ fill: '#FF204E', r: 4 }} />
                <Line type="monotone" dataKey="complexity" name="Cognitive Activity %" stroke="#38BDF8" strokeWidth={2} dot={{ fill: '#38BDF8', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category & Entity Distribution Bar Chart */}
        <div className="neumorph-inset rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-[#FF204E]" />
              <h4 className="text-xs font-bold text-white">Entity & Domain Frequency Distribution</h4>
            </div>
            <span className="text-[10px] text-white/40 font-mono">Metadata Weights</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={entityDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#140408',
                    borderColor: '#E50914',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="frequency" name="Frequency Index" fill="#FF204E" radius={[6, 6, 0, 0]} />
                <Bar dataKey="weight" name="Relevance Weight" fill="#881337" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Tracked Entities & Goals Pills Footer */}
      <div className="space-y-3 pt-2 border-t border-[#E50914]/20">
        <div>
          <span className="text-xs font-bold text-white/70 block mb-2">Tracked Session Entities:</span>
          <div className="flex flex-wrap gap-2">
            {sessionContext.entities.map((ent, idx) => (
              <span key={idx} className="px-3 py-1 rounded-xl neumorph-badge text-xs font-semibold text-white flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF204E]" />
                {ent}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white/70">Active User Goals (Drag & Drop or Rank to Prioritize):</span>
            <span className="text-[10px] text-white/40 font-mono">Manual Priority Ranking</span>
          </div>
          <div className="space-y-2">
            {sessionContext.userGoals.map((goal, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                className="neumorph-inset rounded-xl p-3 text-xs text-white/90 flex items-center justify-between cursor-grab active:cursor-grabbing hover:border hover:border-[#FF204E]/40 transition-all"
              >
                <div className="flex items-center gap-3 truncate">
                  <GripVertical className="h-4 w-4 text-white/40 flex-shrink-0" />
                  <span className="font-mono text-[#FF204E] font-bold">#{idx + 1}</span>
                  <span className="truncate">🎯 {goal}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  <button
                    onClick={() => idx > 0 && reorderUserGoals(idx, idx - 1)}
                    disabled={idx === 0}
                    className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 text-white/70 transition-colors"
                    title="Move Up"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => idx < sessionContext.userGoals.length - 1 && reorderUserGoals(idx, idx + 1)}
                    disabled={idx === sessionContext.userGoals.length - 1}
                    className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 text-white/70 transition-colors"
                    title="Move Down"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
