export interface MinifyOptions {
  precision: number;
  removeSpaces: boolean;
  tightenNegatives: boolean;
  convertRelative: boolean;
  optimizeCommands: boolean;
  removeComments: boolean;
  removeMetadata: boolean;
  removeDefaultAttrs: boolean;
  collapseWhitespace: boolean;
  removeLeadingZeros: boolean;
}

export interface SavedPreset {
  id: string;
  name: string;
  options: MinifyOptions;
  createdAt: number;
}

export interface PathDetail {
  id: number;
  originalD: string;
  minifiedD: string;
  originalBytes: number;
  minifiedBytes: number;
  bytesSaved: number;
  reductionPercentage: number;
}

export interface MinifyResult {
  originalSvg: string;
  minifiedSvg: string;
  originalBytes: number;
  minifiedBytes: number;
  bytesSaved: number;
  percentageSaved: number;
  pathCount: number;
  precisionDelta: number;
  executionTimeMs: number;
  pathDetails: PathDetail[];
  matrixCheck: {
    pathIntegrity: number; // 100%
    coordinatePrecisionDelta: number;
    fileSizeReductionPct: number;
    status: 'OPTIMAL' | 'STABLE' | 'WARNING';
  };
}

export interface SampleIcon {
  id: string;
  name: string;
  category: string;
  svg: string;
  description: string;
}
