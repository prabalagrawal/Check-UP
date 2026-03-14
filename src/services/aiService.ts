import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface HealthPrediction {
  potentialProblems: string[];
  riskLevels: { problem: string; level: 'Low' | 'Medium' | 'High' }[];
  lifestyleChanges: { action: string; impact: string; priority: 'Low' | 'Medium' | 'High' }[];
  dietaryChanges: { food: string; action: 'Increase' | 'Decrease' | 'Avoid'; reason: string }[];
  explanation: string;
}

export async function predictHealthRisks(
  medicalHistory: string,
  lifestyle: any,
  wearableDataSummary: string
): Promise<HealthPrediction> {
  const model = "gemini-3.1-pro-preview";
  const prompt = `
    As Ollie, the wise preventive health owl, analyze this user's digital health twin data to predict potential health problems.
    
    User Context:
    - Medical History: ${medicalHistory}
    - Lifestyle Habits:
        * Food: ${lifestyle.foodHabits}
        * Exercise: ${lifestyle.exerciseFrequency}
        * Smoking: ${lifestyle.smoking ? 'Yes' : 'No'}
        * Alcohol: ${lifestyle.alcohol}
    - Wearable Data Trends (Simulated): ${wearableDataSummary}

    Your Task:
    1. Predict potential health problems (risks) based on the combination of lifestyle habits and medical history.
    2. Suggest specific, personalized lifestyle and dietary changes.
    3. For each lifestyle change, clearly define the 'action', its 'impact' (how it mitigates the specific predicted risk), and its 'priority' (High/Medium/Low).
    4. For each dietary change, specify the 'food', the 'action' (Increase/Decrease/Avoid), and the medical 'reason' linked to the user's profile.
    5. Provide a wise, empathetic explanation (Ollie's Wisdom) that connects the data points to the recommendations.

    The advice must be actionable and tailored to prevent the identified risks from manifesting into chronic conditions.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          potentialProblems: { type: Type.ARRAY, items: { type: Type.STRING } },
          riskLevels: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                problem: { type: Type.STRING },
                level: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
              }
            }
          },
          lifestyleChanges: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                action: { type: Type.STRING },
                impact: { type: Type.STRING },
                priority: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
              }
            }
          },
          dietaryChanges: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                food: { type: Type.STRING },
                action: { type: Type.STRING, enum: ['Increase', 'Decrease', 'Avoid'] },
                reason: { type: Type.STRING }
              }
            }
          },
          explanation: { type: Type.STRING }
        },
        required: ["potentialProblems", "riskLevels", "lifestyleChanges", "dietaryChanges", "explanation"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

export async function getOllieWisdom(userProfile: any) {
  const model = "gemini-3-flash-preview";
  const response = await ai.models.generateContent({
    model,
    contents: `Based on this user profile: ${JSON.stringify(userProfile)}, provide one short 'Wise Word of the Day' as Ollie the Owl. Keep it under 20 words and very encouraging.`,
    config: {
      systemInstruction: "You are Ollie, a wise owl health coach. You speak simply and empathetically."
    }
  });
  return response.text;
}

export async function searchInsuranceSchemes(query: string) {
  const model = "gemini-3-flash-preview";
  const response = await ai.models.generateContent({
    model,
    contents: `Find the best insurance schemes for: ${query}. Provide a list of schemes with names and brief descriptions.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.web) || []
  };
}

export async function scanPrescription(base64Image: string) {
  const model = "gemini-3-flash-preview";
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
        { text: "Extract all medical information from this prescription, including medicine names, dosages, and instructions. Format as JSON." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          medicines: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                dosage: { type: Type.STRING },
                instructions: { type: Type.STRING }
              }
            }
          },
          doctorName: { type: Type.STRING },
          date: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

export async function chatWithOllie(message: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[]) {
  const model = "gemini-3-flash-preview";
  const response = await ai.models.generateContent({
    model,
    contents: [...history, { role: 'user', parts: [{ text: message }] }],
    config: {
      systemInstruction: `
        You are Ollie, the wise and friendly owl chatbot for the CheckUp health platform.
        Your goal is to provide accurate medical information by searching the internet.
        
        CRITICAL RULES:
        1. Use VERY SIMPLE language that a child could understand. Avoid complex medical jargon.
        2. You are multilingual. You MUST understand and respond in English, Hindi, and Hinglish (Hindi written in English script) based on the user's preference.
        3. Always use Google Search grounding to ensure your information is up-to-date.
        4. If a user asks for medical advice, provide information but always include a disclaimer to consult a real doctor.
        5. Be encouraging, empathetic, and wise.
      `,
      tools: [{ googleSearch: {} }]
    }
  });

  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.web) || []
  };
}
