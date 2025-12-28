
import { GoogleGenAI, Type } from "@google/genai";
import { BusinessDetails, MarketingContent, ScrapeResult } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  async scrapeBusinessDetails(url: string): Promise<ScrapeResult> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find the exact business details for this URL: ${url}. 
      I need: Name, Rating, Full Address, Contact Number, and typical business Tags/Categories. 
      Return the data in a clear format.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            rating: { type: Type.STRING },
            address: { type: Type.STRING },
            contact: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            reviewsCount: { type: Type.STRING },
            openingHours: { type: Type.STRING },
          },
          required: ["name", "address", "contact"]
        }
      }
    });

    const details = JSON.parse(response.text) as BusinessDetails;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Search Source",
      uri: chunk.web?.uri || url
    })) || [];

    return { details, sources };
  }

  async generateMarketingContent(details: BusinessDetails): Promise<MarketingContent> {
    const prompt = `Based on these business details: ${JSON.stringify(details)}, 
    generate professional marketing materials.
    1. A catchy social media post for Instagram/Facebook with emojis.
    2. A short punchy ad copy for Google Ads.
    3. An email subject line that converts.
    4. HTML and CSS (separate fields) for a modern, sleek business card or promotional flyer. 
       Make the design responsive and use elegant colors.
    5. A detailed description of what a professional photo of this business should look like.`;

    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            socialPost: { type: Type.STRING },
            adCopy: { type: Type.STRING },
            emailSubject: { type: Type.STRING },
            cardHtml: { type: Type.STRING },
            cardCss: { type: Type.STRING },
            imageDescription: { type: Type.STRING },
          },
          required: ["socialPost", "adCopy", "cardHtml", "cardCss"]
        }
      }
    });

    return JSON.parse(response.text) as MarketingContent;
  }

  async generatePromotionalImage(details: BusinessDetails, visualContext: string, style: string = 'Modern'): Promise<string> {
    const prompt = `Generate a high-end, 4K professional promotional advertisement poster for the business: "${details.name}".
    Business Type: ${details.tags.join(', ')}.
    Location: ${details.address}.
    Contact: ${details.contact}.
    
    Visual Theme: ${visualContext}.
    Graphic Style: ${style}.
    
    Instructions:
    - The poster must feature professional branding and elegant typography.
    - Include a prominent "Shop Now" or "Visit Us Today" call to action.
    - The design should look like a high-budget commercial graphic for Instagram or Facebook.
    - Ensure the layout is balanced, modern, and highlights the premium nature of the products.
    - Overlay the business name in a bold, stylish font.`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from model");
  }
}

export const gemini = new GeminiService();
