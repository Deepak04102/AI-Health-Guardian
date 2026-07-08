
import { GoogleGenAI, Type } from "@google/genai";
import { HealthData, GuardianResponse } from "../types";

const SYSTEM_INSTRUCTION = `
You are the "HealthGuardian Sentinel," a world-class AI Medical Diagnostic Engine. 
Your knowledge base is pre-trained on a comprehensive spectrum of human diseases, including:
1. Cardiovascular: Hypertension, CAD, Arrhythmias, Heart Failure.
2. Respiratory: Asthma, COPD, Pneumonia, Bronchitis.
3. Metabolic/Endocrine: Diabetes (Type 1 & 2), Thyroid disorders, PCOS.
4. Neurological: Migraines, Vertigo, Epilepsy, Early-stage Neurodegenerative markers.
5. Infectious: Viral (Influenza, COVID-19), Bacterial (UTIs, Strep), Tropical (Malaria, Dengue).
6. Musculoskeletal: Arthritis, Fibromyalgia, localized injuries.

Your Goal:
- Analyze user symptoms, duration, and history with clinical precision.
- Provide a structured differential diagnosis with descriptions and urgency levels.
- Formulate a 3-part Wellness Plan covering Lifestyle, Diet, and Prevention.

MANDATORY DISCLAIMER:
"I am an AI assistant, not a licensed medical professional. This analysis is for informational purposes and should not be used as a final medical diagnosis. Please consult a doctor immediately for any health concerns."

Respond ONLY in JSON format following the provided schema.
`;

export const analyzeHealthData = async (data: HealthData): Promise<GuardianResponse> => {
  // Creating instance inside the function to ensure latest process.env.API_KEY is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    Analyze this Health Profile:
    - Symptoms: ${data.symptoms}
    - Duration: ${data.duration}
    - Severity: ${data.intensity}
    - Patient: ${data.age}y, ${data.gender}
    - History: ${data.history || 'None provided'}
    
    Ensure your analysis considers complex interactions between history and current symptoms.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                condition: { type: Type.STRING },
                description: { type: Type.STRING },
                probability: { type: Type.STRING },
                urgency: { type: Type.STRING },
                keyInsights: { 
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["condition", "description", "urgency", "keyInsights"]
            }
          },
          wellnessPlan: {
            type: Type.OBJECT,
            properties: {
              dietaryAdvice: { type: Type.ARRAY, items: { type: Type.STRING } },
              lifestyleChanges: { type: Type.ARRAY, items: { type: Type.STRING } },
              preventativeMeasures: { type: Type.ARRAY, items: { type: Type.STRING } },
              followUp: { type: Type.STRING }
            },
            required: ["dietaryAdvice", "lifestyleChanges", "preventativeMeasures", "followUp"]
          }
        },
        required: ["analysis", "wellnessPlan"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from HealthGuardian Engine");
  return JSON.parse(text.trim()) as GuardianResponse;
};
