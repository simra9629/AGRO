import { createServerFn } from "@tanstack/react-start";
import OpenAI from "openai";
import { z } from "zod";

const groq = new OpenAI({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(8000),
});

const ChatInput = z.object({
  messages: z.array(MessageSchema).min(1).max(40),
  lang: z.string().default("en"),
});

function systemPrompt(lang: string) {
  if (lang === "hi") {
    return `
आप AGRO हैं — एक विशेषज्ञ कृषि सहायक।
किसानों को सरल और व्यावहारिक सलाह दें।
उत्तर छोटे और स्पष्ट रखें।
`;
  }

  return `
You are AGRO — an expert agricultural assistant.
Help farmers with crops, irrigation,
fertilizers, pests and diseases.
Keep answers concise and practical.
`;
}

export const agroChat = createServerFn({
  method: "POST",
})
  .inputValidator((data: unknown) =>
    ChatInput.parse(data)
  )
  .handler(async ({ data }) => {
    try {
      const completion =
        await groq.chat.completions.create({
          model: "openai/gpt-oss-120b",

          messages: [
            {
              role: "system",
              content: systemPrompt(data.lang),
            },

            ...data.messages,
          ],
        });

      return {
        reply:
          completion.choices[0]?.message?.content ||
          "No response",
      };
    } catch (err) {
      console.error(
        "Groq Chat Error:",
        err instanceof Error ? err.message : err
      );

      return {
        reply: "AI service unavailable right now.",
      };
    }
  });

// FIX: schema now matches what weather.tsx sends (lat/lon/weatherSummary)
// and the return key is "tips" to match the destructure in weather.tsx
const WeatherInput = z.object({
  lat: z.number(),
  lon: z.number(),
  weatherSummary: z.string(),
  lang: z.string().default("en"),
});

export const agroWeatherInsight = createServerFn({
  method: "POST",
})
  .inputValidator((data: unknown) =>
    WeatherInput.parse(data)
  )
  .handler(async ({ data }) => {
    const fallback = { tips: [] as string[] };
    try {
      const prompt =
        data.lang === "hi"
          ? `
आप एक कृषि मौसम विशेषज्ञ हैं।

नीचे दिए गए मौसम सारांश के आधार पर किसानों के लिए 3 व्यावहारिक सुझाव दें।

मौसम: ${data.weatherSummary}
स्थान: अक्षांश ${data.lat.toFixed(2)}, देशांतर ${data.lon.toFixed(2)}

केवल JSON में उत्तर दें:
{ "tips": ["सुझाव 1", "सुझाव 2", "सुझाव 3"] }
`
          : `
You are an agricultural weather expert.

Based on the weather summary below, give 3 concise, practical farming tips.

Weather: ${data.weatherSummary}
Location: lat ${data.lat.toFixed(2)}, lon ${data.lon.toFixed(2)}

Return ONLY valid JSON:
{ "tips": ["tip 1", "tip 2", "tip 3"] }
`;

      const completion =
        await groq.chat.completions.create({
          model: "openai/gpt-oss-120b",

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],

          temperature: 0.3,
        });

      const raw =
        completion.choices[0]?.message?.content ||
        "{}";

      const cleaned = raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      try {
        const parsed = JSON.parse(cleaned);
        return {
          tips: Array.isArray(parsed.tips) ? parsed.tips : [],
        };
      } catch {
        return fallback;
      }
    } catch (err) {
      console.error(
        "Weather Insight Error:",
        err instanceof Error ? err.message : err
      );

      return fallback;
    }
  });

const ScanInput = z.object({
  imageBase64: z.string(),
  mime: z.string(),
  note: z.string().optional(),
  hint: z.string().optional(),
  lang: z.string().default("en"),
});

export const agroScan = createServerFn({
  method: "POST",
})
  .inputValidator((data: unknown) =>
    ScanInput.parse(data)
  )
  .handler(async ({ data }) => {
    try {
      const cleaned = data.imageBase64.replace(
        /^data:image\/\w+;base64,/,
        ""
      );

      // Include the MobileNet hint in the Plant.id request
      // so the API can use it as a disambiguation signal
      const plantIdBody: Record<string, unknown> = {
        images: [cleaned],

        modifiers: [
          "crops_fast",
          "similar_images",
        ],

        disease_details: [
          "description",
          "treatment",
          "classification",
          "common_names",
          "cause",
        ],

        language: "en",
      };

      if (data.hint) {
        plantIdBody.plant_details = ["common_names"];
        // Pass the hint as extra context in the custom id field
        plantIdBody.custom_id = data.hint;
      }

      const response = await fetch(
        "https://api.plant.id/v2/health_assessment",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            "Api-Key":
              import.meta.env.VITE_PLANT_ID_API_KEY,
          },

          body: JSON.stringify(plantIdBody),
        }
      );

      const result = await response.json();

      const suggestion =
        result?.health_assessment?.diseases?.[0];

      const responseData = {
        crop:
          result?.crop?.name ||
          suggestion?.name ||
          "Plant",

        condition:
          suggestion?.name || "Unknown",

        confidence: Math.round(
          (suggestion?.probability || 0) * 100
        ),

        symptoms: suggestion?.disease_details
          ?.description
          ? [suggestion.disease_details.description]
          : [],

        causes: suggestion?.disease_details?.cause
          ? [suggestion.disease_details.cause]
          : [],

        treatment:
          suggestion?.disease_details?.treatment
            ?.chemical || [],

        prevention:
          suggestion?.disease_details?.treatment
            ?.prevention || [],
      };

      // Return English directly
      if (data.lang === "en") {
        return responseData;
      }

      // Translate with Groq
      const translationPrompt = `
Translate this agricultural diagnosis JSON into ${data.lang}.

Keep the JSON structure EXACTLY the same.

Return ONLY valid JSON.

JSON:
${JSON.stringify(responseData)}
`;

      const translation =
        await groq.chat.completions.create({
          model: "openai/gpt-oss-120b",

          messages: [
            {
              role: "user",
              content: translationPrompt,
            },
          ],

          temperature: 0.2,
        });

      const translated =
        translation.choices[0]?.message?.content ||
        "{}";

      const cleanedTranslation = translated
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      try {
        return JSON.parse(cleanedTranslation);
      } catch {
        return responseData;
      }
    } catch (err) {
      console.error(
        "Plant.id Error:",
        err instanceof Error ? err.message : err
      );

      return {
        crop: "Error",
        condition: "Plant analysis failed",
        confidence: 0,
        symptoms: [],
        causes: [],
        treatment: [],
        prevention: [],
      };
    }
  });
