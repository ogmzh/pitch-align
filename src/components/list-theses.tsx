"use client";
import { useEffect, useState } from "react";

import { SelectPitch, SelectThesis } from "@/server/db/schema";
import { Button } from "./ui/button";

type ListThesesProps = {
  getTheses: (userId: string) => Promise<SelectThesis[]>;
  deleteThesis: (thesisId: string) => Promise<void>;
  selectedThesis: SelectThesis | null;
  setSelectedThesis: (thesis: SelectThesis | null) => void;
  selectedPitch: SelectPitch | null;
};

export const ListTheses = ({
  getTheses,
  selectedThesis,
  setSelectedThesis,
}: ListThesesProps) => {
  const [theses, setTheses] = useState<SelectThesis[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("pitch-align-uuid");
    if (userId) {
      getTheses(userId).then((data) => {
        setTheses(data);
        setSelectedThesis(data[0]);
      });
    }
  }, [getTheses, setSelectedThesis]);

  return (
    <div className="flex w-full flex-col gap-2">
      {theses.map((thesis) => (
        <Button
          onClick={() => setSelectedThesis(thesis)}
          variant={selectedThesis?.id === thesis.id ? "default" : "outline"}
          className={`hover:border-primary text-md  justify-start whitespace-pre-wrap py-8 text-left font-semibold`}
          key={thesis.id}>
          {thesis.name}
        </Button>
      ))}
    </div>
  );
};
