"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { PitchAnalysis, ThesisMatch } from "@/shared/types";

type ThesisAnalysisProps = {
  selectLastPitchAnalysis: (userId: string) => Promise<PitchAnalysis>;
};

const CustomTooltip = ({ data }: { data: ThesisMatch | null }) => {
  if (!data) return null;
  return (
    <div className="bg-background text-foreground max-w-[600px] rounded-md border-2 p-4 shadow-lg">
      <div className="flex w-full justify-between">
        <p className="text-lg font-bold">{data.thesis.name}</p>
        <p className="text-lg">{data.matchPercentage}% match</p>
      </div>
      <p>{data.reason}</p>
    </div>
  );
};

export const PitchAnalysisComponent = ({
  selectLastPitchAnalysis,
}: ThesisAnalysisProps) => {
  const [analysis, setAnalysis] = useState<PitchAnalysis | null>(null);

  useEffect(() => {
    selectLastPitchAnalysis(
      localStorage.getItem("pitch-align-uuid") ?? ""
    ).then((data) => setAnalysis(data));
  }, [selectLastPitchAnalysis]);

  return (
    <div className="flex w-[1200px] flex-1 flex-col items-center justify-center gap-5">
      {analysis && (
        <>
          <h3 className="text-3xl font-bold">Pitch Analysis</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={analysis.thesisMatches}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="thesis.name" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                content={({ payload }) => (
                  <CustomTooltip data={payload?.[0]?.payload} />
                )}
              />
              <Bar dataKey="matchPercentage" fill="#e11d48" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex w-full">
            <BarChart />
          </div>
          <div className="flex max-w-[800px] flex-col rounded-md border-2 p-6">
            {analysis?.pitch.name}
            <br />
            {analysis?.pitch.content}
          </div>
        </>
      )}
    </div>
  );
};
