import { revalidatePath } from "next/cache";

import { AddPitchDialog } from "@/components/add-pitch-dialog";
import { AddThesisDialog } from "@/components/add-thesis-dialog";
import { Details } from "@/components/details";
import { ThemeToggle } from "@/components/theme-toggle";
import { analyzePitch } from "@/server/assistant";
import {
  createPitchAnalysis,
  getPitchAnalysis,
  getThesisAnalysis,
} from "@/server/db/actions/analysis";
import { deletePitch, getPitchesForUser } from "@/server/db/actions/pitch";
import {
  createThesis,
  deleteThesis,
  getThesesForUser,
} from "@/server/db/actions/thesis";
import { createUser, userExists, userHasTheses } from "@/server/db/actions/user";
import { CreatePitch, CreateThesis } from "@/server/db/schema";

export default async function Home() {
  const createThesisAction = async (thesis: CreateThesis) => {
    "use server";

    const existingUser = await userExists(thesis.userId);
    if (!existingUser) {
      await createUser({ id: thesis.userId });
    }
    await createThesis(thesis, thesis.userId);
    revalidatePath("/");
  };

  const getThesesAction = async (userId: string) => {
    "use server";
    return await getThesesForUser(userId);
  };

  const deleteThesisAction = async (thesisId: string) => {
    "use server";
    await deleteThesis(thesisId);
    revalidatePath("/");
  };

  const getPitchesAction = async (userId: string) => {
    "use server";
    return await getPitchesForUser(userId);
  };

  const deletePitchAction = async (pitchId: string) => {
    "use server";
    await deletePitch(pitchId);
    revalidatePath("/");
  };

  const getThesesAnalysisAction = async (thesisId: string) => {
    "use server";
    return await getThesisAnalysis(thesisId);
  };

  const getPitchAnalysisAction = async (pitchId: string) => {
    "use server";
    return await getPitchAnalysis(pitchId);
  };

  const userHasThesesAction = async (userId: string) => {
    "use server";
    return await userHasTheses(userId);
  }

  const submitPitchAction = async (pitch: CreatePitch) => {
    "use server";
    const theses = await getThesesForUser(pitch.userId);
    if (!theses || !theses.length) {
      alert("No theses for this user");
      return;
    } else {
      const analysis = await analyzePitch(pitch, theses);
      if (analysis) {
        await createPitchAnalysis({
          pitch,
          analysis,
        });
        revalidatePath("/");
      } else {
        console.warn("we didn't get any pitch analysis response");
      }
    }
  };

  return (
    <main className="flex h-screen flex-col items-center gap-20">
      <div className="mt-10 flex w-full justify-end pr-20">
        <ThemeToggle />
      </div>
      <div className="flex w-full max-w-[800px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-4xl font-extrabold lg:text-5xl">Pitch Align</h1>
          <h3 className="text-center text-2xl font-semibold tracking-tight text-stone-500 dark:text-stone-300">
            Define Investment theses, upload pitch decks and match them against
            theses
          </h3>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-5 sm:flex-row">
        <AddThesisDialog createThesis={createThesisAction} />
        <AddPitchDialog submitPitch={submitPitchAction} userHasTheses={userHasThesesAction} />
      </div>
      <Details
        userHasTheses={userHasThesesAction}
        getTheses={getThesesAction}
        getPitches={getPitchesAction}
        deleteThesis={deleteThesisAction}
        deletePitch={deletePitchAction}
        getThesisAnalysis={getThesesAnalysisAction}
        getPitchAnalysis={getPitchAnalysisAction}
      />
    </main>
  );
}
