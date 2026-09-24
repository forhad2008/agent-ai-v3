import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  Globe,
  Bell,
  User,
  ChevronDown,
  X,
  Sparkles,
  LayoutDashboard,
  MessageSquare,
  Cpu,
  CheckSquare,
  FileText,
  Wrench,
  ShieldCheck,
  Clock,
  Settings,
  ArrowRight,
  CornerDownLeft,
  Plus,
  Palette,
  Check,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Info,
  CheckCheck,
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';
import { TECH_LANGUAGES, TechLanguage } from '../../data/languages';
import { sound } from '../../services/sound';

type SearchCategory = 'ALL' | 'PAGES' | 'TASKS' | 'FILES' | 'TOOLS' | 'MESSAGES';

interface SearchResultItem {
  id: string;
  category: 'Pages' | 'Tasks' | 'Files' | 'Tools' | 'Messages' | 'Action';
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ElementType;
  onSelect: () => void;
}

export const Header: React.FC = () => {
  const {
    tasks,
    files,
    tools,
    messages,
    setActiveView,
    setSelectedTask,
    setSelectedFile,
    handleSendMessage,
    createTask,
    currentLanguage,
    setLanguageMode,
    t,
    setIsLanguageModalOpen,
    userProfile,
    searchQuery,
    setSearchQuery,
    notifications,
    unreadNotificationCount,
    deleteNotification,
    clearAllNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsNotificationCenterOpen,
  } = useAgent();

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const [selectedLangRegion, setSelectedLangRegion] = useState<string>('All');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('ALL');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);

  // Filtered Tech Languages for real-time switcher
  const filteredTechLanguages = useMemo(() => {
    const q = langSearch.toLowerCase().trim();
    return TECH_LANGUAGES.filter((lang) => {
      const matchRegion = selectedLangRegion === 'All' || lang.region === selectedLangRegion;
      const matchQuery =
        !q ||
        lang.country.toLowerCase().includes(q) ||
        lang.name.toLowerCase().includes(q) ||
        lang.englishName.toLowerCase().includes(q) ||
        lang.countryCode.toLowerCase().includes(q) ||
        lang.techHub.toLowerCase().includes(q);
      return matchRegion && matchQuery;
    });
  }, [langSearch, selectedLangRegion]);

  // Close search, language, and notification dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(e.target as Node) &&
        languageButtonRef.current &&
        !languageButtonRef.current.contains(e.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(e.target as Node) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Keyboard Shortcut: ⌘K or Ctrl+K to open search, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // App Navigation Pages Definition
  const pages = useMemo(
    () => [
      {
        id: 'page_dashboard',
        label: 'Dashboard Overview',
        desc: 'Real-time KPI metrics, active pipeline & system status',
        view: 'dashboard' as const,
        icon: LayoutDashboard,
      },
      {
        id: 'page_perfect_agent',
        label: 'What is a Perfect AI Agent? 🎯',
        desc: '10 architectural pillars, Normal AI vs Agent battle arena & simulator',
        view: 'perfect-agent' as const,
        icon: Sparkles,
      },
      {
        id: 'page_chat',
        label: 'AI Co-Pilot Chat',
        desc: 'ChatGPT-grade conversational reasoning with autonomous execution',
        view: 'chat' as const,
        icon: MessageSquare,
      },
      {
        id: 'page_image_studio',
        label: 'Image Studio & Pro Canvas Editor',
        desc: 'Real image generation, AI inpainting, drawing brush, GPU filters & text tools',
        view: 'image-studio' as const,
        icon: Palette,
      },
      {
        id: 'page_ailab',
        label: 'AI Multi-Modal Lab',
        desc: 'Generate music, images, video, speech & live Google search',
        view: 'ailab' as const,
        icon: Cpu,
      },
      {
        id: 'page_tasks',
        label: 'Tasks & Autonomous Workflows',
        desc: 'Manage task pipelines, priority queues & background jobs',
        view: 'tasks' as const,
        icon: CheckSquare,
      },
      {
        id: 'page_files',
        label: 'Workspace Files & Storage',
        desc: 'Browse, create, upload and inspect documents, code & data',
        view: 'files' as const,
        icon: FileText,
      },
      {
        id: 'page_tools',
        label: 'Production Tools & Sandbox',
        desc: '30+ agent integrations, APIs and interactive test sandbox',
        view: 'tools' as const,
        icon: Wrench,
      },
      {
        id: 'page_approvals',
        label: 'Security Approvals & Gates',
        desc: 'Review external actions, sensitive operations & compliance policies',
        view: 'approvals' as const,
        icon: ShieldCheck,
      },
      {
        id: 'page_activity',
        label: 'Activity Logs & Audit Trail',
        desc: 'Timestamped event records, tool logs & JSON audit export',
        view: 'activity' as const,
        icon: Clock,
      },
      {
        id: 'page_profile',
        label: 'User Profile & Memory Matrix',
        desc: 'Personal details, bio, avatar & long-term agent memories',
        view: 'profile' as const,
        icon: User,
      },
      {
        id: 'page_settings',
        label: 'System Settings & WhatsApp',
        desc: 'WhatsApp simulation, language mode, voice settings & telemetry',
        view: 'settings' as const,
        icon: Settings,
      },
    ],
    []
  );

  // Compute Live Search Results across Pages, Tasks, Files, Tools, Messages & AI Actions
  const searchResults = useMemo<SearchResultItem[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    const results: SearchResultItem[] = [];

    // When query is present, prioritize instant Agent Actions
    if (q) {
      results.push({
        id: 'action_prompt_agent',
        category: 'Action',
        title: `Ask Agent: "${searchQuery.trim()}"`,
        subtitle: 'Dispatch directly to Agent-sigma08 conversational engine in Chat',
        badge: 'Instant AI',
        badgeColor: 'text-[#FF204E] border-[#FF204E]/40 bg-[#FF204E]/10',
        icon: Sparkles,
        onSelect: () => {
          setActiveView('chat');
          handleSendMessage(searchQuery.trim());
          setIsSearchOpen(false);
          setSearchQuery('');
        },
      });

      results.push({
        id: 'action_create_task',
        category: 'Action',
        title: `Create Task: "${searchQuery.trim()}"`,
        subtitle: 'Add as a high-priority task in your autonomous pipeline',
        badge: 'New Task',
        badgeColor: 'text-[#38BDF8] border-[#38BDF8]/40 bg-[#38BDF8]/10',
        icon: Plus,
        onSelect: () => {
          createTask(searchQuery.trim(), `Created via quick search command: "${searchQuery.trim()}"`, 'Medium');
          setActiveView('tasks');
          setIsSearchOpen(false);
          setSearchQuery('');
        },
      });
    }

    // 1. Pages Search
    pages.forEach((p) => {
      if (!q || p.label.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)) {
        results.push({
          id: p.id,
          category: 'Pages',
          title: p.label,
          subtitle: p.desc,
          badge: 'Navigation',
          badgeColor: 'text-[#94A3B8] border-[#94A3B8]/30 bg-white/5',
          icon: p.icon,
          onSelect: () => {
            setActiveView(p.view);
            setIsSearchOpen(false);
          },
        });
      }
    });

    // 2. Tasks Search
    tasks.forEach((t) => {
      if (!q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.status.toLowerCase().includes(q)) {
        results.push({
          id: `task_${t.id}`,
          category: 'Tasks',
          title: t.title,
          subtitle: `${t.description.slice(0, 75)}...`,
          badge: t.status,
          badgeColor:
            t.status === 'Completed'
              ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
              : t.status === 'Running'
              ? 'text-[#FF204E] border-[#FF204E]/30 bg-[#FF204E]/10'
              : 'text-amber-400 border-amber-500/30 bg-amber-500/10',
          icon: CheckSquare,
          onSelect: () => {
            setSelectedTask(t);
            setActiveView('tasks');
            setIsSearchOpen(false);
          },
        });
      }
    });

    // 3. Files Search
    files.forEach((f) => {
      if (!q || f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q) || (f.content && f.content.toLowerCase().includes(q))) {
        results.push({
          id: `file_${f.id}`,
          category: 'Files',
          title: f.name,
          subtitle: `${f.size} • ${f.category.toUpperCase()} • ${f.updatedAt}`,
          badge: f.extension ? `.${f.extension}` : f.category,
          badgeColor: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
          icon: FileText,
          onSelect: () => {
            setSelectedFile(f);
            setActiveView('files');
            setIsSearchOpen(false);
          },
        });
      }
    });

    // 4. Tools Search
    tools.forEach((tl) => {
      if (!q || tl.name.toLowerCase().includes(q) || tl.description.toLowerCase().includes(q) || tl.category.toLowerCase().includes(q)) {
        results.push({
          id: `tool_${tl.id}`,
          category: 'Tools',
          title: tl.name,
          subtitle: tl.description,
          badge: tl.category.replace('_', ' '),
          badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
          icon: Wrench,
          onSelect: () => {
            setActiveView('tools');
            setIsSearchOpen(false);
          },
        });
      }
    });

    // 5. Messages Search (Active chat search)
    if (q) {
      messages
        .filter((m) => !m.isDeleted && m.text.toLowerCase().includes(q))
        .slice(0, 6)
        .forEach((m) => {
          results.push({
            id: `msg_${m.id}`,
            category: 'Messages',
            title: `${m.sender === 'user' ? 'You' : 'Agent-sigma08'}: "${m.text.slice(0, 60)}..."`,
            subtitle: `Chat log • ${m.timestamp}`,
            badge: m.sender === 'user' ? 'Prompt' : 'Response',
            badgeColor: m.sender === 'user' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 'text-[#FF204E] border-[#FF204E]/30 bg-[#FF204E]/10',
            icon: MessageSquare,
            onSelect: () => {
              setActiveView('chat');
              setIsSearchOpen(false);
            },
          });
        });
    }

    return results;
  }, [searchQuery, pages, tasks, files, tools, messages, setActiveView, setSelectedTask, setSelectedFile, handleSendMessage, createTask]);

  // Filter results by selected category tab
  const filteredResults = useMemo(() => {
    if (activeCategory === 'ALL') return searchResults;
    if (activeCategory === 'PAGES') return searchResults.filter((r) => r.category === 'Pages' || r.category === 'Action');
    if (activeCategory === 'TASKS') return searchResults.filter((r) => r.category === 'Tasks');
    if (activeCategory === 'FILES') return searchResults.filter((r) => r.category === 'Files');
    if (activeCategory === 'TOOLS') return searchResults.filter((r) => r.category === 'Tools');
    if (activeCategory === 'MESSAGES') return searchResults.filter((r) => r.category === 'Messages');
    return searchResults;
  }, [searchResults, activeCategory]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults.length, activeCategory]);

  // Keyboard navigation within results
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSearchOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsSearchOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filteredResults.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        filteredResults[selectedIndex].onSelect();
      } else if (searchQuery.trim()) {
        setActiveView('chat');
        handleSendMessage(searchQuery.trim());
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    }
  };

  const handleClearSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchQuery('');
    inputRef.current?.focus();
  };

  return (
    <header
      id="app_header"
      className="
        relative
        z-50
        flex
        h-[64px]
        w-full
        shrink-0
        items-center
        justify-between
        rounded-2xl
        neumorph-raised
        px-3
        sm:px-6
        transition-all
      "
    >
      {/* Specular light lines */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF204E]/30 to-transparent" />

      {/* LEFT / CENTER: Fully Functional Search & Command System */}
      <div ref={searchContainerRef} className="flex flex-1 items-center min-w-0 max-w-md mr-1.5 sm:mr-3 relative">
        <div className="relative w-full">
          <Search
            className={`absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 pointer-events-none transition-colors ${
              isSearchOpen || searchQuery ? 'text-[#FF204E] animate-pulse' : 'text-[#94A3B8]'
            }`}
          />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!isSearchOpen) setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            onKeyDown={handleInputKeyDown}
            placeholder={
              currentLanguage.id !== 'en' && currentLanguage.labels.searchPlaceholder
                ? currentLanguage.labels.searchPlaceholder
                : "Search or ask AI..."
            }
            className="
              w-full
              rounded-xl
              neumorph-input
              bg-gradient-to-r
              from-[#060103]
              via-[#0e0207]
              to-[#060103]
              h-9
              sm:h-10
              py-1.5
              sm:py-2.5
              pl-8
              sm:pl-10
              pr-8
              sm:pr-16
              text-xs
              text-[#F8FAFC]
              placeholder-[#94A3B8]/60
              border
              border-[#E50914]/25
              focus:border-[#FF204E]
              focus:ring-1
              sm:focus:ring-2
              focus:ring-[#FF204E]/30
              focus:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.95),inset_-3px_-3px_8px_rgba(255,32,78,0.35),0_0_20px_rgba(255,32,78,0.4)]
              focus:outline-none
              transition-all
              caret-[#FF204E]
              truncate
            "
          />

          <div className="absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="h-6 w-6 sm:h-5 sm:w-5 rounded-full neumorph-circle flex items-center justify-center text-[#94A3B8] hover:text-[#FF204E] transition-all cursor-pointer"
                title="Clear query"
              >
                <X className="h-3 w-3" />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                inputRef.current?.focus();
                setIsSearchOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-[#E50914]/30 bg-[#080204] px-1.5 py-0.5 text-[10px] font-mono text-[#94A3B8] hover:text-white cursor-pointer select-none"
              title="Quick Search Shortcut"
            >
              ⌘ K
            </button>
          </div>
        </div>

        {/* Real-Time Search & Command Results Overlay */}
        {isSearchOpen && (
          <div className="fixed inset-x-2 xs:inset-x-3 top-[68px] sm:absolute sm:inset-auto sm:left-0 sm:top-[calc(100%+8px)] w-auto sm:w-[580px] max-w-[calc(100vw-16px)] sm:max-w-[580px] rounded-2xl neumorph-card p-3 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(229,9,20,0.35)] border border-[#FF204E]/35 z-[100] animate-fadeIn">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 border-b border-[#E50914]/20 scrollbar-none">
              {(
                [
                  { key: 'ALL', label: 'All' },
                  { key: 'PAGES', label: 'Pages' },
                  { key: 'TASKS', label: 'Tasks' },
                  { key: 'FILES', label: 'Files' },
                  { key: 'TOOLS', label: 'Tools' },
                  { key: 'MESSAGES', label: 'Chat' },
                ] as const
              ).map((tab) => {
                const isActive = activeCategory === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveCategory(tab.key)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer transition-all shrink-0 ${
                      isActive
                        ? 'neumorph-btn-primary text-white shadow-md'
                        : 'neumorph-btn-secondary text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Results List */}
            <div className="max-h-[360px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-[#E50914]/40">
              {filteredResults.length > 0 ? (
                filteredResults.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={item.onSelect}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'neumorph-card bg-gradient-to-r from-[#20050e] to-[#120207] border border-[#FF204E]/60 shadow-[0_4px_16px_rgba(255,32,78,0.25)] translate-x-1'
                          : 'hover:bg-white/[0.04] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            item.category === 'Action'
                              ? 'neumorph-btn-primary text-white'
                              : isSelected
                              ? 'neumorph-circle text-[#FF204E]'
                              : 'neumorph-inset text-[#94A3B8]'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold truncate ${
                                isSelected ? 'text-white' : 'text-[#F8FAFC]'
                              }`}
                            >
                              {item.title}
                            </span>
                            {item.badge && (
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${
                                  item.badgeColor || 'text-[#94A3B8] border-white/10'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">{item.subtitle}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 pl-2 shrink-0">
                        {isSelected ? (
                          <div className="flex items-center gap-1 text-[10px] font-mono text-[#FF204E] font-semibold">
                            <span>Open</span>
                            <CornerDownLeft className="h-3 w-3" />
                          </div>
                        ) : (
                          <ArrowRight className="h-3.5 w-3.5 text-[#94A3B8]/40 group-hover:text-[#94A3B8] transition-colors" />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 px-4 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full neumorph-circle mx-auto flex items-center justify-center text-[#FF204E]">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">No results found for "{searchQuery}"</h4>
                    <p className="text-[11px] text-[#94A3B8] mt-1 max-w-xs mx-auto">
                      Would you like to ask Agent-sigma08 to research this or create a new automated task?
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveView('chat');
                        handleSendMessage(searchQuery.trim());
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="neumorph-btn-primary px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 text-white cursor-pointer"
                    >
                      <Sparkles className="h-3 w-3" />
                      Ask Agent Now
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        createTask(searchQuery.trim(), `Task for ${searchQuery.trim()}`, 'Medium');
                        setActiveView('tasks');
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="neumorph-btn-secondary px-3 py-1.5 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      Create Task
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Helper Keyboard Footer */}
            <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#E50914]/20 text-[10px] text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white/90">
                  {filteredResults.length} {filteredResults.length === 1 ? 'match' : 'matches'}
                </span>
                <span>•</span>
                <span>Press ↵ to open</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded neumorph-inset font-mono text-[9px]">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded neumorph-inset font-mono text-[9px]">↓</kbd>
                  <span>navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded neumorph-inset font-mono text-[9px]">Esc</kbd>
                  <span>close</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Global Selector, Notification Bell with red badge 3, Profile Avatar */}
      <div className="relative flex items-center gap-2 sm:gap-3">
        {/* Global Dropdown Button - Neumorphic Tactile Pill */}
        <button
          ref={languageButtonRef}
          id="btn_language_mode_header"
          type="button"
          onClick={() => {
            setIsLanguageDropdownOpen((prev) => !prev);
            sound.play('click');
          }}
          title={`Active Language: ${currentLanguage.name} (${currentLanguage.englishName}) - Tech Hub: ${currentLanguage.techHub}. Click to open Language Switcher.`}
          className="
            group
            relative
            flex
            items-center
            gap-2
            sm:gap-2.5
            rounded-full
            bg-gradient-to-r
            from-[#1C080E]/95
            via-[#140509]/95
            to-[#260A14]/95
            px-3.5
            sm:px-4
            py-1.5
            text-xs
            font-semibold
            text-white
            cursor-pointer
            border
            border-[#FF204E]/40
            hover:border-[#FF204E]
            shadow-[0_2px_12px_rgba(0,0,0,0.6),0_0_14px_rgba(255,32,78,0.22)]
            hover:shadow-[0_0_22px_rgba(255,32,78,0.55)]
            active:scale-95
            transition-all
            duration-200
            backdrop-blur-md
          "
        >
          <div className="relative flex items-center justify-center">
            <Globe className="h-3.5 w-3.5 text-[#FF204E] shrink-0 transition-transform duration-300 group-hover:rotate-45 drop-shadow-[0_0_8px_rgba(255,32,78,0.9)]" />
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-[#140509] animate-pulse" />
          </div>
          <span className="font-semibold text-xs text-white tracking-tight flex items-center gap-1.5 select-none transition-colors">
            <span className="text-sm leading-none drop-shadow-sm transform transition-transform group-hover:scale-110">{currentLanguage.flag}</span>
            <span className="truncate max-w-[85px] sm:max-w-[130px] font-extrabold tracking-wide text-white group-hover:text-[#FF4D6D] transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {currentLanguage.name}
            </span>
            <span className="hidden md:inline-flex text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FF204E]/20 text-[#FF4D6D] border border-[#FF204E]/40 uppercase tracking-wider shadow-[0_0_8px_rgba(255,32,78,0.25)]">
              {currentLanguage.countryCode}
            </span>
          </span>
          <ChevronDown className={`h-3.5 w-3.5 text-[#94A3B8] transition-transform duration-200 group-hover:text-white ${isLanguageDropdownOpen ? 'rotate-180 text-[#FF204E]' : ''}`} />
        </button>

        {/* Real Language Switcher Popover Panel */}
        {isLanguageDropdownOpen && (
          <div
            ref={languageDropdownRef}
            className="
              absolute
              right-0
              sm:right-auto
              sm:left-0
              top-[calc(100%+8px)]
              w-[320px]
              xs:w-[360px]
              sm:w-[410px]
              max-w-[95vw]
              rounded-2xl
              neumorph-card
              p-3.5
              shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(229,9,20,0.35)]
              border
              border-[#FF204E]/40
              z-[120]
              animate-fadeIn
            "
          >
            {/* Popover Header */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#E50914]/20">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg neumorph-circle flex items-center justify-center text-[#FF204E]">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                    Tech Language Hub
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#FF204E]/20 text-[#FF204E] font-bold">
                      30 Nations
                    </span>
                  </h4>
                  <p className="text-[10px] text-[#94A3B8]">
                    Active: <span className="text-white font-bold">{currentLanguage.flag} {currentLanguage.country}</span> ({currentLanguage.name})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLanguageDropdownOpen(false)}
                className="h-6 w-6 rounded-lg neumorph-circle flex items-center justify-center text-[#94A3B8] hover:text-white cursor-pointer"
                title="Close"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            {/* Search Filter */}
            <div className="relative mb-2.5">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94A3B8]" />
              <input
                type="text"
                value={langSearch}
                onChange={(e) => setLangSearch(e.target.value)}
                placeholder="Search 30 languages, countries or tech hubs..."
                className="w-full bg-[#080204] rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-[#94A3B8]/60 border border-[#E50914]/25 focus:border-[#FF204E] focus:outline-none"
              />
              {langSearch && (
                <button
                  type="button"
                  onClick={() => setLangSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Region Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 border-b border-[#E50914]/15 scrollbar-none">
              {['All', 'Asia & Pacific', 'Europe', 'Americas', 'Middle East'].map((reg) => (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setSelectedLangRegion(reg)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap cursor-pointer transition-all ${
                    selectedLangRegion === reg
                      ? 'neumorph-btn-primary text-white shadow-sm'
                      : 'neumorph-btn-secondary text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>

            {/* Quick Switch List */}
            <div className="max-h-[260px] overflow-y-auto space-y-1 pr-1 scrollbar-thin">
              {filteredTechLanguages.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#94A3B8]">
                  No matching tech nation found for "{langSearch}"
                </div>
              ) : (
                filteredTechLanguages.map((lang) => {
                  const isCurrent = lang.id === currentLanguage.id;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => {
                        setLanguageMode(lang.id);
                        sound.play('success');
                        setIsLanguageDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer group ${
                        isCurrent
                          ? 'neumorph-card border border-[#FF204E] bg-[#FF204E]/10 shadow-[0_0_12px_rgba(255,32,78,0.25)]'
                          : 'hover:bg-white/5 neumorph-inset-sm border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl shrink-0 drop-shadow-sm">{lang.flag}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-bold truncate ${isCurrent ? 'text-[#FF204E]' : 'text-white group-hover:text-[#FF204E]'}`}>
                              {lang.name}
                            </span>
                            <span className="text-[10px] text-[#94A3B8] truncate">
                              ({lang.englishName})
                            </span>
                          </div>
                          <div className="text-[10px] text-[#94A3B8] truncate">
                            {lang.country} • <span className="text-[#FF204E]/80">{lang.techHub}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-white/5 text-[#94A3B8]">
                          {lang.countryCode}
                        </span>
                        {isCurrent && (
                          <div className="h-5 w-5 rounded-full bg-[#FF204E] text-white flex items-center justify-center shadow-[0_0_8px_rgba(255,32,78,0.8)]">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Popover Footer */}
            <div className="pt-2.5 mt-2 border-t border-[#E50914]/20 flex items-center justify-between">
              <span className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Localization Engine
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsLanguageDropdownOpen(false);
                  setIsLanguageModalOpen(true);
                  sound.play('click');
                }}
                className="text-[10px] font-bold text-[#FF204E] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full Tech Grid</span>
                <ArrowRight className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>
        )}

        {/* Notification Bell - Neumorphic Raised Circle Button */}
        <div className="relative">
          <button
            ref={notificationButtonRef}
            onClick={() => {
              setShowNotifications(!showNotifications);
              sound.play('click');
            }}
            className="
              relative
              flex
              h-9
              w-9
              items-center
              justify-center
              neumorph-circle
              text-white/90
              cursor-pointer
              transition-transform
              active:scale-95
            "
            title="Agent Notifications & Live Status"
          >
            <Bell className="h-4.5 w-4.5 text-[#FF204E]" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 min-w-[18px] px-1 items-center justify-center rounded-full neumorph-badge-primary text-[10px] font-black text-white shadow-[0_0_8px_rgba(255,32,78,0.8)] animate-pulse">
                {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div
              ref={notificationDropdownRef}
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl neumorph-card p-4 shadow-2xl z-50 text-xs space-y-3 animate-fadeIn border border-[#E50914]/25"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#E50914]/25 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">Agent Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span className="text-[10px] text-[#FF204E] font-bold neumorph-badge px-2 py-0.5 rounded-full">
                      {unreadNotificationCount} New
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {notifications.length > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAllNotificationsAsRead();
                          sound.play('click');
                        }}
                        className="text-[10px] text-[#94A3B8] hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Mark all as read"
                      >
                        <CheckCheck className="h-3 w-3 text-emerald-400" />
                        <span>Read All</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Delete all notifications?')) {
                            clearAllNotifications();
                            sound.play('delete');
                          }
                        }}
                        className="text-[10px] text-red-400 hover:text-red-300 px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Delete all notifications"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Clear</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Notification Items List */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-[#94A3B8]">
                    <Bell className="h-6 w-6 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold text-zinc-300">No notifications</p>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      Working states and completed tasks will appear here.
                    </p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notif) => {
                    const isWorking = notif.type === 'task_started';
                    const isCompleted = notif.type === 'task_completed';
                    const isWeb = notif.type === 'web_gathering';

                    return (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.taskId) {
                            const t = tasks.find((item) => item.id === notif.taskId);
                            if (t) setSelectedTask(t);
                            setActiveView('tasks');
                            setShowNotifications(false);
                          } else {
                            setIsNotificationCenterOpen(true);
                            setShowNotifications(false);
                          }
                          sound.play('click');
                        }}
                        className={`group relative p-3 rounded-xl transition-all cursor-pointer border ${
                          notif.read
                            ? 'neumorph-inset bg-black/30 border-white/5 hover:border-[#FF204E]/30'
                            : 'bg-gradient-to-r from-[#FF204E]/10 to-transparent border-[#FF204E]/40 hover:border-[#FF204E]/70 shadow-[0_0_10px_rgba(255,32,78,0.1)]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                                isWorking
                                  ? 'bg-[#FF204E]/20 text-[#FF204E]'
                                  : isCompleted
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : isWeb
                                  ? 'bg-cyan-500/20 text-cyan-300'
                                  : 'bg-blue-500/20 text-blue-300'
                              }`}
                            >
                              {isWorking
                                ? 'Real Working'
                                : isCompleted
                                ? 'Completed'
                                : isWeb
                                ? 'Web Intel'
                                : 'System'}
                            </span>
                            <span className="text-[10px] text-[#94A3B8]">{notif.timestamp}</span>
                          </div>

                          {/* Delete Single Notification */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id);
                              sound.play('delete');
                            }}
                            className="p-1 rounded text-[#94A3B8] hover:text-red-400 hover:bg-red-500/20 transition-all cursor-pointer opacity-70 group-hover:opacity-100"
                            title="Delete this notification"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="font-semibold text-white mt-1 line-clamp-1">
                          {notif.title}
                        </div>
                        <div className="text-[11px] text-[#94A3B8] line-clamp-2 mt-0.5 leading-relaxed">
                          {notif.message}
                        </div>

                        {notif.webSources && notif.webSources.length > 0 && (
                          <div className="mt-1 text-[10px] text-cyan-300 flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            <span>{notif.webSources.length} Live Web Sources Gathered</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="pt-2 border-t border-[#E50914]/20 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications(false);
                    setIsNotificationCenterOpen(true);
                    sound.play('click');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#FF204E]/15 hover:bg-[#FF204E]/25 text-[#FF204E] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-[#FF204E]/30"
                >
                  <span>Open Full Notification Hub</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User profile picture with Neumorphic circular bezel */}
        <div
          id="header_user_avatar"
          onClick={() => setActiveView('profile')}
          className="
            relative
            flex
            h-9
            w-9
            items-center
            justify-center
            cursor-pointer
            neumorph-circle
            p-[2px]
            hover:scale-105
            transition-all
          "
          title="User Profile & Settings"
        >
          <div className="flex h-full w-full items-center justify-center rounded-full overflow-hidden bg-black/60">
            {userProfile.profileImage ? (
              <img src={userProfile.profileImage} alt={userProfile.name} className="h-full w-full object-cover rounded-full" />
            ) : (
              <User className="h-4 w-4 text-white fill-white/80" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


