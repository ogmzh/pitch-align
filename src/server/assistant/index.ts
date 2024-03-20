import OpenAI from "openai";

import { CreatePitch, SelectThesis } from "@/server/db/schema";
import { AnalyzePitchResponse } from "@/shared/types";

const openai = new OpenAI();

export const analyzePitch = async (
  pitch: CreatePitch,
  theses: SelectThesis[]
): Promise<AnalyzePitchResponse | null> => {
  const prompt = {
    request: {
      pitch: {
        name: pitch.name,
        content: pitch.content,
      },
      theses: theses.map((thesis) => ({
        id: thesis.id,
        name: thesis.name,
        tag: thesis.tag,
        description: thesis.description,
      })),
    },
  };

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
        You are an assistant that will summarise an investment pitch and match it against a provided list of investment theses / themes.
        Use the investment theme name, description and tag properties to reason about the topic.
        Assign match_percentage value to the response object based on how relevant the topic is to the investment pitch. Range it from 0 - 100.
        The input will come in JSON format, and you will only output JSON formatted like:
        {
            "response": {
                "theses": [
                {
                    "thesis": {
                      "id": {thesisId},
                      "name": {thesisName},
                    },
                    "matchPercentage": {matchingPercentage},
                    "reason": {reasoningOutput}
                }
                ]
            }
        }
        Make sure to include all the theses in the response, regardless of their match_percentage value.
        `,
      },
      {
        role: "user",
        content: JSON.stringify(prompt),
      },
    ],
    model: "gpt-4-turbo-preview",
  });

  return completion.choices[0].message.content
    ? (JSON.parse(
        completion.choices[0].message.content
      ) as AnalyzePitchResponse)
    : null;
};
