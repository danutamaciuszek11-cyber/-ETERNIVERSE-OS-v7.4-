import React, { useState, useEffect } from 'react';
import { MinifyOptions, SavedPreset } from '../types';
import { Sliders, Sparkles, Check, RefreshCw, Bookmark, Plus, Trash2, Save, CheckCircle2 } from 'lucide-react';

interface OptimizationControlsProps {
  options: MinifyOptions;
  onChange: (options: MinifyOptions) => void;
  onReset: () => void;
}

const STORAGE_KEY = 'eterniverse_custom_presets_v1';

const DEFAULT_CUSTOM_PRESETS: SavedPreset[] = [
  {
    id: 'preset-web-light',
    name: 'Web Ultra-Light',
    options: {
      precision: 2,
      removeSpaces: true,
      tightenNegatives: true,
      convertRelative: true,
      optimizeCommands: true,
      removeComments: true,
      removeMetadata: true,
      removeDefaultAttrs: true,
      collapseWhitespace: true,
      removeLeadingZeros: true,
    },
    createdAt: Date.now() - 100000,
  },
  {
    id: 'preset-font-safe',
    name: 'Icon Font Safe',
    options: {
      precision: 4,
      removeSpaces: true,
      tightenNegatives: true,
      convertRelative: false,
      optimizeCommands: false,
      removeComments: true,
      removeMetadata: true,
      removeDefaultAttrs: false,
      collapseWhitespace: true,
      removeLeadingZeros: false,
    },
    createdAt: Date.now() - 50000,
  },
];

export const OptimizationControls: React.FC<OptimizationControlsProps> = ({
  options,
  onChange,
  onReset,
}) => {
  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>([]);
  const [newPresetName, setNewPresetName] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Load custom presets from Local Storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedPresets(parsed);
          return;
        }
      }
      // Seed initial defaults if empty
      setSavedPresets(DEFAULT_CUSTOM_PRESETS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CUSTOM_PRESETS));
    } catch (e) {
      console.warn('Failed to load presets from localStorage', e);
      setSavedPresets(DEFAULT_CUSTOM_PRESETS);
    }
  }, []);

  // Save presets list to Local Storage
  const persistPresets = (presets: SavedPreset[]) => {
    setSavedPresets(presets);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
    } catch (e) {
      console.warn('Failed to persist presets to localStorage', e);
    }
  };

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleToggle = (key: keyof MinifyOptions) => {
    setActivePresetId(null);
    onChange({
      ...options,
      [key]: !options[key],
    });
  };

  const handlePrecisionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActivePresetId(null);
    onChange({
      ...options,
      precision: parseInt(e.target.value, 10),
    });
  };

  const applyPreset = (preset: 'aggressive' | 'standard' | 'high-precision') => {
    setActivePresetId(`built-in-${preset}`);
    if (preset === 'aggressive') {
      onChange({
        precision: 1,
        removeSpaces: true,
        tightenNegatives: true,
        convertRelative: true,
        optimizeCommands: true,
        removeComments: true,
        removeMetadata: true,
        removeDefaultAttrs: true,
        collapseWhitespace: true,
        removeLeadingZeros: true,
      });
    } else if (preset === 'standard') {
      onChange({
        precision: 3,
        removeSpaces: true,
        tightenNegatives: true,
        convertRelative: true,
        optimizeCommands: true,
        removeComments: true,
        removeMetadata: true,
        removeDefaultAttrs: true,
        collapseWhitespace: true,
        removeLeadingZeros: true,
      });
    } else {
      onChange({
        precision: 5,
        removeSpaces: true,
        tightenNegatives: true,
        convertRelative: false,
        optimizeCommands: false,
        removeComments: true,
        removeMetadata: true,
        removeDefaultAttrs: false,
        collapseWhitespace: true,
        removeLeadingZeros: false,
      });
    }
  };

  const handleLoadCustomPreset = (preset: SavedPreset) => {
    setActivePresetId(preset.id);
    onChange({ ...preset.options });
    showNotification(`Loaded preset: "${preset.name}"`);
  };

  const handleCreatePreset = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newPresetName.trim();
    if (!name) return;

    const newPreset: SavedPreset = {
      id: `custom-${Date.now()}`,
      name,
      options: { ...options },
      createdAt: Date.now(),
    };

    const updated = [newPreset, ...savedPresets];
    persistPresets(updated);
    setActivePresetId(newPreset.id);
    setNewPresetName('');
    setIsSaving(false);
    showNotification(`Saved custom preset: "${name}"`);
  };

  const handleDeletePreset = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedPresets.filter((p) => p.id !== id);
    persistPresets(updated);
    if (activePresetId === id) {
      setActivePresetId(null);
    }
    showNotification(`Deleted preset: "${name}"`);
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/10 p-4 font-mono text-xs shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="text-cyan-400 font-bold uppercase tracking-wider text-xs">
            Minification Engine Config
          </h2>
        </div>
        <button
          id="btn-reset-options"
          onClick={() => {
            setActivePresetId(null);
            onReset();
          }}
          className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-cyan-300 uppercase font-bold transition-colors cursor-pointer"
          title="Reset to default protocol options"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Quick Protocol Presets */}
      <div className="mb-4">
        <label className="block text-slate-400 text-[9px] uppercase tracking-wider mb-2 font-bold">
          Quick Protocol Presets:
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            id="preset-aggressive"
            onClick={() => applyPreset('aggressive')}
            className={`py-1.5 px-2 text-[10px] font-bold uppercase transition-all cursor-pointer border ${
              activePresetId === 'built-in-aggressive' || options.precision === 1
                ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                : 'bg-[#0d0d0d] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
            }`}
          >
            Aggressive (1-Dec)
          </button>
          <button
            id="preset-standard"
            onClick={() => applyPreset('standard')}
            className={`py-1.5 px-2 text-[10px] font-bold uppercase transition-all cursor-pointer border ${
              activePresetId === 'built-in-standard' || (options.precision === 3 && activePresetId === null)
                ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                : 'bg-[#0d0d0d] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
            }`}
          >
            Standard (3-Dec)
          </button>
          <button
            id="preset-high-precision"
            onClick={() => applyPreset('high-precision')}
            className={`py-1.5 px-2 text-[10px] font-bold uppercase transition-all cursor-pointer border ${
              activePresetId === 'built-in-high-precision'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                : 'bg-[#0d0d0d] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
            }`}
          >
            High Precision (5-Dec)
          </button>
        </div>
      </div>

      {/* LocalStorage User Presets Section */}
      <div className="mb-5 p-3 bg-black border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-slate-300 text-[10px] uppercase font-bold flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
            Saved Local Presets ({savedPresets.length}):
          </span>
          <button
            id="btn-toggle-save-preset"
            onClick={() => setIsSaving(!isSaving)}
            className="flex items-center gap-1 px-2 py-0.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[9px] uppercase font-bold transition-all cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>{isSaving ? 'Cancel' : 'Save Current Config'}</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="p-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-[9px] uppercase font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Create Preset Form */}
        {isSaving && (
          <form onSubmit={handleCreatePreset} className="flex gap-2">
            <input
              id="input-preset-name"
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="Preset Name (e.g. Mobile Minimal)..."
              className="flex-1 bg-[#0d0d0d] border border-cyan-500/50 text-cyan-200 px-2.5 py-1 text-[10px] focus:outline-none focus:border-cyan-400 placeholder:text-slate-600 font-mono"
              autoFocus
            />
            <button
              id="btn-confirm-save-preset"
              type="submit"
              disabled={!newPresetName.trim()}
              className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[9px] uppercase transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1"
            >
              <Save className="w-3 h-3" />
              Save
            </button>
          </form>
        )}

        {/* Presets Grid */}
        <div className="flex flex-wrap gap-2 pt-1">
          {savedPresets.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleLoadCustomPreset(preset)}
                className={`group flex items-center gap-2 px-2.5 py-1 text-[10px] border cursor-pointer transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                    : 'bg-[#0d0d0d] border-white/10 text-slate-300 hover:border-cyan-500/40 hover:text-white'
                }`}
              >
                <span className="font-bold">{preset.name}</span>
                <span className="text-[8px] text-slate-500 uppercase">({preset.options.precision}dec)</span>
                <button
                  onClick={(e) => handleDeletePreset(preset.id, preset.name, e)}
                  className="text-slate-500 hover:text-red-400 p-0.5 rounded transition-colors ml-1"
                  title="Delete preset from local storage"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
          {savedPresets.length === 0 && !isSaving && (
            <span className="text-[9px] text-slate-500 italic uppercase">No saved custom presets yet.</span>
          )}
        </div>
      </div>

      {/* Precision Slider */}
      <div className="mb-5 p-3 bg-black border border-white/10">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-slate-300 text-[10px] uppercase font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Path Coordinate Precision:
          </span>
          <span className="text-black font-bold bg-cyan-400 px-2 py-0.5 text-[9px] uppercase">
            {options.precision} Decimals
          </span>
        </div>
        <input
          id="input-precision-slider"
          type="range"
          min="0"
          max="6"
          step="1"
          value={options.precision}
          onChange={handlePrecisionChange}
          className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[8px] text-slate-500 mt-1 uppercase">
          <span>0 (Integer)</span>
          <span>1</span>
          <span>2</span>
          <span>3 (Default)</span>
          <span>4</span>
          <span>5</span>
          <span>6 (Max)</span>
        </div>
      </div>

      {/* Checkbox Options */}
      <div className="space-y-2 text-[10px] uppercase">
        
        {/* Remove Spaces */}
        <label className="flex items-center justify-between p-2 bg-[#0d0d0d] hover:bg-white/5 border border-white/10 cursor-pointer group">
          <span className="text-slate-300 group-hover:text-cyan-300 transition-colors">
            Purge Command Whitespace
          </span>
          <div className="flex items-center">
            <input
              id="chk-remove-spaces"
              type="checkbox"
              checked={options.removeSpaces}
              onChange={() => handleToggle('removeSpaces')}
              className="sr-only"
            />
            <div className={`w-4 h-4 border flex items-center justify-center transition-all ${
              options.removeSpaces ? 'bg-cyan-500 border-cyan-400 text-black' : 'border-slate-700 bg-black'
            }`}>
              {options.removeSpaces && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </div>
        </label>

        {/* Tighten Negative Numbers */}
        <label className="flex items-center justify-between p-2 bg-[#0d0d0d] hover:bg-white/5 border border-white/10 cursor-pointer group">
          <span className="text-slate-300 group-hover:text-cyan-300 transition-colors">
            Tighten Negative Numbers (<code className="text-slate-400 lowercase">10 -20</code> → <code className="text-cyan-400 lowercase">10-20</code>)
          </span>
          <div className="flex items-center">
            <input
              id="chk-tighten-negatives"
              type="checkbox"
              checked={options.tightenNegatives}
              onChange={() => handleToggle('tightenNegatives')}
              className="sr-only"
            />
            <div className={`w-4 h-4 border flex items-center justify-center transition-all ${
              options.tightenNegatives ? 'bg-cyan-500 border-cyan-400 text-black' : 'border-slate-700 bg-black'
            }`}>
              {options.tightenNegatives && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </div>
        </label>

        {/* Strip Leading Zeros */}
        <label className="flex items-center justify-between p-2 bg-[#0d0d0d] hover:bg-white/5 border border-white/10 cursor-pointer group">
          <span className="text-slate-300 group-hover:text-cyan-300 transition-colors">
            Strip Leading Zeros (<code className="text-slate-400 lowercase">0.5</code> → <code className="text-cyan-400 lowercase">.5</code>)
          </span>
          <div className="flex items-center">
            <input
              id="chk-remove-zeros"
              type="checkbox"
              checked={options.removeLeadingZeros}
              onChange={() => handleToggle('removeLeadingZeros')}
              className="sr-only"
            />
            <div className={`w-4 h-4 border flex items-center justify-center transition-all ${
              options.removeLeadingZeros ? 'bg-cyan-500 border-cyan-400 text-black' : 'border-slate-700 bg-black'
            }`}>
              {options.removeLeadingZeros && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </div>
        </label>

        {/* Collapse XML Whitespace */}
        <label className="flex items-center justify-between p-2 bg-[#0d0d0d] hover:bg-white/5 border border-white/10 cursor-pointer group">
          <span className="text-slate-300 group-hover:text-cyan-300 transition-colors">
            Collapse XML Indentation & Tags
          </span>
          <div className="flex items-center">
            <input
              id="chk-collapse-whitespace"
              type="checkbox"
              checked={options.collapseWhitespace}
              onChange={() => handleToggle('collapseWhitespace')}
              className="sr-only"
            />
            <div className={`w-4 h-4 border flex items-center justify-center transition-all ${
              options.collapseWhitespace ? 'bg-cyan-500 border-cyan-400 text-black' : 'border-slate-700 bg-black'
            }`}>
              {options.collapseWhitespace && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </div>
        </label>

        {/* Strip Comments & Metadata */}
        <label className="flex items-center justify-between p-2 bg-[#0d0d0d] hover:bg-white/5 border border-white/10 cursor-pointer group">
          <span className="text-slate-300 group-hover:text-cyan-300 transition-colors">
            Purge HTML/XML Comments & Metadata
          </span>
          <div className="flex items-center">
            <input
              id="chk-remove-comments"
              type="checkbox"
              checked={options.removeComments}
              onChange={() => handleToggle('removeComments')}
              className="sr-only"
            />
            <div className={`w-4 h-4 border flex items-center justify-center transition-all ${
              options.removeComments ? 'bg-cyan-500 border-cyan-400 text-black' : 'border-slate-700 bg-black'
            }`}>
              {options.removeComments && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </div>
        </label>

        {/* Remove Redundant Default Attributes */}
        <label className="flex items-center justify-between p-2 bg-[#0d0d0d] hover:bg-white/5 border border-white/10 cursor-pointer group">
          <span className="text-slate-300 group-hover:text-cyan-300 transition-colors">
            Remove Default/Unused XML Attributes
          </span>
          <div className="flex items-center">
            <input
              id="chk-remove-default-attrs"
              type="checkbox"
              checked={options.removeDefaultAttrs}
              onChange={() => handleToggle('removeDefaultAttrs')}
              className="sr-only"
            />
            <div className={`w-4 h-4 border flex items-center justify-center transition-all ${
              options.removeDefaultAttrs ? 'bg-cyan-500 border-cyan-400 text-black' : 'border-slate-700 bg-black'
            }`}>
              {options.removeDefaultAttrs && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </div>
        </label>

      </div>
    </div>
  );
};

