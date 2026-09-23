import React, { useState } from 'react';
import {
  Search,
  Globe,
  Bell,
  User,
  ChevronDown,
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';

export const Header: React.FC = () => {
  const { setActiveView, setIsLanguageModalOpen, userProfile, searchQuery, setSearchQuery } = useAgent();
  const [showNotifications, setShowNotifications] = useState(false);

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
        border
        border-[#E50914]/30
        bg-[#0f0408]/80
        px-3
        sm:px-6
        backdrop-blur-[24px]
        shadow-[0_8px_32px_rgba(229,9,20,0.2)]
        transition-all
      "
    >
      {/* Specular light lines */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E50914]/40 to-transparent" />

      {/* LEFT / CENTER: Search bar (matching screenshot: "Search anything... ⌘ K") */}
      <div className="flex flex-1 items-center max-w-md mr-3">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anything..."
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/[0.05]
              py-2
              pl-10
              pr-12
              text-xs
              text-white
              placeholder-white/40
              focus:border-[#FF204E]/60
              focus:bg-black/60
              focus:outline-none
              transition-all
            "
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-white/60">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* RIGHT: Global Selector, Notification Bell with red badge 3, Profile Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Global Dropdown (Matches Screenshot: Global ∨) */}
        <button
          id="btn_language_mode_header"
          onClick={() => setIsLanguageModalOpen(true)}
          className="
            flex
            items-center
            gap-1.5
            rounded-full
            border
            border-white/10
            bg-white/[0.06]
            px-3
            py-1.5
            text-xs
            font-medium
            text-white/90
            transition-all
            hover:border-[#FF204E]/50
            hover:bg-[#E50914]/20
          "
        >
          <Globe className="h-3.5 w-3.5 text-white/70" />
          <span className="font-semibold text-xs text-white">Global</span>
          <ChevronDown className="h-3.5 w-3.5 text-white/50" />
        </button>

        {/* Notification Bell (Matches Screenshot: Bell icon with red circle 3 badge) */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="
              relative
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-white/[0.06]
              text-white/80
              hover:border-[#FF204E]/40
              hover:text-white
              transition-all
            "
            title="Notifications"
          >
            <Bell className="h-4.5 w-4.5 text-white/90" />
            <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#E50914] text-[10px] font-black text-white shadow-[0_0_10px_#E50914]">
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-[#E50914]/30 bg-[#0f0408]/95 p-4 shadow-[0_10px_30px_rgba(229,9,20,0.3)] backdrop-blur-xl z-50 text-xs space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-white">System Notifications</span>
                <span className="text-[10px] text-[#FF204E] font-bold">3 New</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="font-semibold text-white">Research Agent</div>
                  <div className="text-[10px] text-white/60">Completed web research task • 2m ago</div>
                </div>
                <div className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="font-semibold text-white">Task Flow Pipeline</div>
                  <div className="text-[10px] text-white/60">Automated workflow executed • 34m ago</div>
                </div>
                <div className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="font-semibold text-white">Agent-sigma08 Ready</div>
                  <div className="text-[10px] text-white/60">System running smoothly v3.8.0</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User profile picture with Red Circular Neon Glow Ring (Matches Screenshot) */}
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
            rounded-full
            p-[2px]
            bg-gradient-to-tr
            from-[#E50914]
            to-[#FF204E]
            shadow-[0_0_15px_rgba(229,9,20,0.7)]
            hover:scale-105
            transition-transform
          "
          title="User Profile & Settings"
        >
          <div className="flex h-full w-full items-center justify-center rounded-full overflow-hidden bg-black">
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

