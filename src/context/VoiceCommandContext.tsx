import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAgent } from './AgentContext';
import { voiceCommandService, VOICE_CHEAT_SHEET } from '../services/voiceCommandService';
import { VoiceCommandRecord, VoiceIntentType, VoiceCheatItem } from '../types';
import { sound } from '../services/sound';

interface VoiceCommandContextType {
  isListening: boolean;
  isSupported: boolean;
  interimTranscript: string;
  finalTranscript: string;
  lastExecutedCommand: VoiceCommandRecord | null;
  commandHistory: VoiceCommandRecord[];
  ttsEnabled: boolean;
  setTtsEnabled: (enabled: boolean) => void;
  toggleListening: () => void;
  startListening: () => void;
  stopListening: () => void;
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
  const [lastExecutedCommand, setLastExecutedCommand] = useState<VoiceCommandRecord | null>(null);
  const [commandHistory, setCommandHistory] = useState<VoiceCommandRecord[]>([]);
  const [ttsEnabled, setTtsEnabledState] = useState<boolean>(true);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsSupported(voiceCommandService.isSupported());

    const unsubTranscript = voiceCommandService.subscribeTranscript((interim, final) => {
      setInterimTranscript(interim);
      if (final) {
        setFinalTranscript(final);
      }
    });

    const unsubState = voiceCommandService.subscribeStateChange((listening) => {
      setIsListening(listening);
      if (!listening) {
        setInterimTranscript('');
      }
    });

    const unsubCommand = voiceCommandService.subscribeCommandExecuted((record) => {
      setLastExecutedCommand(record);
      setCommandHistory(voiceCommandService.getCommandHistory());
      handleExecuteCommandAction(record);
    });

    return () => {
      unsubTranscript();
      unsubState();
      unsubCommand();
    };
  }, []);

  // Dispatch live application action based on voice intent
  const handleExecuteCommandAction = useCallback((record: VoiceCommandRecord) => {
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

          // Navigate to tasks so user sees the newly created task
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
    return voiceCommandService.processVoiceText(text, 1.0);
  };

  const clearHistory = () => {
    voiceCommandService.clearHistory();
    setCommandHistory([]);
  };

  // Keyboard shortcut listener: Alt+V or Ctrl+Shift+V to toggle listening
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'v') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'v')) {
        e.preventDefault();
        toggleListening();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <VoiceCommandContext.Provider
      value={{
        isListening,
        isSupported,
        interimTranscript,
        finalTranscript,
        lastExecutedCommand,
        commandHistory,
        ttsEnabled,
        setTtsEnabled,
        toggleListening,
        startListening,
        stopListening,
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
