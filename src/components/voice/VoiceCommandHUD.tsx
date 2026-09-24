import React from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  HelpCircle,
  X,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Play,
  CornerDownLeft,
  Compass,
  PlusCircle,
  Wrench,
  Music,
  Bell,
  Search,
  Bot,
  Activity,
} from 'lucide-react';
import { useVoiceCommand } from '../../context/VoiceCommandContext';
import { sound } from '../../services/sound';
import { VoiceIntentType, VoiceConfidenceLevel } from '../../types';

export const VoiceCommandHUD: React.FC = () => {
  const {
    isListening,
    isSupported,
    interimTranscript,
    finalTranscript,
    realtimeInterpretation,
    lastExecutedCommand,
    pendingCommand,
    isVerifying,
    verificationCountdown,
    ttsEnabled,
    setTtsEnabled,
    toggleListening,
    stopListening,
    confirmPendingCommand,
    cancelPendingCommand,
    setIsVoiceModalOpen,
  } = useVoiceCommand();

  if (!isSupported) return null;

  // Show HUD if currently listening, or verifying a command, or if interim text exists, or recently executed
  const hasActiveInterim = !!interimTranscript.trim();
  const hasPending = isVerifying && !!pendingCommand;
  const showHUD = isListening || hasPending || hasActiveInterim;

  if (!showHUD && !isListening) return null;

  // Active display data prioritization
  const activeRecord = pendingCommand || lastExecutedCommand;
  const rawSpeechText = interimTranscript || pendingCommand?.transcript || lastExecutedCommand?.transcript || '';
  const currentInterpretation = realtimeInterpretation || (activeRecord ? {
    intent: activeRecord.intent,
    actionSummary: activeRecord.actionSummary,
    confidence: activeRecord.confidence || 0.94,
    confidenceLevel: activeRecord.confidenceLevel || 'high',
    parameters: activeRecord.parameters || {},
  } : null);

  const confidenceScore = currentInterpretation?.confidence
    ? Math.round(currentInterpretation.confidence * 100)
    : isListening && rawSpeechText
    ? 92
    : 0;

  const confidenceLevel: VoiceConfidenceLevel = currentInterpretation?.confidenceLevel ||
    (confidenceScore >= 85 ? 'high' : confidenceScore >= 60 ? 'medium' : 'low');

  // Intent Icon Helper
  const getIntentIcon = (intent?: VoiceIntentType) => {
    switch (intent) {
      case 'create_task':
        return <PlusCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />;
      case 'navigate':
        return <Compass className="h-3.5 w-3.5 text-cyan-400 shrink-0" />;
      case 'ask_agent':
        return <Bot className="h-3.5 w-3.5 text-purple-400 shrink-0" />;
      case 'execute_tool':
        return <Wrench className="h-3.5 w-3.5 text-amber-400 shrink-0" />;
      case 'search':
        return <Search className="h-3.5 w-3.5 text-blue-400 shrink-0" />;
      case 'manage_alarm':
        return <Music className="h-3.5 w-3.5 text-rose-400 shrink-0" />;
      case 'manage_notifications':
        return <Bell className="h-3.5 w-3.5 text-yellow-400 shrink-0" />;
      case 'help':
        return <HelpCircle className="h-3.5 w-3.5 text-amber-300 shrink-0" />;
      default:
        return <Activity className="h-3.5 w-3.5 text-[#FF204E] shrink-0" />;
    }
  };

  // Confidence Score Icon & Badge Helper
  const renderConfidenceBadge = () => {
    if (!rawSpeechText && !currentInterpretation) return null;

    if (confidenceLevel === 'high') {
      return (
        <div
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]"
          title={`High Confidence Score: ${confidenceScore}% — Command matches known intent pattern.`}
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>{confidenceScore}% Match</span>
        </div>
      );
    }

    if (confidenceLevel === 'medium') {
      return (
        <div
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-[10px] font-mono font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]"
          title={`Moderate Confidence Score: ${confidenceScore}% — Partial grammar match.`}
        >
          <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span>{confidenceScore}% Match</span>
        </div>
      );
    }

    return (
      <div
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 text-[10px] font-mono font-bold shadow-[0_0_10px_rgba(244,63,94,0.2)]"
        title={`Low Confidence Score: ${confidenceScore}% — Ambiguous or unrecognized pattern.`}
      >
        <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
        <span>{confidenceScore}% Uncertain</span>
      </div>
    );
  };

  return (
    <aside
      aria-label="Voice Command Status & Verification HUD"
      className="
        fixed
        bottom-5
        left-1/2
        -translate-x-1/2
        z-[95]
        flex
        flex-col
        gap-2.5
        p-3.5
        sm:p-4
        rounded-2xl
        neumorph-card
        bg-[#0a0205]/95
        backdrop-blur-2xl
        border
        border-[#FF204E]/50
        shadow-[0_15px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(255,32,78,0.35)]
        w-[94vw]
        max-w-2xl
        animate-fadeIn
        transition-all
      "
    >
      {/* HUD TOP ROW: Mic, Live Status, Confidence Icon, Top Controls */}
      <div className="flex items-center justify-between gap-3">
        {/* Left: Microphone & Status Label */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              toggleListening();
            }}
            className={`
              relative
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              transition-all
              cursor-pointer
              shrink-0
              ${
                isListening
                  ? 'bg-gradient-to-br from-[#FF204E] via-[#E50914] to-[#FF4D6D] text-white shadow-[0_0_20px_rgba(255,32,78,0.8)] scale-105'
                  : 'bg-white/5 text-[#94A3B8] hover:text-white border border-white/10'
              }
            `}
            title={isListening ? 'Stop voice recognition (Alt+V)' : 'Start voice recognition (Alt+V)'}
          >
            {isListening ? (
              <>
                <span className="absolute inset-0 rounded-xl bg-[#FF204E]/50 animate-ping pointer-events-none" />
                <Mic className="h-4 w-4 animate-bounce relative z-10" />
              </>
            ) : (
              <MicOff className="h-4 w-4" />
            )}
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[9px] font-mono font-black tracking-wider uppercase px-2 py-0.5 rounded-full ${
                  isVerifying
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                    : isListening
                    ? 'bg-[#FF204E]/20 text-[#FF4D6D] border border-[#FF204E]/40 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {isVerifying ? 'VERIFYING EXECUTION' : isListening ? 'SPEECH LISTENING' : 'VOICE READY'}
              </span>

              {/* Equalizer frequency visualizer */}
              {isListening && (
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-[#FF204E] rounded-full animate-pulse h-2" style={{ animationDelay: '0.1s' }} />
                  <span className="w-0.5 bg-[#FF4D6D] rounded-full animate-pulse h-3" style={{ animationDelay: '0.2s' }} />
                  <span className="w-0.5 bg-[#FF204E] rounded-full animate-pulse h-1.5" style={{ animationDelay: '0.3s' }} />
                  <span className="w-0.5 bg-[#FF4D6D] rounded-full animate-pulse h-3" style={{ animationDelay: '0.4s' }} />
                  <span className="w-0.5 bg-[#FF204E] rounded-full animate-pulse h-2" style={{ animationDelay: '0.15s' }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Confidence Score Badge & Action Toggles */}
        <div className="flex items-center gap-2">
          {/* Confidence Score Meter */}
          {renderConfidenceBadge()}

          {/* TTS Toggle */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setTtsEnabled(!ttsEnabled);
            }}
            className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              ttsEnabled
                ? 'text-[#FF4D6D] hover:bg-[#FF204E]/20 bg-[#FF204E]/10 border border-[#FF204E]/30'
                : 'text-slate-500 hover:text-slate-300 bg-white/5 border border-white/5'
            }`}
            title={ttsEnabled ? 'Voice Response Enabled (Click to Mute)' : 'Voice Response Muted (Click to Enable)'}
          >
            {ttsEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>

          {/* Cheatsheet Modal Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsVoiceModalOpen(true);
            }}
            className="h-7 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer border border-white/10"
            title="Open Voice Command Cheatsheet (Right-click Header Mic)"
          >
            <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Cheatsheet</span>
          </button>

          {/* Stop / Close */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              stopListening();
            }}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Close Voice HUD"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* HUD MAIN BODY: Real-time Transcript & AI Interpretation Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        
        {/* PANEL 1: Real-time Speech Transcript ("Heard") */}
        <div className="rounded-xl neumorph-inset p-2.5 bg-[#050102]/80 border border-white/5 flex flex-col justify-between min-h-[58px]">
          <div className="text-[10px] font-mono text-[#94A3B8] font-semibold flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF204E] animate-pulse" />
              <span>Real-Time Transcript (Voice Input):</span>
            </span>
            {isListening && (
              <span className="text-[9px] text-amber-400/80 font-mono">Listening...</span>
            )}
          </div>

          <div className="text-xs text-white font-medium mt-1 leading-snug break-words">
            {rawSpeechText ? (
              <span className="text-amber-200 italic font-semibold">
                "{rawSpeechText}"
              </span>
            ) : (
              <span className="text-slate-500 text-[11px]">
                Speak a command like <strong className="text-slate-300">"Create task review audit with high priority"</strong> or <strong className="text-slate-300">"Go to tasks"</strong>
              </span>
            )}
          </div>
        </div>

        {/* PANEL 2: AI's Structured Interpretation ("Resolved Intent") */}
        <div className={`rounded-xl neumorph-card p-2.5 border transition-all flex flex-col justify-between min-h-[58px] ${
          isVerifying
            ? 'bg-amber-950/20 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
            : currentInterpretation && currentInterpretation.intent !== 'unknown'
            ? 'bg-[#140307]/80 border-[#FF204E]/30'
            : 'bg-white/5 border-white/5'
        }`}>
          <div className="text-[10px] font-mono text-[#94A3B8] font-semibold flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-cyan-400" />
              <span>AI Interpretation Preview:</span>
            </span>
            {currentInterpretation && (
              <span className="text-[9px] font-mono uppercase font-bold text-[#FF4D6D]">
                {currentInterpretation.intent}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-1 min-w-0">
            {getIntentIcon(currentInterpretation?.intent)}
            <div className="text-xs font-bold text-white truncate">
              {currentInterpretation ? (
                <span>{currentInterpretation.actionSummary}</span>
              ) : (
                <span className="text-slate-500 text-[11px] font-normal">
                  Awaiting spoken intent...
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* VERIFICATION & COUNTDOWN CONTROLLER (Shows during Pre-execution Verification) */}
      {isVerifying && pendingCommand && (
        <div className="rounded-xl neumorph-card p-2.5 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-amber-950/40 border border-amber-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
          
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative h-6 w-6 flex items-center justify-center shrink-0">
              <svg className="h-6 w-6 -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-400 transition-all duration-75"
                  strokeDasharray={`${verificationCountdown}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[8px] font-mono font-bold text-amber-300">
                {Math.ceil((verificationCountdown / 100) * 1.8)}s
              </span>
            </div>

            <div className="space-y-0.5">
              <div className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                <span>Executing in {((verificationCountdown / 100) * 1.8).toFixed(1)}s</span>
                <span className="text-[10px] text-amber-400 font-mono">(Press Enter to confirm or Esc to cancel)</span>
              </div>
              <p className="text-[10px] text-amber-300/80">
                Verify the AI interpretation above matches your intent before execution.
              </p>
            </div>
          </div>

          {/* Quick Action Verification Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                cancelPendingCommand();
              }}
              className="h-7 px-3 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              title="Cancel execution (Esc)"
            >
              <X className="h-3 w-3" />
              <span>Cancel</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                confirmPendingCommand();
              }}
              className="h-7 px-3.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)] hover:brightness-110 transition-all cursor-pointer flex items-center gap-1"
              title="Execute now (Enter)"
            >
              <CornerDownLeft className="h-3 w-3" />
              <span>Execute Now</span>
            </button>
          </div>

        </div>
      )}

      {/* EXECUTED RECENT COMMAND CONFIRMATION BADGE */}
      {!isVerifying && lastExecutedCommand && lastExecutedCommand.status === 'executed' && (
        <div className="flex items-center justify-between text-[11px] text-emerald-400 font-medium px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-1.5 truncate">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-300">Verified & Executed:</span>
            <span className="text-white font-semibold truncate">{lastExecutedCommand.actionSummary}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-300 ml-2 shrink-0">
            {lastExecutedCommand.confidence ? `${Math.round(lastExecutedCommand.confidence * 100)}% Confidence` : 'Verified'}
          </span>
        </div>
      )}

      {/* CANCELLED COMMAND CONFIRMATION BADGE */}
      {!isVerifying && lastExecutedCommand && lastExecutedCommand.status === 'cancelled' && (
        <div className="flex items-center gap-1.5 text-[11px] text-rose-400 font-medium px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20">
          <X className="h-3.5 w-3.5 text-rose-400 shrink-0" />
          <span className="text-slate-300">Command Cancelled:</span>
          <span className="text-white font-semibold truncate">{lastExecutedCommand.transcript}</span>
        </div>
      )}
    </aside>
  );
};
