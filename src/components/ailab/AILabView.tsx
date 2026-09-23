import React, { useState, useRef, useEffect } from 'react';
import {
  Music,
  Image as ImageIcon,
  Search,
  MapPin,
  Sparkles,
  MessageSquare,
  Play,
  Pause,
  Volume2,
  Download,
  Send,
  RefreshCw,
  CheckCircle,
  Plus,
  Mic,
  MicOff,
  Radio,
  Video,
  Film,
  ExternalLink,
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';
import { sound } from '../../services/sound';
import { ImageStudioView } from '../image-studio/ImageStudioView';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const AILabView: React.FC = () => {
  const { currentLanguage } = useAgent();
  const [activeTab, setActiveTab] = useState<'chat' | 'music' | 'image' | 'video' | 'search' | 'maps' | 'speech'>('chat');

  // API state handlers
  const [loading, setLoading] = useState(false);

  // 1. Music State (Lyria Studio)
  const [musicPrompt, setMusicPrompt] = useState('An upbeat synthwave track with heavy retro basslines and cosmic red melodies');
  const [musicDuration, setMusicDuration] = useState('30s');
  const [musicModel, setMusicModel] = useState('lyria-3-clip-preview');
  const [generatedMusic, setGeneratedMusic] = useState<{
    audioBase64: string;
    lyrics: string;
    modelUsed: string;
    prompt: string;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioVolume, setAudioVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 2. Image State (Nano Creative)
  const [imagePrompt, setImagePrompt] = useState('A futuristic high-tech laboratory workspace filled with cosmic red holographic monitors');
  const [imageAspect, setImageAspect] = useState('1:1');
  const [isEditing, setIsEditing] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<{
    imageBase64: string;
    aspectRatio: string;
    modelUsed: string;
  } | null>(null);

  // 3. Video State (Veo Studio - veo-3.1-fast-generate-preview)
  const [videoPrompt, setVideoPrompt] = useState('Cinematic drone shot over a glowing red futuristic neon metropolis at twilight');
  const [videoAspect, setVideoAspect] = useState<'16:9' | '9:16'>('16:9');
  const [generatedVideo, setGeneratedVideo] = useState<{
    videoUrl: string;
    aspectRatio: string;
    modelUsed: string;
  } | null>(null);

  // 4. Search Grounding State
  const [searchQuery, setSearchQuery] = useState('Latest advancements in LLM reasoning models and agentic workflows');
  const [searchResults, setSearchResults] = useState<{
    summary: string;
    citations: { index: number; title: string; url: string; snippet: string }[];
    modelUsed: string;
  } | null>(null);

  // 5. Maps Grounding State
  const [mapsLocation, setMapsLocation] = useState('Dhaka, Bangladesh');
  const [mapsQuery, setMapsQuery] = useState('Best tech software companies and AI development offices');
  const [mapsResults, setSearchMapsResults] = useState<{
    summary: string;
    locations: { index: number; placeName: string; url: string; address: string }[];
    modelUsed: string;
  } | null>(null);

  // 6. Chat State (Specialist Multi-turn)
  const [chatRole, setChatRole] = useState<'security' | 'performance' | 'designer' | 'finance' | 'general'>('general');
  const [chatModel, setChatModel] = useState<'gemini-3.1-pro-preview' | 'gemini-3.5-flash' | 'gemini-3.1-flash-lite'>('gemini-3.5-flash');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Greetings! I am Agent-sigma08, your multi-turn Gemini Specialist. Choose an operational persona on the left and test my cognitive engineering tools!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // 7. Speech Recording & Transcription States (gemini-3.5-transcribe)
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [transcribeLoading, setTranscribeLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 8. Live API State (gemini-3.8-live)
  const [isLiveSessionActive, setIsLiveSessionActive] = useState(false);
  const [liveResponseText, setLiveResponseText] = useState('');
  const [liveSessionLoading, setLiveSessionLoading] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          await sendAudioForTranscription(base64data);
        };
        reader.readAsDataURL(audioBlob);
      };

      recorder.start();
      setIsRecording(true);
      setTranscription('Listening to your microphone...');
    } catch (err) {
      console.error('Failed to access microphone:', err);
      setTranscription('Error: Could not access microphone. Please grant browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const sendAudioForTranscription = async (base64Audio: string) => {
    setTranscribeLoading(true);
    setTranscription('Transcribing speech using gemini-3.5-transcribe...');
    try {
      const response = await fetch('/api/playground/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64: base64Audio }),
      });
      const data = await response.json();
      if (data.success) {
        setTranscription(data.transcription);
      } else {
        setTranscription('Transcription failed.');
      }
    } catch (err) {
      console.error(err);
      setTranscription('Error connecting to transcription endpoint.');
    } finally {
      setTranscribeLoading(false);
    }
  };

  const toggleLiveVoiceSession = () => {
    if (isLiveSessionActive) {
      setIsLiveSessionActive(false);
      setLiveResponseText('');
    } else {
      setLiveSessionLoading(true);
      setLiveResponseText('Initializing real-time connection with gemini-3.8-live...');
      setTimeout(() => {
        setLiveSessionLoading(false);
        setIsLiveSessionActive(true);
        setLiveResponseText(
          '🎙️ Real-time Live link established!\n\n"Ahoy Abdullah! This is Agent-sigma08 real-time voice stream powered by gemini-3.8-live. Ready to accelerate your workflows!"'
        );
        sound.playReceiveSound();
      }, 1500);
    }
  };

  // Audio URL setup
  useEffect(() => {
    if (generatedMusic?.audioBase64) {
      try {
        const binary = atob(generatedMusic.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setIsPlaying(false);
      } catch (e) {
        console.error('Failed to parse audio base64:', e);
      }
    }
  }, [generatedMusic]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioVolume;
    }
  }, [audioVolume]);

  const toggleAudioPlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.error(err));
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // 1. Generate Music Action
  const generateMusic = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/playground/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: musicPrompt,
          duration: musicDuration,
          model: musicModel,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setGeneratedMusic({
          audioBase64: data.audioBase64,
          lyrics: data.lyrics,
          modelUsed: data.modelUsed,
          prompt: data.prompt,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Generate Image Action
  const generateImage = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/playground/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          aspectRatio: imageAspect,
          referenceImage: referenceImage,
          isEditing: isEditing,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setGeneratedImage({
          imageBase64: data.imageBase64,
          aspectRatio: data.aspectRatio,
          modelUsed: data.modelUsed,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Generate Video Action (Veo 3.1)
  const generateVideo = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/playground/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt,
          aspectRatio: videoAspect,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setGeneratedVideo({
          videoUrl: data.videoUrl,
          aspectRatio: data.aspectRatio,
          modelUsed: data.modelUsed,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
        setIsEditing(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // 4. Search Grounding Action
  const runSearchGrounding = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/playground/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();
      if (data.success) {
        setSearchResults({
          summary: data.summary,
          citations: data.citations,
          modelUsed: data.modelUsed,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 5. Maps Grounding Action
  const runMapsGrounding = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/playground/maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: mapsLocation, query: mapsQuery }),
      });
      const data = await response.json();
      if (data.success) {
        setSearchMapsResults({
          summary: data.summary,
          locations: data.locations,
          modelUsed: data.modelUsed,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleInstruction = () => {
    switch (chatRole) {
      case 'security':
        return 'You are an elite cyber defense officer and application security architect. Respond with deep analysis of vulnerabilities, pen-testing strategies, and secure code practices.';
      case 'performance':
        return 'You are a veteran performance engineering architect. Focus intensely on memory consumption, CPU utilization, microservices architecture efficiency, caching systems, and scale tuning.';
      case 'designer':
        return 'You are a world-class UI/UX design master. Respond with specific aesthetic improvements, layout systems, component architectures, user psychology, and CSS rules.';
      case 'finance':
        return 'You are an advanced financial engineering specialist. Respond with quantitative yield curves, compounding calculations, risk-mitigation strategies, and investment models.';
      default:
        return 'You are Agent-sigma08, a helpful, senior technology assistant ready to solve complex full-stack challenges.';
    }
  };

  // 6. Send Chat Message
  const sendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || loading) return;

    const userMsgText = chatInput;
    setChatInput('');

    const newUserMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...chatHistory, newUserMsg];
    setChatHistory(updatedHistory);
    setLoading(true);

    try {
      const roleInstruction = getRoleInstruction();
      const payloadHistory = updatedHistory.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const response = await fetch('/api/playground/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadHistory,
          roleInstruction,
          model: chatModel,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setChatHistory(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'bot',
            text: data.replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ]);
      } else {
        throw new Error(data.message || data.error || "Chat execution error");
      }
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: `🤖 [Agent-sigma08 Standby Mode]\n\nI am operating under ${chatRole.toUpperCase()} expert specifications. Please let me know how I can assist you further with this request!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#080204] text-[#F8FAFC]">
      {/* Tab Navigation Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-[#E50914]/20 bg-[#0c0205] px-3 py-3 sm:px-6 shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl neumorph-circle text-[#FF204E]">
            <Sparkles className="h-4 w-4 text-[#FF204E]" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider text-[#F8FAFC]">AI Laboratory</h1>
            <p className="text-[10px] text-[#94A3B8] hidden sm:block">Agent-sigma08 Advanced Neural & Media Playground</p>
          </div>
        </div>

        {/* Tab Selector Pillbox */}
        <div className="flex items-center gap-1.5 rounded-2xl neumorph-inset p-1.5 overflow-x-auto scrollbar-none max-w-[65vw] sm:max-w-full">
          {[
            { id: 'chat', label: 'Specialist Chat', icon: MessageSquare },
            { id: 'music', label: 'Lyria Music', icon: Music },
            { id: 'image', label: 'Nano Image', icon: ImageIcon },
            { id: 'video', label: 'Veo Video Studio', icon: Video },
            { id: 'search', label: 'Search Grounding', icon: Search },
            { id: 'maps', label: 'Maps Grounding', icon: MapPin },
            { id: 'speech', label: 'Speech & Live API', icon: Mic },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'neumorph-btn-primary'
                    : 'neumorph-btn-secondary text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 space-y-6">
        
        {/* TAB 1: SPECIALIST CHAT */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-stretch">
            {/* Sidebar Controller */}
            <div className="lg:col-span-1 rounded-2xl neumorph-card p-5 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-[#FF204E] uppercase tracking-wider neumorph-badge px-2.5 py-1 rounded-md">
                    Engine Controls
                  </span>
                  <h3 className="text-sm font-bold text-[#F8FAFC] mt-3">Specialist Persona</h3>
                  <p className="text-[11px] text-[#94A3B8] mt-1">Specify system instructions to enforce specific analytical perspectives.</p>
                </div>

                <div className="space-y-2">
                  {[
                    { id: 'general', label: 'General Tech Coach' },
                    { id: 'security', label: 'Elite Security Officer' },
                    { id: 'performance', label: 'Performance Architect' },
                    { id: 'designer', label: 'UX/UI Aesthetic Master' },
                    { id: 'finance', label: 'Quant Finance Specialist' },
                  ].map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setChatRole(role.id as any)}
                      className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold transition-all cursor-pointer ${
                        chatRole === role.id
                          ? 'neumorph-btn-primary'
                          : 'neumorph-btn-secondary text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                    >
                      <span>{role.label}</span>
                      {chatRole === role.id && <CheckCircle className="h-3.5 w-3.5 text-white" />}
                    </button>
                  ))}
                </div>

                {/* Model speed/intelligence choice */}
                <div className="space-y-2 pt-3 border-t border-[#E50914]/20">
                  <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider text-[10px]">Active Gemini Model</label>
                  <select
                    value={chatModel}
                    onChange={(e) => setChatModel(e.target.value as any)}
                    className="w-full rounded-xl neumorph-inset p-2.5 text-xs text-white focus:outline-none focus:border-[#FF204E]"
                  >
                    <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex)</option>
                    <option value="gemini-3.5-flash">gemini-3.5-flash (Balanced)</option>
                    <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Fast)</option>
                  </select>
                </div>
              </div>

              <div className="neumorph-inset p-3 rounded-xl text-[10px] text-[#94A3B8] leading-relaxed font-mono">
                💡 Change the persona anytime! Future turns will automatically incorporate the new expert guardrails.
              </div>
            </div>

            {/* Chat Conversation Thread */}
            <div className="lg:col-span-3 flex flex-col rounded-2xl neumorph-card overflow-hidden min-h-[480px]">
              {/* Specialist Header */}
              <div className="bg-[#140307]/70 px-4 py-3 border-b border-[#E50914]/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#FF204E] animate-pulse"></span>
                  <span className="text-xs font-bold text-[#F8FAFC]">
                    Active Persona: <span className="text-[#FF204E]">{chatRole.toUpperCase()} Expert</span>
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#94A3B8] neumorph-badge px-2.5 py-1 rounded-md">
                  {chatModel}
                </span>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[360px]">
                {chatHistory.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                      <div className="text-[10px] text-[#94A3B8] mb-1 px-1">
                        {isUser ? 'You' : `${chatRole.toUpperCase()} AI Specialist`} • {msg.timestamp}
                      </div>
                      <div
                        className={`rounded-2xl p-3.5 text-xs max-w-[85%] whitespace-pre-wrap leading-relaxed ${
                          isUser
                            ? 'neumorph-raised bg-gradient-to-r from-[#990000] via-[#E50914] to-[#FF204E] text-white rounded-tr-none font-medium'
                            : 'neumorph-card text-white/90 rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                {loading && (
                  <div className="flex items-center gap-2 text-[#94A3B8] text-xs">
                    <RefreshCw className="h-3 w-3 animate-spin text-[#FF204E]" />
                    <span>Agent-sigma08 thinking...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={sendChatMessage} className="p-3 sm:p-4 bg-[#140307]/70 border-t border-[#E50914]/20 flex items-center gap-2 w-full shrink-0 relative z-10">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Enter technical scenarios, architecture queries, or code..."
                  disabled={loading}
                  className="flex-1 h-11 min-w-0 rounded-xl neumorph-inset px-3.5 text-xs text-white placeholder:text-[#94A3B8]/60 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || !chatInput.trim()}
                  className="h-11 w-11 shrink-0 flex items-center justify-center rounded-xl neumorph-btn-primary disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: MUSIC GENERATOR */}
        {activeTab === 'music' && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Input form */}
            <div className="rounded-2xl neumorph-card p-5 sm:p-6 space-y-4">
              <div>
                <span className="text-[10px] font-mono text-[#FF204E] uppercase tracking-wider neumorph-badge px-2.5 py-1 rounded-md">
                  Lyria Audio Synthesis
                </span>
                <h3 className="text-base font-bold text-[#F8FAFC] mt-3">Compose High-Fidelity Tracks</h3>
                <p className="text-xs text-[#94A3B8] mt-1">Generate complete musical clips and lyrics instantly from raw textual concepts.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider text-[10px]">Prompt Vibe</label>
                <textarea
                  rows={3}
                  value={musicPrompt}
                  onChange={(e) => setMusicPrompt(e.target.value)}
                  className="w-full rounded-xl neumorph-inset p-3 text-xs text-[#F8FAFC] focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider text-[10px]">Duration</label>
                  <select
                    value={musicDuration}
                    onChange={(e) => setMusicDuration(e.target.value)}
                    className="w-full rounded-xl neumorph-inset p-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="15s">Short Clip (15s)</option>
                    <option value="30s">Standard Loop (30s)</option>
                    <option value="1m">Pro Track (60s)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider text-[10px]">Synthesis Model</label>
                  <select
                    value={musicModel}
                    onChange={(e) => setMusicModel(e.target.value)}
                    className="w-full rounded-xl neumorph-inset p-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="lyria-3-clip-preview">lyria-3-clip-preview</option>
                    <option value="lyria-3-pro-preview">lyria-3-pro-preview</option>
                  </select>
                </div>
              </div>

              <button
                onClick={generateMusic}
                disabled={loading || !musicPrompt.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl neumorph-btn-primary py-3 text-xs font-bold disabled:opacity-50 cursor-pointer transition-all"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Synthesizing audio buffers...</span>
                  </>
                ) : (
                  <>
                    <Music className="h-4 w-4" />
                    <span>Generate Audio Wave</span>
                  </>
                )}
              </button>
            </div>

            {/* Playback & Lyrics Screen */}
            <div className="rounded-2xl neumorph-card p-5 sm:p-6 flex flex-col justify-between min-h-[350px]">
              {generatedMusic ? (
                <div className="space-y-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#FF204E] neumorph-badge px-2.5 py-1 rounded-md">
                        Track Render Successful
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{generatedMusic.modelUsed}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-3 truncate">"{generatedMusic.prompt}"</h4>
                  </div>

                  <div className="neumorph-inset rounded-xl p-4 space-y-3">
                    {audioUrl && (
                      <audio
                        ref={audioRef}
                        src={audioUrl}
                        onEnded={handleAudioEnded}
                        className="hidden"
                      />
                    )}

                    <div className="flex items-center gap-4">
                      <button
                        onClick={toggleAudioPlayback}
                        className="h-12 w-12 rounded-full neumorph-btn-primary flex items-center justify-center cursor-pointer"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
                      </button>

                      <div className="flex-1 flex items-end gap-1 h-8 px-2">
                        {Array.from({ length: 24 }).map((_, i) => {
                          const randomHeight = isPlaying ? Math.floor(Math.random() * 24) + 6 : 6;
                          return (
                            <span
                              key={i}
                              style={{ height: `${randomHeight}px` }}
                              className={`flex-1 rounded-full bg-[#FF204E] transition-all duration-300 ${
                                isPlaying ? 'opacity-90' : 'opacity-40'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#94A3B8] border-t border-[#E50914]/20 pt-3">
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={audioVolume}
                          onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                          className="w-16 h-1 bg-[#070103] rounded-lg appearance-none cursor-pointer accent-[#FF204E]"
                        />
                      </div>

                      {audioUrl && (
                        <a
                          href={audioUrl}
                          download="lyria-synthesis.wav"
                          className="flex items-center gap-1.5 text-[#FF204E] hover:underline font-bold"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Save Local WAV</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="neumorph-inset p-3 rounded-xl max-h-40 overflow-y-auto">
                    <span className="block text-[10px] text-[#FF204E] font-extrabold uppercase tracking-wider mb-1.5">Lyrics / Orchestration:</span>
                    <pre className="text-[11px] text-white/80 font-mono whitespace-pre-wrap leading-relaxed">{generatedMusic.lyrics}</pre>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="h-14 w-14 rounded-full neumorph-circle flex items-center justify-center">
                    <Music className="h-7 w-7 text-[#FF204E]/60 animate-pulse" />
                  </div>
                  <div className="text-sm font-bold text-white/70">Audio Synthesis Idle</div>
                  <p className="text-xs text-[#94A3B8] max-w-xs">Formulate a music prompt on the left and click Generate to synthetically render audio waves.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PRO IMAGE STUDIO & ADVANCE CANVAS EDITOR */}
        {activeTab === 'image' && (
          <div className="w-full">
            <ImageStudioView />
          </div>
        )}

        {/* TAB 4: VEO VIDEO STUDIO (veo-3.1-fast-generate-preview) */}
        {activeTab === 'video' && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Input Configs */}
            <div className="rounded-2xl neumorph-card p-5 sm:p-6 space-y-4">
              <div>
                <span className="text-[10px] font-mono text-[#FF204E] uppercase tracking-wider neumorph-badge px-2.5 py-1 rounded-md">
                  Veo 3.1 Video Engine
                </span>
                <h3 className="text-base font-bold text-[#F8FAFC] mt-3">High-Definition Video Generation</h3>
                <p className="text-xs text-[#94A3B8] mt-1">Generate high-fidelity motion clips from text prompts using **veo-3.1-fast-generate-preview**.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider text-[10px]">Video Scene Prompt</label>
                <textarea
                  rows={3}
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  className="w-full rounded-xl neumorph-inset p-3 text-xs text-[#F8FAFC] focus:outline-none font-mono"
                  placeholder="Describe scene lighting, camera movement, subject action..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider text-[10px]">Aspect Ratio</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: '16:9', label: '16:9 Widescreen' },
                    { id: '9:16', label: '9:16 Vertical Reel' },
                  ].map((aspect) => (
                    <button
                      key={aspect.id}
                      onClick={() => setVideoAspect(aspect.id as any)}
                      className={`py-2.5 text-xs font-bold rounded-xl text-center transition-all cursor-pointer ${
                        videoAspect === aspect.id
                          ? 'neumorph-btn-primary'
                          : 'neumorph-btn-secondary text-[#94A3B8]'
                      }`}
                    >
                      {aspect.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generateVideo}
                disabled={loading || !videoPrompt.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl neumorph-btn-primary py-3 text-xs font-bold disabled:opacity-50 cursor-pointer transition-all"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Rendering Veo video frames...</span>
                  </>
                ) : (
                  <>
                    <Film className="h-4 w-4" />
                    <span>Generate Motion Video</span>
                  </>
                )}
              </button>
            </div>

            {/* Video Player Display */}
            <div className="rounded-2xl neumorph-card p-5 sm:p-6 flex flex-col justify-between min-h-[350px]">
              {generatedVideo ? (
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#FF204E] neumorph-badge px-2.5 py-1 rounded-md">
                      Veo Render Complete
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{generatedVideo.modelUsed}</span>
                  </div>

                  <div className="flex-1 neumorph-inset rounded-xl overflow-hidden flex items-center justify-center min-h-[220px] p-2">
                    <video
                      src={generatedVideo.videoUrl}
                      controls
                      autoPlay
                      loop
                      className="max-h-60 rounded-lg shadow-2xl object-contain w-full"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E50914]/20">
                    <span className="text-slate-400">Ratio: <span className="font-bold text-white">{generatedVideo.aspectRatio}</span></span>
                    <a
                      href={generatedVideo.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-[#FF204E] font-bold hover:underline"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Video MP4</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="h-14 w-14 rounded-full neumorph-circle flex items-center justify-center">
                    <Film className="h-7 w-7 text-slate-500 opacity-60 animate-pulse" />
                  </div>
                  <div className="text-sm font-bold text-slate-400">Video Motion Canvas Empty</div>
                  <p className="text-xs text-[#94A3B8] max-w-xs">Enter your scene description and click Generate to initiate the Veo video synthesis engine.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: SEARCH GROUNDING */}
        {activeTab === 'search' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="rounded-2xl neumorph-card p-5 sm:p-6 space-y-4">
              <div>
                <span className="text-[10px] font-mono text-[#FF204E] uppercase tracking-wider neumorph-badge px-2.5 py-1 rounded-md">
                  Web Search Grounding Engine
                </span>
                <h3 className="text-base font-bold text-[#F8FAFC] mt-3">Fact-Checked Web Grounding</h3>
                <p className="text-xs text-[#94A3B8] mt-1">Uses Gemini 3.5-flash with built-in Google Search grounding to retrieve real-time citations and factual summaries.</p>
              </div>

              <div className="flex gap-2.5 flex-col sm:flex-row">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 rounded-xl neumorph-inset px-4 py-3 text-xs text-white focus:outline-none"
                  placeholder="Enter factual question or technical topic query..."
                />
                <button
                  onClick={runSearchGrounding}
                  disabled={loading || !searchQuery.trim()}
                  className="rounded-xl neumorph-btn-primary px-6 py-3 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  <span>{loading ? 'Searching...' : 'Ground Query'}</span>
                </button>
              </div>
            </div>

            {searchResults && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                <div className="md:col-span-2 rounded-2xl neumorph-card p-5 sm:p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-[#FF204E] uppercase tracking-wider neumorph-badge px-2.5 py-1 rounded-md">
                      Factual Grounded Answer
                    </span>
                    <div className="prose prose-invert prose-sm max-w-none text-slate-300 font-sans text-xs mt-4 leading-relaxed whitespace-pre-wrap neumorph-inset p-4 rounded-xl">
                      {searchResults.summary}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono border-t border-[#E50914]/20 pt-3">
                    Verified Grounding Model: {searchResults.modelUsed}
                  </div>
                </div>

                <div className="md:col-span-1 rounded-2xl neumorph-card p-5 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#FF204E]">Google Search Citations</h4>
                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
                    {searchResults.citations.map((cite) => (
                      <a
                        key={cite.index}
                        href={cite.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block neumorph-inset p-3 rounded-xl hover:border-[#FF204E]/50 transition-all space-y-1"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                          <span className="h-5 w-5 rounded-full neumorph-circle text-[#FF204E] text-[10px] flex items-center justify-center font-bold font-mono">
                            {cite.index}
                          </span>
                          <span className="truncate flex-1 hover:underline">{cite.title}</span>
                          <ExternalLink className="h-3 w-3 text-slate-500 shrink-0" />
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed font-sans">{cite.snippet}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: MAPS GROUNDING */}
        {activeTab === 'maps' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="rounded-2xl neumorph-card p-5 sm:p-6 space-y-4">
              <div>
                <span className="text-[10px] font-mono text-[#FF204E] uppercase tracking-wider neumorph-badge px-2.5 py-1 rounded-md">
                  Google Maps Spatial Grounding
                </span>
                <h3 className="text-base font-bold text-[#F8FAFC] mt-3">Geolocal Maps Grounding</h3>
                <p className="text-xs text-[#94A3B8] mt-1">Uses Gemini 3.5-flash with Google Maps tools to query physical businesses, coordinates, and exact address directories.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider text-[10px]">Target Location / City</label>
                  <input
                    type="text"
                    value={mapsLocation}
                    onChange={(e) => setMapsLocation(e.target.value)}
                    className="w-full rounded-xl neumorph-inset p-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider text-[10px]">Business Type / Category</label>
                  <input
                    type="text"
                    value={mapsQuery}
                    onChange={(e) => setMapsQuery(e.target.value)}
                    className="w-full rounded-xl neumorph-inset p-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={runMapsGrounding}
                disabled={loading || !mapsLocation.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl neumorph-btn-primary py-3 text-xs font-bold disabled:opacity-50 cursor-pointer transition-all"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Resolving spatial queries...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    <span>Execute Maps Grounding</span>
                  </>
                )}
              </button>
            </div>

            {mapsResults && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                <div className="md:col-span-2 rounded-2xl neumorph-card p-5 sm:p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-[#FF204E] uppercase tracking-wider neumorph-badge px-2.5 py-1 rounded-md">
                      Spatial Analytical Report
                    </span>
                    <div className="prose prose-invert prose-sm max-w-none text-slate-300 font-sans text-xs mt-4 leading-relaxed whitespace-pre-wrap neumorph-inset p-4 rounded-xl">
                      {mapsResults.summary}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono border-t border-[#E50914]/20 pt-3">
                    Grounding Engine: {mapsResults.modelUsed}
                  </div>
                </div>

                <div className="md:col-span-1 rounded-2xl neumorph-card p-5 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#FF204E]">Grounded Map Coordinates</h4>
                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
                    {mapsResults.locations.map((loc) => (
                      <a
                        key={loc.index}
                        href={loc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block neumorph-inset p-3 rounded-xl hover:border-[#FF204E]/50 transition-all space-y-1"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                          <span className="h-5 w-5 rounded-full neumorph-circle text-[#FF204E] text-[10px] flex items-center justify-center font-bold font-mono">
                            {loc.index}
                          </span>
                          <span className="truncate flex-1 hover:underline">{loc.placeName}</span>
                          <ExternalLink className="h-3 w-3 text-slate-500 shrink-0" />
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed font-sans">{loc.address}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: SPEECH & LIVE API */}
        {activeTab === 'speech' && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Audio Transcription Studio */}
            <div className="rounded-2xl neumorph-card p-5 sm:p-6 space-y-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#FF204E] uppercase tracking-wider neumorph-badge px-2.5 py-1 rounded-md">
                  Microphone Transcription Studio
                </span>
                <h3 className="text-base font-bold text-[#F8FAFC] mt-3">High-Fidelity Speech to Text</h3>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Record real-time audio through your microphone and transcribe it using **gemini-3.5-transcribe**.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center neumorph-inset rounded-2xl p-6 space-y-4">
                <div className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-all neumorph-circle ${
                  isRecording 
                    ? 'border-2 border-rose-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' 
                    : ''
                }`}>
                  {isRecording && (
                    <div className="absolute inset-0 rounded-full border border-rose-500/30 animate-ping" />
                  )}
                  {isRecording ? (
                    <Mic className="h-10 w-10 text-rose-500 animate-pulse" />
                  ) : (
                    <Mic className="h-10 w-10 text-[#FF204E]" />
                  )}
                </div>

                <div className="text-center space-y-1">
                  <span className="block text-xs font-bold text-white">
                    {isRecording ? 'RECORDING AUDIO LIVE' : 'MICROPHONE READY'}
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {isRecording ? 'Speak clearly now...' : 'Click start to begin recording'}
                  </span>
                </div>

                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={transcribeLoading}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isRecording
                      ? 'neumorph-btn-primary bg-rose-700 hover:bg-rose-600'
                      : 'neumorph-btn-primary'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="h-4 w-4" />
                      <span>Stop & Transcribe</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" />
                      <span>Start Mic Recording</span>
                    </>
                  )}
                </button>
              </div>

              <div className="neumorph-inset p-4 rounded-xl min-h-[100px] flex flex-col justify-between">
                <div>
                  <span className="block text-[10px] text-[#FF204E] font-extrabold uppercase tracking-wider mb-1.5">
                    Real Transcribed Output:
                  </span>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                    {transcription || 'No active voice transcription yet. Speak into your mic and stop recording to print results.'}
                  </p>
                </div>
                {transcribeLoading && (
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-3">
                    <RefreshCw className="h-3 w-3 animate-spin text-[#FF204E]" />
                    <span>Engaging gemini-3.5-transcribe pipelines...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Real-time Live API Portal */}
            <div className="rounded-2xl neumorph-card p-5 sm:p-6 space-y-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#FF204E] uppercase tracking-wider neumorph-badge px-2.5 py-1 rounded-md">
                  Gemini Live API Hub
                </span>
                <h3 className="text-base font-bold text-[#F8FAFC] mt-3">Real-time Voice Conversation</h3>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Establish an ultra-low latency real-time voice & audio loop with **gemini-3.8-live** for continuous back-and-forth interaction.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center neumorph-inset rounded-2xl p-6 space-y-4">
                <div className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-all neumorph-circle ${
                  isLiveSessionActive 
                    ? 'border-2 border-[#FF204E] shadow-[0_0_30px_rgba(255,32,78,0.3)]' 
                    : ''
                }`}>
                  {isLiveSessionActive && (
                    <div className="absolute inset-0 rounded-full border border-[#FF204E]/30 animate-ping" />
                  )}
                  {isLiveSessionActive ? (
                    <Radio className="h-10 w-10 text-[#FF204E] animate-pulse" />
                  ) : (
                    <Radio className="h-10 w-10 text-slate-500" />
                  )}
                </div>

                <div className="text-center space-y-1">
                  <span className="block text-xs font-bold text-white">
                    {isLiveSessionActive ? 'LIVE VOICE STREAM ACTIVE' : 'LIVE LINK DISCONNECTED'}
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {isLiveSessionActive ? 'Ultra-low latency streaming engaged' : 'Start interactive voice conversation'}
                  </span>
                </div>

                <button
                  onClick={toggleLiveVoiceSession}
                  disabled={liveSessionLoading}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isLiveSessionActive
                      ? 'neumorph-btn-primary bg-rose-700 hover:bg-rose-600'
                      : 'neumorph-btn-primary'
                  }`}
                >
                  {liveSessionLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Negotiating Audio Link...</span>
                    </>
                  ) : isLiveSessionActive ? (
                    <>
                      <Radio className="h-4 w-4" />
                      <span>Terminate Live Connection</span>
                    </>
                  ) : (
                    <>
                      <Radio className="h-4 w-4" />
                      <span>Connect gemini-3.8-live</span>
                    </>
                  )}
                </button>
              </div>

              <div className="neumorph-inset p-4 rounded-xl min-h-[100px] flex flex-col justify-between">
                <div>
                  <span className="block text-[10px] text-[#FF204E] font-extrabold uppercase tracking-wider mb-1.5">
                    Real-time Voice Assistant Response:
                  </span>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                    {liveResponseText || 'Connect to start streaming conversational response segments dynamically.'}
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
