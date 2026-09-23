import React, { useState, useEffect } from 'react';
import { Bell, Volume2, Music, Disc3, ExternalLink } from 'lucide-react';
import { AgentProvider, useAgent } from './context/AgentContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { ChatView } from './components/chat/ChatView';
import { TasksView } from './components/tasks/TasksView';
import { FilesView } from './components/files/FilesView';
import { ToolsView } from './components/tools/ToolsView';
import { ApprovalsView } from './components/approvals/ApprovalsView';
import { ActivityView } from './components/activity/ActivityView';
import { SettingsView } from './components/settings/SettingsView';
import { UserProfileView } from './components/profile/UserProfileView';
import { AILabView } from './components/ailab/AILabView';
import { LanguageModeModal } from './components/common/LanguageModeModal';
import { InstallGuideModal } from './components/common/InstallGuideModal';
import { sound } from './services/sound';

const MainLayout: React.FC = () => {
  const { activeView, triggeredAlarm, setTriggeredAlarm } = useAgent();
  const [isPlayingSound, setIsPlayingSound] = useState<boolean>(true);

  useEffect(() => {
    if (triggeredAlarm) {
      setIsPlayingSound(true);
      sound.playPiratesTheme(true);
    }
  }, [triggeredAlarm]);

  const handleDismissAlarm = () => {
    sound.stopPiratesTheme();
    setIsPlayingSound(false);
    setTriggeredAlarm(null);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'profile':
        return <UserProfileView />;
      case 'chat':
        return <ChatView />;
      case 'ailab':
        return <AILabView />;
      case 'tasks':
        return <TasksView />;
      case 'files':
        return <FilesView />;
      case 'tools':
        return <ToolsView />;
      case 'approvals':
        return <ApprovalsView />;
      case 'activity':
        return <ActivityView />;
      case 'results':
        return <TasksView />;
      case 'automations':
        return <TasksView />;
      case 'integrations':
        return <ToolsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#080204] text-[#F8FAFC] font-sans antialiased">
      {/* Background Image bg99.png with deep crimson cosmic backdrop */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
        <img
          src="/bg99.png"
          alt="Main cosmic background"
          className="w-full h-full object-cover transition-all duration-1000 scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = './bg99.png';
          }}
        />
        {/* Deep dark red overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0204]/70 via-[#080204]/60 to-[#120206]/80 pointer-events-none" />
      </div>

      {/* Ambient glowing crimson red light particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-10 opacity-60">
        <div className="absolute -top-32 left-[15%] h-[550px] w-[550px] rounded-full bg-gradient-to-br from-[#E50914]/25 via-transparent to-transparent blur-[140px]" />
        <div className="absolute right-[-80px] top-[15%] h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-[#FF204E]/20 via-transparent to-transparent blur-[160px]" />
      </div>

      {/* Main floating desktop frames */}
      <div className="relative z-40 flex h-full w-full flex-col p-3 sm:p-5 gap-3 sm:gap-4 overflow-hidden bg-transparent">
        {/* Floating top bar */}
        <Header />

        <div className="flex min-h-0 flex-1 gap-3 sm:gap-4 overflow-hidden">
          {/* Floating side bar */}
          <Sidebar />

          {/* Floating content canvas */}
          <main
            className="
              relative
              flex-1
              min-w-0
              rounded-2xl
              overflow-y-auto
              overflow-x-hidden
              bg-transparent
              scrollbar-thin
              scrollbar-track-transparent
              scrollbar-thumb-[#E50914]/30
            "
          >
            {renderActiveView()}
          </main>
        </div>
      </div>

      {/* Modals & alert portals */}
      <LanguageModeModal />
      <InstallGuideModal />

      {/* Alarm ringing popup overlay */}
      {triggeredAlarm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#E50914]/50 bg-[#0f0306]/95 p-6 sm:p-7 shadow-[0_0_60px_rgba(229,9,20,0.5)] text-center space-y-5">
            {/* Pulsing ring graphic */}
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#E50914]/30 to-[#FF204E]/30 border border-[#E50914]/50 shadow-[0_0_30px_rgba(229,9,20,0.5)]">
              <div className="absolute inset-0 rounded-full border border-[#FF204E]/40 animate-ping" />
              <Bell className="h-10 w-10 text-[#FF204E] animate-bounce" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-block rounded-full bg-[#E50914]/20 px-3 py-1 text-[10px] font-black tracking-widest text-[#FF204E] uppercase border border-[#E50914]/40 shadow-sm">
                🚨 Agent-sigma08 Live Alarm
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {triggeredAlarm.label}
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Scheduled Time: <span className="font-mono font-bold text-[#FF204E]">{triggeredAlarm.time}</span>
              </p>
            </div>

            {/* Pirates of the Caribbean Theme Ringtone Audio Player Status */}
            <div className="rounded-2xl bg-black/70 p-4 border border-[#E50914]/30 space-y-2.5 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Disc3 className="h-4 w-4 text-[#FF204E] animate-spin" style={{ animationDuration: '3s' }} />
                  <span className="text-[11px] font-black text-white uppercase tracking-wider">
                    Official Alarm Ringtone
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {/* Equalizer animation bars */}
                  <div className="flex items-end gap-0.5 h-3.5">
                    <span className="w-1 bg-[#FF204E] rounded-full animate-pulse h-full" />
                    <span className="w-1 bg-[#E50914] rounded-full animate-pulse h-2" style={{ animationDelay: '0.15s' }} />
                    <span className="w-1 bg-[#FF204E] rounded-full animate-pulse h-3.5" style={{ animationDelay: '0.3s' }} />
                    <span className="w-1 bg-[#E50914] rounded-full animate-pulse h-1.5" style={{ animationDelay: '0.45s' }} />
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-[#FF204E]">PLAYING</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-[#1a0509] p-2.5 rounded-xl border border-[#E50914]/20">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#E50914] to-[#990000] flex items-center justify-center flex-shrink-0 shadow-md">
                  <Music className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">
                    He's a Pirate (Pirates of the Caribbean)
                  </div>
                  <div className="text-[10px] text-[#94A3B8] truncate">
                    Hans Zimmer & Klaus Badelt • High-Fidelity Ringtone
                  </div>
                </div>
              </div>

              {/* YouTube / Web Link */}
              <div className="flex items-center justify-between pt-1 text-[10px] text-[#94A3B8]">
                <span className="text-[#94A3B8]/80">Source: Web Audio & YouTube Master</span>
                <a
                  href="https://www.youtube.com/watch?v=27mB8verLK8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#FF204E] hover:underline font-semibold"
                >
                  <span>Open on YouTube</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleDismissAlarm}
                className="w-full rounded-2xl bg-gradient-to-r from-[#E50914] via-[#FF204E] to-[#E50914] hover:opacity-95 py-3.5 text-xs font-black tracking-wider text-white shadow-xl shadow-[#E50914]/50 transition-all transform active:scale-95 cursor-pointer uppercase"
              >
                DISMISS & STOP RINGTONE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AgentProvider>
      <MainLayout />
    </AgentProvider>
  );
}
