import { IImageData, IPromptResponse } from "../types";
import { Prompts } from "../constants/prompts";
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from "axios";



export class DesignUtils {
    static ideogramUrl = "https://api.ideogram.ai/v1/ideogram-v3/";
    static apiKey = process.env.IDEOGRAM_API_KEY || "";

    static async generateImageUrl(imageData: IImageData): Promise<IPromptResponse> {
        try {
            const formData = new FormData();
            formData.append("prompt", imageData.prompt);
            //formData.append("resolution", imageData.resolution || "");
            formData.append("aspect_ratio", imageData.aspectRatio || "1x1");
            formData.append("rendering_speed", imageData.rendering_speed || "QUALITY");
            formData.append("magic_prompt", imageData.magic_prompt || "AUTO");
            formData.append("style_type", imageData.style_type || "REALISTIC");

            if (imageData.style_reference_images) {
                formData.append("style_reference_images", imageData.style_reference_images);
            }

            const response = await axios.post(
                `${this.ideogramUrl}generate`,
                formData,
                {
                    headers: {
                        "Api-Key": this.apiKey,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const data: IPromptResponse = response.data;
            return data;
        }
        catch (error) {
            console.error("Error generating image URL:", error);
            throw new Error("Failed to generate image URL");
        }
    }


    static async generatePrompts(
        business_type: string,
        product_or_service: string,
        target_audience: string,
        additional_information: string,
        use_case: string,
        festival_or_season: string
    ): Promise<string[]> {
        const geminiApiKey = process.env.GEMINI_API_KEY;
        if (!geminiApiKey) {
            throw new Error('GEMINI_API_KEY environment variable is required');
        }
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompts = [
            Prompts.minimalProductShotPrompt(
                business_type,
                product_or_service
            ),
            Prompts.trendyCasualLifestylePrompt(
                business_type,
                product_or_service,
                target_audience
            ),
            Prompts.professionalCorporatePrompt(
                business_type,
                product_or_service
            ),
            Prompts.funCartoonyPrompt(
                business_type,
                product_or_service,
                target_audience
            ),
            Prompts.textOnImagePrompt(
                business_type,
                product_or_service,
                additional_information
            ),
            Prompts.visualStorytellingPrompt(
                business_type,
                target_audience,
                use_case
            ),
            Prompts.seasonalFestivalPrompt(
                business_type,
                festival_or_season,
                product_or_service
            ),
        ];

        const responses: string[] = [];

        const responsePromises = prompts.map(async (prompt) => {
            try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
            } catch (err) {
            console.error("Gemini API error:", err);
            return "";
            }
        });

        const outputs = await Promise.all(responsePromises);
        responses.push(...outputs);

        return responses;
    }
}