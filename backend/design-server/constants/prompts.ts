export class Prompts {
    static minimalProductShotPrompt(business_type: string, product_or_service: string): string {
        return `Generate an Ideogram prompt for a minimalist product shot image based on the following business:
        Business type: ${business_type}

        Product/Service: ${product_or_service}

        Keep the image clean, white or neutral background, no text, simple high-quality focus on the product itself. Avoid distractions. Make the composition elegant and modern."

        Example Output (for a protein smoothie brand):
        "Minimalist product photo of a ready-to-drink protein smoothie bottle, centered on white background, soft shadow, clean studio lighting, modern premium label clearly visible, no clutter, sleek and elegant`;
    }

    static trendyCasualLifestylePrompt(
        business_type: string,
        product_or_service: string,
        target_audience: string
    ): string {
        return `Generate an Ideogram prompt for a trendy, casual, lifestyle-style image based on the following:
        Business type: ${business_type}
        Product/Service: ${product_or_service}
        Target Audience: ${target_audience}
        The image should have modern lifestyle appeal — bright, casual vibe, likely with indian people using the product naturally. Think Instagram-worthy but realistic."
        Example Output (for a smoothie brand for gym-goers):
        "Young fitness enthusiast drinking a protein smoothie post-workout, standing outside a gym, bright daylight, sporty outfit, casual energy, bottle branding visible, trendy and healthy lifestyle vibe"`;
    }

    static textOnImagePrompt(
        business_type: string,
        product_or_service: string,
        additional_information: string
    ): string {
        return `Given the business type: '${business_type}' and what they offer: '${product_or_service}', generate a short prompt for a promotional image that includes text overlay highlighting a key benefit, offer, or message based on '${additional_information}'. The output prompt should be visual and specific, and the text should be embedded into the image.
        Example Output Prompt (for Bakery):

        "High-quality image of freshly baked chocolate cookies on a wooden tray, with soft lighting and the text overlay: 'Freshly Baked. Made with Love. Order Now.'"`;
    }

    static visualStorytellingPrompt(
        business_type: string,
        target_audience: string,
        product_or_service: string,
        use_case: string
    ): string {
        return `For a business in the category '${business_type}', generate a detailed storytelling visual prompt about the product ${product_or_service} where the image tells a compelling story or use-case. Include real Indian characters (human beings), realistic setting, and emotional tone relevant to the target audience.
        Example Output (for a skincare brand):
        A young Indian woman standing in front of a mirror, visibly stressed about acne, then in the same frame smiling confidently after using a dermatology product, soft lighting and pastel tones, emotional, transformation-based storytelling`;
    }

    static seasonalFestivalPrompt(
        business_type: string,
        festival_or_season: string,
        product_or_service?: string
    ): string {
        return `Given the business type: '${business_type}', and the current or upcoming Indian festival or season: '${festival_or_season}', generate a visual prompt for ${product_or_service} that merges the business offering with the cultural or seasonal theme. Include traditional elements, colors, or symbolic imagery.`;
    }
}