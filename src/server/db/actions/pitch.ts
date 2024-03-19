import {
  CreatePitch,
  SelectPitch,
  pitches,
  theses,
  thesisPitchMatches,
} from "@/server/db/schema";
import { db } from "..";
import { eq } from "drizzle-orm";

export const createPitch = async (
  createPitch: CreatePitch
): Promise<CreatePitch> => {
  const result = await db
    .insert(pitches)
    .values({
      userId: createPitch.userId,
      content: createPitch.content,
      name: createPitch.name,
    })
    .returning();
  return result[0];
};

export const deletePitch = async (pitchId: string) => {
  await db.delete(pitches).where(eq(pitches.id, pitchId));
};

export const getPitchesForUser = async (
  userId: string
): Promise<SelectPitch[]> => {
  return await db
    .select({
      content: pitches.content,
      createdAt: pitches.createdAt,
      id: pitches.id,
      name: pitches.name,
      userId: pitches.userId,
    })
    .from(pitches)
    .where(eq(pitches.userId, userId));
};
