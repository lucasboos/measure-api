import { GoogleGenAI } from '@google/genai';

import { MeasureType } from '../types/measure';

export const analyzeMeter = async (base64Image: string, measureType: MeasureType): Promise<number> => {
  const ai = new GoogleGenAI({});

  const contents = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image,
      },
    },
    { text: `Analyze this image of a ${measureType} meter and return ONLY the numeric value shown, no extra text.` },
  ];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error("Empty response from Gemini.");
    }

    const cleanedNumber = parseFloat(rawText.replace(/[^\d.,]/g, '').replace(',', '.'));

    return cleanedNumber;
  } catch (err) {
    throw {
      status: 500,
      error_code: "GEMINI_ERROR",
      message: "Error processing image with Gemini API.",
    };
  }
};
