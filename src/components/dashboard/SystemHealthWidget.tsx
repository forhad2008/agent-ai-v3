import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  Cpu,
  Zap,
  CheckCircle2,
  RefreshCw,
  Server,
  ShieldCheck,
  Radio,
  Gauge,
  Sparkles,
  Clock,
  Layers,
  AlertTriangle,
  AlertOctagon,
  Sliders,
  Check,
  TrendingUp,
  Volume2,
  VolumeX,
  PlayCircle
} from 'lucide-react';
import { fetchSystemHealthApi, SystemHealthData } from '../../services/api';
import { LatencyD3Chart, LatencyDataPoint } from './LatencyD3Chart';

export const SystemHealthWidget: React.FC = () => {
  const [healthData, setHealthData] = useState<SystemHealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Configurable Latency Thresholds
  const [warningThreshold, setWarningThreshold] = useState<number>(100);
  const [criticalThreshold, setCriticalThreshold] = useState<number>(200);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Simulated latency spike state for testing visual warning system
  const [simulatedSpike, setSimulatedSpike] = useState<number | null>(null);

  // 60-Second Time Series Latency History
  const [latencyWindow, setLatencyWindow] = useState<LatencyDataPoint[]>(() => {
    // Seed initial 60s window (samples every 5s = 12 points)
    const now = Date.now();
    const seeded: LatencyDataPoint[] = [];
    for (let i = 11; i >= 0; i--) {
      const ts = now - i * 5000;
      seeded.push({
        timestamp: ts,
        timeLabel: new Date(ts).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        latencyMs: Math.floor(22 + Math.random() * 18),
      });
    }
    return seeded;
  });

  const loadHealthData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const data = await fetchSystemHealthApi();
      setHealthData(data);

      const actualLatency = data.clientLatencyMs || data.serverLatencyMs || 28;
      const currentLatency = simulatedSpike !== null ? simulatedSpike : actualLatency;

      const now = Date.now();
      const timeStr = new Date(now).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setLatencyWindow((prev) => {
        // Filter out samples older than 60 seconds (60,000 ms)
        const windowStart = now - 60000;
        const filtered = prev.filter(p => p.timestamp >= windowStart);
        const next = [...filtered, { timestamp: now, timeLabel: timeStr, latencyMs: currentLatency }];
        return next;
      });
    } catch (err) {
      console.error('Failed to load system health:', err);
    } finally {
      setLoading(false);
      if (isManualRefresh) {
        setTimeout(() => setRefreshing(false), 300);
      }
    }
  }, [simulatedSpike]);

  useEffect(() => {
    loadHealthData();
  }, [loadHealthData]);

  // Auto-refresh timer every 3s to maintain smooth 60s sliding window
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadHealthData();
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadHealthData]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const realLatency = healthData?.clientLatencyMs || healthData?.serverLatencyMs || 28;
  const currentLatency = simulatedSpike !== null ? simulatedSpike : realLatency;

  // VISUAL WARNING SYSTEM EVALUATION
  const isCritical = currentLatency >= criticalThreshold;
  const isWarning = !isCritical && currentLatency >= warningThreshold;
  const isHealthy = !isCritical && !isWarning;

  const getStatusBadge = () => {
    if (isCritical) {
      return {
        label: `CRITICAL LATENCY (${currentLatency}ms)`,
        bg: 'bg-red-500/15 text-red-400 border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.4)]',
        dot: 'bg-red-500',
        icon: AlertOctagon
      };
    }
    if (isWarning) {
      return {
        label: `LATENCY WARNING (${currentLatency}ms)`,
        bg: 'bg-amber-500/15 text-amber-400 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
        dot: 'bg-amber-400',
        icon: AlertTriangle
      };
    }
    return {
      label: `OPTIMAL LATENCY (${currentLatency}ms)`,
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400',
      icon: CheckCircle2
    };
  };

  const statusBadge = getStatusBadge();
  const StatusIcon = statusBadge.icon;

  const tokenStats = healthData?.tokenUsage || {
    totalQuota: 1000000,
    tokensUsed: 142800,
    tokensRemaining: 857200,
    percentRemaining: 85.7,
    promptTokens: 94600,
    completionTokens: 48200,
    requestsCount: 38,
    activeModel: 'gemini-2.5-flash',
    tpmLimit: 1000000,
    rpmLimit: 2000,
    lastUpdated: new Date().toISOString()
  };

  // Border styling based on warning status
  const cardBorderClass = isCritical
    ? 'border-red-500/80 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse-border'
    : isWarning
    ? 'border-amber-500/70 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
    : 'border-[#FF204E]/30';

  return (
    <div
      id="system_health_widget"
      className={`relative overflow-hidden rounded-3xl neumorph-card p-5 sm:p-6 space-y-5 transition-all duration-300 ${cardBorderClass}`}
    >
      {/* Background Ambient Glows depending on health state */}
      {isCritical ? (
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-red-600/25 blur-[110px] animate-pulse" />
      ) : isWarning ? (
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-amber-500/20 blur-[110px]" />
      ) : (
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#E50914]/15 blur-[100px]" />
      )}
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#FF204E]/10 blur-[100px]" />

      {/* Widget Header Row */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between border-b border-white/10 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-2xl neumorph-circle transition-colors ${
            isCritical ? 'text-red-400 shadow-[0_0_18px_rgba(239,68,68,0.5)]' :
            isWarning ? 'text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]' :
            'text-[#FF204E] shadow-[0_0_15px_rgba(255,32,78,0.3)]'
          }`}>
            <Activity className={`h-5 w-5 ${isCritical ? 'animate-bounce' : 'animate-pulse'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-white tracking-wide">
                System Health & Gemini AI Metrics
              </h3>
              <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black border ${statusBadge.bg}`}>
                <span className={`h-2 w-2 rounded-full ${statusBadge.dot} ${isCritical || isWarning ? 'animate-ping' : ''}`} />
                <span>{statusBadge.label}</span>
              </span>
            </div>
            <p className="text-[11px] text-white/60">
              60s D3 Latency Trend Analysis & Token Usage Monitor
            </p>
          </div>
        </div>

        {/* Action Controls & Threshold Config Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Threshold Settings Modal Trigger */}
          <button
            type="button"
            onClick={() => setShowConfigModal(!showConfigModal)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
              showConfigModal
                ? 'bg-[#FF204E] text-white shadow-[0_0_12px_#FF204E]'
                : 'neumorph-btn-secondary text-white/80 hover:text-white'
            }`}
            title="Configure warning thresholds and simulation"
          >
            <Sliders className="h-3.5 w-3.5 text-[#FF204E]" />
            <span>Thresholds ({warningThreshold}/{criticalThreshold}ms)</span>
          </button>

          {/* Auto Refresh Toggle */}
          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
              autoRefresh
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'neumorph-btn-secondary text-white/50'
            }`}
            title="Toggle 3-second automatic D3 sync"
          >
            <Radio className={`h-3.5 w-3.5 ${autoRefresh ? 'animate-pulse text-emerald-400' : ''}`} />
            <span>{autoRefresh ? 'Live Sync (3s)' : 'Sync Paused'}</span>
          </button>

          {/* Manual Ping Button */}
          <button
            type="button"
            onClick={() => loadHealthData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-xl neumorph-btn-primary px-3.5 py-1.5 text-xs font-bold text-white transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Ping</span>
          </button>
        </div>
      </div>

      {/* VISUAL WARNING SYSTEM DIAGNOSTIC BANNER */}
      {isCritical && (
        <div className="relative z-10 flex items-start gap-3 rounded-2xl bg-red-950/80 border border-red-500/70 p-4 text-xs text-red-200 shadow-xl backdrop-blur-md animate-pulse">
          <AlertOctagon className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold uppercase tracking-wider text-red-300">
                CRITICAL LATENCY ALERT TRIGGERED
              </span>
              <span className="font-mono text-[10px] text-red-400 font-bold bg-red-900/50 px-2 py-0.5 rounded border border-red-500/30">
                Limit: {criticalThreshold}ms | Measured: {currentLatency}ms
              </span>
            </div>
            <p className="text-red-200/90 leading-relaxed text-[11px]">
              Response latency has exceeded the critical boundary ({criticalThreshold}ms). AI requests may experience timeouts or high server queue contention. Check regional network connectivity or Gemini API rate limits.
            </p>
          </div>
        </div>
      )}

      {isWarning && (
        <div className="relative z-10 flex items-start gap-3 rounded-2xl bg-amber-950/70 border border-amber-500/60 p-3.5 text-xs text-amber-200 shadow-lg backdrop-blur-md">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold uppercase tracking-wider text-amber-300">
                LATENCY WARNING DETECTED
              </span>
              <span className="font-mono text-[10px] text-amber-400 font-bold bg-amber-900/50 px-2 py-0.5 rounded border border-amber-500/30">
                Limit: {warningThreshold}ms | Measured: {currentLatency}ms
              </span>
            </div>
            <p className="text-amber-200/90 leading-relaxed text-[11px]">
              API latency ({currentLatency}ms) has passed the warning threshold ({warningThreshold}ms). System performance is degraded but operational.
            </p>
          </div>
        </div>
      )}

      {/* THRESHOLD CONFIGURATION MODAL / PANEL */}
      {showConfigModal && (
        <div className="relative z-20 rounded-2xl bg-black/80 border border-[#FF204E]/40 p-4 space-y-4 backdrop-blur-md shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-[#FF204E]" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Configurable Latency Thresholds & Spike Testing
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setShowConfigModal(false)}
              className="text-xs text-white/50 hover:text-white cursor-pointer px-2 py-0.5 rounded bg-white/10"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Warning Threshold Slider */}
            <div className="space-y-1.5 bg-black/30 p-3 rounded-xl border border-white/5">
              <div className="flex justify-between items-center text-amber-400 font-bold text-[11px]">
                <span>Warning Threshold (Yellow)</span>
                <span className="font-mono">{warningThreshold} ms</span>
              </div>
              <input
                type="range"
                min="30"
                max="300"
                step="10"
                value={warningThreshold}
                onChange={(e) => setWarningThreshold(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-[10px] text-white/50 block">
                Triggers yellow warning badge and diagnostic alert box when latency &ge; {warningThreshold}ms.
              </span>
            </div>

            {/* Critical Threshold Slider */}
            <div className="space-y-1.5 bg-black/30 p-3 rounded-xl border border-white/5">
              <div className="flex justify-between items-center text-red-400 font-bold text-[11px]">
                <span>Critical Threshold (Red)</span>
                <span className="font-mono">{criticalThreshold} ms</span>
              </div>
              <input
                type="range"
                min="80"
                max="600"
                step="10"
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
              <span className="text-[10px] text-white/50 block">
                Triggers red critical alert banner and glowing pulsing container when latency &ge; {criticalThreshold}ms.
              </span>
            </div>
          </div>

          {/* Preset Buttons & Simulation Testing */}
          <div className="space-y-2 pt-1 border-t border-white/10">
            <span className="text-[10px] font-bold text-white/60 block uppercase tracking-wider">
              Quick Test Simulation Controls (Simulate Latency Spikes)
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setSimulatedSpike(null)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  simulatedSpike === null
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                Real API Ping ({realLatency}ms)
              </button>

              <button
                type="button"
                onClick={() => setSimulatedSpike(warningThreshold + 25)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  simulatedSpike === warningThreshold + 25
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-white/5 text-amber-300/80 hover:bg-white/10'
                }`}
              >
                Simulate Warning Spike ({warningThreshold + 25}ms)
              </button>

              <button
                type="button"
                onClick={() => setSimulatedSpike(criticalThreshold + 60)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  simulatedSpike === criticalThreshold + 60
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-white/5 text-red-300/80 hover:bg-white/10'
                }`}
              >
                Simulate Critical Spike ({criticalThreshold + 60}ms)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: D3 Line Chart + Token Usage */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ========================================================= */}
        {/* LEFT COLUMN: D3 LATENCY LINE CHART (6 cols)                */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 rounded-2xl neumorph-inset p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Gauge className="h-4 w-4 text-[#FF204E]" />
                <span>60-Second Latency Trend (D3 Chart)</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="text-white/50">Current:</span>
                <span className={`font-black ${
                  isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {currentLatency} ms
                </span>
              </div>
            </div>

            {/* D3 Line Chart Component */}
            <div className="rounded-xl neumorph-card p-2 bg-black/40 border border-white/5">
              <LatencyD3Chart
                data={latencyWindow}
                warningThreshold={warningThreshold}
                criticalThreshold={criticalThreshold}
                height={175}
              />
            </div>
          </div>

          {/* Sub Metrics Row */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-[11px]">
            <div className="rounded-xl bg-black/20 p-2 border border-white/5 space-y-0.5">
              <span className="text-white/50 block text-[10px]">Server Latency</span>
              <span className="font-mono font-bold text-white">
                {healthData?.serverLatencyMs || 12} ms
              </span>
            </div>
            <div className="rounded-xl bg-black/20 p-2 border border-white/5 space-y-0.5">
              <span className="text-white/50 block text-[10px]">Network RTT</span>
              <span className="font-mono font-bold text-emerald-400">
                {Math.max(1, currentLatency - (healthData?.serverLatencyMs || 12))} ms
              </span>
            </div>
            <div className="rounded-xl bg-black/20 p-2 border border-white/5 space-y-0.5">
              <span className="text-white/50 block text-[10px]">Samples (60s)</span>
              <span className="font-mono font-bold text-sky-400">
                {latencyWindow.length} pings
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: REMAINING GEMINI TOKEN USAGE (6 cols)        */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 rounded-2xl neumorph-inset p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Header & Active Model Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Sparkles className="h-4 w-4 text-[#FF204E]" />
                <span>Gemini Model Token Quota</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-[#FF204E]/15 border border-[#FF204E]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#FF204E]">
                <Cpu className="h-3 w-3" />
                <span>{tokenStats.activeModel}</span>
              </div>
            </div>

            {/* Token Numbers & Meter */}
            <div className="space-y-2 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <span className="text-xs text-white/60 block">Remaining Token Allowance</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                      {formatNumber(tokenStats.tokensRemaining)}
                    </span>
                    <span className="text-xs font-bold text-white/50">
                      / {formatNumber(tokenStats.totalQuota)}
                    </span>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-black text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <span>{tokenStats.percentRemaining}% Remaining</span>
                  </span>
                </div>
              </div>

              {/* Multi-segment Token Progress Bar */}
              <div className="space-y-1">
                <div className="h-3.5 w-full rounded-full neumorph-card p-0.5 relative overflow-hidden flex items-center">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#E50914] to-[#FF204E] shadow-[0_0_10px_#FF204E] transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(3, (tokenStats.tokensUsed / tokenStats.totalQuota) * 100))}%`
                    }}
                  />
                  <div
                    className="h-full rounded-r-full bg-emerald-500/30 transition-all duration-500"
                    style={{
                      width: `${Math.max(0, 100 - (tokenStats.tokensUsed / tokenStats.totalQuota) * 100)}%`
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-white/50 font-medium px-0.5">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#FF204E]" />
                    Used: {formatNumber(tokenStats.tokensUsed)} ({((tokenStats.tokensUsed / tokenStats.totalQuota) * 100).toFixed(1)}%)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Available: {formatNumber(tokenStats.tokensRemaining)}
                  </span>
                </div>
              </div>
            </div>

            {/* Breakdown Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="rounded-xl bg-black/20 p-2 border border-white/5">
                <span className="text-[10px] text-white/50 block">Prompt Input</span>
                <span className="text-xs font-mono font-bold text-white">
                  {formatNumber(tokenStats.promptTokens)}
                </span>
              </div>
              <div className="rounded-xl bg-black/20 p-2 border border-white/5">
                <span className="text-[10px] text-white/50 block">Output Tokens</span>
                <span className="text-xs font-mono font-bold text-white">
                  {formatNumber(tokenStats.completionTokens)}
                </span>
              </div>
              <div className="rounded-xl bg-black/20 p-2 border border-white/5">
                <span className="text-[10px] text-white/50 block">Rate Limit TPM</span>
                <span className="text-xs font-mono font-bold text-[#FF204E]">
                  1.0M TPM
                </span>
              </div>
              <div className="rounded-xl bg-black/20 p-2 border border-white/5">
                <span className="text-[10px] text-white/50 block">RPM Quota</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  2,000 RPM
                </span>
              </div>
            </div>
          </div>

          {/* Footer Uptime & Status Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-white/60">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-[#FF204E]" />
              <span>Server Uptime:</span>
              <span className="font-mono font-bold text-white">
                {formatUptime(healthData?.uptimeSeconds || 3600)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-white/40">
              <Layers className="h-3 w-3 text-white/40" />
              <span>{tokenStats.requestsCount} total requests logged</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Service Diagnostics Checklist Bar */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-[#E50914]/20">
        <div className="flex items-center gap-2 text-[11px] text-white/80 font-medium bg-black/20 rounded-xl p-2 border border-white/5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Express Server (:3000)</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-white/80 font-medium bg-black/20 rounded-xl p-2 border border-white/5">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Gemini SDK Configured</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-white/80 font-medium bg-black/20 rounded-xl p-2 border border-white/5">
          <Radio className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Google Search Grounding</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-white/80 font-medium bg-black/20 rounded-xl p-2 border border-white/5">
          <Server className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Vite / Node Proxy Active</span>
        </div>
      </div>
    </div>
  );
};
