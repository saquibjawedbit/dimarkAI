export interface IPrompt {
    productImage?: File | null,
    businessType: string,
    productDescription?: string,
    targetAudience: string,
    additionalInformation?: string,
    useCase?: string,
    festivalOrSeason?: string,
}

export interface IImageData {
    prompt: string;
    resolution?: string | null;
    aspectRatio?: "1x1" | "4x5";
    rendering_speed?: "TURBO" | "DEFAULT" | "QUALITY";
    magic_prompt?: "AUTO" | "OFF" | "ON";
    style_type?: "REALISTIC" | "AUTO" | "GENERAL" | "DESIGN";
    style_reference_images?: File | null;
}

export interface IPromptResponseItem {
    prompt: string;
    resolution: string;
    is_image_safe: boolean;
    seed: number;
    url: string;
    style_type: "REALISTIC" | "AUTO" | "GENERAL" | "DESIGN";
}

export interface IPromptResponse {
    created: string;
    data: IPromptResponseItem[];
}