import { DesignUtils } from "../utils/design.utils";
import { IImageData, IPromptResponse , IPrompt} from "../types";

export class DesignService {
    async generateDesigns(prompt: IPrompt): Promise<string[]> {
        const imageData: IImageData = {
            prompt: prompt.productDescription,
            resolution: prompt.targetSize || "",
            aspectRatio: "1x1",
            rendering_speed: "QUALITY",
            magic_prompt: "AUTO",
            style_type: "REALISTIC",
            style_reference_images: prompt.productImage
        };

        const response = await DesignUtils.generateImageUrl(imageData);
        return response.data.map(item => item.url);
    }
}