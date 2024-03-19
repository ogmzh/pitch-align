import { eq } from "drizzle-orm";

import { theses } from "@/server/db/schema";
import type { CreateThesis, SelectThesis } from "@/server/db/schema";
import { db } from "..";

export const createThesis = async (thesis: CreateThesis, userId: string) => {
  await db.insert(theses).values({
    ...thesis,
    userId,
  });
};

export const getThesesForUser = async (
  userId: string
): Promise<SelectThesis[]> => {
  return await db.select().from(theses).where(eq(theses.userId, userId));
};

export const deleteThesis = async (thesisId: string): Promise<void> => {
  await db.delete(theses).where(eq(theses.id, thesisId));
};
