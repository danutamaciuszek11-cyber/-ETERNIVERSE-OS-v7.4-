/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { MinifyOptions, SampleIcon } from './types';
import { optimizeIconSet, DEFAULT_OPTIONS } from './utils/svgMinifier';
import { SAMPLE_ICONS } from './data/sampleIcons';
import { Header } from './components/Header';
import { OptimizationControls } from './components/OptimizationControls';
import { SvgInputEditor } from './components/SvgInputEditor';
import { VisualDiffViewer } from './components/VisualDiffViewer';
import { MinificationStats } from './components/MinificationStats';
import { PathDetailsTable } from './components/PathDetailsTable';
import { MatrixCheckModal } from './components/MatrixCheckModal';

export default function App() {
  // Initial state uses the Vector Display Unit from the user prompt
  const [svgInput, setSvgInput] = useState<string>(SAMPLE_ICONS[0].svg);
  const [activeSampleId, setActiveSampleId] = useState<string>(SAMPLE_ICONS[0].id);
  const [options, setOptions] = useState<MinifyOptions>(DEFAULT_OPTIONS);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState<boolean>(false);

  // Compute optimized SVG and metrics reactively
  const minificationResult = useMemo(() => {
    return optimizeIconSet(svgInput, options);
  }, [svgInput, options]);

  const handleSelectSample = (sample: SampleIcon) => {
    setSvgInput(sample.svg);
    setActiveSampleId(sample.id);
  };

  const handleResetOptions = () => {
    setOptions(DEFAULT_OPTIONS);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-mono selection:bg-cyan-500 selection:text-black flex flex-col">
      
      {/* HUD Header */}
      <Header
        onOpenMatrixCheck={() => setIsMatrixModalOpen(true)}
        statusText="OPTIMIZING_ASSETS"
        isMatrixOk={true}
      />

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* Top Summary Stats Bar */}
        <section className="space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#06b6d4]"></span>
              Real-Time Vector Payload Diagnostics
            </span>
            <span className="text-slate-500 text-[10px] uppercase">
              Engine: <strong className="text-slate-300">SVG-MINIFIER-CORE v1.1</strong>
            </span>
          </div>
          <MinificationStats result={minificationResult} />
        </section>

        {/* Primary 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (Controls & Input) */}
          <div className="lg:col-span-6 space-y-6 flex flex-col">
            
            {/* Input Editor */}
            <div className="flex-1">
              <SvgInputEditor
                svgInput={svgInput}
                onChange={(val) => {
                  setSvgInput(val);
                  setActiveSampleId('');
                }}
                onSelectSample={handleSelectSample}
                activeSampleId={activeSampleId}
              />
            </div>

            {/* Config Controls */}
            <OptimizationControls
              options={options}
              onChange={setOptions}
              onReset={handleResetOptions}
            />
          </div>

          {/* Right Column (Vector Display Unit Visualizer) */}
          <div className="lg:col-span-6 space-y-6 h-full flex flex-col justify-between">
            <VisualDiffViewer result={minificationResult} />
          </div>

        </div>

        {/* Detailed Path Extraction Table */}
        <section className="pt-2">
          <PathDetailsTable paths={minificationResult.pathDetails} />
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-4 px-6 text-center font-mono text-[10px] text-slate-500 uppercase">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            ETERNIVERSE OS v7.3 | DEV-CORE PROTOCOL: <span className="text-cyan-400 font-bold">ACTIVE</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Precision: Delta &lt; 0.001</span>
            <span>•</span>
            <span>Path Integrity: 100%</span>
          </div>
        </div>
      </footer>

      {/* Matrix Diagnostics Modal */}
      <MatrixCheckModal
        isOpen={isMatrixModalOpen}
        onClose={() => setIsMatrixModalOpen(false)}
        result={minificationResult}
      />

    </div>
  );
}
