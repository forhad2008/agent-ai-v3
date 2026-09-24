import React from 'react';
import { Mic, MicOff, Volume2, VolumeX, HelpCircle, X, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useVoiceCommand } from '../../context/VoiceCommandContext';
import { sound } from '../../services/sound';

export const VoiceCommandHUD: React.FC = () => {
  const {
    isListening,
    isSupported,
    interimTranscript,
    lastExecutedCommand,
    ttsEnabled,
    setTtsEnabled,
    toggleListening,
    stopListening,
    setIsVoiceModalOpen,
  } = useVoiceCommand();

  if (!isSupported) return null;

  // Only show HUD if listening or recently executed a command within 6 seconds
  const hasRecentCommand = !!lastExecutedCommand;
  const showHUD = isListening || (hasRecentCommand && interimTranscript);

  if (!showHUD && !isListening) return null;

  return (
    <aside
      aria-label="Voice Command Status HUD"
      className="
        fixed
        bottom-5
        left-1/2
        -translate-x-1/2
        z-[90]
        flex
        items-center
        gap-3
        px-4
        py-2.5
        rounded-2xl
        neumorph-card
        bg-[#0c0306]/95
        backdrop-blur-xl
        border
        border-[#FF204E]/40
        shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(255,32,78,0.35)]
        max-w-[92vw]
        w-auto
        animate-fadeIn
        transition-all
      "
    >
      {/* Microphone Icon with Pulsing Halo */}
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
              ? 'bg-gradient-to-br from-[#FF204E] to-[#E50914] text-white shadow-[0_0_15px_rgba(255,32,78,0.7)]'
              : 'bg-white/5 text-[#94A3B8] hover:text-white border border-white/10'
          }
        `}
        title={isListening ? 'Click to stop listening (Alt+V)' : 'Click to start listening (Alt+V)'}
      >
        {isListening ? (
          <>
            <span className="absolute inset-0 rounded-xl bg-[#FF204E]/50 animate-ping pointer-events-none" />
            <Mic className="h-4 w-4 animate-pulse relative z-10" />
          </>
        ) : (
          <MicOff className="h-4 w-4" />
        )}
      </button>

      {/* Audio Wave Visualizer & Live Transcript */}
      <div className="flex flex-col min-w-[180px] max-w-[340px] sm:max-w-[480px]">
        <div className="flex items-center gap-2">
          {/* Status badge */}
          <span
            className={`text-[10px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${
              isListening
                ? 'bg-[#FF204E]/20 text-[#FF4D6D] border border-[#FF204E]/40 animate-pulse'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {isListening ? 'LIVE SPEECH LISTENING' : 'VOICE READY'}
          </span>

          {/* Equalizer frequency visualizer */}
          {isListening && (
            <div className="flex items-end gap-1 h-3">
              <span className="w-0.5 bg-[#FF204E] rounded-full animate-pulse h-2" style={{ animationDelay: '0.1s' }} />
              <span className="w-0.5 bg-[#FF4D6D] rounded-full animate-pulse h-3" style={{ animationDelay: '0.2s' }} />
              <span className="w-0.5 bg-[#FF204E] rounded-full animate-pulse h-1.5" style={{ animationDelay: '0.3s' }} />
              <span className="w-0.5 bg-[#FF4D6D] rounded-full animate-pulse h-3" style={{ animationDelay: '0.4s' }} />
              <span className="w-0.5 bg-[#FF204E] rounded-full animate-pulse h-2" style={{ animationDelay: '0.15s' }} />
            </div>
          )}
        </div>

        {/* Live Transcript / Feedback Message */}
        <div className="text-xs text-white font-medium truncate mt-0.5">
          {interimTranscript ? (
            <span className="text-amber-300 italic">"{interimTranscript}"</span>
          ) : lastExecutedCommand ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="h-3 w-3 shrink-0" />
              <span className="truncate">{lastExecutedCommand.actionSummary}</span>
            </span>
          ) : (
            <span className="text-slate-400 text-[11px]">
              Try: <span className="text-white font-semibold">"Create task review audit with high priority"</span> or <span className="text-white font-semibold">"Go to tasks"</span>
            </span>
          )}
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-1.5 pl-2 border-l border-[#E50914]/20 shrink-0">
        {/* TTS Toggle */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setTtsEnabled(!ttsEnabled);
          }}
          className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
            ttsEnabled
              ? 'text-[#FF4D6D] hover:bg-[#FF204E]/20 bg-[#FF204E]/10'
              : 'text-slate-500 hover:text-slate-300 bg-white/5'
          }`}
          title={ttsEnabled ? 'Voice Response Enabled (Click to Mute TTS)' : 'Voice Response Muted (Click to Enable TTS)'}
        >
          {ttsEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        </button>

        {/* Open Full Hub */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setIsVoiceModalOpen(true);
          }}
          className="h-7 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer border border-white/10"
          title="Open Voice Command Hub & Cheatsheet"
        >
          <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
          <span className="hidden sm:inline">Commands</span>
        </button>

        {/* Close / Stop Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            stopListening();
          }}
          className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          title="Stop & Close Voice Bar"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
};
