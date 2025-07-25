import axios from "axios";
import { IImageData, IPromptResponse } from "../types";

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
}