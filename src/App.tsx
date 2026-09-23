import React from 'react';
import { Bell, Volume2 } from 'lucide-react';
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

const MainLayout: React.FC = () => {
  const { activeView, triggeredAlarm, setTriggeredAlarm } = useAgent();

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
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-[#E50914]/40 bg-[#0f0306]/95 p-6 shadow-[0_0_50px_rgba(229,9,20,0.4)] text-center space-y-5">
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#E50914]/20 to-[#FF204E]/20 border border-[#E50914]/40">
              <div className="absolute inset-0 rounded-full border border-[#FF204E]/30 animate-ping" />
              <Bell className="h-10 w-10 text-[#FF204E] animate-bounce" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-block rounded-full bg-[#E50914]/20 px-3 py-1 text-[10px] font-bold tracking-widest text-[#FF204E] uppercase border border-[#E50914]/30">
                🚨 Agent-sigma08 Alarm
              </span>
              <h2 className="text-xl font-black text-white tracking-tight">
                {triggeredAlarm.label}
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Alarm Time: <span className="font-mono font-bold text-[#FF204E]">{triggeredAlarm.time}</span>
              </p>
            </div>

            <div className="rounded-2xl bg-black/60 p-3 border border-[#E50914]/20 flex items-center justify-center gap-2 text-[11px] text-[#FF204E]">
              <Volume2 className="h-3.5 w-3.5 text-[#FF204E] animate-pulse" />
              <span className="font-semibold">🔊 Live Alarm Triggered</span>
            </div>

            <button
              type="button"
              onClick={() => setTriggeredAlarm(null)}
              className="w-full rounded-2xl bg-gradient-to-r from-[#E50914] to-[#FF204E] hover:from-[#FF204E] hover:to-[#E50914] py-3 text-xs font-black text-white shadow-lg shadow-[#E50914]/50 transition-all transform active:scale-95 cursor-pointer"
            >
              DISMISS ALARM
            </button>
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
