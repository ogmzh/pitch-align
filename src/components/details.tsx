"use client";
import { useEffect, useState } from "react";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  PitchAnalysis,
  PitchMatch,
  ThesisAnalysis,
  ThesisMatch,
} from "@/shared/types";
import { SelectPitch, SelectThesis } from "@/server/db/schema";
import { ListPitches } from "./list-pitches";
import { ListTheses } from "./list-theses";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";

type Props = {
  getPitches: (thesisId: string) => Promise<SelectPitch[]>;
  deletePitch: (pitchId: string) => Promise<void>;
  getTheses: (userId: string) => Promise<SelectThesis[]>;
  deleteThesis: (thesisId: string) => Promise<void>;
  getThesisAnalysis: (thesisId: string) => Promise<ThesisAnalysis | null>;
  getPitchAnalysis: (pitchId: string) => Promise<PitchAnalysis | null>;
  userHasTheses: (userId: string) => Promise<boolean>;
};

export const Details = ({
  deletePitch,
  deleteThesis,
  getPitches,
  getTheses,
  getThesisAnalysis,
  getPitchAnalysis,
  userHasTheses,
}: Props) => {
  const [tab, setTab] = useState("theses");

  const [selectedThesis, setSelectedThesis] = useState<SelectThesis | null>(
    null
  );
  const [selectedPitch, setSelectedPitch] = useState<SelectPitch | null>(null);
  const [thesisAnalysis, setThesisAnalysis] = useState<ThesisAnalysis | null>(
    null
  );
  const [pitchAnalysis, setPitchAnalysis] = useState<PitchAnalysis | null>(
    null
  );

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    userHasTheses(localStorage.getItem("pitch-align-uuid") ?? "").then(
      (value) => setDisabled(!value)
    );
  }, [userHasTheses]);

  useEffect(() => {
    if (selectedPitch) {
      getPitchAnalysis(selectedPitch.id).then((data) => setPitchAnalysis(data));
    }
  }, [selectedPitch, getPitchAnalysis]);

  useEffect(() => {
    if (selectedThesis) {
      getThesisAnalysis(selectedThesis.id).then((data) =>
        setThesisAnalysis(data)
      );
    }
  }, [getThesisAnalysis, selectedThesis]);

  return (
    <div className="flex w-[80%] flex-col items-center gap-16">
      <div className="flex flex-col items-center justify-center md:flex-row md:items-start">
        <div className="flex p-4">
          {disabled ? (
            <div className="text-muted-foreground w-[700px] text-center text-2xl">
              Please create your first thesis before matching with any
              Investment Pitches.
            </div>
          ) : (
            <Tabs defaultValue="theses" className="w-[400px]" value={tab}>
              <TabsList className="grid  grid-cols-2">
                <TabsTrigger value="theses" onClick={() => setTab("theses")}>
                  Theses
                </TabsTrigger>
                <TabsTrigger value="pitches" onClick={() => setTab("pitches")}>
                  Pitches
                </TabsTrigger>
              </TabsList>
              <TabsContent value="theses">
                <ListTheses
                  getTheses={getTheses}
                  deleteThesis={deleteThesis}
                  selectedThesis={selectedThesis}
                  setSelectedThesis={setSelectedThesis}
                  selectedPitch={selectedPitch}
                />
              </TabsContent>
              <TabsContent value="pitches">
                <ListPitches
                  getPitches={getPitches}
                  deletePitch={deletePitch}
                  selectedPitch={selectedPitch}
                  setSelectedPitch={setSelectedPitch}
                  selectedThesis={selectedThesis}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
        <div className="flex w-full p-4">
          {tab === "theses" ? (
            <div className={`flex ${!disabled ? "min-w-[500px]" : ""}`}>
              {selectedThesis && (
                <div className="flex max-w-[800px] flex-1 flex-col items-center gap-4">
                  <div className="text-2xl font-semibold">
                    {selectedThesis.name}
                  </div>
                  <div className="text-foreground text-justify text-lg whitespace-pre-wrap">
                    {selectedThesis.description}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex min-w-[500px]">
              {selectedPitch && (
                <div className="flex max-w-[800px] flex-1 flex-col items-center gap-4">
                  <div className="text-2xl font-semibold">
                    {selectedPitch.name}
                  </div>
                  <ScrollArea>
                    <div className="text-foreground max-h-[600px] px-4 text-lg text-justify whitespace-pre-wrap">
                      {selectedPitch.content}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mb-[50px] flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center gap-5">
        {tab === "theses" && thesisAnalysis && (
          <>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={thesisAnalysis.pitchMatches}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="pitch.name" />
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
          </>
        )}
        {tab === "pitches" && pitchAnalysis && (
          <>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={pitchAnalysis.thesisMatches}
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
          </>
        )}
      </div>
    </div>
  );
};

const CustomTooltip = ({ data }: { data: PitchMatch | ThesisMatch | null }) => {
  if (!data) return null;
  const isPitch = Boolean(data) && Object.hasOwn(data, "pitch");
  return (
    <div className="bg-background text-foreground max-w-[600px] rounded-md border-2 p-4 shadow-lg">
      <div className="flex w-full justify-between">
        <p className="text-lg font-bold">
          {data && isPitch
            ? (data as PitchMatch).pitch.name
            : (data as ThesisMatch).thesis?.name}
        </p>
        <p className="text-lg">{data.matchPercentage}% match</p>
      </div>
      <p>{data.reason}</p>
    </div>
  );
};
