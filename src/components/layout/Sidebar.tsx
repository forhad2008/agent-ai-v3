import React from 'react';
import {
  Home,
  MessageSquare,
  FlaskConical,
  Zap,
  BookOpen,
  Settings,
  Folder,
  Link,
  BarChart3,
  Sliders,
  Download,
  Cpu,
} from 'lucide-react';
import { useAgent, ActiveView } from '../../context/AgentContext';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, setIsInstallModalOpen } = useAgent();

  const handleInstallClick = () => {
    setIsInstallModalOpen(true);
  };

  const navItems: {
    id: ActiveView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'profile', label: 'Agent OS', icon: Cpu },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'ailab', label: 'AI Lab', icon: FlaskConical },
    { id: 'tasks', label: 'Task Flow', icon: Zap, badge: 3 },
    { id: 'approvals', label: 'Knowledge', icon: BookOpen },
    { id: 'automations', label: 'Automation', icon: Settings },
    { id: 'files', label: 'Files', icon: Folder },
    { id: 'integrations', label: 'Integrations', icon: Link },
    { id: 'activity', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <aside
      id="app_sidebar"
      className="
        relative
        flex
        h-full
        w-14
        xs:w-16
        sm:w-[210px]
        md:w-[230px]
        shrink-0
        flex-col
        rounded-2xl
        sm:rounded-3xl
        border
        border-[#E50914]/25
        bg-[#0a0306]/90
        p-2
        sm:p-3.5
        backdrop-blur-xl
        shadow-[0_8px_32px_rgba(229,9,20,0.25)]
        transition-all
      "
    >
      {/* Red ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl">
        <div className="absolute -left-12 top-1/2 h-56 w-56 rounded-full bg-[#E50914]/10 blur-[90px]" />
      </div>

      {/* TOP BRAND LOCKUP */}
      <div className="relative z-10 flex flex-col items-center pt-1.5 sm:pt-2 pb-2 sm:pb-4 text-center border-b border-white/10 mb-2">
        <div 
          onClick={() => setActiveView('dashboard')}
          className="cursor-pointer group flex flex-col items-center"
        >
          {/* Logo image from logomax.png */}
          <div className="relative h-10 w-10 sm:h-14 sm:w-14 mb-0.5 sm:mb-1 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#E50914]/20 blur-xl group-hover:bg-[#FF204E]/30 transition-all" />
            <img
              src={`${import.meta.env.BASE_URL}logomax.png`}
              alt="Agent-sigma08 Logo"
              className="relative h-9 w-9 sm:h-12 sm:w-12 object-contain drop-shadow-[0_0_15px_rgba(229,9,20,0.8)] transition-transform group-hover:scale-105"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `${import.meta.env.BASE_URL}logo.png`;
              }}
            />
          </div>

          <h2 className="hidden sm:block text-base font-black text-white tracking-tight leading-none">
            Agent-sigma08
          </h2>
          <p className="hidden sm:block text-[8px] font-bold tracking-[0.25em] text-[#FF4D4D] uppercase mt-1">
            THINK · CREATE · EXECUTE
          </p>
        </div>
      </div>

      {/* NAVIGATION LIST */}
      <div className="relative z-10 flex flex-1 flex-col py-1 overflow-y-auto no-scrollbar">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar_nav_${item.id}`}
                onClick={() => setActiveView(item.id)}
                title={item.label}
                className={`
                  group
                  relative
                  flex
                  w-full
                  items-center
                  justify-center
                  sm:justify-between
                  rounded-xl
                  px-2
                  sm:px-3
                  py-2
                  text-left
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? `
                        bg-gradient-to-r
                        from-[#E50914]
                        to-[#990000]
                        text-white
                        font-bold
                        shadow-[0_4px_15px_rgba(229,9,20,0.5)]
                      `
                      : `
                        text-white/70
                        hover:bg-white/[0.06]
                        hover:text-white
                      `
                  }
                `}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`
                      h-4
                      w-4
                      shrink-0
                      transition-all
                      ${isActive ? 'text-white' : 'text-white/60 group-hover:text-[#FF204E]'}
                    `}
                  />
                  <span className="hidden sm:inline-block text-xs tracking-tight truncate">
                    {item.label}
                  </span>
                </div>

                {/* Badge */}
                {item.badge !== undefined && (
                  <span
                    className="
                      absolute
                      -top-1
                      -right-1
                      sm:static
                      flex
                      h-4
                      w-4
                      sm:h-4.5
                      sm:w-4.5
                      items-center
                      justify-center
                      rounded-full
                      bg-[#E50914]
                      text-white
                      text-[9px]
                      sm:text-[10px]
                      font-bold
                      shadow-[0_0_8px_rgba(229,9,20,0.8)]
                    "
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM PROMO CARD */}
      <div className="relative z-10 pt-2 sm:pt-3 shrink-0">
        <div
          id="sidebar_promo_card"
          className="
            relative
            overflow-hidden
            rounded-xl
            sm:rounded-2xl
            border
            border-[#E50914]/30
            bg-[#15040a]/90
            p-1.5
            sm:p-3
            text-center
            shadow-[0_4px_20px_rgba(229,9,20,0.2)]
          "
        >
          {/* Cosmic red nebula orb backdrop */}
          <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-[#E50914]/30 blur-2xl animate-pulse" />

          <h3 className="hidden sm:block text-xs font-black text-white leading-tight">
            Smarter
            <br />
            <span className="text-[#FF204E]">Faster Together</span>
          </h3>

          <p className="hidden sm:block text-[9px] text-white/60 mt-1.5 leading-snug">
            <strong className="text-white">Agent-sigma08</strong> Your AI companion for a greater tomorrow.
          </p>

          <button
            id="btn_sidebar_install_app"
            onClick={handleInstallClick}
            title="Install Agent"
            className="
              sm:mt-2.5
              flex
              w-full
              items-center
              justify-center
              gap-1.5
              rounded-full
              bg-gradient-to-r
              from-[#E50914]
              to-[#FF204E]
              hover:from-[#FF204E]
              hover:to-[#E50914]
              py-1.5
              sm:py-2
              px-2
              sm:px-3
              text-[10px]
              sm:text-[11px]
              font-extrabold
              text-white
              shadow-[0_4px_15px_rgba(229,9,20,0.5)]
              transition-all
              transform
              active:scale-95
            "
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Install Agent</span>
          </button>

          <div className="hidden sm:block mt-2 text-[9px] font-mono font-semibold text-white/40">
            v3.8.0
          </div>
        </div>
      </div>
    </aside>
  );
};

