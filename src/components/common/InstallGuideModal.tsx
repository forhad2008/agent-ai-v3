import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Laptop,
  Monitor,
  Download,
  CheckCircle,
  Share,
  PlusSquare,
  Sparkles,
  Zap,
  Info,
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallGuideModal: React.FC = () => {
  const { isInstallModalOpen, setIsInstallModalOpen, settings } = useAgent();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState<'ios' | 'android' | 'desktop'>('ios');
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Check if running in standalone PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    // Detect browser platform to pre-select correct tab
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setActiveTab('ios');
    } else if (/android/.test(userAgent)) {
      setActiveTab('android');
    } else {
      setActiveTab('desktop');
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!isInstallModalOpen) return null;

  const handleNativeInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  const isBangla = settings.language === 'Bangla';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={() => setIsInstallModalOpen(false)}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl neumorph-card p-6 shadow-2xl text-[#F8FAFC]">
        {/* Decorative lighting */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#E50914]/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-[#990000]/15 blur-3xl" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E50914]/20 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl neumorph-circle text-[#FF204E]">
              <Download className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold uppercase tracking-wide text-[#F8FAFC]">
                {isBangla ? 'রিয়েল এজেন্ট ইনস্টল করুন' : 'Install Native Work OS App'}
              </h2>
              <p className="text-[11px] text-[#94A3B8]">
                {isBangla
                  ? 'মোবাইল বা পিসিতে ফুল-স্ক্রিন এক্সপেরিয়েন্সের জন্য ইনস্টল করুন'
                  : 'Run Agent-sigma08 directly from your home screen or desktop'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsInstallModalOpen(false)}
            className="h-8 w-8 rounded-xl neumorph-circle flex items-center justify-center text-white/60 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Installed Status */}
        {isInstalled && (
          <div className="my-4 flex items-center gap-2 rounded-xl neumorph-badge p-3 text-rose-300 text-xs font-semibold">
            <CheckCircle className="h-4.5 w-4.5 text-[#FF204E] shrink-0" />
            <span>
              {isBangla
                ? 'অভিনন্দন! আপনি ইতিমধ্যেই রিয়েল এজেন্ট অ্যাপটি সফলভাবে ইনস্টল করেছেন।'
                : 'PWA Connected: Agent-sigma08 is running in native app mode.'}
            </span>
          </div>
        )}

        {installSuccess && (
          <div className="my-4 flex items-center gap-2 rounded-xl neumorph-badge p-3 text-rose-300 text-xs font-semibold">
            <Sparkles className="h-4.5 w-4.5 text-[#FF204E] shrink-0 animate-pulse" />
            <span>
              {isBangla
                ? 'অ্যাপটি সফলভাবে ইনস্টল করা হয়েছে এবং হোম স্ক্রিনে যুক্ত হয়েছে!'
                : 'App successfully registered! Launched from shortcut.'}
            </span>
          </div>
        )}

        {/* Benefits Panel */}
        <div className="my-4 grid grid-cols-3 gap-2.5 rounded-2xl neumorph-inset p-3">
          <div className="flex flex-col items-center text-center p-1">
            <Zap className="h-4 w-4 text-[#FF204E] mb-1" />
            <span className="text-[10px] font-bold text-white/90">
              {isBangla ? 'দ্রুত লোডিং' : 'Blazing Fast'}
            </span>
            <span className="text-[8px] text-white/60 mt-0.5">
              {isBangla ? 'ক্যাশড মেমরি' : 'Instant asset caching'}
            </span>
          </div>
          <div className="flex flex-col items-center text-center p-1 border-x border-white/5">
            <Smartphone className="h-4 w-4 text-[#FF204E] mb-1" />
            <span className="text-[10px] font-bold text-white/90">
              {isBangla ? 'পূর্ণ স্ক্রিন' : 'Standalone UI'}
            </span>
            <span className="text-[8px] text-white/60 mt-0.5">
              {isBangla ? 'ব্রাউজার বারহীন' : 'No search or tab bar'}
            </span>
          </div>
          <div className="flex flex-col items-center text-center p-1">
            <CheckCircle className="h-4.5 w-4.5 text-[#FF204E] mb-1" />
            <span className="text-[10px] font-bold text-white/90">
              {isBangla ? 'নিরাপদ সিঙ্ক' : 'Offline Mode'}
            </span>
            <span className="text-[8px] text-white/60 mt-0.5">
              {isBangla ? 'লোকাল ডেটা ব্যাকআপ' : 'Local data sync'}
            </span>
          </div>
        </div>

        {/* Device Platforms Tab Selector */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'ios'
                ? 'neumorph-btn-primary text-white'
                : 'neumorph-btn-secondary text-white/60 hover:text-white'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Apple iOS</span>
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'android'
                ? 'neumorph-btn-primary text-white'
                : 'neumorph-btn-secondary text-white/60 hover:text-white'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Android</span>
          </button>
          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'desktop'
                ? 'neumorph-btn-primary text-white'
                : 'neumorph-btn-secondary text-white/60 hover:text-white'
            }`}
          >
            <Laptop className="h-3.5 w-3.5" />
            <span>Desktop</span>
          </button>
        </div>

        {/* Guide Contents */}
        <div className="min-h-[170px] neumorph-inset rounded-2xl p-4">
          {activeTab === 'ios' && (
            <div className="space-y-3.5 text-xs">
              <p className="text-white/80 font-medium">
                {isBangla
                  ? 'আইফোন বা আইপ্যাডে কোনো ব্রাউজার এক্সটেনশন ছাড়াই সরাসরি ইনস্টল করুন:'
                  : 'Safari iOS has strict security limits. Follow these steps to secure home screen app launch:'}
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full neumorph-circle text-[10px] font-bold text-white">
                    1
                  </div>
                  <div>
                    <span className="text-white/80">
                      {isBangla ? 'আপনার সাফারির নিচের টুলবারে ' : 'Open in Safari and tap the '}
                    </span>
                    <strong className="text-[#FF204E] inline-flex items-center gap-1 font-semibold">
                      <Share className="h-3.5 w-3.5" /> {isBangla ? 'শেয়ার বাটনটি' : 'Share Button'}
                    </strong>
                    <span className="text-white/80">{isBangla ? ' চাপুন।' : '.'}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full neumorph-circle text-[10px] font-bold text-white">
                    2
                  </div>
                  <div>
                    <span className="text-white/80">
                      {isBangla
                        ? 'মেনুটি স্ক্রোল করে নিচের দিকে যান এবং '
                        : 'Scroll down and select '}
                    </span>
                    <strong className="text-[#FF204E] inline-flex items-center gap-1 font-semibold">
                      <PlusSquare className="h-3.5 w-3.5" />{' '}
                      {isBangla ? 'Add to Home Screen' : 'Add to Home Screen'}
                    </strong>
                    <span className="text-white/80">
                      {isBangla ? ' অপশনে ক্লিক করুন।' : ' option.'}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full neumorph-circle text-[10px] font-bold text-white">
                    3
                  </div>
                  <span className="text-white/80">
                    {isBangla
                      ? "ডানদিকের কোণে 'Add' বাটনটি চাপলে আইকনটি আপনার হোম স্ক্রিনে সুন্দরভাবে যুক্ত হবে।"
                      : "Tap 'Add' in the top-right corner. The Agent icon will now seamlessly integrate on your home screen."}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'android' && (
            <div className="space-y-3.5 text-xs">
              <p className="text-white/80 font-medium">
                {isBangla
                  ? 'গুগল ক্রোম ব্রাউজার বা ক্রোম কোড ব্যবহার করে কুইক ইনস্টলেশন করুন:'
                  : 'Direct Chrome/Android installation is fast and fully integrated:'}
              </p>

              {deferredPrompt ? (
                <div className="p-3 neumorph-card rounded-xl text-center space-y-2">
                  <p className="text-white/80 text-[11px]">
                    {isBangla
                      ? 'অ্যাপটি সরাসরি আপনার অ্যান্ড্রয়েডে ইনস্টল করতে নিচের বাটনে চাপ দিন।'
                      : 'The system has detected a compatible device. Click below to auto-install.'}
                  </p>
                  <button
                    onClick={handleNativeInstall}
                    className="mx-auto flex items-center gap-2 rounded-xl neumorph-btn-primary px-4 py-2 text-xs font-bold text-white cursor-pointer"
                  >
                    <Download className="h-4 w-4 text-white shrink-0" />
                    <span>{isBangla ? 'রিয়েল অ্যাপ ইনস্টল করুন' : 'Direct PWA Install'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2 text-white/80">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full neumorph-circle text-[10px] font-bold text-white">
                      1
                    </div>
                    <span>
                      {isBangla
                        ? 'ব্রাউজারের ওপরের ডানদিকের থ্রি-ডট (৩টি ডট) মেনু আইকনটিতে চাপ দিন।'
                        : 'Tap the three vertical dots (menu bar) in Chrome browser top corner.'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full neumorph-circle text-[10px] font-bold text-white">
                      2
                    </div>
                    <span>
                      {isBangla
                        ? 'মেনু থেকে "Install App" অথবা "Add to Home screen" নির্বাচন করুন।'
                        : 'Select "Install App" or "Add to Home screen" from the menu list.'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full neumorph-circle text-[10px] font-bold text-white">
                      3
                    </div>
                    <span>
                      {isBangla
                        ? 'পপআপ কনফার্মেশনে "Install" চাপলেই ইনস্টল প্রক্রিয়া সম্পূর্ণ হবে।'
                        : 'Confirm the prompt. The app will install and clear background memory.'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'desktop' && (
            <div className="space-y-3.5 text-xs">
              <p className="text-white/80 font-medium">
                {isBangla
                  ? 'আপনার ম্যাক বা উইন্ডোজ পিসিতে ফুল স্ট্যান্ডঅ্যালোন অপারেটিং সিস্টেম হিসেবে রান করুন:'
                  : 'Install Agent-sigma08 on your PC/Mac for deep desktop multi-window workflows:'}
              </p>

              {deferredPrompt ? (
                <div className="p-3 neumorph-card rounded-xl text-center space-y-2">
                  <p className="text-white/80 text-[11px]">
                    {isBangla
                      ? 'পিসিতে সরাসরি ইনস্টলেশন সম্পন্ন করতে নিচের বাটনে চাপ দিন।'
                      : 'Native desktop install is fully supported. Launch straight from Dock or Desktop.'}
                  </p>
                  <button
                    onClick={handleNativeInstall}
                    className="mx-auto flex items-center gap-2 rounded-xl neumorph-btn-primary px-4 py-2 text-xs font-bold text-white cursor-pointer"
                  >
                    <Monitor className="h-4 w-4 shrink-0" />
                    <span>{isBangla ? 'পিসিতে অ্যাপ ইনস্টল করুন' : 'Install Desktop App'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2 text-white/80">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full neumorph-circle text-[10px] font-bold text-white">
                      1
                    </div>
                    <span>
                      {isBangla
                        ? 'ব্রাউজারের অ্যাড্রেস বারের (URL bar) একেবারে ডানদিকে থাকা ইনস্টল আইকন (ডাউনলোড চিহ্ন) ক্লিক করুন।'
                        : 'Look at the address bar (URL bar). Click the "App Install" icon on the right side.'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full neumorph-circle text-[10px] font-bold text-white">
                      2
                    </div>
                    <span>
                      {isBangla
                        ? 'অথবা ব্রাউজারের থ্রি-ডট মেনু খুলে "Install Agent-sigma08..." সিলেক্ট করুন।'
                        : 'Alternatively, open Chrome/Edge Menu and select "Install Agent-sigma08..."'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full neumorph-circle text-[10px] font-bold text-white">
                      3
                    </div>
                    <span>
                      {isBangla
                        ? 'অ্যাপটি লঞ্চ প্যাড বা ডেস্কটপ শর্টকাটে পিন করুন।'
                        : 'Pin to your dock, launchpad, or desktop taskbar for instant workspace access.'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info and Close */}
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-[#94A3B8]">
          <div className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-[#FF204E]" />
            <span className="neumorph-badge px-2 py-0.5 rounded-md text-[10px]">PWA Compliant v1.4</span>
          </div>
          <button
            onClick={() => setIsInstallModalOpen(false)}
            className="rounded-xl neumorph-btn-secondary px-4 py-2 font-bold text-[#F8FAFC] hover:text-white cursor-pointer"
          >
            {isBangla ? 'বন্ধ করুন' : 'Dismiss'}
          </button>
        </div>
      </div>
    </div>
  );
};
