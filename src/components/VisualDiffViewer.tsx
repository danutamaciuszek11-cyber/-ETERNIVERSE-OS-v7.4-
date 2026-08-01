import React, { useState } from 'react';
import { MinifyResult } from '../types';
import { Eye, Layers, ZoomIn, ZoomOut, Maximize2, Copy, Check, Download, ShieldCheck } from 'lucide-react';

interface VisualDiffViewerProps {
  result: MinifyResult;
}

export const VisualDiffViewer: React.FC<VisualDiffViewerProps> = ({ result }) => {
  const [viewMode, setViewMode] = useState<'minified' | 'original' | 'diff'>('minified');
  const [zoom, setZoom] = useState<number>(1);
  const [copiedSvg, setCopiedSvg] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  const handleCopySvg = () => {
    navigator.clipboard.writeText(result.minifiedSvg);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2000);
  };

  const handleCopyPath = () => {
    if (result.pathDetails.length > 0) {
      const allPaths = result.pathDetails.map((p) => p.minifiedD).join(' ');
      navigator.clipboard.writeText(allPaths);
    } else {
      navigator.clipboard.writeText(result.minifiedSvg);
    }
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([result.minifiedSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized-vector.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const firstMinifiedPath = result.pathDetails[0]?.minifiedD || '';

  return (
    <div className="bg-[#0d0d0d] border border-cyan-500/30 p-4 font-mono text-xs flex flex-col justify-between h-full shadow-[0_0_20px_rgba(6,182,212,0.15)]">
      
      {/* Top Header Controls */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-3 border-b border-white/10 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">
              COMPONENT: [ATOM] Vector-Display-Unit
            </span>
            <span className="text-[9px] bg-green-500/10 text-green-400 px-2 py-0.5 border border-green-500/30 flex items-center gap-1 font-bold uppercase">
              <ShieldCheck className="w-3 h-3" />
              MINIFIED
            </span>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1 bg-black p-1 border border-white/10">
            <button
              id="view-mode-minified"
              onClick={() => setViewMode('minified')}
              className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                viewMode === 'minified'
                  ? 'bg-cyan-500 text-black shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Optimized
            </button>
            <button
              id="view-mode-original"
              onClick={() => setViewMode('original')}
              className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                viewMode === 'original'
                  ? 'bg-cyan-500 text-black shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Original
            </button>
            <button
              id="view-mode-diff"
              onClick={() => setViewMode('diff')}
              className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                viewMode === 'diff'
                  ? 'bg-amber-500 text-black shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Visual Overlay Diff
            </button>
          </div>
        </div>

        {/* Display Canvas with Zoom controls */}
        <div className="relative group bg-[#0a0a0a] border border-white/10 p-6 min-h-[220px] flex items-center justify-center overflow-hidden">
          
          {/* Grid Background */}
          {showGrid && (
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            />
          )}

          {/* Zoom Controls Overlay */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black border border-white/10 p-1 opacity-80 group-hover:opacity-100 transition-opacity z-10">
            <button
              id="btn-zoom-out"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
              className="p-1 hover:text-cyan-400 text-slate-400 cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-cyan-300 font-mono px-1">
              {Math.round(zoom * 100)}%
            </span>
            <button
              id="btn-zoom-in"
              onClick={() => setZoom((z) => Math.min(4, z + 0.25))}
              className="p-1 hover:text-cyan-400 text-slate-400 cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-zoom-reset"
              onClick={() => setZoom(1)}
              className="p-1 hover:text-cyan-400 text-slate-400 cursor-pointer"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-toggle-grid"
              onClick={() => setShowGrid(!showGrid)}
              className={`p-1 cursor-pointer ${showGrid ? 'text-cyan-400' : 'text-slate-600'}`}
              title="Toggle Grid"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Rendered Graphic */}
          <div
            className="transition-transform duration-200 flex items-center justify-center max-w-full max-h-full"
            style={{ transform: `scale(${zoom})` }}
          >
            {viewMode === 'minified' && (
              <div
                className="w-24 h-24 text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: result.minifiedSvg }}
              />
            )}

            {viewMode === 'original' && (
              <div
                className="w-24 h-24 text-slate-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: result.originalSvg }}
              />
            )}

            {viewMode === 'diff' && (
              <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Red outline for original */}
                <div
                  className="absolute inset-0 text-red-500 opacity-60 flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: result.originalSvg }}
                />
                {/* Cyan outline for minified */}
                <div
                  className="absolute inset-0 text-cyan-400 mix-blend-screen opacity-90 flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: result.minifiedSvg }}
                />
              </div>
            )}
          </div>

          {/* Telemetry Overlay */}
          <div className="absolute bottom-2 left-2 font-mono text-[9px] text-cyan-300 bg-black/90 p-2.5 border border-cyan-500/40 backdrop-blur-md shadow-[0_0_12px_rgba(6,182,212,0.15)] flex flex-col gap-1 z-10">
            <div className="flex justify-between gap-4">
              <span className="text-slate-400 font-bold uppercase">REDUKCJA:</span>
              <span id="telemetry-reduction" className="text-green-400 font-bold">{result.percentageSaved}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400 font-bold uppercase">LATENCJA:</span>
              <span id="telemetry-time" className="text-cyan-300 font-bold">{result.executionTimeMs}ms</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400 font-bold uppercase">RESONANCE:</span>
              <span className="text-cyan-400 font-bold tracking-wider shadow-[0_0_5px_#06b6d4]">ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Output Path Display matching User Prompt visual specifications */}
        <div className="mt-3 font-mono text-[10px] text-slate-400 break-all bg-[#0a0a0a] border border-cyan-500/20 p-3 relative group shadow-[inset_0_0_10px_rgba(6,182,212,0.05)]">
          <div className="flex items-center justify-between mb-1.5 border-b border-white/5 pb-1">
            <span className="text-[9px] text-cyan-500 font-bold uppercase tracking-wider">
              PATH DATA [d]:
            </span>
            <button
              id="btn-copy-path-data"
              onClick={handleCopyPath}
              className="text-[9px] text-cyan-400 hover:text-cyan-200 flex items-center gap-1 cursor-pointer uppercase font-bold"
            >
              {copiedPath ? (
                <>
                  <Check className="w-3 h-3 text-green-400" /> Copied Path
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy Path
                </>
              )}
            </button>
          </div>
          <div className="text-cyan-200 max-h-16 overflow-y-auto leading-relaxed">
            d="{firstMinifiedPath || 'No path extracted'}"
          </div>
        </div>
      </div>

      {/* Export Action Buttons */}
      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
        <button
          id="btn-copy-minified-svg"
          onClick={handleCopySvg}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase text-[10px] transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)] cursor-pointer active:scale-95"
        >
          {copiedSvg ? (
            <>
              <Check className="w-3.5 h-3.5 text-black" />
              <span>SVG Code Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-black" />
              <span>Copy Optimized SVG</span>
            </>
          )}
        </button>

        <button
          id="btn-download-svg"
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 py-2 px-4 border border-white/20 text-white font-bold text-[10px] uppercase hover:bg-white/10 transition-all cursor-pointer active:scale-95"
          title="Download minified SVG file"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Download</span>
        </button>
      </div>

    </div>
  );
};
