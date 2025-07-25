import { Request, Response } from "express";
import { IPrompt } from "../types";
import { DesignService } from "../services/design.service";

export class DesignController {
    private designService: DesignService;

    constructor() {
        this.designService = new DesignService();
    }

    async design(req: Request, res: Response) {
        const prompt: IPrompt = req.body;
        const images = await this.designService.generateDesigns(prompt);
        console.log("Generated images:", images);
        return res.status(200).json({
            success: true,
            message: "Designs generated successfully",
            data: images,
        });
    }
}