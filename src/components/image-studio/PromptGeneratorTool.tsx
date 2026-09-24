import React, { useState, useMemo } from 'react';
import {
  Wand2,
  Sparkles,
  Layers,
  Sun,
  Palette,
  Eye,
  Camera,
  Compass,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  Shuffle,
  Info,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { sound } from '../../services/sound';

export interface PromptConfig {
  subject: string;
  subjectDetail: string;
  style: string;
  lighting: string;
  mood: string;
  composition: string;
  camera: string;
  colorPalette: string;
  renderEngine: string;
  negativePrompt: string;
}

interface PromptGeneratorProps {
  initialPrompt?: string;
  onApplyPrompt: (generatedPrompt: string, styleId?: string, negativePrompt?: string) => void;
  onClose?: () => void;
}

export const PromptGeneratorTool: React.FC<PromptGeneratorProps> = ({
  initialPrompt = '',
  onApplyPrompt,
  onClose,
}) => {
  // Preset Archetypes
  const styleOptions = [
    { id: 'photorealistic', label: 'Photorealistic 8K', modifier: 'photorealistic, ultra-detailed 8k resolution, raw photo quality, high dynamic range' },
    { id: 'cosmic', label: 'Cosmic Red Sci-Fi', modifier: 'futuristic cosmic cyberpunk, glowing crimson neon circuits, deep space atmosphere' },
    { id: 'cinematic', label: 'Cinematic Movie Still', modifier: 'cinematic still frame, 35mm film grain, anamorphic lens flare, color graded Hollywood production' },
    { id: 'cyberpunk', label: 'Cyberpunk Neo-Tokyo', modifier: 'cyberpunk aesthetic, high-tech dystopian cityscape, neon reflections on wet asphalt' },
    { id: 'anime', label: 'Anime & Studio Ghibli', modifier: 'stylized Japanese anime key visual, Makoto Shinkai aesthetic, clean cel-shading, lush environmental details' },
    { id: '3d-clay', label: '3D Octane / Unreal', modifier: '3D hyper-detailed render, Octane Render, Unreal Engine 5, ray-traced subsurface scattering' },
    { id: 'oil-painting', label: 'Classical Oil Painting', modifier: 'classical Renaissance oil on canvas, textured impasto brushstrokes, chiaroscuro masters style' },
    { id: 'minimalist', label: 'Minimalist Vector Art', modifier: 'clean minimalist vector graphic, bold negative space, geometric elegance, Swiss design principle' },
  ];

  const lightingOptions = [
    { id: 'volumetric', label: 'Volumetric Rays & Fog', modifier: 'dramatic volumetric god rays piercing through atmospheric mist' },
    { id: 'golden_hour', label: 'Golden Hour Sunset', modifier: 'warm soft golden hour sunlight, low angle warm orange-pink glow' },
    { id: 'studio_rim', label: 'Studio Rim & Edge Light', modifier: 'three-point studio lighting, crisp razor-sharp rim highlights, soft ambient fill' },
    { id: 'neon_noir', label: 'Neon Glow in Dark', modifier: 'dark moody lighting with high-contrast electric neon crimson and cyan glow' },
    { id: 'bioluminescent', label: 'Bioluminescent Ambient', modifier: 'surreal bioluminescent ambient illumination from organic glowing flora' },
    { id: 'dramatic_chiaroscuro', label: 'Chiaroscuro Shadows', modifier: 'Rembrandt chiaroscuro lighting, deep cavernous black shadows and sharp key light' },
    { id: 'overcast_soft', label: 'Soft Diffused Overcast', modifier: 'soft diffuse daylight, completely shadowless even studio illumination' },
  ];

  const moodOptions = [
    { id: 'epic_grand', label: 'Epic & Heroic', modifier: 'epic scale, magnificent grandeur, awe-inspiring, cinematic tension' },
    { id: 'mysterious_dark', label: 'Mysterious & Enigmatic', modifier: 'dark enigmatic aura, suspenseful and eerie mystery, veiled secrets' },
    { id: 'peaceful_serene', label: 'Serene & Peaceful', modifier: 'peaceful tranquility, calm zen serenity, harmonic balance, gentle stillness' },
    { id: 'energetic_action', label: 'High Velocity Action', modifier: 'explosive adrenaline, dynamic kinetic motion blur, high-octane intensity' },
    { id: 'melancholic_poetic', label: 'Melancholic & Poetic', modifier: 'poetic nostalgia, quiet solitude, emotional depth, evocative twilight mood' },
    { id: 'luxurious_opulent', label: 'Luxurious & High-End', modifier: 'opulent prestige, lavish sophisticated elegance, billionaire aesthetic' },
  ];

  const compositionOptions = [
    { id: 'rule_of_thirds', label: 'Rule of Thirds', modifier: 'perfect rule-of-thirds composition, off-center focal subject, natural eye lead-in' },
    { id: 'centered_symmetry', label: 'Centered Symmetry', modifier: 'hyper-symmetrical central framing, Wes Anderson symmetry, direct frontal alignment' },
    { id: 'extreme_close_up', label: 'Macro / Close-Up', modifier: 'extreme macro close-up, microscopic textural details, shallow depth of field' },
    { id: 'wide_panoramic', label: 'Wide Panoramic View', modifier: 'expansive sweeping panoramic establishing shot, vast horizon and environmental scale' },
    { id: 'low_angle_hero', label: 'Low Angle Hero Shot', modifier: 'dramatic low-angle worm-eye perspective, towering imposing subject dominance' },
    { id: 'isometric_aerial', label: 'Isometric / Drone View', modifier: 'high-angle bird-eye isometric view, clean architectural perspective' },
  ];

  const cameraOptions = [
    { id: 'none', label: 'Default Auto', modifier: '' },
    { id: 'hasselblad_85mm', label: 'Hasselblad 85mm f/1.4', modifier: 'shot on Hasselblad H6D-100c, 85mm portrait lens, f/1.4 creamy bokeh' },
    { id: 'anamorphic_cinematic', label: 'Arri Alexa Anamorphic', modifier: 'shot on Arri Alexa 65, Panavision anamorphic lens, subtle horizontal streak' },
    { id: 'wide_angle_16mm', label: 'Sony A1 16mm Wide', modifier: 'shot on Sony A1 with 16-35mm G-Master at 16mm, crisp edge-to-edge sharpness' },
    { id: 'macro_100mm', label: 'Canon 100mm Macro', modifier: 'shot on Canon EOS R5 with 100mm f/2.8L Macro, extreme hyper-focus on micro textures' },
  ];

  const colorPaletteOptions = [
    { id: 'cosmic_crimson', label: 'Cosmic Crimson & Obsidian', modifier: 'color grading: deep crimson red #FF204E accents against midnight obsidian black and gunmetal' },
    { id: 'cyberpunk_duotone', label: 'Cyberpunk Crimson & Cyan', modifier: 'color grading: electric neon crimson and vivid cyan duotone contrast' },
    { id: 'warm_analog', label: 'Warm Kodak Portra 400', modifier: 'color grading: Kodak Portra 400 analog warmth, pastel tones, rich earthy highlights' },
    { id: 'monochrome_high_contrast', label: 'High-Contrast Noir Silver', modifier: 'color grading: monochrome black and white, deep silvers, striking tonal contrast' },
    { id: 'emerald_gold', label: 'Emerald Green & Royal Gold', modifier: 'color grading: deep imperial emerald greens with rich 24k gold leaf highlights' },
    { id: 'vibrant_saturated', label: 'Ultra-Vivid Vibrant', modifier: 'color grading: saturated vibrant spectrum, punchy high-contrast pigments' },
  ];

  // State
  const [subject, setSubject] = useState(initialPrompt || 'An autonomous AI android engineer examining a holographic blueprint');
  const [subjectDetail, setSubjectDetail] = useState('hyper-detailed carbon fiber chassis, translucent glass cranial dome displaying glowing quantum neural circuitry, weathered metallic fingers');
  const [selectedStyle, setSelectedStyle] = useState('cosmic');
  const [selectedLighting, setSelectedLighting] = useState('neon_noir');
  const [selectedMood, setSelectedMood] = useState('epic_grand');
  const [selectedComposition, setSelectedComposition] = useState('rule_of_thirds');
  const [selectedCamera, setSelectedCamera] = useState('hasselblad_85mm');
  const [selectedPalette, setSelectedPalette] = useState('cosmic_crimson');
  const [customModifiers, setCustomModifiers] = useState('hyper-detailed, award-winning, ray-tracing, trending on ArtStation');
  const [customNegative, setCustomNegative] = useState('blurry, distorted, low quality, bad anatomy, deformed limbs, watermark, amateur, grain, oversaturated artifacts');

  const [copied, setCopied] = useState(false);
  const [isAiPolishing, setIsAiPolishing] = useState(false);

  // Quick Preset Templates
  const presetBlueprints = [
    {
      name: '🤖 AI Core & Robotics',
      subject: 'Futuristic autonomous AI core named Agent-sigma08',
      subjectDetail: 'intricate micro-circuits glowing with cosmic red neural energy, obsidian glass core floating in zero gravity',
      style: 'cosmic',
      lighting: 'neon_noir',
      mood: 'epic_grand',
      composition: 'centered_symmetry',
      camera: 'anamorphic_cinematic',
      palette: 'cosmic_crimson',
    },
    {
      name: '🏎️ Stealth Hypercar',
      subject: 'Next-gen aerodynamic stealth electric hypercar',
      subjectDetail: 'matte crimson carbon bodywork, active aerodynamic rear wing, glowing laser headlights reflecting off wet tarmac',
      style: 'photorealistic',
      lighting: 'studio_rim',
      mood: 'luxurious_opulent',
      composition: 'low_angle_hero',
      camera: 'hasselblad_85mm',
      palette: 'cosmic_crimson',
    },
    {
      name: '🍣 Gourmet Fine Dining',
      subject: 'Artisanal glazed wagyu beef medallions garnished with truffles',
      subjectDetail: 'steaming hot glistening reduction sauce, edible gold foil flakes, micro herbs, served on a black volcanic stone slate',
      style: 'photorealistic',
      lighting: 'golden_hour',
      mood: 'luxurious_opulent',
      composition: 'extreme_close_up',
      camera: 'macro_100mm',
      palette: 'warm_analog',
    },
    {
      name: '⛩️ Cyberpunk Neo-Tokyo',
      subject: 'Bounty hunter standing on a wet neon-lit skyscraper rooftop',
      subjectDetail: 'tattered high-tech trenchcoat flapping in the wind, red holographic cybernetic eye implant, holographic billboards illuminating rainy haze',
      style: 'cyberpunk',
      lighting: 'neon_noir',
      mood: 'mysterious_dark',
      composition: 'rule_of_thirds',
      camera: 'anamorphic_cinematic',
      palette: 'cyberpunk_duotone',
    },
    {
      name: '🌌 Deep Space Nebula',
      subject: 'Interdimensional stargate portal tearing open in deep space',
      subjectDetail: 'swirling vortex of cosmic red plasma, accretion disk of glowing stellar matter, binary star system in background',
      style: 'cosmic',
      lighting: 'bioluminescent',
      mood: 'epic_grand',
      composition: 'wide_panoramic',
      camera: 'wide_angle_16mm',
      palette: 'cosmic_crimson',
    }
  ];

  // Assemble the master prompt string
  const fullGeneratedPrompt = useMemo(() => {
    const parts: string[] = [];

    // 1. Core Subject + Detail
    if (subject.trim()) {
      if (subjectDetail.trim()) {
        parts.push(`${subject.trim()}, featuring ${subjectDetail.trim()}`);
      } else {
        parts.push(subject.trim());
      }
    }

    // 2. Art Style
    const styleObj = styleOptions.find((s) => s.id === selectedStyle);
    if (styleObj?.modifier) parts.push(styleObj.modifier);

    // 3. Lighting
    const lightObj = lightingOptions.find((l) => l.id === selectedLighting);
    if (lightObj?.modifier) parts.push(lightObj.modifier);

    // 4. Mood & Atmosphere
    const moodObj = moodOptions.find((m) => m.id === selectedMood);
    if (moodObj?.modifier) parts.push(moodObj.modifier);

    // 5. Framing & Composition
    const compObj = compositionOptions.find((c) => c.id === selectedComposition);
    if (compObj?.modifier) parts.push(compObj.modifier);

    // 6. Camera Lens & Sensor
    const camObj = cameraOptions.find((c) => c.id === selectedCamera);
    if (camObj?.modifier) parts.push(camObj.modifier);

    // 7. Color Palette Grading
    const palObj = colorPaletteOptions.find((p) => p.id === selectedPalette);
    if (palObj?.modifier) parts.push(palObj.modifier);

    // 8. Custom Engine/Render Quality Modifiers
    if (customModifiers.trim()) {
      parts.push(customModifiers.trim());
    }

    return parts.join(', ');
  }, [
    subject,
    subjectDetail,
    selectedStyle,
    selectedLighting,
    selectedMood,
    selectedComposition,
    selectedCamera,
    selectedPalette,
    customModifiers,
  ]);

  // Load Preset
  const handleLoadBlueprint = (bp: typeof presetBlueprints[0]) => {
    setSubject(bp.subject);
    setSubjectDetail(bp.subjectDetail);
    setSelectedStyle(bp.style);
    setSelectedLighting(bp.lighting);
    setSelectedMood(bp.mood);
    setSelectedComposition(bp.composition);
    setSelectedCamera(bp.camera);
    setSelectedPalette(bp.palette);
    sound.play('click');
  };

  // Randomize / Shuffle
  const handleRandomize = () => {
    const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    setSelectedStyle(randomItem(styleOptions).id);
    setSelectedLighting(randomItem(lightingOptions).id);
    setSelectedMood(randomItem(moodOptions).id);
    setSelectedComposition(randomItem(compositionOptions).id);
    setSelectedCamera(randomItem(cameraOptions).id);
    setSelectedPalette(randomItem(colorPaletteOptions).id);
    sound.play('click');
  };

  // Copy Prompt to Clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullGeneratedPrompt);
      setCopied(true);
      sound.play('success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Apply to Main Studio
  const handleApply = () => {
    sound.play('success');
    onApplyPrompt(fullGeneratedPrompt, selectedStyle, customNegative);
    if (onClose) onClose();
  };

  // AI Polish with Server Endpoint
  const handleAiPolish = async () => {
    if (!fullGeneratedPrompt || isAiPolishing) return;
    setIsAiPolishing(true);
    sound.play('click');
    try {
      const res = await fetch('/api/playground/image/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullGeneratedPrompt }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setSubject(data.enhancedPrompt);
        setSubjectDetail('');
        sound.play('success');
      }
    } catch (err) {
      console.error('AI polish failed:', err);
    } finally {
      setIsAiPolishing(false);
    }
  };

  return (
    <div className="neumorph-card p-4 sm:p-5 rounded-3xl border border-[#E50914]/30 space-y-5 bg-[#0a0204]/95 text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E50914]/20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl neumorph-circle flex items-center justify-center text-[#FF204E] shadow-[0_0_15px_rgba(255,32,78,0.3)]">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white tracking-wide">AI Prompt Studio Generator</h3>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#E50914]/20 text-[#FF204E] border border-[#FF204E]/40 font-bold">
                PRO BUILDER
              </span>
            </div>
            <p className="text-xs text-[#94A3B8]">
              Craft ultra-high quality, production-grade image prompts with fine-tuned parameters.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRandomize}
            className="neumorph-btn-secondary px-3 py-1.5 rounded-xl text-xs font-bold text-[#94A3B8] hover:text-white flex items-center gap-1.5 cursor-pointer transition-all"
            title="Randomize style, lighting, and camera settings"
          >
            <Shuffle className="h-3.5 w-3.5 text-[#FF204E]" />
            <span className="hidden sm:inline">Randomize Attributes</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-[#94A3B8] hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Quick Blueprint Presets */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-[#FF204E]" />
          Instant Archetype Blueprints
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {presetBlueprints.map((bp, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleLoadBlueprint(bp)}
              className="px-3 py-1.5 rounded-xl neumorph-card hover:border-[#FF204E]/60 text-xs font-bold text-white whitespace-nowrap shrink-0 cursor-pointer transition-all hover:scale-[1.02] border border-white/5 active:scale-95"
            >
              {bp.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Sub-Column: Subject & Subject Details */}
        <div className="space-y-3.5">
          {/* Main Subject */}
          <div>
            <label className="text-xs font-bold text-white flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-[#FF204E]" />
                Primary Subject (What to show)
              </span>
              <span className="text-[10px] text-[#94A3B8]">Required</span>
            </label>
            <div className="neumorph-inset p-2.5 rounded-2xl border border-white/5">
              <textarea
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Cybernetic cyborg warrior, luxury wristwatch, modern villa..."
                rows={2}
                className="w-full bg-transparent text-xs text-white placeholder-[#94A3B8]/50 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Subject Detail & Texture */}
          <div>
            <label className="text-xs font-bold text-white flex items-center gap-1.5 mb-1.5">
              <Wand2 className="h-3.5 w-3.5 text-[#FF204E]" />
              Subject Detail, Materials & Features
            </label>
            <div className="neumorph-inset p-2.5 rounded-2xl border border-white/5">
              <textarea
                value={subjectDetail}
                onChange={(e) => setSubjectDetail(e.target.value)}
                placeholder="Specific materials (titanium, frosted glass, worn leather), clothing, hair, facial expression..."
                rows={2}
                className="w-full bg-transparent text-xs text-white placeholder-[#94A3B8]/50 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Visual Style Selection */}
          <div>
            <label className="text-xs font-bold text-white flex items-center gap-1.5 mb-1.5">
              <Palette className="h-3.5 w-3.5 text-[#FF204E]" />
              Artistic Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {styleOptions.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    setSelectedStyle(st.id);
                    sound.play('click');
                  }}
                  className={`p-2 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer border ${
                    selectedStyle === st.id
                      ? 'neumorph-btn-primary text-white border-[#FF204E] shadow-[0_0_12px_rgba(229,9,20,0.4)]'
                      : 'neumorph-btn-secondary text-[#94A3B8] border-white/5 hover:text-white'
                  }`}
                >
                  <div className="font-bold">{st.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Composition & Framing */}
          <div>
            <label className="text-xs font-bold text-white flex items-center gap-1.5 mb-1.5">
              <Compass className="h-3.5 w-3.5 text-[#FF204E]" />
              Framing & Angle
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {compositionOptions.map((co) => (
                <button
                  key={co.id}
                  type="button"
                  onClick={() => {
                    setSelectedComposition(co.id);
                    sound.play('click');
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-left text-[11px] font-semibold transition-all cursor-pointer border truncate ${
                    selectedComposition === co.id
                      ? 'neumorph-btn-primary text-white border-[#FF204E]'
                      : 'neumorph-btn-secondary text-[#94A3B8] border-white/5 hover:text-white'
                  }`}
                >
                  {co.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sub-Column: Lighting, Mood, Camera, Color */}
        <div className="space-y-3.5">
          {/* Lighting Environment */}
          <div>
            <label className="text-xs font-bold text-white flex items-center gap-1.5 mb-1.5">
              <Sun className="h-3.5 w-3.5 text-[#FF204E]" />
              Lighting Atmosphere
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {lightingOptions.map((li) => (
                <button
                  key={li.id}
                  type="button"
                  onClick={() => {
                    setSelectedLighting(li.id);
                    sound.play('click');
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-left text-[11px] font-semibold transition-all cursor-pointer border truncate ${
                    selectedLighting === li.id
                      ? 'neumorph-btn-primary text-white border-[#FF204E]'
                      : 'neumorph-btn-secondary text-[#94A3B8] border-white/5 hover:text-white'
                  }`}
                >
                  {li.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mood & Aesthetic Emotion */}
          <div>
            <label className="text-xs font-bold text-white flex items-center gap-1.5 mb-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#FF204E]" />
              Emotional Tone / Mood
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {moodOptions.map((mo) => (
                <button
                  key={mo.id}
                  type="button"
                  onClick={() => {
                    setSelectedMood(mo.id);
                    sound.play('click');
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-left text-[11px] font-semibold transition-all cursor-pointer border truncate ${
                    selectedMood === mo.id
                      ? 'neumorph-btn-primary text-white border-[#FF204E]'
                      : 'neumorph-btn-secondary text-[#94A3B8] border-white/5 hover:text-white'
                  }`}
                >
                  {mo.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette & Grading */}
          <div>
            <label className="text-xs font-bold text-white flex items-center gap-1.5 mb-1.5">
              <Palette className="h-3.5 w-3.5 text-[#FF204E]" />
              Color Grading & Tonal Palette
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {colorPaletteOptions.map((cp) => (
                <button
                  key={cp.id}
                  type="button"
                  onClick={() => {
                    setSelectedPalette(cp.id);
                    sound.play('click');
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-left text-[11px] font-semibold transition-all cursor-pointer border truncate ${
                    selectedPalette === cp.id
                      ? 'neumorph-btn-primary text-white border-[#FF204E]'
                      : 'neumorph-btn-secondary text-[#94A3B8] border-white/5 hover:text-white'
                  }`}
                >
                  {cp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Camera Lens Specification */}
          <div>
            <label className="text-xs font-bold text-white flex items-center gap-1.5 mb-1.5">
              <Camera className="h-3.5 w-3.5 text-[#FF204E]" />
              Camera Lens & Sensor Rig
            </label>
            <div className="neumorph-inset p-1 rounded-xl">
              <select
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
                className="w-full bg-transparent text-xs text-white py-1.5 px-2 focus:outline-none cursor-pointer"
              >
                {cameraOptions.map((ca) => (
                  <option key={ca.id} value={ca.id} className="bg-[#120407] text-white">
                    {ca.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Negative Prompt */}
          <div>
            <label className="text-xs font-bold text-[#94A3B8] flex items-center gap-1.5 mb-1">
              Negative Elements (Elements to avoid)
            </label>
            <div className="neumorph-inset p-2 rounded-xl">
              <input
                type="text"
                value={customNegative}
                onChange={(e) => setCustomNegative(e.target.value)}
                placeholder="blurry, distorted, watermark..."
                className="w-full bg-transparent text-[11px] text-white placeholder-[#94A3B8]/40 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Output Master Preview Box */}
      <div className="space-y-2 pt-2 border-t border-[#E50914]/20">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-white flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Synthesized Master Prompt
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAiPolish}
              disabled={isAiPolishing}
              className="neumorph-btn-secondary px-2.5 py-1 rounded-xl text-[11px] font-bold text-[#FF204E] hover:text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Wand2 className={`h-3 w-3 ${isAiPolishing ? 'animate-spin' : ''}`} />
              {isAiPolishing ? 'AI Polishing...' : 'Gemini AI Polish'}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="neumorph-btn-secondary px-2.5 py-1 rounded-xl text-[11px] font-bold text-white flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="neumorph-inset p-3.5 rounded-2xl border border-[#FF204E]/30 bg-[#070103]/80 relative group">
          <p className="text-xs text-white/95 leading-relaxed font-mono select-all">
            {fullGeneratedPrompt}
          </p>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="text-[11px] text-[#94A3B8] flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-[#FF204E]" />
          <span>Click &apos;Send to Image Studio&apos; to instantly load this into your active canvas pipeline.</span>
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl neumorph-btn-primary text-white text-xs font-black tracking-wider flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(229,9,20,0.5)] cursor-pointer hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Sparkles className="h-4 w-4" />
          Send to Image Studio & Synthesize
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
