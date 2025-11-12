
import { GoogleGenAI, Type } from "@google/genai";
import { CategorizedFile } from '../types';

const fileCategorizationSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      fileName: {
        type: Type.STRING,
        description: "The original file name provided in the input list."
      },
      category: {
        type: Type.STRING,
        description: "A relevant category for the file, e.g., 'Document', 'Image', 'Code', 'Archive', 'Audio', 'Video', 'Spreadsheet', 'Presentation', 'Other'."
      },
      summary: {
          type: Type.STRING,
          description: "A very short, one-sentence summary of the file's likely content based on its name."
      }
    },
    required: ["fileName", "category", "summary"]
  }
};

export const categorizeFiles = async (files: File[]): Promise<CategorizedFile[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API key not found. Please set the API_KEY environment variable.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const fileNames = files.map(f => f.name).join(', ');

  const prompt = `Analyze this list of file names and provide a category and a one-sentence summary for each. Prioritize concise and relevant categories. Here are the file names: ${fileNames}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: fileCategorizationSchema,
      },
    });

    const resultText = response.text.trim();
    const categorizedData: CategorizedFile[] = JSON.parse(resultText);
    
    return categorizedData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to categorize files with Gemini API.");
  }
};
