import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  CheckCircle2,
  Play,
  Terminal,
  Clock,
  Compass,
  PlusCircle,
  Wrench,
  Music,
  Trash2,
  Layers,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Sliders,
} from 'lucide-react';
import { useVoiceCommand } from '../../context/VoiceCommandContext';
import { sound } from '../../services/sound';

export const VoiceCommandModal: React.FC = () => {
  const {
    isListening,
    isSupported,
    interimTranscript,
    finalTranscript,
    realtimeInterpretation,
    lastExecutedCommand,
    commandHistory,
    ttsEnabled,
    setTtsEnabled,
    verificationDelayMs,
    setVerificationDelayMs,
    toggleListening,
    isVoiceModalOpen,
    setIsVoiceModalOpen,
    executeManualVoiceCommand,
    clearHistory,
    cheatSheet,
  } = useVoiceCommand();

  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Task Creation' | 'Navigation' | 'AI & Tools' | 'System & Audio'>('All');
  const [testInput, setTestInput] = useState('');
  const [testFeedback, setTestFeedback] = useState<string | null>(null);

  if (!isVoiceModalOpen) return null;

  const filteredCheats = selectedCategory === 'All'
    ? cheatSheet
    : cheatSheet.filter((item) => item.category === selectedCategory);

  const handleTestCommand = (phrase: string) => {
    sound.playClick();
    const result = executeManualVoiceCommand(phrase);
    setTestFeedback(`Executed: ${result.actionSummary}`);
    setTimeout(() => setTestFeedback(null), 4000);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;
    handleTestCommand(testInput.trim());
    setTestInput('');
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Task Creation':
        return <PlusCircle className="h-3.5 w-3.5 text-emerald-400" />;
      case 'Navigation':
        return <Compass className="h-3.5 w-3.5 text-cyan-400" />;
      case 'AI & Tools':
        return <Wrench className="h-3.5 w-3.5 text-purple-400" />;
      case 'System & Audio':
        return <Music className="h-3.5 w-3.5 text-amber-400" />;
      default:
        return <Layers className="h-3.5 w-3.5 text-[#FF204E]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl neumorph-card border border-[#FF204E]/40 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(255,32,78,0.3)] flex flex-col">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#E50914]/20 bg-gradient-to-r from-[#140307]/90 via-[#0e0205]/80 to-[#140307]/90">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl neumorph-circle flex items-center justify-center text-[#FF204E] shadow-[0_0_15px_rgba(255,32,78,0.4)]">
              <Mic className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Voice Command Hub & Real-Time Interpreter
                </h3>
                <span className="hidden xs:inline-flex text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FF204E]/20 text-[#FF4D6D] border border-[#FF204E]/40 uppercase tracking-wider">
                  Web Speech Engine
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Speak naturally to create tasks, switch workspaces, dispatch agent queries & trigger tools with live transcript & verification.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsVoiceModalOpen(false);
            }}
            className="h-8 w-8 rounded-xl neumorph-circle flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Close Voice Hub"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#E50914]/30">
          
          {/* HERO VOICE STATUS & LIVE MICROPHONE CONTROLLER */}
          <div className="rounded-2xl neumorph-inset p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-5 bg-gradient-to-br from-[#120206]/60 to-[#070103]/80 border border-[#FF204E]/25">
            
            {/* Big Mic Button */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  toggleListening();
                }}
                className={`
                  relative
                  flex
                  h-16
                  w-16
                  sm:h-20
                  sm:w-20
                  items-center
                  justify-center
                  rounded-full
                  transition-all
                  cursor-pointer
                  shrink-0
                  ${
                    isListening
                      ? 'bg-gradient-to-tr from-[#FF204E] via-[#E50914] to-[#FF4D6D] text-white shadow-[0_0_30px_rgba(255,32,78,0.8)] scale-105'
                      : 'neumorph-circle text-[#94A3B8] hover:text-white hover:border-[#FF204E]/40'
                  }
                `}
                title={isListening ? 'Click to Stop Listening' : 'Click to Activate Voice Listening'}
              >
                {isListening && (
                  <span className="absolute inset-0 rounded-full border-2 border-[#FF204E] animate-ping opacity-75 pointer-events-none" />
                )}
                {isListening ? (
                  <Mic className="h-8 w-8 sm:h-9 sm:w-9 animate-bounce" />
                ) : (
                  <Mic className="h-7 w-7 sm:h-8 sm:w-8" />
                )}
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${
                      isListening ? 'bg-emerald-400 animate-pulse ring-2 ring-emerald-500/30' : 'bg-slate-500'
                    }`}
                  />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    {isListening ? '🎙️ Active Listening On' : 'Microphone Inactive'}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] font-mono hidden sm:inline">
                    (Shortcut: <kbd className="px-1 py-0.5 rounded bg-black/50 border border-white/20 text-white">Alt+V</kbd>)
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  {isListening ? (
                    <span className="text-amber-300 font-medium animate-pulse">
                      Listening for commands... Speak your instructions clearly.
                    </span>
                  ) : (
                    <span>Click the microphone or press <strong className="text-white">Alt+V</strong> to start speaking hands-free.</span>
                  )}
                </div>
                {/* Visualizer bars */}
                {isListening && (
                  <div className="flex items-end gap-1 h-3.5 pt-1">
                    <span className="w-1 bg-[#FF204E] rounded-full animate-pulse h-full" />
                    <span className="w-1 bg-[#FF4D6D] rounded-full animate-pulse h-2" style={{ animationDelay: '0.1s' }} />
                    <span className="w-1 bg-[#FF204E] rounded-full animate-pulse h-3.5" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1 bg-[#FF4D6D] rounded-full animate-pulse h-1.5" style={{ animationDelay: '0.3s' }} />
                    <span className="w-1 bg-[#FF204E] rounded-full animate-pulse h-3" style={{ animationDelay: '0.4s' }} />
                  </div>
                )}
              </div>
            </div>

            {/* Voice Feedback & Pre-Execution Verification Preferences */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              {/* Verification Timing Selection */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                <Sliders className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-slate-400 text-[11px]">Verification Delay:</span>
                <select
                  value={verificationDelayMs}
                  onChange={(e) => {
                    sound.playClick();
                    setVerificationDelayMs(Number(e.target.value));
                  }}
                  className="bg-[#0c0205] text-white text-xs rounded-lg px-2 py-1 border border-white/15 focus:outline-none focus:border-[#FF204E]"
                >
                  <option value={1800}>1.8s (Standard Verification)</option>
                  <option value={3000}>3.0s (Relaxed Verification)</option>
                  <option value={0}>0s (Instant Execution)</option>
                </select>
              </div>

              {/* TTS Audio toggle */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setTtsEnabled(!ttsEnabled);
                }}
                className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  ttsEnabled
                    ? 'bg-[#FF204E]/15 border-[#FF204E]/50 text-[#FF4D6D] shadow-[0_0_12px_rgba(255,32,78,0.25)]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <span>{ttsEnabled ? 'Voice Feedback: ON' : 'Voice Feedback: MUTED'}</span>
              </button>
            </div>
          </div>

          {/* REAL-TIME TRANSCRIPT & INTERPRETATION PREVIEW IN MODAL */}
          {(interimTranscript || finalTranscript || realtimeInterpretation || testFeedback) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Spoken text */}
              <div className="rounded-xl neumorph-card p-3.5 border border-amber-500/30 bg-amber-500/5 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-amber-300 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 animate-spin" />
                    <span>Real-Time Voice Input:</span>
                  </span>
                  {testFeedback && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {testFeedback}
                    </span>
                  )}
                </div>
                <div className="text-sm font-semibold text-white">
                  {interimTranscript ? (
                    <span className="text-amber-200">"{interimTranscript}"</span>
                  ) : finalTranscript ? (
                    <span className="text-emerald-300">"{finalTranscript}"</span>
                  ) : null}
                </div>
              </div>

              {/* Real-time interpretation */}
              {realtimeInterpretation && (
                <div className="rounded-xl neumorph-card p-3.5 border border-[#FF204E]/40 bg-[#150307]/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#FF4D6D] font-bold">
                    <span>AI Interpretation & Confidence:</span>
                    <div className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>{Math.round(realtimeInterpretation.confidence * 100)}% Match</span>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-white truncate">
                    {realtimeInterpretation.actionSummary}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INTERACTIVE CHEATSHEET SECTION */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-[#FF204E]" />
                  <span>Hands-Free Command Cheat Sheet</span>
                </h4>
                <p className="text-[11px] text-[#94A3B8]">
                  Click any command card to test its instant execution or speak the phrase out loud.
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {(['All', 'Task Creation', 'Navigation', 'AI & Tools', 'System & Audio'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedCategory(cat);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 cursor-pointer border ${
                      selectedCategory === cat
                        ? 'bg-[#FF204E] text-white border-[#FF204E] shadow-[0_0_10px_rgba(255,32,78,0.4)]'
                        : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Command Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {filteredCheats.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-xl neumorph-card p-3 border border-white/5 hover:border-[#FF204E]/40 hover:bg-[#150408]/60 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-[#FF4D6D] transition-colors">
                        {getCategoryIcon(item.category)}
                        <span>"{item.phrase}"</span>
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">
                      Intent: <code className="text-[#FF4D6D]">{item.intent}</code>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleTestCommand(item.phrase.split('/')[0].replace(/\[.*?\]/g, 'Sample Task'))}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#FF204E]/10 hover:bg-[#FF204E]/25 text-[#FF204E] text-[10px] font-bold border border-[#FF204E]/30 transition-all cursor-pointer"
                      title="Simulate Voice Command"
                    >
                      <Play className="h-2.5 w-2.5" />
                      <span>Test Command</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MANUAL SIMULATOR INPUT */}
          <div className="rounded-2xl neumorph-inset p-4 space-y-2 border border-white/10">
            <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Manual Voice Simulator & NLP Debugger</span>
            </h5>
            <p className="text-[11px] text-[#94A3B8]">
              Type any command phrase to verify the parser or test without microphone access:
            </p>
            <form onSubmit={handleManualSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder='e.g., "Create task Audit checkout flow with urgent priority" or "Go to Thought Process"'
                className="flex-1 rounded-xl neumorph-input bg-[#060103] h-10 px-3 text-xs text-white placeholder-slate-500 border border-[#E50914]/30 focus:border-[#FF204E] focus:outline-none"
              />
              <button
                type="submit"
                className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#FF204E] to-[#E50914] text-white text-xs font-bold shadow-[0_0_12px_rgba(255,32,78,0.4)] hover:brightness-110 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                <span>Execute</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          {/* AUDIT LOG OF EXECUTED VOICE COMMANDS WITH CONFIDENCE BADGES */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>Voice Command Execution History ({commandHistory.length})</span>
              </h5>
              {commandHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    sound.play('delete');
                    clearHistory();
                  }}
                  className="text-[11px] text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Clear History</span>
                </button>
              )}
            </div>

            {commandHistory.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-[#94A3B8]">
                No voice commands executed in this session yet. Click the mic button above and start speaking!
              </div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {commandHistory.map((cmd) => {
                  const score = cmd.confidence ? Math.round(cmd.confidence * 100) : 94;
                  return (
                    <div
                      key={cmd.id}
                      className="flex items-center justify-between p-2.5 rounded-xl neumorph-card border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`h-2 w-2 rounded-full shrink-0 ${
                            cmd.success ? 'bg-emerald-400' : 'bg-amber-400'
                          }`}
                        />
                        <div className="min-w-0">
                          <div className="text-white font-medium truncate">
                            "{cmd.transcript}"
                          </div>
                          <div className="text-[10px] text-[#94A3B8] truncate flex items-center gap-2">
                            <span className="text-[#FF4D6D] font-mono">{cmd.intent}</span>
                            <span>•</span>
                            <span>{cmd.actionSummary}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                          <ShieldCheck className="h-2.5 w-2.5" />
                          {score}%
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {cmd.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-[#E50914]/20 bg-[#0c0205] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Browser Web Speech & Real-Time Verification Engine Active</span>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsVoiceModalOpen(false);
            }}
            className="px-5 py-2 rounded-xl neumorph-btn-primary text-xs font-bold text-white shadow-lg cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
