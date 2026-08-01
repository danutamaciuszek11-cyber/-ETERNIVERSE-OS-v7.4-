import React, { useState, useRef } from 'react';
import { SAMPLE_ICONS } from '../data/sampleIcons';
import { SampleIcon } from '../types';
import { Code, FileUp, Sparkles, Copy, Check, Trash2, Layers } from 'lucide-react';

interface SvgInputEditorProps {
  svgInput: string;
  onChange: (value: string) => void;
  onSelectSample: (sample: SampleIcon) => void;
  activeSampleId?: string;
}

export const SvgInputEditor: React.FC<SvgInputEditorProps> = ({
  svgInput,
  onChange,
  onSelectSample,
  activeSampleId,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'samples'>('editor');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onChange(content);
        setActiveTab('editor');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'image/svg+xml' || file.name.endsWith('.svg'))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          onChange(content);
          setActiveTab('editor');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const copyInput = () => {
    navigator.clipboard.writeText(svgInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wrapPathInSvg = (dData: string) => {
    if (svgInput.includes('<svg')) return;
    const wrapped = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">\n  <path d="${dData.trim()}" />\n</svg>`;
    onChange(wrapped);
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/10 font-mono text-xs flex flex-col h-full shadow-md">
      
      {/* Tab Navigation & Toolbar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#080808] px-3 py-2">
        <div className="flex items-center gap-1">
          <button
            id="tab-editor"
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1.5 px-3 py-1 font-bold uppercase transition-colors cursor-pointer text-[10px] ${
              activeTab === 'editor'
                ? 'bg-cyan-500 text-black shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>SVG / Path Input</span>
          </button>
          
          <button
            id="tab-samples"
            onClick={() => setActiveTab('samples')}
            className={`flex items-center gap-1.5 px-3 py-1 font-bold uppercase transition-colors cursor-pointer text-[10px] ${
              activeTab === 'samples'
                ? 'bg-cyan-500 text-black shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Preset Assets</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".svg,image/svg+xml"
            className="hidden"
          />
          <button
            id="btn-upload-file"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase font-bold border border-white/20 text-slate-200 hover:bg-white/10 transition-all cursor-pointer"
            title="Upload SVG file"
          >
            <FileUp className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Upload File</span>
          </button>

          {svgInput && (
            <>
              <button
                id="btn-copy-input"
                onClick={copyInput}
                className="flex items-center gap-1 px-2 py-1 text-[10px] border border-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Copy raw input"
              >
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              </button>
              <button
                id="btn-clear-input"
                onClick={() => onChange('')}
                className="flex items-center gap-1 px-2 py-1 text-[10px] border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                title="Clear input"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 p-3 flex flex-col min-h-[280px]">
        {activeTab === 'editor' ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex-1 flex flex-col relative group"
          >
            <textarea
              id="textarea-svg-input"
              value={svgInput}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`Paste SVG code or path data d="..." here...\n\nExample:\n<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">\n  <path d="M 12.0000 2.0000 L 2.0000 7.0000 l 10.0000 5.0000..." />\n</svg>`}
              className="w-full flex-1 bg-black text-cyan-300 p-3 border border-white/10 focus:border-cyan-500 focus:outline-none resize-none font-mono text-xs leading-relaxed transition-all placeholder:text-slate-600"
              spellCheck={false}
            />

            {/* Quick detect if user pasted raw d="" string without <svg> */}
            {svgInput && !svgInput.trim().startsWith('<') && (
              <div className="mt-2 flex items-center justify-between p-2 bg-amber-950/40 border border-amber-500/30 text-[10px] text-amber-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Detected raw path data (<code className="text-amber-200 font-bold">d="..."</code>). Wrap in SVG container?
                </span>
                <button
                  id="btn-wrap-svg"
                  onClick={() => wrapPathInSvg(svgInput)}
                  className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/40 border border-amber-400/50 text-amber-200 uppercase font-bold transition-colors cursor-pointer text-[9px]"
                >
                  Wrap in SVG
                </button>
              </div>
            )}

            {/* Drag & Drop Hint Overlay when empty */}
            {!svgInput && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6 text-center bg-black/60 border border-dashed border-white/10">
                <FileUp className="w-8 h-8 text-slate-600 mb-2 animate-bounce" />
                <p className="text-slate-400 text-xs">Drag and drop an <span className="text-cyan-400 font-bold">.SVG</span> file here</p>
                <p className="text-[10px] text-slate-600 mt-1 uppercase">or select from Preset Assets tab</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 overflow-y-auto max-h-[320px] pr-1">
            {SAMPLE_ICONS.map((sample) => (
              <div
                key={sample.id}
                id={`sample-item-${sample.id}`}
                onClick={() => {
                  onSelectSample(sample);
                  setActiveTab('editor');
                }}
                className={`p-3 border cursor-pointer transition-all flex flex-col justify-between ${
                  activeSampleId === sample.id
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                    : 'bg-[#0d0d0d] border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono text-cyan-400">{sample.name}</span>
                    <span className="text-[8px] bg-cyan-500 text-black px-1 font-bold uppercase">
                      {sample.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-2 line-clamp-2">{sample.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div
                    className="w-8 h-8 text-cyan-400 bg-black p-1 border border-white/10 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: sample.svg }}
                  />
                  <span className="text-[10px] text-cyan-400 font-mono hover:underline uppercase tracking-wide">
                    Load Asset →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Meta info */}
      <div className="px-3 py-1.5 bg-black border-t border-white/10 flex justify-between items-center text-[9px] text-slate-500 uppercase">
        <span>Encoding: UTF-8</span>
        <span>
          Chars: <strong className="text-slate-300">{svgInput.length}</strong>
        </span>
      </div>

    </div>
  );
};
