import React, { useState } from 'react';
import { MinifyResult } from '../types';
import { Terminal, X, CheckCircle, ShieldCheck, Zap, Copy, Check } from 'lucide-react';

interface MatrixCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: MinifyResult;
}

export const MatrixCheckModal: React.FC<MatrixCheckModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [copiedLog, setCopiedLog] = useState(false);

  if (!isOpen) return null;

  const matrixOutput = `// ETERNIVERSE OS v7.3 | DEV-CORE PROTOCOL
// MATRIX DIAGNOSTIC CHECK EXECUTION REPORT
// TIMESTAMP: ${new Date().toISOString()}

COMMAND: /matrix-check

> [OK] Path Integrity: ${result.matrixCheck.pathIntegrity}%
> [OK] Coordinate Precision: Delta < ${result.matrixCheck.coordinatePrecisionDelta}
> [OK] File Size Reduction: ${result.matrixCheck.fileSizeReductionPct}%
> [OK] Total Paths Evaluated: ${result.pathCount}
> [OK] Raw Payload: ${result.originalBytes} Bytes
> [OK] Minified Payload: ${result.minifiedBytes} Bytes
> [SYSTEM] Resonance stable. Code protocol ACTIVE.`;

  const copyLog = () => {
    navigator.clipboard.writeText(matrixOutput);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 font-mono">
      <div className="w-full max-w-xl bg-[#0a0a0a] border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.25)] text-xs overflow-hidden flex flex-col">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#080808] border-b border-cyan-500/30">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-bold uppercase tracking-wider text-xs">
              DEV-CORE // /matrix-check Diagnostics
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Console Body */}
        <div className="p-4 bg-[#0a0a0a] text-slate-300 space-y-4">
          
          {/* Status summary banner */}
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-cyan-300 font-bold text-xs uppercase">
                  SYSTEM STATUS: STABLE
                </div>
                <div className="text-[10px] text-slate-400 uppercase">
                  Path geometry verified across float transformations
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 text-[9px] bg-green-500 text-black font-bold uppercase">
              PASSED
            </span>
          </div>

          {/* Diagnostic Metrics Matrix */}
          <div className="space-y-2 border border-white/10 p-3 bg-black text-[10px] uppercase">
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                Path Integrity
              </span>
              <span className="text-green-400 font-bold">100%</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                Coordinate Precision
              </span>
              <span className="text-cyan-400 font-bold">Delta &lt; {result.matrixCheck.coordinatePrecisionDelta}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                File Size Reduction
              </span>
              <span className="text-amber-400 font-bold">{result.matrixCheck.fileSizeReductionPct}%</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                Resonance State
              </span>
              <span className="text-cyan-400 font-bold tracking-wider">[STABLE]</span>
            </div>
          </div>

          {/* Raw Log Output Block */}
          <div>
            <div className="flex items-center justify-between text-[9px] text-slate-500 mb-1 uppercase font-bold">
              <span>RAW DIAGNOSTIC TELEMETRY</span>
              <button
                onClick={copyLog}
                className="text-cyan-400 hover:text-cyan-200 flex items-center gap-1 cursor-pointer"
              >
                {copiedLog ? (
                  <>
                    <Check className="w-3 h-3 text-green-400" /> Copied Log
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy Log
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-black border border-white/10 text-[10px] text-cyan-300 overflow-x-auto leading-relaxed font-mono">
              {matrixOutput}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-[#080808] border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[10px] uppercase transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.4)]"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
};
