import { useEffect, useState } from "react";

import { SelectPitch, SelectThesis } from "@/server/db/schema";
import { Button } from "./ui/button";

type ListPitchesProps = {
  getPitches: (userId: string) => Promise<SelectPitch[]>;
  deletePitch: (pitchId: string) => Promise<void>;
  selectedPitch: SelectPitch | null;
  setSelectedPitch: (pitch: SelectPitch | null) => void;
  selectedThesis: SelectThesis | null;
};

export const ListPitches = ({
  getPitches,
  deletePitch,
  setSelectedPitch,
  selectedPitch,
  selectedThesis,
}: ListPitchesProps) => {
  const [pitches, setPitches] = useState<SelectPitch[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("pitch-align-uuid");
    if (userId) {
      getPitches(userId).then((data) => {
        setPitches(data);
        setSelectedPitch(data[0]);
      });
    }
  }, [getPitches, setSelectedPitch]);

  return (
    <div className="flex flex-col gap-2">
      {pitches.map((pitch) => (
        <Button
          onClick={() => setSelectedPitch(pitch)}
          variant={selectedPitch?.id === pitch.id ? "default" : "outline"}
          className={`hover:border-primary text-md flex justify-start py-8 font-semibold`}
          key={pitch.id}>
          {pitch.name}
        </Button>
      ))}
    </div>
  );
};
