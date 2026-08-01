import React, { useState } from 'react';
import { PathDetail } from '../types';
import { formatBytes } from '../utils/svgMinifier';
import { Copy, Check, ChevronDown, ChevronUp, FileCode } from 'lucide-react';

interface PathDetailsTableProps {
  paths: PathDetail[];
}

export const PathDetailsTable: React.FC<PathDetailsTableProps> = ({ paths }) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (paths.length === 0) return null;

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/10 font-mono text-xs shadow-md overflow-hidden">
      
      {/* Header Bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2.5 bg-[#080808] border-b border-white/10 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-400 font-bold uppercase tracking-wider text-xs">
            Extracted Path Inspection ({paths.length})
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold">
          <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Table Content */}
      {isExpanded && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0d0d0d] border-b border-white/10 text-[9px] text-slate-400 uppercase tracking-wider font-bold">
                <th className="p-3">#</th>
                <th className="p-3">Original Vector Path Data</th>
                <th className="p-3">Minified Path Data</th>
                <th className="p-3 text-right">Raw</th>
                <th className="p-3 text-right">Minified</th>
                <th className="p-3 text-right">Saved</th>
                <th className="p-3 text-center">Copy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[10px]">
              {paths.map((path) => (
                <tr key={path.id} className="hover:bg-cyan-500/5 transition-colors">
                  <td className="p-3 text-cyan-400 font-bold">#{path.id}</td>
                  <td className="p-3 max-w-[180px] sm:max-w-[240px] truncate text-slate-400 font-mono" title={path.originalD}>
                    {path.originalD}
                  </td>
                  <td className="p-3 max-w-[180px] sm:max-w-[240px] truncate text-cyan-300 font-semibold font-mono" title={path.minifiedD}>
                    {path.minifiedD}
                  </td>
                  <td className="p-3 text-right text-slate-400">
                    {formatBytes(path.originalBytes)}
                  </td>
                  <td className="p-3 text-right text-cyan-400 font-bold">
                    {formatBytes(path.minifiedBytes)}
                  </td>
                  <td className="p-3 text-right text-green-400 font-bold">
                    -{path.reductionPercentage}%
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleCopy(path.id, path.minifiedD)}
                      className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition-colors cursor-pointer inline-flex items-center"
                      title="Copy minified path d string"
                    >
                      {copiedId === path.id ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
