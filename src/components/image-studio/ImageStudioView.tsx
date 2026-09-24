import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Wand2,
  Paintbrush,
  Eraser,
  Type,
  Crop,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Sliders,
  Download,
  Save,
  Copy,
  Check,
  Upload,
  Camera,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Undo2,
  Redo2,
  Image as ImageIcon,
  Send,
  Trash2,
  Layers,
  Palette,
  Crosshair,
  Compass,
  Square,
  Circle,
  HelpCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';
import { sound } from '../../services/sound';
import { PromptGeneratorTool } from './PromptGeneratorTool';

type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
type ActiveTool = 'select' | 'brush' | 'eraser' | 'mask' | 'text' | 'shape' | 'crop' | 'filters';
type FilterPreset = 'none' | 'cosmic-crimson' | 'cyberpunk' | 'noir' | 'vintage' | 'emerald';

interface CanvasHistoryState {
  imageDataUrl: string;
}

export const ImageStudioView: React.FC = () => {
  const { uploadFile, setActiveView, handleSendMessage } = useAgent();

  // Mode: 'generate' | 'edit' | 'gallery' | 'generator-tool'
  const [studioMode, setStudioMode] = useState<'generate' | 'edit' | 'gallery' | 'generator-tool'>('generate');
  const [showPromptGeneratorModal, setShowPromptGeneratorModal] = useState(false);

  // Generation Controls
  const [prompt, setPrompt] = useState('Futuristic robotic AI core glowing with cosmic red circuits in deep space, hyper-detailed, octane render 8k');
  const [negativePrompt, setNegativePrompt] = useState('blurry, deformed, bad anatomy, low quality, artifacts, watermark');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [selectedStyle, setSelectedStyle] = useState('cosmic');
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [modelUsed, setModelUsed] = useState('gemini-3.1-flash-image');

  // Canvas & Active Image State
  const [currentImageSrc, setCurrentImageSrc] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ActiveTool>('select');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Brush & Drawing Settings
  const [brushSize, setBrushSize] = useState(12);
  const [brushColor, setBrushColor] = useState('#FF204E');
  const [brushOpacity, setBrushOpacity] = useState(1.0);
  const [isNeonGlow, setIsNeonGlow] = useState(true);

  // Inpainting Mask
  const [inpaintPrompt, setInpaintPrompt] = useState('Replace masked region with glowing cybernetic crystals');
  const [isInpainting, setIsInpainting] = useState(false);

  // Text Overlay Settings
  const [overlayText, setOverlayText] = useState('AGENT-SIGMA08');
  const [textFontSize, setTextFontSize] = useState(36);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [textFontFamily, setTextFontFamily] = useState<'sans' | 'mono' | 'orbitron' | 'serif'>('orbitron');

  // Adjustment Filters State
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [hueRotate, setHueRotate] = useState(0);
  const [blur, setBlur] = useState(0);
  const [exposure, setExposure] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [invert, setInvert] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [activeFilterPreset, setActiveFilterPreset] = useState<FilterPreset>('none');

  // History Undo / Redo
  const [history, setHistory] = useState<CanvasHistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Canvas Element References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Push Canvas snapshot to Undo stack
  const pushHistorySnapshot = useCallback(() => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    setHistory((prev) => {
      const next = prev.slice(0, historyIndex + 1);
      return [...next, { imageDataUrl: dataUrl }];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // Undo Action
  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      const targetState = history[nextIndex];
      setHistoryIndex(nextIndex);
      loadDataUrlToCanvas(targetState.imageDataUrl, false);
      sound.play('click');
    }
  };

  // Redo Action
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const targetState = history[nextIndex];
      setHistoryIndex(nextIndex);
      loadDataUrlToCanvas(targetState.imageDataUrl, false);
      sound.play('click');
    }
  };

  // Load a Data URL into the Canvas
  const loadDataUrlToCanvas = (dataUrl: string, recordHistory = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.naturalWidth || 1024;
      canvas.height = img.naturalHeight || 1024;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setCurrentImageSrc(dataUrl);

      if (recordHistory) {
        setHistory([{ imageDataUrl: dataUrl }]);
        setHistoryIndex(0);
      }
    };
    img.src = dataUrl;
  };

  // Initial Sample Artwork on mount
  useEffect(() => {
    if (!currentImageSrc) {
      handleGenerateImage(false);
    }
  }, []);

  // AI Prompt Enhancer
  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancingPrompt) return;
    setIsEnhancingPrompt(true);
    sound.play('click');
    try {
      const res = await fetch('/api/playground/image/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
        sound.play('success');
      }
    } catch (err) {
      console.error('Enhance prompt failed:', err);
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  // Generate Image via API
  const handleGenerateImage = async (playSound = true) => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    if (playSound) sound.play('click');

    try {
      const res = await fetch('/api/playground/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          style: selectedStyle,
          negativePrompt,
        }),
      });
      const data = await res.json();
      if (data.success && data.imageBase64) {
        const mime = data.mimeType || 'image/png';
        const dataUrl = `data:${mime};base64,${data.imageBase64}`;
        loadDataUrlToCanvas(dataUrl, true);
        setModelUsed(data.modelUsed || 'gemini-3.1-flash-image');
        setStudioMode('edit');
        if (playSound) sound.play('success');
      }
    } catch (err) {
      console.error('Image generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Perform AI Inpainting
  const handleApplyInpaint = async () => {
    if (!canvasRef.current || !inpaintPrompt.trim() || isInpainting) return;
    setIsInpainting(true);
    sound.play('click');

    try {
      const currentCanvasUrl = canvasRef.current.toDataURL('image/png');
      const res = await fetch('/api/playground/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${inpaintPrompt}, preserve surrounding context, seamless high definition blend`,
          aspectRatio,
          referenceImage: currentCanvasUrl,
          isEditing: true,
          style: selectedStyle,
        }),
      });
      const data = await res.json();
      if (data.success && data.imageBase64) {
        const mime = data.mimeType || 'image/png';
        const dataUrl = `data:${mime};base64,${data.imageBase64}`;
        loadDataUrlToCanvas(dataUrl, true);
        sound.play('success');
        setActiveTool('select');
      }
    } catch (err) {
      console.error('Inpainting error:', err);
    } finally {
      setIsInpainting(false);
    }
  };

  // Drawing Handlers
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'select' || activeTool === 'filters') return;
    const coords = getCanvasCoords(e);
    isDrawingRef.current = true;
    lastPosRef.current = coords;

    if (activeTool === 'text') {
      applyTextToCanvas(coords.x, coords.y);
      isDrawingRef.current = false;
    } else if (activeTool === 'shape') {
      applyShapeToCanvas(coords.x, coords.y);
      isDrawingRef.current = false;
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current || !lastPosRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);

    ctx.save();
    if (activeTool === 'brush') {
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = brushOpacity;

      if (isNeonGlow) {
        ctx.shadowColor = brushColor;
        ctx.shadowBlur = brushSize * 1.5;
      }

      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (activeTool === 'eraser') {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = brushSize * 1.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'destination-out';

      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (activeTool === 'mask') {
      // Semi-transparent red mask for inpainting
      ctx.strokeStyle = 'rgba(255, 32, 78, 0.45)';
      ctx.lineWidth = brushSize * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
    ctx.restore();

    lastPosRef.current = coords;
  };

  const stopDrawing = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastPosRef.current = null;
      pushHistorySnapshot();
    }
  };

  // Stamp Text onto Canvas
  const applyTextToCanvas = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    const fontName =
      textFontFamily === 'orbitron'
        ? 'Orbitron, system-ui, sans-serif'
        : textFontFamily === 'mono'
        ? 'monospace'
        : textFontFamily === 'serif'
        ? 'Georgia, serif'
        : 'Inter, system-ui, sans-serif';

    ctx.font = `bold ${textFontSize}px ${fontName}`;
    ctx.fillStyle = textColor;
    ctx.shadowColor = '#FF204E';
    ctx.shadowBlur = 14;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(overlayText, x, y);
    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.lineWidth = Math.max(1, textFontSize * 0.05);
    ctx.strokeText(overlayText, x, y);

    ctx.restore();
    pushHistorySnapshot();
    sound.play('click');
  };

  // Stamp Tech Shapes & HUD Stamp
  const applyShapeToCanvas = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.strokeStyle = '#FF204E';
    ctx.fillStyle = 'rgba(229, 9, 20, 0.15)';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#FF204E';
    ctx.shadowBlur = 12;

    // Draw Cyber Reticle
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(x - 55, y);
    ctx.lineTo(x + 55, y);
    ctx.moveTo(x, y - 55);
    ctx.lineTo(x, y + 55);
    ctx.stroke();

    ctx.restore();
    pushHistorySnapshot();
    sound.play('click');
  };

  // Rotate Canvas 90 degrees
  const handleRotate = (clockwise = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prevCanvas = document.createElement('canvas');
    prevCanvas.width = canvas.width;
    prevCanvas.height = canvas.height;
    prevCanvas.getContext('2d')?.drawImage(canvas, 0, 0);

    canvas.width = prevCanvas.height;
    canvas.height = prevCanvas.width;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((clockwise ? 90 : -90) * (Math.PI / 180));
    ctx.drawImage(prevCanvas, -prevCanvas.width / 2, -prevCanvas.height / 2);
    ctx.restore();

    pushHistorySnapshot();
    sound.play('click');
  };

  // Flip Canvas
  const handleFlip = (horizontal = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prevCanvas = document.createElement('canvas');
    prevCanvas.width = canvas.width;
    prevCanvas.height = canvas.height;
    prevCanvas.getContext('2d')?.drawImage(canvas, 0, 0);

    ctx.save();
    if (horizontal) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);
    }
    ctx.drawImage(prevCanvas, 0, 0);
    ctx.restore();

    pushHistorySnapshot();
    sound.play('click');
  };

  // Apply Live Adjustment Filter Values into Canvas Pixels
  const handleBakeFilters = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prevCanvas = document.createElement('canvas');
    prevCanvas.width = canvas.width;
    prevCanvas.height = canvas.height;
    prevCanvas.getContext('2d')?.drawImage(canvas, 0, 0);

    ctx.save();
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hueRotate}deg) blur(${blur}px) sepia(${sepia}%) invert(${invert}%) grayscale(${grayscale}%)`;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(prevCanvas, 0, 0);
    ctx.restore();

    // Reset sliders after baking
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setHueRotate(0);
    setBlur(0);
    setExposure(0);
    setSepia(0);
    setInvert(0);
    setGrayscale(0);
    setActiveFilterPreset('none');

    pushHistorySnapshot();
    sound.play('success');
  };

  // Select Preset Filter LUT
  const applyPresetFilter = (preset: FilterPreset) => {
    setActiveFilterPreset(preset);
    sound.play('click');
    switch (preset) {
      case 'cosmic-crimson':
        setBrightness(105);
        setContrast(125);
        setSaturation(140);
        setHueRotate(350);
        setSepia(15);
        setInvert(0);
        setGrayscale(0);
        break;
      case 'cyberpunk':
        setBrightness(115);
        setContrast(130);
        setSaturation(160);
        setHueRotate(280);
        setSepia(0);
        setInvert(0);
        setGrayscale(0);
        break;
      case 'noir':
        setBrightness(110);
        setContrast(150);
        setSaturation(0);
        setHueRotate(0);
        setSepia(0);
        setInvert(0);
        setGrayscale(100);
        break;
      case 'vintage':
        setBrightness(95);
        setContrast(105);
        setSaturation(85);
        setHueRotate(20);
        setSepia(45);
        setInvert(0);
        setGrayscale(0);
        break;
      case 'emerald':
        setBrightness(105);
        setContrast(120);
        setSaturation(135);
        setHueRotate(120);
        setSepia(0);
        setInvert(0);
        setGrayscale(0);
        break;
      default:
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
        setHueRotate(0);
        setBlur(0);
        setSepia(0);
        setInvert(0);
        setGrayscale(0);
    }
  };

  // File Upload
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        loadDataUrlToCanvas(reader.result as string, true);
        setStudioMode('edit');
        sound.play('success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Save directly to Workspace Files
  const handleSaveToFiles = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const filename = `artwork_${Date.now()}.png`;

    uploadFile({
      name: filename,
      size: `${Math.round(dataUrl.length / 1024)} KB`,
      type: 'image/png',
      content: dataUrl,
    });

    setSavedSuccess(true);
    sound.play('success');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Download Image
  const handleDownload = (format: 'png' | 'jpeg' = 'png') => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL(`image/${format}`, 0.95);
    const link = document.createElement('a');
    link.download = `agent-sigma08_${Date.now()}.${format}`;
    link.href = dataUrl;
    link.click();
    sound.play('success');
  };

  // Copy to Clipboard
  const handleCopy = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setCopied(true);
          sound.play('success');
          setTimeout(() => setCopied(false), 2000);
        }
      });
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // Send to AI Co-Pilot Chat
  const handleSendToChat = () => {
    if (!canvasRef.current) return;
    setActiveView('chat');
    handleSendMessage(`Please perform a full aesthetic and technical critique of this generated image. Prompt used: "${prompt}"`);
  };

  // Curated Preset Sample Prompts
  const samplePrompts = [
    {
      title: 'Cosmic Red Cyberpunk Core',
      prompt: 'A futuristic cybernetic android with glowing crimson red optical sensors, high-tech carbon fiber chassis, neon rain reflections, cinematic 8k octane render',
      style: 'cyberpunk',
    },
    {
      title: 'Quantum Portal Horizon',
      prompt: 'Interdimensional portal glowing with red energy on an alien volcanic planet, dramatic volumetric clouds, twin moons, photorealistic landscape',
      style: 'cosmic',
    },
    {
      title: 'Luxury Stealth Hypercar',
      prompt: 'Aggressive crimson matte black hypercar in a futuristic neon tunnel, dynamic motion blur, wet asphalt reflections, hyper-detailed ray-tracing',
      style: 'photorealistic',
    },
    {
      title: 'Anime Neo Tokyo Rooftop',
      prompt: 'Anime hero overlooking futuristic neon megacity at twilight, glowing red holographic HUD display, stylized wind and cherry blossom petals, Makoto Shinkai style',
      style: 'anime',
    },
  ];

  return (
    <div className="flex flex-col h-full w-full space-y-4 pb-6">
      {/* Top Banner & Mode Bar */}
      <div className="neumorph-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 border border-[#E50914]/25">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl neumorph-circle flex items-center justify-center text-[#FF204E]">
            <Wand2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white tracking-tight">Agent-sigma08 Pro Image Studio</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full neumorph-btn-primary text-white tracking-wider uppercase">
                Advance AI & Canvas
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Generate photorealistic artwork with Gemini models, edit with pro pixel & vector tools, and save to workspace.
            </p>
          </div>
        </div>

        {/* Studio View Mode Switcher */}
        <div className="flex items-center gap-1.5 neumorph-inset p-1 rounded-xl overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => {
              setStudioMode('generate');
              sound.play('click');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              studioMode === 'generate' ? 'neumorph-btn-primary text-white shadow-md' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Generator
          </button>
          <button
            type="button"
            onClick={() => {
              setStudioMode('generator-tool');
              sound.play('click');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              studioMode === 'generator-tool' ? 'neumorph-btn-primary text-white shadow-md' : 'text-[#FF204E] hover:text-white'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Prompt Generator Tool
          </button>
          <button
            type="button"
            onClick={() => {
              setStudioMode('edit');
              sound.play('click');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              studioMode === 'edit' ? 'neumorph-btn-primary text-white shadow-md' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Paintbrush className="h-3.5 w-3.5" />
            Pro Canvas Editor
          </button>
          <button
            type="button"
            onClick={() => {
              setStudioMode('gallery');
              sound.play('click');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              studioMode === 'gallery' ? 'neumorph-btn-primary text-white shadow-md' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            Showcase Prompts
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[620px]">
        {/* LEFT COLUMN: Controls & Tools (4 cols normally, 6 cols in generator-tool mode) */}
        <div className={`${studioMode === 'generator-tool' ? 'lg:col-span-6' : 'lg:col-span-4'} flex flex-col space-y-4`}>
          {studioMode === 'generate' ? (
            /* GENERATOR PANEL */
            <div className="neumorph-card p-4 rounded-2xl space-y-4 border border-[#E50914]/20 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#FF204E]" />
                  Creative Prompt Studio
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setStudioMode('generator-tool');
                      sound.play('click');
                    }}
                    className="neumorph-btn-primary px-2.5 py-1 rounded-lg text-[11px] font-bold text-white flex items-center gap-1 cursor-pointer shadow-sm"
                    title="Open Prompt Generator Tool to build deep style, lighting & mood prompts"
                  >
                    <SlidersHorizontal className="h-3 w-3" />
                    Prompt Builder
                  </button>
                  <button
                    type="button"
                    onClick={handleEnhancePrompt}
                    disabled={isEnhancingPrompt}
                    className="neumorph-btn-secondary px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#FF204E] hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Wand2 className={`h-3 w-3 ${isEnhancingPrompt ? 'animate-spin' : ''}`} />
                    {isEnhancingPrompt ? 'Enhancing...' : 'Enhance'}
                  </button>
                </div>
              </div>

              {/* Prompt Textarea */}
              <div className="neumorph-inset p-2.5 rounded-xl">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your vision with rich details, lighting, mood and atmosphere..."
                  rows={4}
                  className="w-full bg-transparent text-xs text-white placeholder-[#94A3B8]/60 focus:outline-none resize-none scrollbar-none"
                />
              </div>

              {/* Aspect Ratio Selector */}
              <div>
                <label className="text-[11px] font-bold text-[#94A3B8] block mb-1.5">Aspect Ratio</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['1:1', '16:9', '9:16', '4:3', '3:4'] as AspectRatio[]).map((ar) => (
                    <button
                      key={ar}
                      type="button"
                      onClick={() => {
                        setAspectRatio(ar);
                        sound.play('click');
                      }}
                      className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        aspectRatio === ar ? 'neumorph-btn-primary text-white shadow-md' : 'neumorph-btn-secondary text-[#94A3B8]'
                      }`}
                    >
                      {ar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Presets */}
              <div>
                <label className="text-[11px] font-bold text-[#94A3B8] block mb-1.5">Visual Art Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'cosmic', label: '🌌 Cosmic Red' },
                    { id: 'photorealistic', label: '📸 Photorealistic 8K' },
                    { id: 'cyberpunk', label: '⚡ Cyberpunk Neon' },
                    { id: 'anime', label: '⛩️ Anime / Ghibli' },
                    { id: '3d-clay', label: '🧊 3D Render' },
                    { id: 'oil-painting', label: '🎨 Oil Painting' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => {
                        setSelectedStyle(style.id);
                        sound.play('click');
                      }}
                      className={`p-2 text-left text-xs font-semibold rounded-xl transition-all cursor-pointer border ${
                        selectedStyle === style.id
                          ? 'neumorph-btn-primary text-white border-[#FF204E] shadow-sm'
                          : 'neumorph-btn-secondary text-[#94A3B8] border-white/5 hover:text-white'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Negative Prompt */}
              <div>
                <label className="text-[11px] font-bold text-[#94A3B8] block mb-1">Negative Elements</label>
                <div className="neumorph-inset p-2 rounded-xl">
                  <input
                    type="text"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="Things to avoid..."
                    className="w-full bg-transparent text-[11px] text-white placeholder-[#94A3B8]/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Generate Trigger Button */}
              <button
                type="button"
                onClick={() => handleGenerateImage(true)}
                disabled={isGenerating}
                className="w-full py-3 rounded-xl neumorph-btn-primary text-white text-xs font-black tracking-wide flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(229,9,20,0.4)] cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Synthesizing High-Def Artwork...' : 'Synthesize Image Now'}
              </button>

              {/* Upload Alternative */}
              <div className="pt-2 border-t border-[#E50914]/20 flex items-center justify-between text-xs text-[#94A3B8]">
                <span>Or import your own image:</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="neumorph-btn-secondary px-2.5 py-1 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="h-3 w-3" />
                  Upload
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  className="hidden"
                />
              </div>
            </div>
          ) : studioMode === 'edit' ? (
            /* PRO ADVANCE CANVAS TOOLS PANEL */
            <div className="neumorph-card p-4 rounded-2xl space-y-4 border border-[#E50914]/20 flex-1 overflow-y-auto max-h-[700px] scrollbar-thin">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Palette className="h-4 w-4 text-[#FF204E]" />
                  Advance Tool Suite
                </span>
                <span className="text-[10px] font-mono text-[#94A3B8]">
                  {canvasRef.current ? `${canvasRef.current.width}×${canvasRef.current.height}` : '1024×1024'}
                </span>
              </div>

              {/* Tool Category Selector Grid */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'select' as ActiveTool, label: 'Select', icon: Crosshair },
                  { id: 'brush' as ActiveTool, label: 'Brush', icon: Paintbrush },
                  { id: 'eraser' as ActiveTool, label: 'Eraser', icon: Eraser },
                  { id: 'mask' as ActiveTool, label: 'Inpaint', icon: Wand2 },
                  { id: 'text' as ActiveTool, label: 'Text', icon: Type },
                  { id: 'shape' as ActiveTool, label: 'Reticle', icon: Square },
                  { id: 'crop' as ActiveTool, label: 'Rotate', icon: RotateCw },
                  { id: 'filters' as ActiveTool, label: 'Filters', icon: Sliders },
                ].map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => {
                        setActiveTool(tool.id);
                        sound.play('click');
                      }}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        activeTool === tool.id
                          ? 'neumorph-btn-primary text-white shadow-md'
                          : 'neumorph-btn-secondary text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4 mb-1" />
                      {tool.label}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Context Tool Properties */}
              {activeTool === 'brush' && (
                <div className="neumorph-inset p-3 rounded-xl space-y-3">
                  <span className="text-[11px] font-bold text-white block">Brush Properties</span>
                  <div>
                    <div className="flex justify-between text-[10px] text-[#94A3B8] mb-1">
                      <span>Brush Size</span>
                      <span>{brushSize}px</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={64}
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-full accent-[#FF204E]"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-[#94A3B8] block mb-1">Color Palette</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {['#FF204E', '#E50914', '#FFD700', '#00F2FE', '#4FACFE', '#00FF88', '#FFFFFF', '#080204'].map(
                        (c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setBrushColor(c)}
                            style={{ backgroundColor: c }}
                            className={`h-6 w-6 rounded-full border cursor-pointer transition-transform ${
                              brushColor === c ? 'scale-125 border-white shadow-[0_0_8px_rgba(255,32,78,0.8)]' : 'border-white/20'
                            }`}
                          />
                        )
                      )}
                      <input
                        type="color"
                        value={brushColor}
                        onChange={(e) => setBrushColor(e.target.value)}
                        className="h-6 w-6 rounded-full cursor-pointer bg-transparent border-0"
                        title="Custom Color"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#94A3B8]">Cosmic Neon Glow</span>
                    <button
                      type="button"
                      onClick={() => setIsNeonGlow(!isNeonGlow)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                        isNeonGlow ? 'neumorph-btn-primary text-white' : 'neumorph-btn-secondary text-[#94A3B8]'
                      }`}
                    >
                      {isNeonGlow ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              )}

              {activeTool === 'mask' && (
                <div className="neumorph-inset p-3 rounded-xl space-y-3 border border-[#FF204E]/30">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF204E]">
                    <Wand2 className="h-3.5 w-3.5" />
                    AI Inpainting Mask
                  </div>
                  <p className="text-[10px] text-[#94A3B8]">
                    1. Paint red mask over the area you want to alter on the canvas.
                    <br />
                    2. Describe what should replace it below:
                  </p>
                  <textarea
                    value={inpaintPrompt}
                    onChange={(e) => setInpaintPrompt(e.target.value)}
                    placeholder="e.g., Replace with glowing red cyber skull..."
                    rows={2}
                    className="w-full bg-[#080204] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none resize-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyInpaint}
                    disabled={isInpainting}
                    className="w-full py-2 rounded-xl neumorph-btn-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Wand2 className={`h-3 w-3 ${isInpainting ? 'animate-spin' : ''}`} />
                    {isInpainting ? 'Regenerating Region...' : 'Apply AI Inpaint'}
                  </button>
                </div>
              )}

              {activeTool === 'text' && (
                <div className="neumorph-inset p-3 rounded-xl space-y-3">
                  <span className="text-[11px] font-bold text-white block">Typography Layer</span>
                  <input
                    type="text"
                    value={overlayText}
                    onChange={(e) => setOverlayText(e.target.value)}
                    placeholder="Enter text..."
                    className="w-full bg-[#080204] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-[#94A3B8] block mb-1">Font Family</span>
                      <select
                        value={textFontFamily}
                        onChange={(e) => setTextFontFamily(e.target.value as any)}
                        className="w-full bg-[#080204] text-xs text-white p-1.5 rounded-lg border border-white/10"
                      >
                        <option value="orbitron">Orbitron (Cyber)</option>
                        <option value="sans">Inter (Modern)</option>
                        <option value="mono">Monospace (Code)</option>
                        <option value="serif">Georgia (Classic)</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#94A3B8] block mb-1">Font Size ({textFontSize}px)</span>
                      <input
                        type="range"
                        min={14}
                        max={96}
                        value={textFontSize}
                        onChange={(e) => setTextFontSize(Number(e.target.value))}
                        className="w-full accent-[#FF204E]"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-[#94A3B8] italic">Click anywhere on the canvas to stamp this text.</p>
                </div>
              )}

              {activeTool === 'crop' && (
                <div className="neumorph-inset p-3 rounded-xl space-y-3">
                  <span className="text-[11px] font-bold text-white block">Transform Geometry</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleRotate(false)}
                      className="neumorph-btn-secondary p-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Rotate -90°
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRotate(true)}
                      className="neumorph-btn-secondary p-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                      Rotate +90°
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFlip(true)}
                      className="neumorph-btn-secondary p-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FlipHorizontal className="h-3.5 w-3.5" />
                      Flip Horizontal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFlip(false)}
                      className="neumorph-btn-secondary p-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FlipVertical className="h-3.5 w-3.5" />
                      Flip Vertical
                    </button>
                  </div>
                </div>
              )}

              {activeTool === 'filters' && (
                <div className="neumorph-inset p-3 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white">GPU Color Grading</span>
                    <button
                      type="button"
                      onClick={handleBakeFilters}
                      className="neumorph-btn-primary px-2.5 py-1 rounded-lg text-[10px] font-bold text-white cursor-pointer"
                    >
                      Bake Filters
                    </button>
                  </div>

                  {/* Filter Presets */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'none' as FilterPreset, label: 'Normal' },
                      { id: 'cosmic-crimson' as FilterPreset, label: '🔴 Cosmic' },
                      { id: 'cyberpunk' as FilterPreset, label: '🌆 Cyber' },
                      { id: 'noir' as FilterPreset, label: '🖤 Noir' },
                      { id: 'vintage' as FilterPreset, label: '📼 Retro' },
                      { id: 'emerald' as FilterPreset, label: '💚 Matrix' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => applyPresetFilter(f.id)}
                        className={`p-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                          activeFilterPreset === f.id
                            ? 'neumorph-btn-primary text-white shadow-sm'
                            : 'neumorph-btn-secondary text-[#94A3B8]'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Sliders */}
                  <div className="space-y-2 pt-1">
                    <div>
                      <div className="flex justify-between text-[10px] text-[#94A3B8]">
                        <span>Brightness</span>
                        <span>{brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min={30}
                        max={200}
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full accent-[#FF204E]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-[#94A3B8]">
                        <span>Contrast</span>
                        <span>{contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min={30}
                        max={200}
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="w-full accent-[#FF204E]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-[#94A3B8]">
                        <span>Saturation</span>
                        <span>{saturation}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={250}
                        value={saturation}
                        onChange={(e) => setSaturation(Number(e.target.value))}
                        className="w-full accent-[#FF204E]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-[#94A3B8]">
                        <span>Hue Shift</span>
                        <span>{hueRotate}°</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={360}
                        value={hueRotate}
                        onChange={(e) => setHueRotate(Number(e.target.value))}
                        className="w-full accent-[#FF204E]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Undo / Redo Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E50914]/20">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                    className="neumorph-btn-secondary p-2 rounded-xl text-[#94A3B8] hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Undo (Ctrl+Z)"
                  >
                    <Undo2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                    className="neumorph-btn-secondary p-2 rounded-xl text-[#94A3B8] hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Redo (Ctrl+Y)"
                  >
                    <Redo2 className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (currentImageSrc) loadDataUrlToCanvas(currentImageSrc, true);
                    sound.play('click');
                  }}
                  className="text-[11px] text-[#94A3B8] hover:text-[#FF204E] cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Reset Canvas
                </button>
              </div>
            </div>
          ) : studioMode === 'generator-tool' ? (
            /* DEDICATED PROMPT GENERATOR TOOL IN LEFT PANEL */
            <div className="flex-1 overflow-y-auto max-h-[760px] scrollbar-thin">
              <PromptGeneratorTool
                initialPrompt={prompt}
                onApplyPrompt={(genPrompt, styleId, negPrompt) => {
                  setPrompt(genPrompt);
                  if (styleId) setSelectedStyle(styleId);
                  if (negPrompt) setNegativePrompt(negPrompt);
                  setStudioMode('generate');
                  sound.play('success');
                }}
                onClose={() => setStudioMode('generate')}
              />
            </div>
          ) : (
            /* SHOWCASE GALLERY PROMPTS PANEL */
            <div className="neumorph-card p-4 rounded-2xl space-y-3 border border-[#E50914]/20 flex-1 overflow-y-auto max-h-[700px]">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#FF204E]" />
                Curated High-Resolution Prompts
              </span>
              <p className="text-[11px] text-[#94A3B8]">Click any prompt to instantly load and generate in Studio:</p>

              <div className="space-y-2.5">
                {samplePrompts.map((sp, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setPrompt(sp.prompt);
                      setSelectedStyle(sp.style);
                      setStudioMode('generate');
                      sound.play('click');
                    }}
                    className="p-3 rounded-xl neumorph-card hover:border-[#FF204E]/50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white group-hover:text-[#FF204E] transition-colors">
                        {sp.title}
                      </span>
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 text-[#94A3B8]">
                        {sp.style}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] line-clamp-2">{sp.prompt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Workspace Action Card */}
          <div className="neumorph-card p-3 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#94A3B8]">
              <span>Active Model Engine:</span>
              <span className="font-mono text-[#FF204E] font-bold truncate max-w-[170px]">{modelUsed}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleSaveToFiles}
                className="neumorph-btn-secondary p-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {savedSuccess ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Save className="h-3.5 w-3.5" />}
                {savedSuccess ? 'Saved!' : 'Save to Files'}
              </button>
              <button
                type="button"
                onClick={handleSendToChat}
                className="neumorph-btn-primary p-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Send className="h-3.5 w-3.5" />
                Analyze in Chat
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Interactive Pro Canvas (8 cols normally, 6 cols in generator-tool mode) */}
        <div className={`${studioMode === 'generator-tool' ? 'lg:col-span-6' : 'lg:col-span-8'} flex flex-col space-y-3`}>
          {/* Canvas Floating Top Toolbar */}
          <div className="neumorph-card px-4 py-2.5 rounded-2xl flex items-center justify-between border border-[#E50914]/25">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-[#94A3B8]">
                Mode: <strong className="text-white uppercase">{activeTool}</strong>
              </span>
            </div>

            {/* Canvas Zoom & View Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center neumorph-inset rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.4, z - 0.15))}
                  className="p-1 text-[#94A3B8] hover:text-white cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="text-[10px] font-mono px-2 text-[#94A3B8]">{Math.round(zoomLevel * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.15))}
                  className="p-1 text-[#94A3B8] hover:text-white cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="p-1 text-[#94A3B8] hover:text-white cursor-pointer text-[10px] font-mono px-1"
                  title="Reset Zoom"
                >
                  1:1
                </button>
              </div>

              {/* Action Buttons */}
              <button
                type="button"
                onClick={handleCopy}
                className="neumorph-btn-secondary p-1.5 rounded-lg text-[#94A3B8] hover:text-white cursor-pointer"
                title="Copy Image"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={() => handleDownload('png')}
                className="neumorph-btn-primary px-3 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Download className="h-3.5 w-3.5" />
                Export PNG
              </button>
            </div>
          </div>

          {/* Canvas Viewport Surface */}
          <div className="flex-1 min-h-[500px] neumorph-inset rounded-3xl p-4 flex items-center justify-center overflow-auto relative bg-[#050002]/90 border border-white/5">
            {/* Visual Grid Backdrop */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#FF204E_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* Live Filter Applied onto Canvas Viewport */}
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.15s ease-out',
                filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hueRotate}deg) blur(${blur}px) sepia(${sepia}%) invert(${invert}%) grayscale(${grayscale}%)`,
              }}
              className="relative shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(229,9,20,0.25)] rounded-xl overflow-hidden border border-[#E50914]/40"
            >
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className={`max-w-[720px] max-h-[560px] object-contain block bg-[#080204] ${
                  activeTool === 'brush' || activeTool === 'mask'
                    ? 'cursor-crosshair'
                    : activeTool === 'eraser'
                    ? 'cursor-cell'
                    : activeTool === 'text'
                    ? 'cursor-text'
                    : 'cursor-default'
                }`}
              />

              {/* Inpainting / Active Tool Overlay Indicator */}
              {isGenerating && (
                <div className="absolute inset-0 bg-[#080204]/80 backdrop-blur-md flex flex-col items-center justify-center space-y-3 z-30">
                  <div className="h-12 w-12 rounded-full neumorph-circle flex items-center justify-center text-[#FF204E] animate-spin">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">Synthesizing Neural Artwork</p>
                    <p className="text-xs text-[#94A3B8] mt-1 font-mono">Running @google/genai image pipeline...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Floating Canvas Tips */}
            <div className="absolute bottom-4 left-6 pointer-events-none text-[10px] text-[#94A3B8] font-mono flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF204E]" />
              <span>Left-click & drag on canvas to paint, stamp, or mask • Ctrl+Z to undo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
