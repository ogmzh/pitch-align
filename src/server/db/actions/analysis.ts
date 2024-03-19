import { desc, eq } from "drizzle-orm";
import { db } from "..";
import {
  CreatePitch,
  pitches,
  theses,
  thesisPitchMatches,
  users,
} from "@/server/db/schema";
import {
  AnalyzePitchResponse,
  PitchAnalysis,
  ThesisAnalysis,
  ThesisMatch,
} from "@/shared/types";
import { getThesesForUser } from "./thesis";
import { createPitch } from "./pitch";

type CreatePitchAnalysisRequest = {
  pitch: CreatePitch;
  analysis: AnalyzePitchResponse;
};

export const createPitchAnalysis = async (
  pitchAnalysisRequest: CreatePitchAnalysisRequest
) => {
  const { pitch, analysis } = pitchAnalysisRequest;
  await db.transaction(async (tx) => {
    const theses = await getThesesForUser(pitch.userId);
    if (theses && theses.length) {
      const newPitch = await createPitch(pitch);
      theses.forEach(async (thesis) => {
        const matchingThesis: ThesisMatch | undefined =
          analysis.response.theses.find(
            (response) => response.thesis.id === thesis.id
          );
        if (matchingThesis) {
          await tx.insert(thesisPitchMatches).values({
            thesisId: thesis.id,
            reason: matchingThesis.reason,
            matchPercentage: matchingThesis.matchPercentage.toString(),
            pitchId: newPitch.id!,
          });
        }
      });
    }
  });
};

export const getPitchAnalysis = async (
  pitchId: string
): Promise<PitchAnalysis | null> => {
  const results = await db
    .select()
    .from(pitches)
    .rightJoin(thesisPitchMatches, eq(pitches.id, thesisPitchMatches.pitchId))
    .leftJoin(theses, eq(theses.id, thesisPitchMatches.thesisId))
    .where(eq(pitches.id, pitchId));

  if (!results || !results.length) {
    return null;
  }

  const pitchAnalysis: PitchAnalysis = {
    pitch: {
      id: results?.[0]?.pitch?.id ?? "",
      content: results?.[0]?.pitch?.content ?? "",
      name: results?.[0]?.pitch?.name ?? "",
    },
    thesisMatches: results.map((result) => ({
      matchPercentage: result.thesis_pitch_match?.matchPercentage
        ? Number(result.thesis_pitch_match?.matchPercentage)
        : 0,
      reason: result.thesis_pitch_match?.reason ?? "",
      thesis: {
        id: result.thesis?.id ?? "",
        name: result.thesis?.name ?? "",
      },
    })),
  };
  return pitchAnalysis;
};

export const getThesisAnalysis = async (
  thesisId: string
): Promise<ThesisAnalysis | null> => {
  const results = await db
    .select()
    .from(theses)
    .rightJoin(thesisPitchMatches, eq(theses.id, thesisPitchMatches.thesisId))
    .leftJoin(pitches, eq(pitches.id, thesisPitchMatches.pitchId))
    .where(eq(theses.id, thesisId));

  if (!results || !results.length) {
    return null;
  }

  const thesisAnalysis: ThesisAnalysis = {
    thesis: {
      id: results?.[0]?.thesis?.id ?? "",
      name: results?.[0]?.thesis?.name ?? "",
    },
    pitchMatches: results.map((result) => ({
      pitch: {
        id: result.pitch?.id ?? "",
        name: result.pitch?.name ?? "",
        content: result.pitch?.content ?? "",
      },
      matchPercentage: result.thesis_pitch_match?.matchPercentage
        ? Number(result.thesis_pitch_match?.matchPercentage)
        : 0,
      reason: result.thesis_pitch_match?.reason ?? "",
    })),
  };
  return thesisAnalysis;
};
