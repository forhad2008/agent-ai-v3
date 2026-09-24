// Web Speech API Voice-Activated Command Engine for Agent-sigma08
// Supports hands-free navigation, natural language task creation, agent dispatch, speech synthesis & tactile audio feedback

import { VoiceCommandRecord, VoiceIntentType, VoiceCheatItem, TaskPriority } from '../types';
import { sound } from './sound';

// Speech Recognition Type Definitions for TypeScript
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export interface VoiceCommandParseResult {
  intent: VoiceIntentType;
  actionSummary: string;
  responseSpeech: string;
  parameters: Record<string, any>;
  confidence?: number;
}

export const VOICE_CHEAT_SHEET: VoiceCheatItem[] = [
  // Navigation
  {
    phrase: 'Go to Dashboard',
    intent: 'navigate',
    description: 'Switch to live system analytics & metrics overview',
    category: 'Navigation',
  },
  {
    phrase: 'Open Tasks / Go to Task Manager',
    intent: 'navigate',
    description: 'Navigate to task pipeline, kanban & subtask board',
    category: 'Navigation',
  },
  {
    phrase: 'Open Chat / Talk to Agent',
    intent: 'navigate',
    description: 'Open conversational AI prompt workspace',
    category: 'Navigation',
  },
  {
    phrase: 'Open Thought Process',
    intent: 'navigate',
    description: 'Inspect deep reasoning chain, memory & tool planner',
    category: 'Navigation',
  },
  {
    phrase: 'Open Perfect Agent',
    intent: 'navigate',
    description: 'Launch the multi-engine autonomous agent orchestrator',
    category: 'Navigation',
  },
  {
    phrase: 'Open AI Lab',
    intent: 'navigate',
    description: 'Open AI Studio experimentation playground',
    category: 'Navigation',
  },
  {
    phrase: 'Open Image Studio',
    intent: 'navigate',
    description: 'Access generative image canvas and style presets',
    category: 'Navigation',
  },
  {
    phrase: 'Open Approvals',
    intent: 'navigate',
    description: 'Review pending security and tool approval requests',
    category: 'Navigation',
  },
  {
    phrase: 'Open Activity Log',
    intent: 'navigate',
    description: 'View real-time agent audit trails and event logs',
    category: 'Navigation',
  },
  {
    phrase: 'Open File Manager',
    intent: 'navigate',
    description: 'Browse workspace files, scripts, and documents',
    category: 'Navigation',
  },
  {
    phrase: 'Open Tools Catalog',
    intent: 'navigate',
    description: 'Inspect integrated MCP tools, SQL & APIs',
    category: 'Navigation',
  },
  {
    phrase: 'Open Settings / My Profile',
    intent: 'navigate',
    description: 'Configure agent parameters, API keys, or profile',
    category: 'Navigation',
  },
  {
    phrase: 'Open Master Plan / Plan Architect',
    intent: 'navigate',
    description: 'Launch high-level goal breakdown and roadmapping engine',
    category: 'Navigation',
  },

  // Task Creation
  {
    phrase: 'Create task [Title] with urgent priority',
    intent: 'create_task',
    description: 'Instantly creates a new urgent task in the pipeline',
    category: 'Task Creation',
  },
  {
    phrase: 'Add task [Title] with high priority',
    intent: 'create_task',
    description: 'Adds a high priority task with auto-categorization',
    category: 'Task Creation',
  },
  {
    phrase: 'New task [Title]',
    intent: 'create_task',
    description: 'Quickly creates a standard task hands-free',
    category: 'Task Creation',
  },
  {
    phrase: 'Create database backup task with high priority',
    intent: 'create_task',
    description: 'Creates tagged task with automatic priority assignment',
    category: 'Task Creation',
  },

  // AI & Tools
  {
    phrase: 'Search for [query]',
    intent: 'search',
    description: 'Performs instant global search across files, tasks & tools',
    category: 'AI & Tools',
  },
  {
    phrase: 'Ask agent [your prompt/question]',
    intent: 'ask_agent',
    description: 'Dispatches query directly to Agent-sigma08 reasoning core',
    category: 'AI & Tools',
  },
  {
    phrase: 'Run security scan',
    intent: 'execute_tool',
    description: 'Executes autonomous security audit tool',
    category: 'AI & Tools',
  },
  {
    phrase: 'Execute database indexing',
    intent: 'execute_tool',
    description: 'Triggers SQL query and database optimization',
    category: 'AI & Tools',
  },

  // System & Audio
  {
    phrase: 'Open Notifications / Clear Notifications',
    intent: 'manage_notifications',
    description: 'Toggles notification hub or clears alert badge',
    category: 'System & Audio',
  },
  {
    phrase: 'Play Pirates Theme / Stop Audio',
    intent: 'manage_alarm',
    description: 'Plays Pirates of the Caribbean soundtrack or silences ringtone',
    category: 'System & Audio',
  },
  {
    phrase: 'Help / Voice Commands',
    intent: 'help',
    description: 'Opens this hands-free voice command cheatsheet',
    category: 'System & Audio',
  },
  {
    phrase: 'Stop listening / Mute microphone',
    intent: 'system_control',
    description: 'Deactivates live voice speech recognition',
    category: 'System & Audio',
  },
];

export class VoiceCommandService {
  private recognition: any = null;
  private isListening: boolean = false;
  private continuous: boolean = true;
  private language: string = 'en-US';
  private ttsEnabled: boolean = true;
  private onTranscriptCallbacks: Set<(interim: string, final: string) => void> = new Set();
  private onCommandExecutedCallbacks: Set<(record: VoiceCommandRecord) => void> = new Set();
  private onStateChangeCallbacks: Set<(listening: boolean) => void> = new Set();
  private commandHistory: VoiceCommandRecord[] = [];

  constructor() {
    this.initRecognition();
  }

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  private initRecognition() {
    if (!this.isSupported()) return;

    try {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = this.continuous;
      this.recognition.interimResults = true;
      this.recognition.lang = this.language;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.notifyStateChange(true);
        sound.play('click');
      };

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptSegment;
          } else {
            interimTranscript += transcriptSegment;
          }
        }

        this.notifyTranscript(interimTranscript, finalTranscript);

        if (finalTranscript.trim()) {
          const confidence = event.results[event.results.length - 1][0].confidence;
          this.processVoiceText(finalTranscript.trim(), confidence);
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          this.isListening = false;
          this.notifyStateChange(false);
        }
      };

      this.recognition.onend = () => {
        // If we intended to stay listening continuously, restart unless explicitly stopped
        if (this.isListening && this.continuous) {
          try {
            this.recognition.start();
          } catch (e) {
            this.isListening = false;
            this.notifyStateChange(false);
          }
        } else {
          this.isListening = false;
          this.notifyStateChange(false);
        }
      };
    } catch (e) {
      console.warn('SpeechRecognition initialization error:', e);
    }
  }

  public setLanguage(langCode: string) {
    this.language = langCode || 'en-US';
    if (this.recognition) {
      this.recognition.lang = this.language;
    }
  }

  public setTtsEnabled(enabled: boolean) {
    this.ttsEnabled = enabled;
  }

  public isTtsEnabled(): boolean {
    return this.ttsEnabled;
  }

  public startListening() {
    if (!this.isSupported()) {
      console.warn('Web Speech API is not supported in this browser.');
      return;
    }
    if (!this.recognition) {
      this.initRecognition();
    }
    try {
      this.isListening = true;
      this.recognition.start();
    } catch (e) {
      console.warn('Speech recognition start failed or already active:', e);
    }
  }

  public stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.notifyStateChange(false);
  }

  public toggleListening(): boolean {
    if (this.isListening) {
      this.stopListening();
      return false;
    } else {
      this.startListening();
      return true;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public subscribeTranscript(cb: (interim: string, final: string) => void): () => void {
    this.onTranscriptCallbacks.add(cb);
    return () => this.onTranscriptCallbacks.delete(cb);
  }

  public subscribeCommandExecuted(cb: (record: VoiceCommandRecord) => void): () => void {
    this.onCommandExecutedCallbacks.add(cb);
    return () => this.onCommandExecutedCallbacks.delete(cb);
  }

  public subscribeStateChange(cb: (listening: boolean) => void): () => void {
    this.onStateChangeCallbacks.add(cb);
    cb(this.isListening);
    return () => this.onStateChangeCallbacks.delete(cb);
  }

  private notifyTranscript(interim: string, final: string) {
    this.onTranscriptCallbacks.forEach((cb) => cb(interim, final));
  }

  private notifyStateChange(listening: boolean) {
    this.onStateChangeCallbacks.forEach((cb) => cb(listening));
  }

  // Parse natural voice transcript into structured command
  public parseCommand(rawText: string): VoiceCommandParseResult {
    const text = rawText.trim().toLowerCase();
    
    // 1. Wake word stripping (e.g., "Hey Sigma", "Sigma", "Agent Sigma", "Computer", "Jarvis")
    const cleanText = text
      .replace(/^(hey|ok|okay|hi|hello)?\s*(sigma|agent sigma|agent|sigma08|computer)\s*[,:\-]?\s*/i, '')
      .trim();

    // 2. STOP / MUTE COMMANDS
    if (
      cleanText === 'stop listening' ||
      cleanText === 'disable voice' ||
      cleanText === 'turn off voice' ||
      cleanText === 'stop voice' ||
      cleanText === 'mute' ||
      cleanText === 'mute microphone'
    ) {
      return {
        intent: 'system_control',
        actionSummary: 'Stopped voice listening',
        responseSpeech: 'Voice recognition stopped.',
        parameters: { action: 'stop_listening' },
      };
    }

    // 3. HELP / CHEATSHEET
    if (
      cleanText === 'help' ||
      cleanText === 'voice commands' ||
      cleanText === 'what can you do' ||
      cleanText === 'show voice commands' ||
      cleanText === 'show commands' ||
      cleanText === 'open voice hub' ||
      cleanText === 'voice hub'
    ) {
      return {
        intent: 'help',
        actionSummary: 'Opened Voice Command Hub',
        responseSpeech: 'Here are all available voice commands.',
        parameters: { modal: 'voice_hub' },
      };
    }

    // 4. TASK CREATION (HANDS-FREE)
    // Matches: "create task [title]", "add task [title]", "new task [title]", "make a task [title]", "todo [title]"
    const createTaskRegex = /^(?:create|add|new|make|schedule|insert)\s+(?:a\s+)?(?:new\s+)?task\s+(.+)$/i;
    const todoRegex = /^todo\s+(.+)$/i;
    const taskMatch = cleanText.match(createTaskRegex) || cleanText.match(todoRegex);

    if (taskMatch) {
      let taskClause = taskMatch[1].trim();
      let priority: TaskPriority = 'Medium';

      // Check priority keywords within clause
      if (/\b(urgent|critical|emergency|p0)\b/i.test(taskClause)) {
        priority = 'Urgent';
        taskClause = taskClause.replace(/\s*(?:with\s+)?(?:urgent|critical|emergency|p0)(?:\s+priority)?\s*/gi, ' ').trim();
      } else if (/\b(high priority|high|p1)\b/i.test(taskClause)) {
        priority = 'High';
        taskClause = taskClause.replace(/\s*(?:with\s+)?(?:high)(?:\s+priority)?\s*/gi, ' ').trim();
      } else if (/\b(low priority|low|p3)\b/i.test(taskClause)) {
        priority = 'Low';
        taskClause = taskClause.replace(/\s*(?:with\s+)?(?:low)(?:\s+priority)?\s*/gi, ' ').trim();
      } else if (/\b(medium priority|medium|normal|p2)\b/i.test(taskClause)) {
        priority = 'Medium';
        taskClause = taskClause.replace(/\s*(?:with\s+)?(?:medium|normal)(?:\s+priority)?\s*/gi, ' ').trim();
      }

      // Cleanup remaining filler
      taskClause = taskClause.replace(/^(to|named|called|for)\s+/i, '').trim();

      // Capitalize first letter of task title
      const title = taskClause.charAt(0).toUpperCase() + taskClause.slice(1);

      return {
        intent: 'create_task',
        actionSummary: `Created Task: "${title}" (${priority} Priority)`,
        responseSpeech: `Task created: ${title} with ${priority} priority.`,
        parameters: {
          title,
          priority,
          description: `Voice-created task initialized hands-free via Web Speech API command.`,
        },
      };
    }

    // 5. NAVIGATION COMMANDS
    // e.g. "go to dashboard", "open chat", "show tasks", "navigate to files"
    const navMatch = cleanText.match(/^(?:go to|navigate to|open|show|switch to|view)\s+(.+)$/i);
    if (navMatch) {
      const target = navMatch[1].trim().toLowerCase();

      if (target.includes('dash') || target.includes('overview') || target.includes('home') || target.includes('stats')) {
        return {
          intent: 'navigate',
          actionSummary: 'Navigated to Dashboard',
          responseSpeech: 'Switching to Dashboard.',
          parameters: { view: 'dashboard' },
        };
      }
      if (target.includes('task') || target.includes('kanban') || target.includes('todo') || target.includes('pipeline')) {
        return {
          intent: 'navigate',
          actionSummary: 'Navigated to Tasks',
          responseSpeech: 'Opening Task Manager.',
          parameters: { view: 'tasks' },
        };
      }
      if (target.includes('chat') || target.includes('prompt') || target.includes('conversation') || target.includes('agent')) {
        return {
          intent: 'navigate',
          actionSummary: 'Navigated to Chat Workspace',
          responseSpeech: 'Opening AI Chat workspace.',
          parameters: { view: 'chat' },
        };
      }
      if (target.includes('thought') || target.includes('reason') || target.includes('thinking')) {
        return {
          intent: 'navigate',
          actionSummary: 'Navigated to Thought Process',
          responseSpeech: 'Opening Thought Process and Reasoning chain.',
          parameters: { view: 'thought-process' },
        };
      }
      if (target.includes('perfect') || target.includes('super agent') || target.includes('autonomous')) {
        return {
          intent: 'navigate',
          actionSummary: 'Navigated to Perfect Agent Hub',
          responseSpeech: 'Opening Perfect Agent orchestrator.',
          parameters: { view: 'perfect-agent' },
        };
      }
      if (target.includes('ai lab') || target.includes('lab') || target.includes('studio') || target.includes('playground')) {
        return {
          intent: 'navigate',
          actionSummary: 'Navigated to AI Lab',
          responseSpeech: 'Opening AI Lab.',
          parameters: { view: 'ailab' },
        };
      }
      if (target.includes('image') || target.includes('photo') || target.includes('art') || target.includes('generator')) {
        return {
          intent: 'navigate',
          actionSummary: 'Navigated to Image Studio',
          responseSpeech: 'Opening Generative Image Studio.',
          parameters: { view: 'image-studio' },
        };
      }
      if (target.includes('approval') || target.includes('permission') || target.includes('review')) {
        return {
          intent: 'navigate',
          actionSummary: 'Navigated to Approvals',
          responseSpeech: 'Opening pending approvals.',
          parameters: { view: 'approvals' },
        };
      }
      if (target.includes('activity') || target.includes('log') || target.includes('audit') || target.includes('history')) {
        return {
          intent: 'navigate',
          actionSummary: 'Navigated to Activity Log',
          responseSpeech: 'Opening live activity audit log.',
          parameters: { view: 'activity' },
        };
      }
      if (target.includes('file') || target.includes('document') || target.includes('asset') || target.includes('workspace')) {
        return {
          intent: 'navigate',
          actionSummary: 'Navigated to File Manager',
          responseSpeech: 'Opening File Manager.',
          parameters: { view: 'files' },
        };
      }
      if (target.includes('tool') || target.includes('integration') || target.includes('mcp') || target.includes('plugin')) {
        return {
          intent: 'navigate',
          actionSummary: 'Navigated to Tools & Integrations',
          responseSpeech: 'Opening Tools Catalog.',
          parameters: { view: 'tools' },
        };
      }
      if (target.includes('setting') || target.includes('config') || target.includes('preference')) {
        return {
          intent: 'navigate',
          actionSummary: 'Navigated to Settings',
          responseSpeech: 'Opening Settings.',
          parameters: { view: 'settings' },
        };
      }
      if (target.includes('profile') || target.includes('account') || target.includes('user')) {
        return {
          intent: 'navigate',
          actionSummary: 'Navigated to User Profile',
          responseSpeech: 'Opening User Profile.',
          parameters: { view: 'profile' },
        };
      }
      if (target.includes('notification') || target.includes('alert') || target.includes('bell')) {
        return {
          intent: 'manage_notifications',
          actionSummary: 'Opened Notification Center',
          responseSpeech: 'Opening Notification Center.',
          parameters: { action: 'open_notifications' },
        };
      }
      if (target.includes('plan') || target.includes('architect') || target.includes('roadmap') || target.includes('goal')) {
        return {
          intent: 'navigate',
          actionSummary: 'Opened Master Plan Architect',
          responseSpeech: 'Opening Plan Architect.',
          parameters: { action: 'open_planner' },
        };
      }
    }

    // Direct single word navigation triggers
    if (cleanText === 'dashboard') return { intent: 'navigate', actionSummary: 'Navigated to Dashboard', responseSpeech: 'Dashboard.', parameters: { view: 'dashboard' } };
    if (cleanText === 'tasks' || cleanText === 'task manager') return { intent: 'navigate', actionSummary: 'Navigated to Tasks', responseSpeech: 'Tasks.', parameters: { view: 'tasks' } };
    if (cleanText === 'chat') return { intent: 'navigate', actionSummary: 'Navigated to Chat', responseSpeech: 'Chat.', parameters: { view: 'chat' } };
    if (cleanText === 'approvals') return { intent: 'navigate', actionSummary: 'Navigated to Approvals', responseSpeech: 'Approvals.', parameters: { view: 'approvals' } };
    if (cleanText === 'activity' || cleanText === 'logs') return { intent: 'navigate', actionSummary: 'Navigated to Activity Log', responseSpeech: 'Activity.', parameters: { view: 'activity' } };
    if (cleanText === 'files') return { intent: 'navigate', actionSummary: 'Navigated to Files', responseSpeech: 'Files.', parameters: { view: 'files' } };
    if (cleanText === 'tools') return { intent: 'navigate', actionSummary: 'Navigated to Tools', responseSpeech: 'Tools.', parameters: { view: 'tools' } };
    if (cleanText === 'settings') return { intent: 'navigate', actionSummary: 'Navigated to Settings', responseSpeech: 'Settings.', parameters: { view: 'settings' } };
    if (cleanText === 'profile') return { intent: 'navigate', actionSummary: 'Navigated to Profile', responseSpeech: 'Profile.', parameters: { view: 'profile' } };
    if (cleanText === 'thought process' || cleanText === 'reasoning') return { intent: 'navigate', actionSummary: 'Navigated to Thought Process', responseSpeech: 'Thought Process.', parameters: { view: 'thought-process' } };
    if (cleanText === 'perfect agent') return { intent: 'navigate', actionSummary: 'Navigated to Perfect Agent', responseSpeech: 'Perfect Agent.', parameters: { view: 'perfect-agent' } };

    // 6. SEARCH COMMANDS
    // e.g. "search for database logs", "find tasks", "search security"
    const searchMatch = cleanText.match(/^(?:search(?:\s+for)?|find|lookup|filter(?:\s+by)?)\s+(.+)$/i);
    if (searchMatch) {
      const query = searchMatch[1].trim();
      return {
        intent: 'search',
        actionSummary: `Search: "${query}"`,
        responseSpeech: `Searching for ${query}.`,
        parameters: { query },
      };
    }

    // 7. ASK AGENT / SEND MESSAGE
    // e.g. "ask agent how to optimize database", "tell agent to summarize logs", "prompt agent ..."
    const askMatch = cleanText.match(/^(?:ask(?:\s+agent)?|tell\s+agent|prompt(?:\s+agent)?|send\s+message)\s+(.+)$/i);
    if (askMatch) {
      const prompt = askMatch[1].trim();
      return {
        intent: 'ask_agent',
        actionSummary: `Asked Agent: "${prompt}"`,
        responseSpeech: `Prompting Agent-sigma08 with your question.`,
        parameters: { prompt, view: 'chat' },
      };
    }

    // 8. TOOL EXECUTION COMMANDS
    if (cleanText.includes('security scan') || cleanText.includes('scan system') || cleanText.includes('audit security')) {
      return {
        intent: 'execute_tool',
        actionSummary: 'Executed Security Scan Tool',
        responseSpeech: 'Running security vulnerability scan.',
        parameters: { tool: 'security_scan' },
      };
    }
    if (cleanText.includes('database index') || cleanText.includes('optimize database') || cleanText.includes('run sql')) {
      return {
        intent: 'execute_tool',
        actionSummary: 'Executed Database Index Tool',
        responseSpeech: 'Executing database query optimization.',
        parameters: { tool: 'database_indexing' },
      };
    }

    // 9. AUDIO & ALARM COMMANDS
    if (cleanText.includes('pirates theme') || cleanText.includes('play pirates') || cleanText.includes('play song') || cleanText.includes('play music')) {
      return {
        intent: 'manage_alarm',
        actionSummary: 'Playing Pirates of the Caribbean Audio',
        responseSpeech: 'Playing Pirates of the Caribbean soundtrack.',
        parameters: { action: 'play_pirates' },
      };
    }
    if (cleanText.includes('stop song') || cleanText.includes('stop music') || cleanText.includes('stop audio') || cleanText.includes('stop ringtone') || cleanText.includes('stop alarm') || cleanText.includes('silence')) {
      return {
        intent: 'manage_alarm',
        actionSummary: 'Stopped Audio / Alarm Playback',
        responseSpeech: 'Audio stopped.',
        parameters: { action: 'stop_pirates' },
      };
    }

    // 10. NOTIFICATION CONTROLS
    if (cleanText.includes('clear notification') || cleanText.includes('clear all notification') || cleanText.includes('delete notification')) {
      return {
        intent: 'manage_notifications',
        actionSummary: 'Cleared all notifications',
        responseSpeech: 'All notifications cleared.',
        parameters: { action: 'clear_all' },
      };
    }
    if (cleanText.includes('mark all read') || cleanText.includes('read notification')) {
      return {
        intent: 'manage_notifications',
        actionSummary: 'Marked notifications as read',
        responseSpeech: 'Notifications marked as read.',
        parameters: { action: 'mark_all_read' },
      };
    }

    // 11. UNKNOWN / CONVERSATIONAL FALLBACK
    return {
      intent: 'unknown',
      actionSummary: `Heard: "${rawText}"`,
      responseSpeech: `I heard "${rawText}". Say "Help" to see voice commands, or say "Create task" or "Go to tasks".`,
      parameters: { rawText },
    };
  }

  // Speak voice feedback response using SpeechSynthesis
  public speak(text: string, onEnd?: () => void) {
    if (!this.ttsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Cancel any existing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      utterance.lang = this.language || 'en-US';

      // Pick high quality natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => (v.lang.startsWith('en') || v.lang === this.language) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))
      ) || voices.find((v) => v.lang.startsWith(this.language.slice(0, 2)));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      if (onEnd) onEnd();
    }
  }

  // Process text directly (from live microphone speech or simulated test input)
  public processVoiceText(text: string, confidence: number = 0.92): VoiceCommandRecord {
    const parsed = this.parseCommand(text);

    const record: VoiceCommandRecord = {
      id: `vc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      transcript: text,
      intent: parsed.intent,
      actionSummary: parsed.actionSummary,
      responseSpeech: parsed.responseSpeech,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      success: parsed.intent !== 'unknown',
      confidence,
      parameters: parsed.parameters,
    };

    // Keep history bounded to 30 items
    this.commandHistory = [record, ...this.commandHistory.slice(0, 29)];

    // Play feedback sound and speak response
    if (parsed.intent === 'create_task') {
      sound.play('success');
    } else if (parsed.intent === 'unknown') {
      sound.play('error');
    } else {
      sound.play('receive');
    }

    if (this.ttsEnabled && parsed.responseSpeech) {
      this.speak(parsed.responseSpeech);
    }

    // Notify registered listeners
    this.onCommandExecutedCallbacks.forEach((cb) => cb(record));

    return record;
  }

  public getCommandHistory(): VoiceCommandRecord[] {
    return this.commandHistory;
  }

  public clearHistory() {
    this.commandHistory = [];
  }
}

export const voiceCommandService = new VoiceCommandService();
