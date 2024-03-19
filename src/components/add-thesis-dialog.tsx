"use client";
import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { v4 as uuidv4 } from "uuid";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateThesis } from "@/server/db/schema";
import { Textarea } from "./ui/textarea";

const colors = [
  "#FAFAFA",
  "#000000",
  "#FF0000",
  "#FFA500",
  "#FFFF00",
  "#008000",
  "#0000FF",
  "#800080",
];

type AddThesisDialogProps = {
  createThesis: (thesis: CreateThesis) => Promise<void>;
};

export function AddThesisDialog({ createThesis }: AddThesisDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState(colors[0]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setColor(colors[0]);
      setName("");
      setDescription("");
      setTag("");
    }
  }, [isOpen]);

  useEffect(() => {
    let storedUUID = localStorage.getItem("pitch-align-uuid");

    if (!storedUUID) {
      const newUUID = uuidv4();
      localStorage.setItem("pitch-align-uuid", newUUID);
    }
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await createThesis({
        color,
        name,
        description,
        tag,
        userId: localStorage.getItem("pitch-align-uuid") ?? "",
      });
    } catch (e) {
      console.warn("Something went wrong.....", e);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button size="lg" className="min-w-[160px]">Add a Thesis</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a thesis</DialogTitle>
          <DialogDescription>
            Define the name, description and a tag
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="thesis-name" className="text-right">
              Name
            </Label>
            <Input
              id="thesis-name"
              placeholder="Ocean Cleanup"
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="I'd want to save some oceans for my kids when they grow up"
              className="col-span-3"
              rows={5}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="thesis-tag" className="text-right">
              Tag
            </Label>
            <Input
              id="thesis-tag"
              placeholder="Something short, like `ocean`"
              className="col-span-3"
              onChange={(e) => setTag(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
