import React from 'react';
import { Cpu, Terminal, Zap, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenMatrixCheck: () => void;
  statusText?: string;
  isMatrixOk?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMatrixCheck,
  statusText = 'OPTIMIZING_ASSETS',
  isMatrixOk = true,
}) => {
  return (
    <header className="h-14 border-b border-cyan-500/30 flex items-center justify-between px-4 sm:px-6 bg-black font-mono sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4] animate-pulse"></div>
        <h1 className="text-xs tracking-[0.25em] sm:tracking-[0.3em] font-bold text-cyan-400 uppercase">
          ETERNIVERSE OS v7.3 // KAISA CORE
        </h1>
      </div>

      <div className="flex items-center gap-4 sm:gap-8 text-[10px] text-slate-500 uppercase">
        <span className="hidden md:inline-flex items-center gap-2">
          <span className="text-cyan-500 font-bold">PROTO:</span> DEV-CORE
        </span>
        <span className="hidden sm:inline-flex items-center gap-2">
          <span className="text-green-500 font-bold">STATUS:</span> {statusText}
        </span>

        {/* Matrix Check Button */}
        <button
          id="btn-matrix-check"
          onClick={onOpenMatrixCheck}
          className="flex items-center gap-2 px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[10px] transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.4)] uppercase"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>/matrix-check</span>
          {isMatrixOk && (
            <ShieldCheck className="w-3.5 h-3.5 ml-0.5" />
          )}
        </button>
      </div>
    </header>
  );
};
