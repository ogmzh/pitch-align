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

export type GPTModel =
  | "gpt-4-0125-preview"
  | "gpt-4-turbo-preview"
  | "gpt-4-1106-preview"
  | "gpt-4-vision-preview"
  | "gpt-4"
  | "gpt-4-0314"
  | "gpt-4-0613"
  | "gpt-4-32k"
  | "gpt-4-32k-0314"
  | "gpt-4-32k-0613"
  | "gpt-3.5-turbo"
  | "gpt-3.5-turbo-16k"
  | "gpt-3.5-turbo-0301"
  | "gpt-3.5-turbo-0613"
  | "gpt-3.5-turbo-1106"
  | "gpt-3.5-turbo-0125"
  | "gpt-3.5-turbo-16k-0613";
