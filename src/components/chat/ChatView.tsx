import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Send,
  Square,
  RotateCw,
  Copy,
  Check,
  Paperclip,
  Mic,
  MicOff,
  Sparkles,
  Plus,
  FileText,
  AlertCircle,
  X,
  MoreVertical,
  Trash2,
  Volume2,
  VolumeX,
  Search,
  Pin,
  Download,
  Edit2,
  Smile,
  ArrowDown,
  Globe,
  ExternalLink,
  Brain,
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';
import { PlanProgressCard } from './PlanProgressCard';
import { ApprovalCard } from './ApprovalCard';
import { ToolExecutionCard } from './ToolExecutionCard';
import { FileItem, MessageItem } from '../../types';

const EMOJI_OPTIONS = ['👍', '❤️', '🔥', '🚀', '💡', '👏'];

const ThinkingTraceSection: React.FC<{ thinkingText: string }> = ({ thinkingText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { setActiveView } = useAgent();

  const handleCopyThinking = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(thinkingText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="my-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[#120408]/90 via-[#0a0204]/90 to-[#18050a]/90 border border-[#FF204E]/30 shadow-lg transition-all">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#170509]/80 border-b border-[#FF204E]/15">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 text-left text-xs font-bold uppercase tracking-wider text-[#FF204E] hover:text-[#ff4d73] transition-colors focus:outline-none cursor-pointer group"
        >
          <div className="relative flex h-4 w-4 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E50914] opacity-35"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FF204E] shadow-[0_0_8px_#FF204E]"></span>
          </div>
          <span className="font-bold tracking-wider text-[#FF204E] group-hover:underline underline-offset-2">
            🧠 Deep Cognitive Thinking & Web Strategy
          </span>
          <span className="text-[10px] text-[#94A3B8] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10">
            {isOpen ? 'COLLAPSE ▴' : 'EXPAND ▾'}
          </span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopyThinking}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 hover:bg-white/10 text-slate-300 hover:text-white text-[10px] font-mono transition-all border border-white/10 cursor-pointer"
            title="Copy thinking trace"
          >
            {isCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{isCopied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('thought-process')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FF204E]/15 hover:bg-[#FF204E]/30 text-[#FF4D4D] text-[10px] font-bold font-mono transition-all cursor-pointer border border-[#FF204E]/30"
            title="Open real-time Thought Process View"
          >
            <Brain className="h-3 w-3" />
            <span className="hidden sm:inline">Thought Process View ↗</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="bg-[#060102]/95 p-4 font-mono text-[11px] leading-relaxed text-[#CBD5E1] whitespace-pre-wrap select-all space-y-2 border-t border-[#FF204E]/10">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[10px] text-[#94A3B8]">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Multi-Platform Reasoning Engine • Complete Trace</span>
            </div>
            <span className="text-slate-400">Autonomous Execution Active</span>
          </div>
          <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
            {thinkingText}
          </div>
        </div>
      )}
    </div>
  );
};

export const ChatView: React.FC = () => {
  const {
    messages,
    setMessages,
    handleSendMessage,
    isGenerating,
    stopGeneration,
    regenerateLastResponse,
    startNewConversation,
    activePlan,
    files,
    setSelectedFile,
    setActiveView,
    settings,
    currentLanguage,
    t,
    setIsLanguageModalOpen,
    deleteMessageWhatsAppStyle,
    openPlanArchitect,
  } = useAgent();

  const [input, setInput] = useState('');
  const [selectedAttachedFiles, setSelectedAttachedFiles] = useState<FileItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [emojiPickerMsgId, setEmojiPickerMsgId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Deep thinking elapsed timer (Autonomous mode without artificial time pressure)
  const [thinkingSeconds, setThinkingSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setThinkingSeconds(0);
      interval = setInterval(() => {
        setThinkingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const demoSuggestions = [
    { title: settings.language === 'Bangla' ? '💰 অনলাইন ইনকাম ও সম্পদ প্ল্যান' : '💰 $5k/mo Wealth & Skill Plan', prompt: settings.language === 'Bangla' ? 'আমি অনলাইন থেকে প্রতি মাসে ৩০০০ ডলার আয় করতে চাই। গুগল ওয়েব ডেটা ও মার্কেট অ্যানালাইসিস দিয়ে আমার জন্য একটি নিখুঁত ৪-পর্যায়ের এক্সিকিউশন প্ল্যান তৈরি করো।' : 'I want to earn $3,000-$5,000/mo online. Synthesize a 4-phase strategic masterplan with verified Google market benchmarks.' },
    { title: settings.language === 'Bangla' ? '💪 মাসল বিল্ডিং ও ওজন বৃদ্ধি প্ল্যান' : '💪 Muscle Hypertrophy & Weight Gain', prompt: settings.language === 'Bangla' ? 'আমি স্বাস্থ্যকরভাবে ৮ কেজি ওজন বাড়াতে এবং মাসল তৈরি করতে চাই। আমার উচ্চতা ৫ ফিট ৮ ইঞ্চি, ওজন ৬০ কেজি। সাইন্টিফিক ডায়েট ও ওয়ার্কআউট প্ল্যান দাও।' : 'I want to gain 8kg of lean muscle mass. My weight is 60kg, height 5ft 8in. Create a scientific caloric surplus nutrition and 4-phase workout masterplan.' },
    { title: settings.language === 'Bangla' ? '🧠 মেমরি ও জেমিনি ওয়ার্ক প্ল্যান' : '🧠 Memory & Gemini Work Plan', prompt: settings.language === 'Bangla' ? 'আমার মেমরি ও লক্ষ্য অনুযায়ী আমার কাজের একটি পূর্ণাঙ্গ প্ল্যান তৈরি করো' : 'Make a complete work plan for me using your memory and Gemini reasoning' },
    { title: settings.language === 'Bangla' ? '📄 গুরুত্বপূর্ণ ডকুমেন্টস ও লিংক' : '📄 Important Documents & Links', prompt: settings.language === 'Bangla' ? 'আমার প্রজেক্টের গুরুত্বপূর্ণ ডকুমেন্টস এবং প্রয়োজনীয় রেফারেন্স লিংকগুলো পাঠাও' : 'Send me the links to my important project documents and reference guides' },
    { title: t.demoAnalyzeWebsite, prompt: t.demoAnalyzeWebsitePrompt },
    { title: t.demoResearchTrends, prompt: t.demoResearchTrendsPrompt },
  ];

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (!isSearchOpen) {
      scrollToBottom();
    }
  }, [messages, isGenerating, activePlan]);

  // Scroll listener for jump to bottom button
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 250);
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isGenerating) return;
    const attachedToSend = [...selectedAttachedFiles];
    setInput('');
    setSelectedAttachedFiles([]);
    await handleSendMessage(textToSend, attachedToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Text-To-Speech Reader
  const toggleSpeech = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner audio reading
    const cleanText = text
      .replace(/[#*_`>~\[\]\(\)]/g, '')
      .replace(/<[^>]*>/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Detect language
    const isBangla = /[ঀ-৿]/.test(cleanText);
    utterance.lang = isBangla ? 'bn-BD' : 'en-US';

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Live Web Speech Recognition (Mic Input)
  const toggleVoiceInput = () => {
    if (isRecording) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Fallback simulation
      setIsRecording(true);
      const simulatedText = settings.language === 'Bangla' 
        ? 'ওয়েবসাইটের নিরাপত্তা ও কর্মক্ষমতা বিশ্লেষণ করো'
        : 'Analyze website performance and security vulnerabilities';
      setTimeout(() => {
        setInput((prev) => (prev ? `${prev} ${simulatedText}` : simulatedText));
        setIsRecording(false);
      }, 2500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      speechRecognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = settings.language === 'Bangla' ? 'bn-BD' : 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsRecording(false);
    }
  };

  const handleAttachWorkspaceFile = (file: FileItem) => {
    if (!selectedAttachedFiles.some((f) => f.id === file.id)) {
      setSelectedAttachedFiles([...selectedAttachedFiles, file]);
    }
    setShowAttachMenu(false);
  };

  const handleNativeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    for (let i = 0; i < uploadedFiles.length; i++) {
      const f = uploadedFiles[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const newAttachedFile: FileItem = {
          id: `file_${Date.now()}_${i}`,
          name: f.name,
          size: `${(f.size / 1024).toFixed(1)} KB`,
          type: f.type || 'text/plain',
          extension: f.name.split('.').pop() || '',
          updatedAt: 'Just now',
          category: 'document',
          content: content || '[Binary or unreadable file content]',
        };
        setSelectedAttachedFiles((prev) => [...prev, newAttachedFile]);
      };
      if (f.type.includes('text') || f.name.endsWith('.json') || f.name.endsWith('.js') || f.name.endsWith('.ts') || f.name.endsWith('.md') || f.name.endsWith('.csv')) {
        reader.readAsText(f);
      } else {
        reader.readAsDataURL(f);
      }
    }
    setShowAttachMenu(false);
  };

  // Toggle emoji reaction
  const handleToggleReaction = (msgId: string, emoji: string) => {
    setMessages((prev: MessageItem[]) =>
      prev.map((msg: MessageItem) => {
        if (msg.id !== msgId) return msg;
        const currentReactions = msg.reactions || [];
        const exists = currentReactions.includes(emoji);
        const updated = exists
          ? currentReactions.filter((e) => e !== emoji)
          : [...currentReactions, emoji];
        return { ...msg, reactions: updated };
      })
    );
    setEmojiPickerMsgId(null);
  };

  // Toggle pin message
  const handleTogglePin = (msgId: string) => {
    setMessages((prev: MessageItem[]) =>
      prev.map((msg: MessageItem) =>
        msg.id === msgId ? { ...msg, isPinned: !msg.isPinned } : msg
      )
    );
    setActiveMenuId(null);
  };

  // Edit user message
  const handleEditPrompt = (text: string) => {
    setInput(text);
    textareaRef.current?.focus();
  };

  // Export Chat as Markdown
  const handleExportChat = () => {
    const formatted = messages
      .filter((m) => !m.isDeleted)
      .map((m) => `### ${m.sender === 'user' ? 'You' : 'Agent-sigma08'} (${m.timestamp})\n\n${m.text}\n`)
      .join('\n---\n\n');

    const blob = new Blob([`# Agent-sigma08 Conversation Transcript\nExported on: ${new Date().toLocaleString()}\n\n---\n\n${formatted}`], {
      type: 'text/markdown;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Agent-sigma08-Chat-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Pinned messages list
  const pinnedMessages = useMemo(() => {
    return messages.filter((m) => m.isPinned && !m.isDeleted);
  }, [messages]);

  // Filtered messages if search is active
  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase();
    return messages.filter(
      (m) =>
        !m.isDeleted &&
        (m.text.toLowerCase().includes(q) || (m.thinkingText && m.thinkingText.toLowerCase().includes(q)))
    );
  }, [messages, searchQuery]);

  return (
    <div id="ai_chat_view" className="flex h-full flex-col bg-[#080204]/90 text-[#F8FAFC]">
      {/* Chat Top Subheader */}
      <div className="flex shrink-0 items-center justify-between border-b border-[#E50914]/20 bg-[#0c0205] px-3.5 py-2.5 sm:px-6 shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl neumorph-circle text-[#FF204E]">
            <Sparkles className="h-4 w-4 text-[#FF204E]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
                Personal Work Agent Active
              </h3>
              <button
                onClick={() => setIsLanguageModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1 rounded-full neumorph-badge px-2.5 py-0.5 text-[10px] text-[#FF204E] cursor-pointer"
                title="Change system language"
              >
                <span>{currentLanguage.flag}</span>
                <span>{currentLanguage.country}</span>
              </button>
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              {t.chatSubheader}
            </p>
          </div>
        </div>

        {/* Chat Header Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Plan Architect Trigger Button */}
          <button
            onClick={() => openPlanArchitect()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF204E] to-[#FF4D4D] text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,32,78,0.35)] hover:shadow-[0_0_22px_rgba(255,32,78,0.55)] cursor-pointer"
            title="Open AI High-Quality Masterplan Architect"
          >
            <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
            <span className="hidden sm:inline">{settings.language === 'Bangla' ? '🎯 মাস্টারপ্ল্যান তৈরি' : '🎯 Masterplan Architect'}</span>
          </button>

          {/* Autonomous Web-Research & Learning Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full neumorph-badge text-[10px] text-sky-300 font-mono">
            <Globe className="h-3 w-3 text-sky-400 animate-pulse" />
            <span className="font-semibold">Web Grounding Active</span>
          </div>

          {/* Search Toggle */}
          <button
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (isSearchOpen) setSearchQuery('');
            }}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isSearchOpen
                ? 'neumorph-btn-primary'
                : 'neumorph-btn-secondary text-[#94A3B8] hover:text-white'
            }`}
            title="Search inside conversation"
          >
            <Search className="h-3.5 w-3.5" />
          </button>

          {/* Export Chat */}
          <button
            onClick={handleExportChat}
            className="p-2 rounded-xl neumorph-btn-secondary text-[#94A3B8] hover:text-[#FF204E] cursor-pointer"
            title="Export conversation as Markdown"
          >
            <Download className="h-3.5 w-3.5" />
          </button>

          {/* Language Mobile Button */}
          <button
            onClick={() => setIsLanguageModalOpen(true)}
            className="flex sm:hidden items-center gap-1 rounded-xl neumorph-btn-secondary px-2.5 py-1.5 text-xs text-[#F8FAFC] cursor-pointer"
            title="Change Language Mode"
          >
            <span>{currentLanguage.flag}</span>
          </button>

          {/* New Session Button */}
          <button
            id="btn_new_conversation"
            onClick={startNewConversation}
            className="flex items-center gap-1.5 rounded-xl neumorph-btn-primary px-3.5 py-1.5 text-xs font-semibold cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {t.newSession}
            </span>
          </button>
        </div>
      </div>

      {/* Chat Search Bar if active */}
      {isSearchOpen && (
        <div className="flex items-center gap-2 border-b border-[#E50914]/20 bg-[#0f0306]/95 px-4 py-2 text-xs">
          <Search className="h-3.5 w-3.5 text-[#FF204E] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords, code, advice in this chat..."
            className="flex-1 bg-transparent text-sm text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none"
            autoFocus
          />
          {searchQuery && (
            <span className="text-[10px] text-[#94A3B8]">
              {filteredMessages.length} matches
            </span>
          )}
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery('');
            }}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Pinned Messages Banner */}
      {pinnedMessages.length > 0 && !isSearchOpen && (
        <div className="bg-[#1a0408]/90 border-b border-[#FF204E]/30 px-4 py-2 text-xs flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 text-[#FF204E] font-medium shrink-0">
            <Pin className="h-3.5 w-3.5 fill-current rotate-45" />
            <span className="text-[11px] uppercase tracking-wider font-bold">Pinned:</span>
          </div>
          <div className="flex-1 truncate text-slate-300 text-xs">
            {pinnedMessages[pinnedMessages.length - 1].text.slice(0, 100)}...
          </div>
          <button
            onClick={() => handleTogglePin(pinnedMessages[pinnedMessages.length - 1].id)}
            className="text-[10px] text-slate-400 hover:text-rose-400 shrink-0 font-mono"
          >
            Unpin
          </button>
        </div>
      )}

      {/* Message Stream */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6 relative"
      >
        {/* Suggestion Prompts if history is short */}
        {messages.length <= 2 && !searchQuery && (
          <div className="mx-auto max-w-3xl mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              {t.quickSuggestionsTitle}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {demoSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  className="flex flex-col items-start p-3 text-left rounded-2xl neumorph-card hover:border-[#FF204E] transition-all group cursor-pointer"
                >
                  <span className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#FF204E]">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-[#94A3B8] line-clamp-2 mt-1">
                    "{item.prompt}"
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Items */}
        <div className="mx-auto max-w-3xl space-y-6">
          {filteredMessages.map((msg) => {
            if (msg.isDeleted && msg.deletedType === 'me') {
              return null; // WhatsApp "Delete for Me" fully hides the message locally
            }
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                id={`message_${msg.id}`}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group relative`}
              >
                {/* Sender badge & timestamp */}
                <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-[#94A3B8]">
                  <span className="font-semibold text-[#F8FAFC]">
                    {isUser ? 'You (Abdullah)' : (settings.agentName || 'Agent-sigma08')}
                  </span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                  {msg.isPinned && (
                    <span className="flex items-center gap-0.5 text-[#FF204E] text-[10px] font-bold">
                      <Pin className="h-2.5 w-2.5 fill-current" /> Pinned
                    </span>
                  )}
                </div>

                {/* Message Bubble Container */}
                <div
                  className={`relative max-w-[94%] sm:max-w-[85%] rounded-2xl p-4 sm:p-5 text-sm leading-relaxed transition-all duration-200 ${
                    msg.isDeleted
                      ? 'neumorph-inset text-slate-500 rounded-2xl italic'
                      : isUser
                        ? 'neumorph-raised bg-gradient-to-r from-[#E50914] via-[#FF204E] to-[#990000] text-[#F8FAFC] rounded-tr-none border border-[#FF204E]/50 shadow-[0_0_20px_rgba(229,9,20,0.4)]'
                        : 'neumorph-card text-[#F8FAFC] rounded-tl-none'
                  }`}
                >
                  {/* WhatsApp Menu Dropdown & Action Trigger */}
                  {!msg.isDeleted && (
                    <div className="absolute right-2 top-2 z-20 flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
                      {/* Emoji Picker Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEmojiPickerMsgId(emojiPickerMsgId === msg.id ? null : msg.id);
                        }}
                        className="p-1 rounded-lg bg-black/40 hover:bg-black/60 text-slate-400 hover:text-amber-300 transition-all cursor-pointer"
                        title="React with Emoji"
                      >
                        <Smile className="h-3.5 w-3.5" />
                      </button>

                      {/* Dropdown Options */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === msg.id ? null : msg.id);
                        }}
                        className="p-1 rounded-lg bg-black/40 hover:bg-black/60 text-slate-400 hover:text-white transition-all cursor-pointer"
                        title="Options"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>

                      {/* Floating Emoji Picker Popover */}
                      {emojiPickerMsgId === msg.id && (
                        <div className="absolute right-0 top-7 z-30 flex items-center gap-1 rounded-full bg-[#0f0306] border border-[#FF204E]/30 p-1.5 shadow-2xl animate-fadeIn">
                          {EMOJI_OPTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleToggleReaction(msg.id, emoji)}
                              className="text-base p-1 hover:scale-125 transition-transform"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Dropdown Menu */}
                      {activeMenuId === msg.id && (
                        <div className="absolute right-0 top-7 w-44 rounded-xl bg-[#0f0306]/95 border border-[#FF204E]/25 py-1 shadow-2xl z-30 animate-fadeIn">
                          {isUser && (
                            <button
                              type="button"
                              onClick={() => {
                                handleEditPrompt(msg.text);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-slate-300 hover:bg-white/5 flex items-center gap-2 transition-colors cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5 text-[#FF204E]" />
                              <span>Edit & Resend</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleTogglePin(msg.id)}
                            className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-slate-300 hover:bg-white/5 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Pin className="h-3.5 w-3.5 text-amber-400" />
                            <span>{msg.isPinned ? 'Unpin Message' : 'Pin to Top'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleCopyText(msg.id, msg.text);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-slate-300 hover:bg-white/5 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Copy className="h-3.5 w-3.5 text-sky-400" />
                            <span>Copy Text</span>
                          </button>
                          <div className="border-t border-[#FF204E]/15 my-0.5" />
                          <button
                            type="button"
                            onClick={() => {
                              deleteMessageWhatsAppStyle(msg.id, 'everyone');
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-[10px] font-black text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete for Everyone</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              deleteMessageWhatsAppStyle(msg.id, 'me');
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-[10px] font-black text-slate-400 hover:bg-white/5 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Delete for Me</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {msg.isDeleted ? (
                    <div className="flex items-center gap-2 text-slate-500 select-none italic text-xs sm:text-sm">
                      <AlertCircle className="h-4 w-4 text-slate-600 shrink-0" />
                      <span>{settings.language === 'Bangla' ? '🚫 এই বার্তাটি মুছে ফেলা হয়েছে' : '🚫 This message was deleted'}</span>
                    </div>
                  ) : (
                    <>
                      {/* Attached files indicator in user msg */}
                      {msg.attachedFiles && msg.attachedFiles.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1.5 pb-2 border-b border-white/20">
                          {msg.attachedFiles.map((file, i) => (
                            <span
                              key={i}
                              className="flex items-center gap-1 rounded bg-black/30 px-2 py-1 text-[11px] font-mono text-[#A7F3D0]"
                            >
                              <Paperclip className="h-3 w-3" />
                              <span>{file.name}</span>
                              <span className="opacity-70">({file.size})</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Collapsible Cognitive Thinking Process block */}
                      {!isUser && msg.thinkingText && (
                        <ThinkingTraceSection thinkingText={msg.thinkingText} />
                      )}

                      {/* Plan Steps Card if embedded */}
                      {msg.planSteps && msg.planSteps.length > 0 && (
                        <PlanProgressCard
                          steps={msg.planSteps}
                          isGenerating={false}
                          groundingMetadata={msg.groundingMetadata}
                          onGatherWebInfo={(topic) => {
                            const promptText = settings.language === 'Bangla'
                              ? `এই প্ল্যানের জন্য লাইভ ওয়েব তথ্য ও মার্কেট ইন্টেলিজেন্স সংগ্রহ করো: "${topic}"`
                              : `Gather real-time web intelligence, industry benchmarks, and authoritative sources for this plan: "${topic}"`;
                            handleSendMessage(promptText);
                          }}
                        />
                      )}

                      {/* Tool Executions Cards */}
                      {msg.toolExecutions && msg.toolExecutions.length > 0 && (
                        <div className="my-3 space-y-1.5">
                          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                            Executed Tools & Verifications:
                          </div>
                          {msg.toolExecutions.map((toolExec, i) => (
                            <ToolExecutionCard key={i} tool={toolExec} />
                          ))}
                        </div>
                      )}

                      {/* Google Search Live Grounding & Multi-Platform Web Sources Card */}
                      {msg.groundingMetadata && (Boolean(msg.groundingMetadata.searchQueries?.length) || Boolean(msg.groundingMetadata.sources?.length)) && (
                        <div className="my-3 rounded-2xl bg-[#030712]/95 border border-sky-500/35 p-3.5 text-xs shadow-[0_4px_20px_rgba(14,165,233,0.15)] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs sm:text-sm">
                              <Globe className="h-4 w-4 text-sky-400 animate-pulse" />
                              <span>Google Live Grounding & Multi-Platform Web Intelligence</span>
                            </div>
                            {msg.groundingMetadata.sources && msg.groundingMetadata.sources.length > 0 && (
                              <span className="text-[10px] text-sky-300 font-mono bg-sky-500/20 px-2.5 py-0.5 rounded-full border border-sky-500/40">
                                {msg.groundingMetadata.sources.length} verified citations
                              </span>
                            )}
                          </div>

                          {msg.groundingMetadata.searchQueries && msg.groundingMetadata.searchQueries.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                              <span className="text-[10px] text-slate-400 font-mono font-semibold">Searched:</span>
                              {msg.groundingMetadata.searchQueries.map((q, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 rounded-md bg-sky-950/70 border border-sky-500/40 px-2 py-0.5 text-[10px] text-sky-200 font-mono"
                                >
                                  <Search className="h-2.5 w-2.5 text-sky-400" />
                                  <span>"{q}"</span>
                                </span>
                              ))}
                            </div>
                          )}

                          {msg.groundingMetadata.sources && msg.groundingMetadata.sources.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-sky-500/20">
                              {msg.groundingMetadata.sources.slice(0, 8).map((source, idx) => {
                                const platform = source.platform || 'Live Web';
                                const isGitHub = platform.includes('GitHub');
                                const isMDN = platform.includes('MDN');
                                const isStackOverflow = platform.includes('Stack');
                                const isDocs = platform.includes('Docs') || platform.includes('Google');
                                const isPkg = platform.includes('NPM') || platform.includes('PyPI');

                                const badgeColor = isGitHub
                                  ? 'bg-purple-950/60 border-purple-500/40 text-purple-300'
                                  : isMDN
                                  ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                                  : isStackOverflow
                                  ? 'bg-orange-950/60 border-orange-500/40 text-orange-300'
                                  : isPkg
                                  ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                                  : isDocs
                                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                                  : 'bg-sky-950/60 border-sky-500/40 text-sky-300';

                                return (
                                  <a
                                    key={idx}
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-sky-500/15 border border-white/10 hover:border-sky-400/50 px-2.5 py-1.5 text-[11px] text-slate-300 hover:text-white transition-all group max-w-[280px] shadow-sm"
                                    title={`${source.title} (${source.url})`}
                                  >
                                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${badgeColor}`}>
                                      {platform}
                                    </span>
                                    <span className="truncate text-[10px] font-medium">{source.title || source.domain}</span>
                                    <ExternalLink className="h-3 w-3 text-slate-500 group-hover:text-sky-400 shrink-0 ml-auto" />
                                  </a>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Markdown formatted content */}
                      <div className="prose prose-invert prose-sm max-w-none text-slate-200">
                        <ReactMarkdown
                          components={{
                            a: ({ href, children, ...props }) => {
                              // Handle workspace file deep links e.g. #file:file_web_audit
                              if (href?.startsWith('#file:')) {
                                const targetIdentifier = href.replace('#file:', '').trim();
                                const matchedFile = files.find(
                                  (f) => f.id === targetIdentifier || f.name.toLowerCase() === targetIdentifier.toLowerCase()
                                );

                                return (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (matchedFile) {
                                        setSelectedFile(matchedFile);
                                        setActiveView('files');
                                      } else {
                                        setActiveView('files');
                                      }
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF204E]/15 hover:bg-[#FF204E]/25 border border-[#FF204E]/40 px-2.5 py-1 text-xs font-semibold text-[#FF204E] hover:text-[#ff4d73] transition-all cursor-pointer shadow-sm my-1"
                                    title={matchedFile ? `Open workspace document: ${matchedFile.name}` : 'Open Workspace Files'}
                                  >
                                    <FileText className="h-3.5 w-3.5 shrink-0 text-[#FF204E]" />
                                    <span>{children}</span>
                                    <ExternalLink className="h-3 w-3 opacity-70 shrink-0" />
                                  </button>
                                );
                              }

                              // Standard external web link
                              const isExternal = href?.startsWith('http://') || href?.startsWith('https://');
                              return (
                                <a
                                  href={href}
                                  target={isExternal ? '_blank' : undefined}
                                  rel={isExternal ? 'noopener noreferrer' : undefined}
                                  className="inline-flex items-center gap-1 text-[#FF204E] hover:text-[#ff4d73] underline underline-offset-4 decoration-[#FF204E]/40 hover:decoration-[#FF204E] font-medium transition-colors"
                                  {...props}
                                >
                                  <span>{children}</span>
                                  {isExternal && <ExternalLink className="h-3 w-3 inline-block shrink-0 opacity-80" />}
                                </a>
                              );
                            },
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>

                      {/* Embedded Approval Card if waiting for user confirmation */}
                      {msg.requiresApproval && msg.approvalDetails && (
                        <ApprovalCard approval={msg.approvalDetails} />
                      )}

                      {/* Reactions display */}
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {msg.reactions.map((emoji, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleToggleReaction(msg.id, emoji)}
                              className="inline-flex items-center gap-1 rounded-full bg-black/40 border border-white/10 px-2 py-0.5 text-xs hover:bg-black/60 transition-colors"
                            >
                              <span>{emoji}</span>
                              <span className="text-[10px] text-slate-400 font-mono">1</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Error recovery card */}
                      {msg.error && (
                        <div className="mt-3 rounded-xl bg-rose-950/30 p-3 border border-rose-500/40 text-xs">
                          <div className="flex items-center gap-2 text-rose-300 font-bold mb-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>Execution Anomaly Detected</span>
                          </div>
                          <p className="text-slate-300 font-mono text-[11px]">{msg.error.reason}</p>
                          <div className="mt-2 text-slate-400 flex items-center justify-between pt-2 border-t border-rose-900/40">
                            <span>Next: {msg.error.next}</span>
                            <button
                              onClick={regenerateLastResponse}
                              className="text-[#FF204E] hover:text-[#E50914] font-bold hover:underline"
                            >
                              Retry Step
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Actions (Copy / Audio Speak / Regenerate) for agent responses */}
                      {!isUser && (
                        <div className="mt-3 flex items-center gap-2 pt-2 border-t border-[#FF204E]/20 text-[11px] text-slate-400">
                          {/* Copy Action */}
                          <button
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="flex items-center gap-1 rounded px-2 py-1 hover:bg-[#FF204E]/15 hover:text-slate-200 transition-colors"
                            title="Copy message text"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="h-3 w-3 text-[#FF204E]" />
                                <span className="text-[#FF204E] font-medium">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          {/* Audio Voice Speaker */}
                          <button
                            onClick={() => toggleSpeech(msg.id, msg.text)}
                            className={`flex items-center gap-1 rounded px-2 py-1 transition-colors ${
                              speakingMsgId === msg.id
                                ? 'bg-[#E50914]/25 text-[#FF204E] font-bold'
                                : 'hover:bg-[#FF204E]/15 hover:text-slate-200'
                            }`}
                            title={speakingMsgId === msg.id ? 'Stop audio' : 'Read aloud with AI voice'}
                          >
                            {speakingMsgId === msg.id ? (
                              <>
                                <VolumeX className="h-3 w-3 text-[#FF204E] animate-pulse" />
                                <span>Stop Audio</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="h-3 w-3" />
                                <span>Read Aloud</span>
                              </>
                            )}
                          </button>

                          {/* Regenerate Action */}
                          <button
                            onClick={regenerateLastResponse}
                            className="flex items-center gap-1 rounded px-2 py-1 hover:bg-[#FF204E]/15 hover:text-slate-200 transition-colors"
                            title="Regenerate response"
                          >
                            <RotateCw className="h-3 w-3" />
                            <span>Regenerate</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {/* Active Generation Indicator & Live Plan Steps */}
          {isGenerating && (
            <div className="flex flex-col items-start space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 px-1 text-[#FF204E]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#FF204E] animate-ping" />
                  <span className="font-semibold">{settings.agentName || 'Agent-sigma08'}</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <span className="bg-[#E50914]/15 text-[#FF204E] px-2.5 py-0.5 rounded-md border border-[#FF204E]/30 font-bold tracking-wider font-mono text-[10px] flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#FF204E] animate-pulse" />
                  {settings.language === 'Bangla'
                    ? `🧠 স্বাধীন চিন্তাভাবনা ও বিশ্লেষণ চলছে • ${thinkingSeconds}s`
                    : `🧠 Autonomous Deep Thinking • ${thinkingSeconds}s`}
                </span>
              </div>

              <div className="w-full max-w-[85%] rounded-2xl bg-[#0f0306]/90 border border-[#E50914]/30 rounded-tl-none space-y-3 p-3.5 shadow-xl">
                {activePlan && (
                  <PlanProgressCard steps={activePlan} isGenerating={true} />
                )}

                {/* Autonomous Thought Pipeline & Depth Indicator */}
                <div className="space-y-1.5 bg-[#080204]/70 rounded-xl p-2.5 border border-white/5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-300 font-medium flex items-center gap-1.5">
                      <span className="text-[#FF204E]">◈</span>
                      {thinkingSeconds < 4
                        ? (settings.language === 'Bangla' ? 'লক্ষ্য অনুধাবন ও প্রয়োজনীয় আর্কিটেকচার বিশ্লেষণ...' : 'Deconstructing goals & exploring optimal architectures...')
                        : thinkingSeconds < 9
                        ? (settings.language === 'Bangla' ? 'গভীর ডোমেন জ্ঞান ও সর্বোত্তম সমাধান অনুসন্ধান...' : 'Synthesizing domain knowledge & evaluating solutions...')
                        : thinkingSeconds < 16
                        ? (settings.language === 'Bangla' ? 'পূর্ণাঙ্গ সমাধান, কোড ও কার্যপ্রণালী প্রস্তুত হচ্ছে...' : 'Formulating comprehensive deliverables & production-grade code...')
                        : (settings.language === 'Bangla' ? 'নিখুঁত মান যাচাই ও চূড়ান্ত ডেলিভারি প্রস্তুত হচ্ছে...' : 'Polishing deliverable & verifying quality edge-cases...')}
                    </span>
                    <span className="text-[#FF204E] font-bold text-[10px] bg-[#FF204E]/10 px-2 py-0.5 rounded border border-[#FF204E]/20">
                      {thinkingSeconds}s elapsed
                    </span>
                  </div>
                  <div className="w-full bg-[#140207] rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#E50914] via-[#FF204E] to-[#FF6B8B] h-1.5 transition-all duration-500 animate-pulse" 
                      style={{ width: `${Math.min(96, Math.max(15, thinkingSeconds * 6))}%` }} 
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-slate-400 pt-0.5">
                    <span>
                      {settings.language === 'Bangla'
                        ? '✨ কোনো কৃত্রিম সময়সীমা নেই • সম্পূর্ণ সঠিক ও পূর্ণাঙ্গ উত্তর তৈরির নিশ্চয়তা'
                        : '✨ No artificial rush • Prioritizing comprehensive excellence over speed'}
                    </span>
                    <span className="text-emerald-400/80 font-mono">Independent Mode Active</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 pt-0.5">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-[#FF204E] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 rounded-full bg-[#FF204E] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 rounded-full bg-[#FF204E] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>
                    {settings.language === 'Bangla'
                      ? 'এজেন্ট সম্পূর্ণ ফলাফল প্রস্তুত করছে, উত্তর প্রস্তুত হওয়া মাত্রই প্রদর্শিত হবে...'
                      : 'Agent is formulating the complete response, will deliver as soon as ready...'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Jump to bottom button */}
        {showScrollBottom && (
          <button
            onClick={() => scrollToBottom('smooth')}
            className="fixed bottom-28 right-8 z-30 p-2.5 rounded-full bg-[#FF204E] text-white shadow-2xl hover:scale-110 transition-transform animate-bounce"
            title="Scroll to bottom"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Input Bar & Controls */}
      <div className="shrink-0 border-t border-[#E50914]/25 bg-[#0f0306] p-3 sm:p-4">
        <div className="mx-auto max-w-3xl">
          {/* Selected attached files chips */}
          {selectedAttachedFiles.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {selectedAttachedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-1.5 rounded-lg bg-[#28040b]/60 px-2.5 py-1 text-xs text-[#FF204E] border border-[#E50914]/30"
                >
                  <FileText className="h-3.5 w-3.5 text-[#FF204E]" />
                  <span className="font-medium">{file.name}</span>
                  <button
                    onClick={() =>
                      setSelectedAttachedFiles(selectedAttachedFiles.filter((f) => f.id !== file.id))
                    }
                    className="ml-1 text-slate-400 hover:text-rose-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Voice Input banner if recording */}
          {isRecording && (
            <div className="mb-2 flex items-center justify-between rounded-lg bg-[#E50914]/20 p-2 text-xs text-[#FF204E] border border-[#E50914]/30 animate-pulse">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-[#FF204E]" />
                <span className="font-medium">
                  {settings.language === 'Bangla' ? 'ভয়েস শুনছি... মুখে নির্দেশ বলুন...' : 'Listening to your voice... Speak your prompt...'}
                </span>
              </div>
              <button
                onClick={toggleVoiceInput}
                className="text-[11px] font-semibold text-rose-400 hover:underline"
              >
                Stop
              </button>
            </div>
          )}

          {/* Text Input Row */}
          <div className="relative flex items-end gap-2 rounded-2xl neumorph-inset p-2">
            {/* Attachment Dropdown Toggle */}
            <div className="relative">
              <button
                id="btn_attach_file"
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#94A3B8] neumorph-btn-secondary hover:text-[#FF204E] cursor-pointer"
                title="Attach workspace file or upload"
              >
                <Paperclip className="h-4 w-4" />
              </button>

              {/* Attachment Picker Menu */}
              {showAttachMenu && (
                <div
                  id="attach_menu"
                  className="absolute bottom-12 left-0 z-50 w-64 rounded-2xl neumorph-card p-3 space-y-1 text-xs"
                >
                  <p className="px-2 py-1 font-semibold text-[#94A3B8] uppercase text-[10px]">
                    Workspace Files
                  </p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {files.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => handleAttachWorkspaceFile(f)}
                        className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-[#F8FAFC] hover:bg-white/5 hover:text-[#FF204E] cursor-pointer"
                      >
                        <span className="truncate">{f.name}</span>
                        <span className="text-[10px] text-[#94A3B8]">{f.size}</span>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-[#E50914]/20 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[#FF204E] hover:bg-white/5 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Upload from Device</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleNativeFileUpload}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Voice Input Button */}
            <button
              id="btn_voice_input"
              type="button"
              onClick={toggleVoiceInput}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all cursor-pointer ${
                isRecording
                  ? 'neumorph-btn-primary animate-pulse'
                  : 'text-[#94A3B8] neumorph-btn-secondary hover:text-white'
              }`}
              title="Voice Input (Speech-to-Text)"
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>

            {/* Main Textarea */}
            <textarea
              ref={textareaRef}
              id="chat_input_textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.chatInputPlaceholder}
              rows={1}
              className="flex-1 max-h-32 resize-none bg-transparent py-2.5 px-2 text-sm text-[#F8FAFC] placeholder:text-[#94A3B8]/60 focus:outline-none caret-[#FF204E] transition-all duration-150"
            />

            {/* Stop or Send Button */}
            {isGenerating ? (
              <button
                id="btn_stop_generation"
                type="button"
                onClick={stopGeneration}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl neumorph-btn-primary cursor-pointer"
                title="Stop generation"
              >
                <Square className="h-4 w-4 fill-current" />
              </button>
            ) : (
              <button
                id="btn_send_message"
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all cursor-pointer ${
                  input.trim()
                    ? 'neumorph-btn-primary'
                    : 'neumorph-btn-secondary text-[#94A3B8]/40 cursor-not-allowed opacity-60'
                }`}
                title="Send instruction"
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between px-2 text-[10px] text-slate-400">
            <span>
              {t.shiftEnterHint}
            </span>
            <span className="flex items-center gap-1 text-[#FF204E]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF204E] animate-pulse" />
              Autonomous Agent Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
