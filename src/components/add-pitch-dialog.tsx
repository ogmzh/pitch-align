"use client";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreatePitch } from "@/server/db/schema";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

type AddPitchDialogProps = {
  submitPitch: (pitch: CreatePitch) => Promise<void>;
  userHasTheses: (userId: string) => Promise<boolean>;
};

export function AddPitchDialog({
  submitPitch,
  userHasTheses,
}: AddPitchDialogProps) {
  // todo: tabs for pdf upload vs text paste
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [pitchName, setPitchName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setText("");
    }
  }, [isOpen]);

  useEffect(() => {
    userHasTheses(localStorage.getItem("pitch-align-uuid") ?? "").then(
      (response) => setDisabled(!response)
    );
  }, [userHasTheses]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await submitPitch({
        content: text,
        userId: localStorage.getItem("pitch-align-uuid") ?? "",
        name: pitchName,
      });
    } catch (e) {
      console.warn("Something bad happened...", e);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild disabled={disabled}>
        <Button size="lg" className="min-w-[160px]">
          Add a Pitch
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-w-[925px] flex-1 flex-col">
        <DialogHeader>
          <DialogTitle>Create a Pitch</DialogTitle>
          <DialogDescription>
            Paste in as much text as you&apos;d like
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="pitch-name">Pitch Name</Label>
        <Input
          id="pitch-name"
          placeholder="Ocean Cleanup"
          className="col-span-3"
          onChange={(e) => setPitchName(e.target.value)}
          disabled={isLoading}
        />
        <Textarea
          disabled={isLoading}
          rows={20}
          placeholder="Clean the oceans! Save the bees! Something!"
          onChange={(e) => setText(e.target.value)}
        />
        <DialogFooter>
          <Button
            size="lg"
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}>
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
