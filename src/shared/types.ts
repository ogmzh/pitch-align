// TODO: refactor these to generics
export type ThesisMatch = {
  thesis: {
    id: string;
    name: string;
  };
  matchPercentage: number;
  reason: string;
};

export type PitchMatch = {
  pitch: {
    id: string;
    name: string;
    content: string;
  };
  matchPercentage: number;
  reason: string;
};

export type AnalyzePitchResponse = {
  response: {
    theses: ThesisMatch[];
  };
};

export type PitchAnalysis = {
  thesisMatches: ThesisMatch[];
  pitch: {
    id: string;
    name: string;
    content: string;
  };
};

export type ThesisAnalysis = {
  pitchMatches: PitchMatch[];
  thesis: {
    id: string;
    name: string;
  };
};
