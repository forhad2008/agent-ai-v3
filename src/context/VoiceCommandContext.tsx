import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAgent } from './AgentContext';
import { voiceCommandService, VOICE_CHEAT_SHEET } from '../services/voiceCommandService';
import { VoiceCommandRecord, VoiceInterpretation, VoiceCheatItem, VoiceConfidenceLevel } from '../types';
import { sound } from '../services/sound';

interface VoiceCommandContextType {
  isListening: boolean;
  isSupported: boolean;
  interimTranscript: string;
  finalTranscript: string;
  realtimeInterpretation: VoiceInterpretation | null;
  lastExecutedCommand: VoiceCommandRecord | null;
  pendingCommand: VoiceCommandRecord | null;
  verificationCountdown: number; // in percentage 0 - 100
  isVerifying: boolean;
  commandHistory: VoiceCommandRecord[];
  ttsEnabled: boolean;
  setTtsEnabled: (enabled: boolean) => void;
  verificationDelayMs: number;
  setVerificationDelayMs: (ms: number) => void;
  toggleListening: () => void;
  startListening: () => void;
  stopListening: () => void;
  confirmPendingCommand: () => void;
  cancelPendingCommand: () => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  executeManualVoiceCommand: (text: string) => VoiceCommandRecord;
  clearHistory: () => void;
  cheatSheet: VoiceCheatItem[];
}

const VoiceCommandContext = createContext<VoiceCommandContextType | undefined>(undefined);

export const VoiceCommandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    setActiveView,
    createTask,
    handleSendMessage,
    setSearchQuery,
    sendNotification,
    setIsNotificationCenterOpen,
    clearAllNotifications,
    markAllNotificationsAsRead,
    openPlanArchitect,
    executeToolDirectly,
  } = useAgent();

  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [finalTranscript, setFinalTranscript] = useState<string>('');
  const [realtimeInterpretation, setRealtimeInterpretation] = useState<VoiceInterpretation | null>(null);
  const [lastExecutedCommand, setLastExecutedCommand] = useState<VoiceCommandRecord | null>(null);
  const [pendingCommand, setPendingCommand] = useState<VoiceCommandRecord | null>(null);
  const [verificationCountdown, setVerificationCountdown] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [commandHistory, setCommandHistory] = useState<VoiceCommandRecord[]>([]);
  const [ttsEnabled, setTtsEnabledState] = useState<boolean>(true);
  const [verificationDelayMs, setVerificationDelayMs] = useState<number>(1800);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);

  const countdownTimerRef = useRef<any>(null);
  const pendingCommandRef = useRef<VoiceCommandRecord | null>(null);

  useEffect(() => {
    pendingCommandRef.current = pendingCommand;
  }, [pendingCommand]);

  // Dispatch live application action based on voice intent
  const executeActionNow = useCallback((record: VoiceCommandRecord) => {
    const { intent, parameters } = record;

    switch (intent) {
      case 'create_task': {
        const { title, priority, description } = parameters || {};
        if (title) {
          const newTask = createTask(
            title,
            description || 'Voice-activated hands-free task creation',
            priority || 'Medium',
            true
          );

          sendNotification({
            type: 'task_started',
            title: `🎤 Voice Task Created: ${title}`,
            message: `Priority set to ${priority || 'Medium'}. Initialized autonomously via speech command.`,
            taskId: newTask.id,
            taskTitle: newTask.title,
            priority: (priority?.toLowerCase() as any) || 'normal',
          });

          setActiveView('tasks');
        }
        break;
      }

      case 'navigate': {
        const { view, action } = parameters || {};
        if (view) {
          setActiveView(view as any);
        } else if (action === 'open_notifications') {
          setIsNotificationCenterOpen(true);
        } else if (action === 'open_planner') {
          openPlanArchitect();
        }
        break;
      }

      case 'search': {
        const { query } = parameters || {};
        if (query) {
          setSearchQuery(query);
        }
        break;
      }

      case 'ask_agent': {
        const { prompt } = parameters || {};
        if (prompt) {
          setActiveView('chat');
          handleSendMessage(prompt);
        }
        break;
      }

      case 'execute_tool': {
        const { tool } = parameters || {};
        if (tool) {
          executeToolDirectly(tool);
          setActiveView('activity');
        }
        break;
      }

      case 'manage_alarm': {
        const { action } = parameters || {};
        if (action === 'play_pirates') {
          sound.playPiratesTheme(true);
        } else if (action === 'stop_pirates') {
          sound.stopPiratesTheme();
        }
        break;
      }

      case 'manage_notifications': {
        const { action } = parameters || {};
        if (action === 'clear_all') {
          clearAllNotifications();
        } else if (action === 'mark_all_read') {
          markAllNotificationsAsRead();
        } else {
          setIsNotificationCenterOpen(true);
        }
        break;
      }

      case 'system_control': {
        const { action } = parameters || {};
        if (action === 'stop_listening') {
          voiceCommandService.stopListening();
        }
        break;
      }

      case 'help': {
        setIsVoiceModalOpen(true);
        break;
      }

      default:
        break;
    }

    setLastExecutedCommand({ ...record, status: 'executed' });
    setIsVerifying(false);
    setPendingCommand(null);
    setVerificationCountdown(0);
  }, [
    createTask,
    sendNotification,
    setActiveView,
    setSearchQuery,
    handleSendMessage,
    executeToolDirectly,
    clearAllNotifications,
    markAllNotificationsAsRead,
    setIsNotificationCenterOpen,
    openPlanArchitect,
  ]);

  const cancelPendingCommand = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    sound.play('click');
    if (pendingCommandRef.current) {
      setLastExecutedCommand({
        ...pendingCommandRef.current,
        status: 'cancelled',
        actionSummary: `Cancelled: "${pendingCommandRef.current.transcript}"`,
      });
    }
    setPendingCommand(null);
    setIsVerifying(false);
    setVerificationCountdown(0);
  }, []);

  const confirmPendingCommand = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (pendingCommandRef.current) {
      executeActionNow(pendingCommandRef.current);
    }
  }, [executeActionNow]);

  // Handle incoming speech commands with pre-execution verification window
  const handleIncomingCommand = useCallback((record: VoiceCommandRecord) => {
    // If unknown or instant delay is 0, execute immediately or show feedback
    if (record.intent === 'unknown' || verificationDelayMs <= 0 || record.intent === 'system_control') {
      executeActionNow(record);
      return;
    }

    // Otherwise, initiate pre-execution verification period
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    const commandWithPending: VoiceCommandRecord = {
      ...record,
      status: 'pending_verification',
    };

    setPendingCommand(commandWithPending);
    setIsVerifying(true);
    setVerificationCountdown(100);

    const startTime = Date.now();
    const duration = verificationDelayMs;

    countdownTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / duration) * 100);
      setVerificationCountdown(remainingPct);

      if (elapsed >= duration) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
        executeActionNow(commandWithPending);
      }
    }, 40);
  }, [verificationDelayMs, executeActionNow]);

  useEffect(() => {
    setIsSupported(voiceCommandService.isSupported());

    const unsubTranscript = voiceCommandService.subscribeTranscript((interim, final) => {
      setInterimTranscript(interim);
      if (final) {
        setFinalTranscript(final);
      }

      // Compute real-time interpretation for interim speech
      const activeText = interim || final;
      if (activeText.trim()) {
        const preview = voiceCommandService.previewInterpretation(activeText.trim());
        setRealtimeInterpretation(preview);
      } else {
        setRealtimeInterpretation(null);
      }
    });

    const unsubState = voiceCommandService.subscribeStateChange((listening) => {
      setIsListening(listening);
      if (!listening) {
        setInterimTranscript('');
      }
    });

    const unsubCommand = voiceCommandService.subscribeCommandExecuted((record) => {
      setCommandHistory(voiceCommandService.getCommandHistory());
      handleIncomingCommand(record);
    });

    return () => {
      unsubTranscript();
      unsubState();
      unsubCommand();
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [handleIncomingCommand]);

  const setTtsEnabled = (enabled: boolean) => {
    setTtsEnabledState(enabled);
    voiceCommandService.setTtsEnabled(enabled);
  };

  const toggleListening = () => {
    voiceCommandService.toggleListening();
  };

  const startListening = () => {
    voiceCommandService.startListening();
  };

  const stopListening = () => {
    voiceCommandService.stopListening();
  };

  const executeManualVoiceCommand = (text: string) => {
    return voiceCommandService.processVoiceText(text, 0.98);
  };

  const clearHistory = () => {
    voiceCommandService.clearHistory();
    setCommandHistory([]);
  };

  // Keyboard shortcut listener: Alt+V or Ctrl+Shift+V to toggle listening; Enter to confirm pending, Esc to cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'v') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'v')) {
        e.preventDefault();
        toggleListening();
      } else if (e.key === 'Escape' && isVerifying) {
        e.preventDefault();
        cancelPendingCommand();
      } else if (e.key === 'Enter' && isVerifying) {
        e.preventDefault();
        confirmPendingCommand();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVerifying, cancelPendingCommand, confirmPendingCommand]);

  return (
    <VoiceCommandContext.Provider
      value={{
        isListening,
        isSupported,
        interimTranscript,
        finalTranscript,
        realtimeInterpretation,
        lastExecutedCommand,
        pendingCommand,
        verificationCountdown,
        isVerifying,
        commandHistory,
        ttsEnabled,
        setTtsEnabled,
        verificationDelayMs,
        setVerificationDelayMs,
        toggleListening,
        startListening,
        stopListening,
        confirmPendingCommand,
        cancelPendingCommand,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        executeManualVoiceCommand,
        clearHistory,
        cheatSheet: VOICE_CHEAT_SHEET,
      }}
    >
      {children}
    </VoiceCommandContext.Provider>
  );
};

export const useVoiceCommand = () => {
  const context = useContext(VoiceCommandContext);
  if (!context) {
    throw new Error('useVoiceCommand must be used within a VoiceCommandProvider');
  }
  return context;
};
