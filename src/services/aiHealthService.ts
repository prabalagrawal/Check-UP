import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface HealthAnalysis {
  potentialRisks: {
    condition: string;
    probability: "Low" | "Medium" | "High";
    reasoning: string;
  }[];
  preventiveActions: string[];
  dietaryRecommendations: string[];
  lifestyleAdjustments: string[];
}

export interface JournalInsight {
  analysis: string;
  potentialIssues: string[];
  matchingSymptoms: string[];
  regulationAdvice: string;
  suggestedNextSteps: string;
}

export const analyzeHealthData = async (data: any): Promise<HealthAnalysis> => {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: `Analyze this health data and provide a structured preventive health report. 
    Data: ${JSON.stringify(data)}
    Focus on:
    1. Potential lifestyle-related risks.
    2. Specific preventive actions.
    3. Detailed dietary changes.
    4. Lifestyle adjustments.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          potentialRisks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                condition: { type: Type.STRING },
                probability: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                reasoning: { type: Type.STRING }
              },
              required: ["condition", "probability", "reasoning"]
            }
          },
          preventiveActions: { type: Type.ARRAY, items: { type: Type.STRING } },
          dietaryRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          lifestyleAdjustments: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["potentialRisks", "preventiveActions", "dietaryRecommendations", "lifestyleAdjustments"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const analyzeDailyJournal = async (entry: string, history: any[] = []): Promise<JournalInsight> => {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: `As Ollie the Owl, a wise health guardian, review this daily activity log and symptoms. 
    Current Entry: "${entry}"
    Recent History: ${JSON.stringify(history)}
    
    Identify:
    1. What problems they might be facing based on activities and symptoms.
    2. What symptoms match potential issues.
    3. How to regulate these issues immediately.
    4. Suggested next steps.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          potentialIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
          matchingSymptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
          regulationAdvice: { type: Type.STRING },
          suggestedNextSteps: { type: Type.STRING }
        },
        required: ["analysis", "potentialIssues", "matchingSymptoms", "regulationAdvice", "suggestedNextSteps"]
      }
    }
  });

  return JSON.parse(response.text);
};
