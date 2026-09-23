import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Globe,
  Cpu,
  RefreshCw,
  Download,
  AlertTriangle,
  Check,
  Save,
  MapPin,
  Sparkles,
  MessageSquare,
  Clock,
  Smartphone,
  Play,
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';
import { TECH_LANGUAGES, getLanguage } from '../../data/languages';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    tasks,
    files,
    activities,
    approvals,
    currentLanguage,
    setLanguageMode,
    setIsLanguageModalOpen,
    t,
  } = useAgent();

  const [formData, setFormData] = useState({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // WhatsApp Auto-Responder States
  const [waEnabled, setWaEnabled] = useState(true);
  const [waDelay, setWaDelay] = useState(20);
  const [waLanguageMatching, setWaLanguageMatching] = useState(true);
  const [waTone, setWaTone] = useState<'professional' | 'friendly' | 'casual'>('friendly');
  
  // Interactive Simulation States
  const [simStatus, setSimStatus] = useState<'idle' | 'waiting' | 'generating' | 'dispatched'>('idle');
  const [simScenario, setSimScenario] = useState<'inquiry_bn' | 'support_en' | 'deal_de'>('inquiry_bn');
  const [simProgress, setSimProgress] = useState(0);
  const [simLog, setSimLog] = useState<string[]>([]);
  const [simDraft, setSimDraft] = useState('');

  const runSimulation = () => {
    setSimStatus('waiting');
    setSimProgress(0);
    setSimLog([`[12:00 PM] 📥 New WhatsApp Message Received.`]);
    setSimDraft('');

    const scenarioTexts = {
      inquiry_bn: {
        from: '+880 1712-345678',
        text: 'আসসালামু আলাইকুম, আপনাদের সফটওয়্যার ডেভেলপমেন্ট সেবার দাম কত? এবং ডেলিভারি দিতে কতদিন সময় লাগবে?',
        detectedLang: 'Bangla (Bengali)',
        detectedType: 'Service Pricing Inquiry',
        draft: `আসসালামু আলাইকুম ওয়া রহমতুল্লাহ! আব্দুল্লাহ ভাইয়ের পক্ষ থেকে আমি উনার এআই অ্যাসিস্ট্যান্ট বলছি। উনি বর্তমানে একটি গুরুত্বপূর্ণ মিটিংয়ে ব্যস্ত আছেন। আপনি যেহেতু আমাদের সফটওয়্যার ডেভেলপমেন্ট সেবার মূল্য সম্পর্কে জানতে চেয়েছেন, আমাদের প্রজেক্ট সাধারণত কাজের পরিধি অনুযায়ী $১,০০০ থেকে শুরু হয় এবং সময় লাগে ২-৪ সপ্তাহ। উনি ফ্রি হওয়া মাত্রই (২০ মিনিটের মধ্যে রিপ্লাই না পাওয়ায় আমি ড্রাফটটি পাঠালাম) আপনাকে সরাসরি মেসেজ করবেন। ধন্যবাদ!`
      },
      support_en: {
        from: '+1 (555) 019-2834',
        text: 'Hi there, I am having trouble logging into my work dashboard. It says authentication failed.',
        detectedLang: 'English (US)',
        detectedType: 'Technical Support',
        draft: `Hello! I am Abdullah's AI Assistant. As Abdullah hasn't been able to respond in the last 20 minutes, I wanted to help you right away. For dashboard login issues, please try clearing your browser cache or reset your session. I have already flagged this for Abdullah, and he will check in on you as soon as he is back! Thank you for your patience.`
      },
      deal_de: {
        from: '+49 89 201934',
        text: 'Hallo, wir möchten das neue Angebot besprechen. Wann haben Sie Zeit für einen kurzen Anruf?',
        detectedLang: 'German (Deutsch)',
        detectedType: 'Business Meeting Inquiry',
        draft: `Hallo! Ich bin der KI-Assistent von Abdullah. Da Abdullah in den letzten 20 Minuten nicht antworten konnte, helfe ich Ihnen gerne weiter. Er ist diese Woche für einen kurzen Anruf verfügbar. Ich habe dies für ihn notiert, und er wird sich direkt mit Ihnen in Verbindung setzen, sobald er wieder online ist!`
      }
    };

    const scenario = scenarioTexts[simScenario];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep += 1;
      setSimProgress(currentStep * 10);
      
      if (currentStep === 2) {
        setSimLog(prev => [...prev, `[12:05 PM] ⏱️ 5 mins elapsed... Waiting for manual reply from Abdullah.`]);
      } else if (currentStep === 4) {
        setSimLog(prev => [...prev, `[12:10 PM] ⏱️ 10 mins elapsed... No manual reply registered.`]);
      } else if (currentStep === 7) {
        setSimLog(prev => [...prev, `[12:15 PM] ⏱️ 15 mins elapsed... Still waiting.`]);
      } else if (currentStep === 10) {
        clearInterval(interval);
        setSimLog(prev => [
          ...prev, 
          `[12:20 PM] 🚨 20-minute threshold reached without reply. Triggering AI Auto-Responder.`,
          `🔍 Analyzing incoming message...`,
          `🗣️ Detected Language: ${scenario.detectedLang}`,
          `📋 Message Type: ${scenario.detectedType}`,
          `🧠 Generating contextual response matched to Abdullah's professional persona with ${waTone} tone...`
        ]);
        
        setSimStatus('generating');
        
        setTimeout(() => {
          setSimDraft(scenario.draft);
          setSimStatus('dispatched');
          setSimLog(prev => [
            ...prev, 
            `✨ Professional reply drafted successfully.`,
            `🚀 Dispatched via WhatsApp Business API successfully to ${scenario.from}!`
          ]);
        }, 1500);
      }
    }, 400);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLanguageSelect = (langId: string) => {
    setFormData((prev) => ({ ...prev, language: langId }));
    setLanguageMode(langId);
  };

  const handleExportWorkspace = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      settings: formData,
      tasks,
      files,
      approvals,
      activities,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abdullah-ai-workspace-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResetMemory = () => {
    if (window.confirm('Are you sure you want to reset conversation memory? Tasks and files will be preserved.')) {
      window.location.reload();
    }
  };

  const activeLangDetails = getLanguage(formData.language);

  return (
    <div id="settings_view" className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full text-[#F8FAFC] bg-[#080204]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FF204E]/20 pb-4 sm:pb-5">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#F8FAFC] flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl neumorph-circle flex items-center justify-center text-[#FF204E]">
              <SettingsIcon className="h-5 w-5 text-[#FF204E]" />
            </div>
            <span>{currentLanguage.labels.settingsTitle}</span>
          </h1>
          <p className="mt-1 text-xs text-[#94A3B8]">
            {t.settingsSubtitle}
          </p>
        </div>

        {saveSuccess && (
          <span className="flex items-center gap-1.5 rounded-xl neumorph-btn-primary px-3.5 py-1.5 text-xs font-semibold text-white animate-fadeIn">
            <Check className="h-3.5 w-3.5 text-white" />
            {t.savedSuccessBadge}
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* ======================================================== */}
        {/* 30 COUNTRY TECHNOLOGY LANGUAGE MODE SECTION              */}
        {/* ======================================================== */}
        <div className="rounded-2xl neumorph-card p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#FF204E]/20">
            <h2 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg neumorph-circle flex items-center justify-center text-[#FF204E]">
                <Globe className="h-4 w-4 text-[#FF204E]" />
              </div>
              <span>{t.langModeSectionTitle}</span>
            </h2>

            <button
              type="button"
              id="btn_open_language_modal_from_settings"
              onClick={() => setIsLanguageModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl neumorph-btn-primary px-3.5 py-1.5 text-xs font-semibold text-white self-start sm:self-auto cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t.openModalBtn}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#94A3B8] font-medium mb-1.5">
                Active Technology Country Language
              </label>
              <select
                id="select_settings_language"
                value={formData.language}
                onChange={(e) => handleLanguageSelect(e.target.value)}
                className="w-full rounded-xl neumorph-inset px-3.5 py-2.5 text-xs sm:text-sm text-[#F8FAFC] focus:outline-none"
              >
                {TECH_LANGUAGES.map((lang, idx) => (
                  <option key={lang.id} value={lang.id} className="bg-[#0f0306] text-white">
                    {lang.flag} {lang.country} — {lang.name} ({lang.englishName}) {idx === 0 ? '★ #1 FIRST' : ''} {lang.id === 'en' ? '★ DEFAULT' : ''}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-[11px] text-[#94A3B8]">
                Bangladesh is placed #1 in the list. When not configured by the user, the default active language is English.
              </p>
            </div>

            {/* Live Country Card Preview */}
            <div className="rounded-xl neumorph-inset p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Selected Tech Hub
                  </span>
                  <span className="text-[10px] font-mono text-[#FF204E] neumorph-badge px-2 py-0.5 rounded-lg">
                    {activeLangDetails.region}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 mt-2">
                  <span className="text-2xl select-none">{activeLangDetails.flag}</span>
                  <div>
                    <div className="text-sm font-bold text-[#F8FAFC]">
                      {activeLangDetails.country} ({activeLangDetails.name})
                    </div>
                    <div className="text-xs text-[#94A3B8]">
                      Standard: {activeLangDetails.englishName}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#FF204E]/15 flex items-center justify-between text-[11px] text-[#94A3B8]">
                <span className="flex items-center gap-1 text-[#FF204E] font-mono">
                  <MapPin className="h-3 w-3" />
                  {activeLangDetails.techHub}
                </span>
                <span className="truncate max-w-[150px]">{activeLangDetails.techDomain}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Profile & Identity */}
        <div className="rounded-2xl neumorph-card p-4 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg neumorph-circle flex items-center justify-center text-[#FF204E]">
              <Cpu className="h-4 w-4 text-[#FF204E]" />
            </div>
            <span>Agent Identity & Autonomous Profile</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#94A3B8] font-medium mb-1">Agent Name</label>
              <input
                type="text"
                value={formData.agentName}
                onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                className="w-full rounded-xl neumorph-inset px-3.5 py-2.5 text-[#F8FAFC] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#94A3B8] font-medium mb-1">Authorized User</label>
              <input
                type="text"
                disabled
                value="Abdullah (Owner & Principal)"
                className="w-full rounded-xl neumorph-inset px-3.5 py-2.5 text-[#94A3B8] cursor-not-allowed opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Permissions & Safety */}
        <div className="rounded-2xl neumorph-card p-4 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg neumorph-circle flex items-center justify-center text-[#FF204E]">
              <Shield className="h-4 w-4 text-[#FF204E]" />
            </div>
            <span>Safety & Security Guardrails</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#94A3B8] font-medium mb-1">Permission Sensitivity</label>
              <select
                value={formData.permissionSensitivity}
                onChange={(e) =>
                  setFormData({ ...formData, permissionSensitivity: e.target.value as any })
                }
                className="w-full rounded-xl neumorph-inset px-3.5 py-2.5 text-[#F8FAFC] focus:outline-none"
              >
                <option value="High" className="bg-[#0f0306]">High (Strict Gate: All external actions require approval)</option>
                <option value="Medium" className="bg-[#0f0306]">Medium (Balanced: External communication &amp; deletes gated)</option>
                <option value="Low" className="bg-[#0f0306]">Low (Permissive: Only sensitive deletions gated)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#94A3B8] font-medium mb-1">Autonomous Plan Execution</label>
              <select
                value={formData.aiBehavior}
                onChange={(e) => setFormData({ ...formData, aiBehavior: e.target.value as any })}
                className="w-full rounded-xl neumorph-inset px-3.5 py-2.5 text-[#F8FAFC] focus:outline-none"
              >
                <option value="semi-autonomous" className="bg-[#0f0306]">Semi-Autonomous (Confirm before critical tools)</option>
                <option value="autonomous" className="bg-[#0f0306]">Fully Autonomous (Auto-approve non-destructive tasks)</option>
                <option value="strict-approval" className="bg-[#0f0306]">Strict Approval (Human in the loop on all actions)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3 rounded-xl neumorph-inset cursor-pointer">
              <div>
                <span className="font-semibold text-[#F8FAFC] block">Safe Execution Mode</span>
                <span className="text-[11px] text-[#94A3B8]">
                  Pre-screens code modifications, verifies syntax, and prevents unintended overwrites.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.safeMode}
                onChange={(e) => setFormData({ ...formData, safeMode: e.target.checked })}
                className="h-4 w-4 rounded accent-[#FF204E]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl neumorph-inset cursor-pointer">
              <div>
                <span className="font-semibold text-[#F8FAFC] block">In-App Notifications</span>
                <span className="text-[11px] text-[#94A3B8]">
                  Display immediate alerts when tasks complete or approvals are required.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.notifications}
                onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                className="h-4 w-4 rounded accent-[#FF204E]"
              />
            </label>

            <div className="pt-3 border-t border-[#FF204E]/15 space-y-3">
              <span className="text-[11px] font-bold tracking-wider text-[#FF204E] uppercase block">
                Delegated Authority & Autopilot Settings
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-between p-3 rounded-xl neumorph-inset cursor-pointer">
                  <div>
                    <span className="font-semibold text-[#F8FAFC] block text-xs">Auto-Dispatch Communications</span>
                    <span className="text-[10px] text-[#94A3B8] block mt-0.5">
                      Allow agent to draft and send outbound emails/replies directly.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.autoApproveEmail}
                    onChange={(e) => setFormData({ ...formData, autoApproveEmail: e.target.checked })}
                    className="h-3.5 w-3.5 rounded accent-[#FF204E] shrink-0 ml-2"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl neumorph-inset cursor-pointer">
                  <div>
                    <span className="font-semibold text-[#F8FAFC] block text-xs">Auto-Schedule Meetings</span>
                    <span className="text-[10px] text-[#94A3B8] block mt-0.5">
                      Authorize agent to book events and suggest calendar slots.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.autoApproveCalendar}
                    onChange={(e) => setFormData({ ...formData, autoApproveCalendar: e.target.checked })}
                    className="h-3.5 w-3.5 rounded accent-[#FF204E] shrink-0 ml-2"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl neumorph-inset cursor-pointer">
                  <div>
                    <span className="font-semibold text-[#F8FAFC] block text-xs">Autonomous File Syncing</span>
                    <span className="text-[10px] text-[#94A3B8] block mt-0.5">
                      Permit agent to rewrite, backup, or clean localized work-files.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.autoApproveFiles}
                    onChange={(e) => setFormData({ ...formData, autoApproveFiles: e.target.checked })}
                    className="h-3.5 w-3.5 rounded accent-[#FF204E] shrink-0 ml-2"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl neumorph-inset cursor-pointer">
                  <div>
                    <span className="font-semibold text-[#F8FAFC] block text-xs">Automated Market Sourcing</span>
                    <span className="text-[10px] text-[#94A3B8] block mt-0.5">
                      Query APIs and scrape live search metrics without approval gate.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.autoApproveResearch}
                    onChange={(e) => setFormData({ ...formData, autoApproveResearch: e.target.checked })}
                    className="h-3.5 w-3.5 rounded accent-[#FF204E] shrink-0 ml-2"
                  />
                </label>
              </div>
            </div>

            <div className="p-3 rounded-xl neumorph-inset flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#F8FAFC] block">Server-Side Gemini 3.8 Integration</span>
                <span className="text-[11px] text-[#94A3B8]">
                  API Key is securely isolated on the backend server (`server.ts`).
                </span>
              </div>
              <span className="rounded-lg neumorph-badge px-2.5 py-1 text-[10px] font-mono font-semibold text-[#FF204E]">
                Connected &amp; Armed
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* INTERACTIVE WHATSAPP AUTO-RESPONDER PANEL WITH SIMULATOR */}
        {/* ======================================================== */}
        <div className="rounded-2xl neumorph-card p-4 sm:p-6 space-y-5 relative overflow-hidden">
          {/* Natural Crimson Glow Accent */}
          <div className="pointer-events-none absolute -right-12 -bottom-12 h-44 w-44 rounded-full bg-[#E50914]/10 blur-[80px]" />

          <div className="flex items-center justify-between border-b border-[#FF204E]/20 pb-3">
            <h2 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg neumorph-circle flex items-center justify-center text-[#FF204E]">
                <Smartphone className="h-4 w-4 text-[#FF204E]" />
              </div>
              <span>WhatsApp Autonomous Auto-Responder</span>
            </h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={waEnabled} 
                onChange={(e) => setWaEnabled(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-[#070103] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#94A3B8] peer-checked:after:bg-[#FF204E] after:border-gray-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#990000] border border-[#FF204E]/20"></div>
              <span className="ml-2 text-[10px] font-bold text-[#94A3B8] uppercase">
                {waEnabled ? 'Active' : 'Disabled'}
              </span>
            </label>
          </div>

          <p className="text-[11px] text-[#94A3B8] leading-relaxed">
            When enabled, the Work OS agent monitors incoming WhatsApp Business API webhooks. If you don't manually respond to an incoming chat within your configured window, the agent automatically drafts and dispatches an contextually accurate reply in the matching client language.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="rounded-xl neumorph-inset p-3.5">
              <span className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-[#FF204E]" />
                Response Threshold
              </span>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={waDelay}
                  onChange={(e) => setWaDelay(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 rounded-lg neumorph-card px-2.5 py-1.5 text-xs text-[#F8FAFC] focus:outline-none font-mono text-center"
                />
                <span className="text-xs text-[#F8FAFC] font-semibold">Minutes</span>
              </div>
              <span className="text-[9px] text-[#94A3B8] block mt-1.5">
                Recommended: 20 minutes to allow human response priority.
              </span>
            </div>

            <div className="rounded-xl neumorph-inset p-3.5">
              <span className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2 flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-[#FF204E]" />
                Language Engine
              </span>
              <label className="flex items-center gap-2 cursor-pointer mt-1">
                <input 
                  type="checkbox" 
                  checked={waLanguageMatching}
                  onChange={(e) => setWaLanguageMatching(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#FF204E]"
                />
                <span className="text-xs text-[#F8FAFC] font-semibold">Dynamic Auto-Detect</span>
              </label>
              <span className="text-[9px] text-[#94A3B8] block mt-2">
                Replies directly in Bangla, English, German, or matching client tongue.
              </span>
            </div>

            <div className="rounded-xl neumorph-inset p-3.5">
              <span className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2 flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5 text-[#FF204E]" />
                Brand Persona Tone
              </span>
              <select
                value={waTone}
                onChange={(e) => setWaTone(e.target.value as any)}
                className="w-full rounded-lg neumorph-card px-2.5 py-1.5 text-xs text-[#F8FAFC] focus:outline-none"
              >
                <option value="friendly" className="bg-[#0f0306]">Friendly &amp; Helpful</option>
                <option value="professional" className="bg-[#0f0306]">Strictly Professional</option>
                <option value="casual" className="bg-[#0f0306]">Casual &amp; Fast</option>
              </select>
              <span className="text-[9px] text-[#94A3B8] block mt-1.5">
                Adapts vocabulary to matched corporate standards.
              </span>
            </div>
          </div>

          {/* REAL-TIME INTERACTIVE SIMULATOR */}
          <div className="rounded-xl neumorph-inset p-4 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FF204E]/15 pb-2.5">
              <div>
                <span className="text-xs font-bold text-[#F8FAFC] block flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#FF204E] animate-pulse" />
                  Live WhatsApp Flow Simulator
                </span>
                <span className="text-[10px] text-[#94A3B8]">
                  Test how the 20-minute waiting gate triggers dynamic language auto-replies.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={simScenario}
                  onChange={(e) => setSimScenario(e.target.value as any)}
                  disabled={simStatus === 'waiting' || simStatus === 'generating'}
                  className="rounded-lg neumorph-card px-2.5 py-1 text-xs text-[#F8FAFC] focus:outline-none font-medium"
                >
                  <option value="inquiry_bn" className="bg-[#0f0306]">🇧🇩 Bangla Pricing Inquiry</option>
                  <option value="support_en" className="bg-[#0f0306]">🇺🇸 English Support Ticket</option>
                  <option value="deal_de" className="bg-[#0f0306]">🇩🇪 German Call Request</option>
                </select>

                <button
                  type="button"
                  onClick={runSimulation}
                  disabled={simStatus === 'waiting' || simStatus === 'generating' || !waEnabled}
                  className="flex items-center gap-1 rounded-xl neumorph-btn-primary disabled:opacity-50 px-3.5 py-1.5 text-xs font-bold text-white cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Simulate</span>
                </button>
              </div>
            </div>

            {/* Simulation Log Window */}
            {simStatus !== 'idle' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                {/* Left: Progression log */}
                <div className="rounded-lg neumorph-card p-3 font-mono text-[10px] space-y-1.5 max-h-48 overflow-y-auto">
                  <div className="flex items-center justify-between text-[#94A3B8] border-b border-[#FF204E]/10 pb-1 mb-1.5 font-sans">
                    <span>TIMELINE LOGS</span>
                    <span className="text-[9px] font-mono text-[#FF204E]">SPEEDED x100</span>
                  </div>
                  {simLog.map((log, i) => (
                    <div key={i} className={`leading-relaxed ${log.includes('🚨') ? 'text-[#FF204E] font-semibold' : log.includes('🚀') || log.includes('✨') ? 'text-white font-semibold' : 'text-[#94A3B8]'}`}>
                      {log}
                    </div>
                  ))}
                  
                  {simStatus === 'waiting' && (
                    <div className="space-y-1.5 font-sans pt-1">
                      <div className="flex items-center justify-between text-[9px] text-[#64748B]">
                        <span>Waiting window elapsed ({waDelay}m gate):</span>
                        <span className="font-mono text-[#FF204E] font-bold">{simProgress}%</span>
                      </div>
                      <div className="w-full bg-[#050102] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#990000] via-[#E50914] to-[#FF204E] h-1.5 transition-all duration-300" style={{ width: `${simProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {simStatus === 'generating' && (
                    <div className="flex items-center gap-1.5 text-[#FF204E] font-sans font-bold animate-pulse py-1">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Agent-sigma08 drafting response...</span>
                    </div>
                  )}
                </div>

                {/* Right: Output message bubble */}
                <div className="rounded-lg neumorph-card p-3 flex flex-col justify-between">
                  <div>
                    <div className="text-[9px] font-bold text-[#94A3B8] tracking-wider uppercase mb-1.5">
                      DISPATCHED OUTBOX RESPONSE
                    </div>
                    {simDraft ? (
                      <p className="text-xs text-[#F8FAFC] leading-relaxed neumorph-inset p-2.5 rounded-xl whitespace-pre-wrap">
                        {simDraft}
                      </p>
                    ) : (
                      <div className="h-28 flex items-center justify-center text-[10px] text-[#64748B] italic">
                        Awaiting auto-response trigger...
                      </div>
                    )}
                  </div>

                  {simStatus === 'dispatched' && (
                    <div className="mt-2 text-[10px] font-sans font-bold text-white neumorph-badge rounded-lg p-1.5 text-center flex items-center justify-center gap-1">
                      <Check className="h-3.5 w-3.5 text-[#FF204E]" />
                      Auto-responder safely completed and message pushed to client device!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            id="btn_save_settings"
            className="flex items-center gap-2 rounded-xl neumorph-btn-primary px-6 py-2.5 text-xs font-bold text-white cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{t.saveSettingsBtn}</span>
          </button>
        </div>

        {/* Data & Memory Management */}
        <div className="rounded-2xl neumorph-card p-4 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg neumorph-circle flex items-center justify-center text-[#FF204E]">
              <AlertTriangle className="h-4 w-4 text-[#FF204E]" />
            </div>
            <span>{t.workspaceDataSectionTitle}</span>
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleExportWorkspace}
              className="flex items-center justify-center gap-1.5 rounded-xl neumorph-btn-secondary px-4 py-2.5 text-xs font-semibold text-[#F8FAFC] hover:text-white cursor-pointer"
            >
              <Download className="h-4 w-4 text-[#FF204E]" />
              <span>{t.exportBackupBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleResetMemory}
              className="flex items-center justify-center gap-1.5 rounded-xl neumorph-btn-secondary px-4 py-2.5 text-xs font-semibold text-rose-400 hover:text-rose-300 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4 text-[#FF204E]" />
              <span>{t.resetMemoryBtn}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
