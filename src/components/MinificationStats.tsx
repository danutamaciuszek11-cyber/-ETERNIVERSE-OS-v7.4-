import React from 'react';
import { MinifyResult } from '../types';
import { formatBytes } from '../utils/svgMinifier';
import { ArrowDownRight, Layers, Gauge, Database } from 'lucide-react';

interface MinificationStatsProps {
  result: MinifyResult;
}

export const MinificationStats: React.FC<MinificationStatsProps> = ({ result }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
      
      {/* Stat 1: Original Size */}
      <div className="p-3 bg-[#0d0d0d] border border-white/10 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 text-[9px] uppercase font-bold mb-1">
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3 text-slate-500" /> Original Size
          </span>
        </div>
        <div className="text-base font-bold text-slate-300">
          {formatBytes(result.originalBytes)}
        </div>
        <div className="text-[9px] text-slate-500 mt-1 uppercase">
          Raw SVG Source payload
        </div>
      </div>

      {/* Stat 2: Minified Size */}
      <div className="p-3 bg-[#0d0d0d] border border-white/10 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 text-[9px] uppercase font-bold mb-1">
          <span className="flex items-center gap-1">
            <Gauge className="w-3 h-3 text-cyan-400" /> Optimized Size
          </span>
        </div>
        <div className="text-base font-bold text-cyan-400">
          {formatBytes(result.minifiedBytes)}
        </div>
        <div className="text-[9px] text-slate-500 mt-1 uppercase">
          Truncated & purged payload
        </div>
      </div>

      {/* Stat 3: Bytes Saved & Savings % */}
      <div className="p-3 bg-cyan-500/10 border border-cyan-500/40 flex flex-col justify-between shadow-[0_0_12px_rgba(6,182,212,0.15)]">
        <div className="flex items-center justify-between text-[9px] uppercase font-bold mb-1">
          <span className="text-cyan-400 flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5 text-green-400" /> Reduction Delta
          </span>
          <span className="px-1.5 py-0.5 bg-green-500 text-black font-bold text-[8px]">
            -{result.percentageSaved}%
          </span>
        </div>
        <div className="text-base font-bold text-green-400">
          -{formatBytes(result.bytesSaved)}
        </div>
        <div className="text-[9px] text-cyan-300/80 mt-1 uppercase">
          {result.percentageSaved > 0 ? 'Purged redundant bytes' : 'Already optimal'}
        </div>
      </div>

      {/* Stat 4: Path Count & Latency */}
      <div className="p-3 bg-[#0d0d0d] border border-white/10 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 text-[9px] uppercase font-bold mb-1">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" /> Path Diagnostics
          </span>
          <span className="text-cyan-400 font-bold">{result.executionTimeMs}ms</span>
        </div>
        <div className="text-base font-bold text-slate-200 flex items-center gap-2">
          <span>{result.pathCount} {result.pathCount === 1 ? 'Path' : 'Paths'}</span>
        </div>
        <div className="text-[9px] text-slate-400 mt-1 flex justify-between uppercase">
          <span>Precision Delta:</span>
          <span className="text-cyan-400 font-bold">&lt; {result.precisionDelta}</span>
        </div>
      </div>

      {/* Efficiency Bar */}
      <div className="col-span-2 lg:col-span-4 bg-[#080808] border border-white/10 p-2 flex flex-col gap-1 text-[9px] uppercase font-mono">
        <div className="flex justify-between text-slate-400 font-bold">
          <span className="text-cyan-400">STATUS: AGGRESSIVE_MINIFICATION_ACTIVE</span>
          <span className="text-green-400 font-bold">EFFICIENCY_GAIN: {result.percentageSaved}%</span>
        </div>
        <div className="w-full bg-zinc-900 h-1.5 border border-white/5 overflow-hidden">
          <div
            className="bg-cyan-500 h-full transition-all duration-300 shadow-[0_0_8px_#06b6d4]"
            style={{ width: `${Math.max(1, result.percentageSaved)}%` }}
          />
        </div>
      </div>

    </div>
  );
};
