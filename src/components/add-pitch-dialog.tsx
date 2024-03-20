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
import { GPTModel } from "@/shared/types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

type AddPitchDialogProps = {
  submitPitch: (pitch: CreatePitch, model: GPTModel) => Promise<void>;
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
  const [model, setModel] = useState<GPTModel>("gpt-4");

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
      await submitPitch(
        {
          content: text,
          userId: localStorage.getItem("pitch-align-uuid") ?? "",
          name: pitchName,
        },
        model
      );
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
          <Select
            value={model}
            onValueChange={(value) => setModel(value as GPTModel)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Models</SelectLabel>
                <SelectItem value="gpt-3.5-turbo">GPT 3.5 Turbo</SelectItem>
                <SelectItem value="gpt-4">GPT 4</SelectItem>
                <SelectItem value="gpt-4-turbo-preview">
                  GPT 4 Turbo Preview
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
