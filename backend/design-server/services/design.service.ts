import { DesignUtils } from "../utils/design.utils";
import { IImageData, IPromptResponse, IPrompt } from "../types";

export class DesignService {
    async generateDesigns(prompt: IPrompt): Promise<string[]> {

        const prompts = await DesignUtils.generatePrompts(
            prompt.businessType,
            prompt.productDescription,
            prompt.targetAudience,
            prompt.additionalInformation || "",
            prompt.useCase || "",
            prompt.festivalOrSeason || ""
        );

        if (prompts.length === 0) {
            throw new Error("No prompts generated");
        }

        const response = await Promise.all(
            prompts.map(async p => {
                const imageData: IImageData = {
                    prompt: prompt.productDescription,
                    aspectRatio: "1x1",
                    rendering_speed: "QUALITY",
                    magic_prompt: "AUTO",
                    style_type: "AUTO",
                    style_reference_images: prompt.productImage
                };
                const res: IPromptResponse = await DesignUtils.generateImageUrl(imageData);
                return res.data[0].url;
            })
        );

        return response;
    }


}