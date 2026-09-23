import React, { useState } from 'react';
import {
  Globe,
  Search,
  Check,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';
import { TECH_LANGUAGES, TechLanguage } from '../../data/languages';

export const LanguageModeModal: React.FC = () => {
  const { currentLanguage, setLanguageMode, isLanguageModalOpen, setIsLanguageModalOpen, t } = useAgent();
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('All');

  if (!isLanguageModalOpen) return null;

  const regions = ['All', 'Asia & Pacific', 'Europe', 'Americas', 'Middle East'];

  const filteredLanguages = TECH_LANGUAGES.filter((lang) => {
    const matchesRegion = regionFilter === 'All' || lang.region === regionFilter;
    const query = search.toLowerCase().trim();
    const matchesQuery =
      !query ||
      lang.country.toLowerCase().includes(query) ||
      lang.name.toLowerCase().includes(query) ||
      lang.englishName.toLowerCase().includes(query) ||
      lang.id.toLowerCase().includes(query);

    return matchesRegion && matchesQuery;
  });

  const handleSelectLanguage = (lang: TechLanguage) => {
    setLanguageMode(lang.id);
    setIsLanguageModalOpen(false);
  };

  return (
    <div
      id="language_mode_modal_backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={() => setIsLanguageModalOpen(false)}
    >
      <div
        id="language_mode_modal_card"
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl bg-[#0f0306] border border-[#E50914]/30 overflow-hidden text-[#F8FAFC] shadow-[0_0_50px_rgba(229,9,20,0.3)] animate-scaleUp"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#E50914]/20 p-4 sm:p-6 bg-gradient-to-r from-[#0f0306] via-[#1a050a] to-[#0f0306]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E50914]/20 border border-[#E50914]/30 text-[#FF204E]">
              <Globe className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#F8FAFC] tracking-tight">
                  {currentLanguage.labels.languageMode}
                </h2>
                <span className="rounded-full bg-[#E50914]/20 px-2 py-0.5 text-[10px] font-mono text-[#FF204E] border border-[#E50914]/40">
                  30 Tech Nations
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                {currentLanguage.labels.selectLanguage}
              </p>
            </div>
          </div>

          <button
            id="btn_close_language_modal"
            onClick={() => setIsLanguageModalOpen(false)}
            className="rounded-xl p-2 text-[#94A3B8] hover:bg-[#080204] hover:text-[#F8FAFC] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Active Language Highlight Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-[#080204] border-b border-[#E50914]/20 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#94A3B8]">Active Mode:</span>
            <span className="text-base">{currentLanguage.flag}</span>
            <span className="font-semibold text-[#FF204E]">{currentLanguage.country}</span>
            <span className="text-[#94A3B8]">({currentLanguage.name})</span>
          </div>
        </div>

        {/* Search & Region Filter Bar */}
        <div className="p-4 sm:px-6 sm:py-3 border-b border-[#E50914]/20 space-y-3 bg-[#0f0306]">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
            <input
              id="input_search_language"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by country or language..."
              className="w-full rounded-xl bg-black/40 pl-9 pr-4 py-2 text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#94A3B8]/60 border border-[#E50914]/30 focus:outline-none focus:border-[#FF204E]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setRegionFilter(reg)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  regionFilter === reg
                    ? 'bg-[#E50914]/30 text-[#FF204E] border border-[#FF204E]/60 shadow-sm'
                    : 'bg-[#080204] text-[#94A3B8] hover:bg-[#E50914]/20 hover:text-[#F8FAFC] border border-transparent'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Language Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-h-[50vh] bg-black/40">
          {filteredLanguages.length === 0 ? (
            <div className="py-12 text-center text-white/50">
              <Globe className="h-8 w-8 mx-auto mb-2 text-[#FF204E]/50 animate-pulse" />
              <p className="text-sm font-medium">No tech countries match &quot;{search}&quot;</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredLanguages.map((lang) => {
                const isActive = currentLanguage.id === lang.id;
                return (
                  <button
                    key={lang.id}
                    id={`lang_option_${lang.id}`}
                    onClick={() => handleSelectLanguage(lang)}
                    className={`text-left flex items-center justify-between p-3 rounded-xl transition-all duration-200 group border cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#E50914]/30 to-[#FF204E]/20 border-[#FF204E]/50 text-[#F8FAFC] shadow-[0_0_15px_rgba(229,9,20,0.2)]'
                        : 'bg-[#080204]/60 hover:bg-[#E50914]/15 border-white/5 hover:border-[#E50914]/30 text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl sm:text-2xl shrink-0 select-none transition-transform group-hover:scale-110 duration-200">
                        {lang.flag}
                      </span>
                      <div className="min-w-0 flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-[#F8FAFC] truncate">
                          {lang.country}
                        </span>
                        <span className="text-[10px] text-white/50 group-hover:text-white/80 truncate">
                          ({lang.name})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center shrink-0 ml-2">
                      {isActive ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF204E] text-white shadow-sm">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </span>
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-white/40 group-hover:text-[#FF204E] group-hover:translate-x-0.5 transition-all duration-200" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 sm:px-6 bg-[#0f0306] border-t border-[#E50914]/20 text-xs">
          <span className="text-[#94A3B8]">
            Selected: <strong className="text-[#F8FAFC]">{currentLanguage.country}</strong> ({currentLanguage.englishName})
          </span>
          <button
            onClick={() => setIsLanguageModalOpen(false)}
            className="rounded-xl bg-[#080204] hover:bg-[#E50914]/20 px-4 py-2 font-semibold text-[#FF204E] border border-[#E50914]/30 transition-colors cursor-pointer"
          >
            {t.closeModal}
          </button>
        </div>
      </div>
    </div>
  );
};
